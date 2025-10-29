// src/contexts/AuthProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

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
  const token = localStorage.getItem('flowAuthToken');
  const userDataRaw = localStorage.getItem('userData');

  let userDataParsed = null;

  if (userDataRaw) {
    try {
      userDataParsed = JSON.parse(userDataRaw);
    } catch (e) {
      console.error('Failed to parse userData from localStorage:', e);
      localStorage.removeItem('userData');
    }
  }

  if (token && userDataParsed) {
    setIsAuthenticated(true);
    setUser(userDataParsed);
  } else {
    setIsAuthenticated(false);
    setUser(null);
  }

  setLoading(false);
}, []);


  /** LOGIN */
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });

      localStorage.setItem('flowAuthToken', res.data.accessToken);
      localStorage.setItem('userData', JSON.stringify({ email }));
      setIsAuthenticated(true);
      setUser({ email });
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  /** SIGNUP */
  const signup = async (dto) => {
    try {
      const res = await authApi.signup(dto);
      localStorage.setItem('userData', JSON.stringify({ email: dto.email }));
      setIsAuthenticated(false);
      setUser({ email: dto.email });
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  /** VERIFY EMAIL */
 const verifyEmail = async (dto) => {
  try {
    const res = await authApi.verifyEmail(dto); // expects { email, code }
    
    // Assuming the API returns { token, user, ... }
    if (res.data?.token) {
      localStorage.setItem('flowAuthToken', res.data.token); // save token for next step
    }
    
    return { success: true, data: res.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Verification failed' 
    };
  }
};

/** VERIFY EMAIL */
const resendCode = async (dto) => {
  try {
    
    const res = await authApi.resendCode(dto.email); // { email }
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Verification failed' };
  }
};

/** CREATE PASSWORD */
const createPassword = async (dto) => {
  try {
      const res = await authApi.createPassword(dto); // { token, password }
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create password' };
    }
  };

  /** FORGOT PASSWORD */
  const forgotPassword = async (email) => {
    try {
      const res = await authApi.forgotPassword(email);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to send reset link' };
    }
  };

  /** RESET PASSWORD */
  const resetPassword = async (dto) => {
    try {
      const res = await authApi.resetPassword(dto); // { token, password }
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to reset password' };
    }
  };

  /** CREATE PIN */
  const createPin = async (dto) => {
    try {
      console.log({dto,token:dto.token});
      
      const res = await authApi.createPin({pin:dto.pin},dto.token); // { pin }
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create pin' };
    }
  };

  const logout = () => {
    localStorage.removeItem('flowAuthToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    verifyEmail,
    resendCode,
    createPassword,
    forgotPassword,
    resetPassword,
    createPin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
