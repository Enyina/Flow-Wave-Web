import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { apiFetch } = await import('../utils/api');
      const res = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
console.log({res})
      if (!res.ok) {
        return { success: false, error: res.data?.error || 'Login failed' };
      }

      const accessToken = res.data?.accessToken || res.data?.token || null;

      if (!accessToken) {
        // If API returned no token but set cookie-based session, attempt to fetch user
        // Fallback to fetching /users/me
        const me = await apiFetch('/users/me', { method: 'GET' });
        if (me.ok) {
          localStorage.setItem('authToken', '');
          localStorage.setItem('userData', JSON.stringify(me.data));
          setIsAuthenticated(true);
          setUser(me.data);
          return { success: true };
        }
        return { success: false, error: 'No access token returned' };
      }

      // Store token and fetch user
      localStorage.setItem('authToken', accessToken);

      const me = await apiFetch('/users/me', { method: 'GET', headers: { Authorization: `Bearer ${accessToken}` } });
      if (me.ok) {
        localStorage.setItem('userData', JSON.stringify(me.data));
        setIsAuthenticated(true);
        setUser(me.data);
        return { success: true };
      }

      // If /users/me failed, still mark authenticated with email
      const fallbackUser = { email, id: null };
      localStorage.setItem('userData', JSON.stringify(fallbackUser));
      setIsAuthenticated(true);
      setUser(fallbackUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const { apiFetch } = await import('../utils/api');
      const res = await apiFetch('/auth/register', { method: 'POST', body: userData });

      if (!res.ok) {
        return { success: false, error: res.data?.error || 'Signup failed' };
      }

      // After signup, attempt to login automatically
      const email = userData.email;
      const password = userData.password;
      if (email && password) {
        return await login(email, password);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
