import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugAuth = () => {
  const { user, isAuthenticated, loading, isAdmin, hasAdminAccess } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg p-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Info</h1>
      
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Is Admin:</strong> {isAdmin() ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Has Admin Access:</strong> {hasAdminAccess() ? 'Yes' : 'No'}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">User Object:</h3>
          <pre className="bg-white dark:bg-gray-900 p-4 rounded border overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Admin Routes Test:</h3>
        <div className="space-y-2">
          <a href="/admin/dashboard" className="block text-blue-600 hover:underline">
            Try Admin Dashboard
          </a>
          <a href="/admin/transactions" className="block text-blue-600 hover:underline">
            Try Admin Transactions
          </a>
          <a href="/admin/admins" className="block text-blue-600 hover:underline">
            Try Admin Management
          </a>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
