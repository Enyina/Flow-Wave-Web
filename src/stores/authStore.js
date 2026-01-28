import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import TokenManager from '../utils/tokenManager';

// User shape definition (for documentation)
// {
//   id: string;
//   email: string;
//   fullName: string;
//   role: string;
//   createdAt: string;
//   updatedAt: string;
// }

// Tokens shape definition
// {
//   accessToken: string;
//   refreshToken: string;
// }

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      message: '',
      refreshPromise: null,

      // Actions
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          TokenManager.setUser(user);
        } else {
          TokenManager.clearUserData();
        }
      },
      
      setTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
        
        // Store access token securely
        if (tokens.accessToken) {
          TokenManager.setAccessToken(tokens.accessToken);
        }
        
        // Schedule refresh if needed
        if (tokens.accessToken) {
          get().scheduleTokenRefresh();
        }
      },

      login: (user, tokens) => {
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Store securely
        TokenManager.setUser(user);
        if (tokens.accessToken) {
          TokenManager.setAccessToken(tokens.accessToken);
          get().scheduleTokenRefresh();
        }
      },

      logout: () => {
        // Clear secure storage
        TokenManager.clearTokens();
        
        // Clear store state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          message: '',
        });
      },

      clearAuth: () => {
        TokenManager.clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          message: '',
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      
      setMessage: (message) => set({ message }),
      
      clearMessage: () => set({ message: '' }),

      // Token refresh strategy
      refreshToken: async () => {
        const state = get();
        
        // Prevent multiple simultaneous refresh attempts
        if (state.refreshPromise) {
          return state.refreshPromise;
        }

        const refreshPromise = (async () => {
          try {
            console.log('🔄 Attempting token refresh...');
            
            const response = await fetch('/api/auth/refresh', {
              method: 'POST',
              credentials: 'include', // Send httpOnly refresh token cookie
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('🔄 Refresh response:', response.status);

            if (response.ok) {
              const data = await response.json();
              console.log('🔄 Refresh data:', data);
              
              if (data.accessToken) {
                set({ accessToken: data.accessToken });
                TokenManager.setAccessToken(data.accessToken);
                
                // Schedule next refresh
                get().scheduleTokenRefresh();
              }
            } else {
              // Refresh failed, clear auth
              console.error('🔄 Refresh failed with status:', response.status);
              get().clearAuth();
              throw new Error('Token refresh failed');
            }
          } catch (error) {
            console.error('🔄 Token refresh error:', error);
            get().clearAuth();
            throw error;
          } finally {
            set({ refreshPromise: null });
          }
        })();

        set({ refreshPromise });
        return refreshPromise;
      },

      // Validate current session
      validateSession: async () => {
        const state = get();
        
        // Check both state and TokenManager for token
        const token = state.accessToken || TokenManager.getAccessToken();
        
        console.log('🔍 Validating session:', { 
          hasStateToken: !!state.accessToken,
          hasStoredToken: !!TokenManager.getAccessToken(),
          finalToken: !!token
        });
        
        if (!token) {
          console.log('❌ No token found, clearing auth');
          state.clearAuth();
          return false;
        }

        // Check if token is expired
        if (TokenManager.isTokenExpired(token)) {
          console.log('⏰ Token expired, but no refresh endpoint available');
          state.clearAuth();
          return false;
        }

        console.log('✅ Token is valid');
        return true;
      },

      // Schedule token refresh
      scheduleTokenRefresh: () => {
        const state = get();
        const token = state.accessToken || TokenManager.getAccessToken();
        
        if (!token) return;

        const expiration = TokenManager.getTokenExpiration(token);
        if (!expiration) return;

        // Refresh 5 minutes before expiration
        const refreshTime = expiration.getTime() - (5 * 60 * 1000);
        const delay = refreshTime - Date.now();

        if (delay > 0) {
          setTimeout(() => {
            get().refreshToken();
          }, delay);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize from storage and migrate if needed
        if (state) {
          TokenManager.migrateFromLocalStorage();
          
          // Validate session on rehydrate
          state.validateSession();
        }
      },
    }
  )
);

// Helper functions for external usage
export const getStoredTokens = () => {
  const state = useAuthStore.getState();
  return {
    accessToken: state.accessToken || TokenManager.getAccessToken(),
    refreshToken: state.refreshToken,
  };
};

export const isAuthenticated = () => {
  const state = useAuthStore.getState();
  return !!(state.accessToken || TokenManager.getAccessToken());
};

// Initialize auth store on import
const initializeAuth = () => {
  const state = useAuthStore.getState();
  
  console.log('🔐 Initializing auth store...');
  
  // First migrate from localStorage if needed
  TokenManager.migrateFromLocalStorage();
  
  // Check if we have stored tokens and user
  const storedUser = TokenManager.getUser();
  const storedToken = TokenManager.getAccessToken();
  
  console.log('📝 Stored data:', { 
    hasUser: !!storedUser, 
    hasToken: !!storedToken,
    userEmail: storedUser?.email 
  });
  
  if (storedUser && storedToken) {
    // We have stored data, set it in the store
    console.log('✅ Setting user from storage');
    state.setUser(storedUser);
    state.setTokens({ accessToken: storedToken, refreshToken: null });
    state.setLoading(false);
    
    // Validate session asynchronously (don't block UI)
    state.validateSession().catch(error => {
      console.error('❌ Session validation failed:', error);
    });
  } else {
    // No stored data, set loading to false
    console.log('❌ No stored auth data found');
    state.setLoading(false);
  }
};

// Auto-initialize
if (typeof window !== 'undefined') {
  initializeAuth();
}
