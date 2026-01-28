import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '../api/authService';
import { useAuthStore } from '../stores/authStore';
import { queryKeys } from '../api/queryClient';

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data;
      login(user, { accessToken, refreshToken });
      
      // Store in localStorage for backward compatibility
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Signup mutation
export const useSignup = () => {
  return useMutation({
    mutationFn: authService.signup,
    onError: (error) => {
      console.error('Signup failed:', error);
    },
  });
};

// Magic link verification mutation
export const useVerifyMagicLink = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authService.verifyMagicLink,
    onSuccess: (data) => {
      const { user, accessToken, refreshToken } = data;
      login(user, { accessToken, refreshToken });
      
      // Store in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error) => {
      console.error('Magic link verification failed:', error);
    },
  });
};

// Get current user query
export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  return useQuery({
    queryKey: queryKeys.user,
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    retry: 1,
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    },
    onError: (error) => {
      console.error('Failed to get current user:', error);
      logout();
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: queryKeys.auth });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      logout();
      queryClient.clear();
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: authService.refreshToken,
    onSuccess: (data) => {
      const { accessToken, refreshToken } = data;
      setTokens({ accessToken, refreshToken });
      
      // Update localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      // Force logout on refresh failure
      useAuthStore.getState().logout();
    },
  });
};
