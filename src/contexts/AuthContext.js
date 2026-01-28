import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import TokenManager from '../utils/tokenManager';
import { 
  login as authServiceLogin, 
  register as authServiceRegister, 
  logout as authServiceLogout,
  sendMagicLink,
  verifyMagicLink as authServiceVerifyMagicLink,
  verifyEmail as authServiceVerifyEmail,
  updatePassword as authServiceUpdatePassword,
  createPassword as authServiceCreatePassword,
  resendOtp as authServiceResendOtp,
  createPin as authServiceCreatePin,
  getCurrentUser
} from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const authStore = useAuthStore();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      // If already authenticated and has user data, no need to check further
      if (authStore.isAuthenticated && authStore.user) {
        authStore.setLoading(false);
        return;
      }
      
      try {
        // Try to validate current session
        const isValid = await authStore.validateSession();
        
        if (!isValid && !authStore.user) {
          // Try to get current user if validation failed but we have no user
          const currentUser = await getCurrentUser();
          if (currentUser) {
            authStore.setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authStore.setMessage('Authentication check failed');
      } finally {
        authStore.setLoading(false);
      }
    };

    // Only check if currently loading
    if (authStore.isLoading) {
      checkAuth();
    }
  }, [authStore]);

  // Login with email and password
  const login = async (email, password) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await authServiceLogin(email, password);
      if (response.success) {
        // Set tokens immediately
        authStore.setTokens({
          accessToken: response.token || response.accessToken,
          refreshToken: response.refreshToken
        });
        
        // If we have user data, set it
        if (response.user) {
          authStore.setUser(response.user);
          authStore.setMessage('Login successful!');
        } else {
          // No user data in login response, fetch it
          try {
            console.log('🔍 Fetching user data after login...');
            const currentUser = await getCurrentUser();
            if (currentUser) {
              authStore.setUser(currentUser);
              authStore.setMessage('Login successful!');
            } else {
              authStore.setMessage('Login successful but failed to load user data');
            }
          } catch (userError) {
            console.error('Failed to fetch user data:', userError);
            authStore.setMessage('Login successful but failed to load user data');
          }
        }
      } else {
        authStore.setMessage(response.error || 'Login failed');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Login failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Signup with email registration
  const signup = async (userData) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await authServiceRegister(userData);
      console.log({response});
      if (response.success) {
        authStore.setMessage('Check your email for verification code!');
      } else {
        authStore.setMessage(response.error || 'Signup failed');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Signup failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Verify email with code
  const verifyEmail = async (userData) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      console.log('🔍 Sending verification data:', userData);
      const response = await authServiceVerifyEmail(userData);
      console.log('🔍 Verification response:', response);
      console.log('🔍 Response token:', response.token);
      
      if (response.success) {
        authStore.setMessage('Email verified successfully!');
        // Store token for next steps
        if (response.token) {
          console.log('🔍 Storing token:', response.token);
          localStorage.setItem('createPasswordToken', response.token);
        } else {
          console.warn('🔍 No token in response!');
        }
      } else {
        authStore.setMessage(response.error || 'Email verification failed');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Email verification failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Resend verification code
  const resendCode = async (userData) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await authServiceResendOtp(userData.email);
      console.log({response});
      if (response.success) {
        authStore.setMessage('Verification code resent to your email!');
      } else {
        authStore.setMessage(response.error || 'Failed to resend code');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Failed to resend code');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Create password after email verification
  const createPassword = async (userData) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await authServiceCreatePassword(userData.password, userData.token);
      console.log('🔍 Create password response:', response);
      
      if (response.success) {
        authStore.setMessage('Password created successfully!');
        // Use the verification token for subsequent requests
        console.log('🔍 Storing verification token for auth:', userData.token);
        TokenManager.setAccessToken(userData.token);
        console.log('🔍 Token stored, verifying:', TokenManager.getAccessToken());
        // Clear the token from localStorage after storing it properly
        localStorage.removeItem('createPasswordToken');
      } else {
        authStore.setMessage(response.error || 'Password creation failed');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Password creation failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Create PIN after password creation
  const createPin = async (userData) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      // Check if token is available before making request
      const currentToken = TokenManager.getAccessToken();
      console.log('🔍 Current token before createPin:', currentToken);
      
      const response = await authServiceCreatePin(userData.pin);
      console.log('🔍 Create PIN response:', response);
      
      if (response.success) {
        authStore.setMessage('PIN created successfully!');
        // Clear any remaining tokens
        localStorage.removeItem('createPasswordToken');
      } else {
        authStore.setMessage(response.error || 'PIN creation failed');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'PIN creation failed');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Resend magic link
  const resendMagicLink = async (email) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await sendMagicLink(email);
      if (response.success) {
        authStore.setMessage('Magic link resent to your email!');
      } else {
        authStore.setMessage(response.error || 'Failed to resend magic link');
      }
      return response;
    } catch (error) {
      authStore.setMessage(error.message || 'Failed to resend magic link');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Verify magic link
  const verifyMagicLink = async (token) => {
    authStore.setLoading(true);
    authStore.clearMessage();
    try {
      const response = await authServiceVerifyMagicLink(token);
      if (response.success) {
        authStore.login(response.user, {
          accessToken: response.authToken || response.accessToken,
          refreshToken: response.refreshToken
        });
        authStore.setMessage('Email verified successfully!');
      } else {
        authStore.setMessage(response.error || 'Invalid or expired link');
      }
      return response;
    } catch (error) {
      authStore.setMessage('Invalid or expired link');
      throw error;
    } finally {
      authStore.setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    authStore.setLoading(true);
    try {
      await authServiceLogout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      authStore.logout();
      authStore.setMessage('Logged out successfully');
      authStore.setLoading(false);
    }
  };

  // Clear message
  const clearMessage = () => {
    authStore.clearMessage();
  };

  // Admin utility functions
  const isAdmin = () => {
    return authStore.user?.role === 'ADMIN';
  };

  const hasAdminAccess = () => {
    return authStore.isAuthenticated && authStore.user?.role === 'ADMIN';
  };

  const value = {
    user: authStore.user,
    loading: authStore.isLoading,
    message: authStore.message,
    isAuthenticated: authStore.isAuthenticated,
    login,
    signup,
    logout,
    verifyEmail,
    resendCode,
    createPassword,
    createPin,
    resendMagicLink,
    verifyMagicLink,
    clearMessage,
    isAdmin,
    hasAdminAccess,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

