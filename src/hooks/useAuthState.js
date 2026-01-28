import { useAuthStore } from '../stores/authStore';
import { useLogin, useLogout, useSignup, useVerifyMagicLink } from './useAuth';

// This hook provides the same interface as the old useAuth context
export const useAuthState = () => {
  const authStore = useAuthStore();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupMutation = useSignup();
  const verifyMutation = useVerifyMagicLink();

  return {
    // State (same as old context)
    user: authStore.user,
    loading: authStore.isLoading,
    message: '', // Could add this to store if needed
    isAuthenticated: authStore.isAuthenticated,

    // Actions (same as old context)
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    signup: signupMutation.mutateAsync,
    verifyMagicLink: verifyMutation.mutateAsync,
    resendMagicLink: signupMutation.mutateAsync, // Using same mutation for now
    
    // Additional state
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isSignupLoading: signupMutation.isPending,
    isVerifyLoading: verifyMutation.isPending,
    
    // Error states
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    signupError: signupMutation.error,
    verifyError: verifyMutation.error,
  };
};
