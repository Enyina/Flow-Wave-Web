import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useCurrentUser } from '../hooks/useAuth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const { isAuthenticated, setLoading } = useAuthStore();
    const { data: currentUser, isLoading, error } = useCurrentUser();

    useEffect(() => {
        // Set loading state based on query state
        setLoading(isLoading);
    }, [isLoading, setLoading]);

    // If there's an error getting current user and we thought we were authenticated,
    // clear the auth state
    useEffect(() => {
        if (error && isAuthenticated) {
            useAuthStore.getState().clearAuth();
        }
    }, [error, isAuthenticated]);

    return <>{children}</>;
};
