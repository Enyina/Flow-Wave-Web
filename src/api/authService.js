import { apiFetch } from '../api/consolidatedApi';
import TokenManager from '../utils/tokenManager';
import { useAuthStore } from '../stores/authStore';

// Get stored user from TokenManager
export const getStoredUser = () => {
  return TokenManager.getUser();
};

// Get current user from API
export const getCurrentUser = async () => {
  try {
    console.log('🔍 Fetching current user from /auth/me...');
    const response = await apiFetch('/auth/me');
    console.log('🔍 Current user response:', response);
    
    if (response.ok) {
      // apiFetch returns { ok: true, status: res.status, data: res.data }
      // So response.data is already the API response data
      const userData = response.data.data || response.data;
      console.log('🔍 Current user data:', userData);
      console.log('🔍 User role:', userData?.role);
      return userData;
    }
    console.log('❌ Failed to get current user, status:', response.status);
    return null;
  } catch (error) {
    console.error('❌ Error getting current user:', error);
    return null;
  }
};

// Login with email and password
export const login = async (email, password) => {
  try {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
console.log({response});

    if (response.ok) {
      // Handle nested response structure
      const responseData = response.data.data || response.data;
      const { user, token, accessToken, refreshToken } = responseData;
      
      console.log('🔐 Login response data:', { user, token, accessToken, refreshToken });
      console.log('🔐 Full response structure:', response.data);
      
      // Use TokenManager for secure storage
      const finalToken = token || accessToken;
      if (finalToken) {
        TokenManager.setAccessToken(finalToken);
      }
      if (refreshToken) {
        // Note: refresh tokens should ideally be httpOnly cookies
        // This is for backward compatibility
        console.warn('Refresh token in response - consider using httpOnly cookies');
      }
      
      // Handle missing user data - get it from token or API
      if (user) {
        TokenManager.setUser(user);
      } else {
        // No user data in response, we'll need to fetch it
        console.log('🔍 No user data in response, will fetch from /auth/me');
        // Don't fail the login, just don't set user yet
      }
      
      return { 
        success: true, 
        user,
        token: finalToken,
        accessToken: finalToken,
        refreshToken
      };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Login failed' 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Register new user
export const register = async (userData) => {
  try {
    const response = await apiFetch('/auth/register', {
      method: 'POST',
      body: userData
    });

    if (response.ok) {
      // Check the nested success field in data
      if (response.data?.success === false) {
        return { 
          success: false, 
          error: response.data?.message || response.data?.error || 'Registration failed' 
        };
      }
      
      const { user, token, accessToken, refreshToken } = response.data;
      
      // Use TokenManager for secure storage
      const finalToken = token || accessToken;
      if (finalToken) {
        TokenManager.setAccessToken(finalToken);
      }
      if (refreshToken) {
        console.warn('Refresh token in response - consider using httpOnly cookies');
      }
      if (user) {
        TokenManager.setUser(user);
      }
      
      return { 
        success: true, 
        user,
        token: finalToken,
        accessToken: finalToken,
        refreshToken
      };
    } else {
      return { 
        success: false, 
        error: response.data?.message || response.data?.error || 'Registration failed' 
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Logout user
export const logout = async () => {
  try {
    // Call logout API endpoint
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Clear secure storage
    TokenManager.clearTokens();
    
    // Clear auth store
    const authStore = useAuthStore.getState();
    authStore.clearAuth();
  }
};

// Send magic link
export const sendMagicLink = async (email) => {
  try {
    const response = await apiFetch('/auth/magic-link', {
      method: 'POST',
      body: { email }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Failed to send magic link' 
      };
    }
  } catch (error) {
    console.error('Magic link error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Verify magic link
export const verifyMagicLink = async (token) => {
  try {
    const response = await apiFetch('/auth/verify-magic-link', {
      method: 'POST',
      body: { token }
    });

    if (response.ok) {
      const { user, authToken, accessToken, refreshToken } = response.data;
      
      // Use TokenManager for secure storage
      const finalToken = authToken || accessToken;
      if (finalToken) {
        TokenManager.setAccessToken(finalToken);
      }
      if (refreshToken) {
        console.warn('Refresh token in response - consider using httpOnly cookies');
      }
      if (user) {
        TokenManager.setUser(user);
      }
      
      return { 
        success: true, 
        user,
        authToken: finalToken,
        accessToken: finalToken,
        refreshToken
      };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Magic link verification failed' 
      };
    }
  } catch (error) {
    console.error('Magic link verification error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Resend OTP
export const resendOtp = async (email) => {
  try {
    const response = await apiFetch('/auth/resend-otp', {
      method: 'POST',
      body: { email }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data?.message || response.data?.error || 'Failed to resend OTP' 
      };
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Create password after email verification
export const createPassword = async (password, token) => {
  try {
    const response = await apiFetch('/auth/create-password', {
      method: 'POST',
      body: { password, token }
    });

    console.log('🔍 Create password backend response:', response);

    if (response.ok) {
      // Check for nested success field
      if (response.data?.success === false) {
        return { 
          success: false, 
          error: response.data?.message || response.data?.error || 'Password creation failed' 
        };
      }
      
      // Extract token from response for subsequent requests
      const responseToken = response.data?.data?.token || response.data?.token || response.data?.accessToken;
      console.log('🔍 Token from create password response:', responseToken);
      
      return { 
        success: true, 
        token: responseToken
      };
    } else {
      return { 
        success: false, 
        error: response.data?.message || response.data?.error || 'Password creation failed' 
      };
    }
  } catch (error) {
    console.error('Password creation error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiFetch('/auth/update-password', {
      method: 'POST',
      body: { currentPassword, newPassword }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Password update failed' 
      };
    }
  } catch (error) {
    console.error('Password update error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Failed to send reset email' 
      };
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword }
    });

    if (response.ok) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: response.data?.error || 'Password reset failed' 
      };
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Create PIN
export const createPin = async (pin) => {
  try {
    const response = await apiFetch('/auth/create-pin', {
      method: 'POST',
      body: { pin }
    });

    if (response.ok) {
      // Check for nested success field
      if (response.data?.success === false) {
        return { 
          success: false, 
          error: response.data?.message || response.data?.error || 'Failed to create PIN' 
        };
      }
      
      return { 
        success: true, 
        message: response.data?.message || 'PIN created successfully'
      };
    } else {
      return { 
        success: false, 
        error: response.data?.message || response.data?.error || 'Failed to create PIN' 
      };
    }
  } catch (error) {
    console.error('Create PIN error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Verify email
export const verifyEmail = async (userData) => {
  try {
    const response = await apiFetch('/auth/verify-email', {
      method: 'POST',
      body: userData
    });

    if (response.ok) {
      // Check for nested success field
      if (response.data?.success === false) {
        return { 
          success: false, 
          error: response.data?.message || response.data?.error || 'Email verification failed' 
        };
      }
      
      // Extract token from nested data structure
      const token = response.data?.data?.token || response.data?.token;
      console.log('🔍 Extracted token:', token);
      
      return { 
        success: true, 
        token: token
      };
    } else {
      return { 
        success: false, 
        error: response.data?.message || response.data?.error || 'Email verification failed' 
      };
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return { 
      success: false, 
      error: error.message || 'Network error' 
    };
  }
};

// Export all functions as default
const authService = {
  getStoredUser,
  getCurrentUser,
  login,
  register,
  logout,
  sendMagicLink,
  verifyMagicLink,
  updatePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail
};

export default authService;