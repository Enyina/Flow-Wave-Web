// Secure Token Management
class TokenManager {
  static TOKEN_KEY = 'flowwave_access_token';
  static USER_KEY = 'flowwave_user';
  
  // Get access token from sessionStorage
  static getAccessToken() {
    try {
      const token = sessionStorage.getItem(this.TOKEN_KEY);
      console.log('📖 Getting access token:', !!token);
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }
  
  // Set access token with validation
  static setAccessToken(token) {
    try {
      console.log('💾 Setting access token:', !!token);
      if (token && this.isValidTokenFormat(token)) {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        console.log('✅ Token stored successfully');
        return true;
      } else {
        console.log('❌ Invalid token format');
        return false;
      }
    } catch (error) {
      console.error('❌ Error setting access token:', error);
      return false;
    }
  }
  
  // Get user data from sessionStorage
  static getUser() {
    try {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearUserData();
      return null;
    }
  }
  
  // Set user data with validation
  static setUser(userData) {
    try {
      console.log('💾 Setting user data:', !!userData);
      if (userData && typeof userData === 'object') {
        sessionStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        console.log('✅ User data stored successfully');
        return true;
      }
      console.log('❌ Invalid user data');
      return false;
    } catch (error) {
      console.error('❌ Error setting user data:', error);
      return false;
    }
  }
  
  // Clear all authentication data
  static clearTokens() {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }
  
  // Clear user data only
  static clearUserData() {
    try {
      sessionStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
  
  // Basic token format validation
  static isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    
    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
  }
  
  // Check if token is expired (if JWT)
  static isTokenExpired(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true; // Assume expired if can't parse
    }
  }
  
  // Get token expiration time
  static getTokenExpiration(token) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }
  
  // Check if token needs refresh (expires within 5 minutes)
  static shouldRefreshToken(token) {
    try {
      const expiration = this.getTokenExpiration(token);
      if (!expiration) return false;
      
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      return expiration < fiveMinutesFromNow;
    } catch (error) {
      console.error('Error checking refresh need:', error);
      return false;
    }
  }
  
  // Migrate from localStorage to sessionStorage
  static migrateFromLocalStorage() {
    try {
      console.log('🔄 Starting migration from localStorage...');
      const legacyTokens = ['accessToken', 'authToken', 'flowAuthToken'];
      const legacyUser = localStorage.getItem('user');
      
      console.log('🔄 Legacy data found:', { 
        hasUser: !!legacyUser,
        tokens: legacyTokens.map(key => ({ key, hasToken: !!localStorage.getItem(key) }))
      });
      
      // Migrate tokens
      for (const tokenKey of legacyTokens) {
        const token = localStorage.getItem(tokenKey);
        if (token && this.isValidTokenFormat(token)) {
          console.log('🔄 Migrating token:', tokenKey);
          this.setAccessToken(token);
          localStorage.removeItem(tokenKey);
          break; // Use first valid token found
        }
      }
      
      // Migrate user data
      if (legacyUser) {
        try {
          const userData = JSON.parse(legacyUser);
          console.log('🔄 Migrating user data:', userData?.email);
          this.setUser(userData);
          localStorage.removeItem('user');
        } catch (e) {
          console.error('Error migrating user data:', e);
        }
      }
      
      // Clean up other legacy keys
      const cleanupKeys = ['refreshToken', 'userData'];
      cleanupKeys.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ Migration completed');
    } catch (error) {
      console.error('❌ Error migrating from localStorage:', error);
    }
  }
}

export default TokenManager;
