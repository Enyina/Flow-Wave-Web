import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, isAdmin } = useAuth();
  const location = useLocation();

  console.log('🔐 AdminProtectedRoute Debug:', {
    loading,
    isAuthenticated,
    user,
    userRole: user?.role,
    isAdmin: isAdmin(),
    path: location.pathname
  });

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('⏳ AdminProtectedRoute: Still loading...');
    return null; // Return null instead of loading spinner to prevent flash
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('❌ AdminProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (!isAdmin()) {
    console.log('❌ AdminProtectedRoute: Not admin, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ AdminProtectedRoute: Access granted');
  return children;
};

export default AdminProtectedRoute;
