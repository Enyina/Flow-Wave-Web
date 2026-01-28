import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    if (isAdmin()) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-neutral-dark dark:text-dark-text mb-2">
          Access Denied
        </h1>

        {/* Error Description */}
        <p className="text-neutral-gray mb-6">
          You don't have permission to access this admin area. This page is restricted to administrators only.
        </p>

        {/* Debug Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
          <h3 className="text-sm font-medium text-neutral-dark dark:text-dark-text mb-2">Debug Information:</h3>
          <div className="text-xs text-neutral-gray space-y-1">
            <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>User Email: {user?.email || 'Not available'}</p>
            <p>User Role: {user?.role || 'Not available'}</p>
            <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
          
          <button
            onClick={handleGoToDashboard}
            className="w-full px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-xs text-neutral-gray">
          <p>If you believe this is an error, please contact your system administrator.</p>
          <p className="mt-1">Admin access requires the role 'ADMIN' in your user profile.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
