import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const UserManagement = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, []); // Initial load

  useEffect(() => {
    if (pagination.page > 1 || Object.values(filters).some(value => value !== '' && value !== 'createdAt' && value !== 'desc')) {
      loadUsers();
    }
  }, [pagination.page, filters]); // Reload when page or filters change

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading users...');
      const response = await adminService.getUsers(pagination.page, pagination.limit, filters);
      console.log('📊 Users response:', response);
      
      // Handle the response structure according to API spec
      console.log('🔍 Response structure:', {
        hasResponse: !!response,
        responseType: typeof response,
        responseKeys: response ? Object.keys(response) : 'null',
        hasUsers: response?.users,
        hasTransactions: response?.transactions,
        isArray: Array.isArray(response)
      });
      
      if (response && response.users) {
        setUsers(response.users);
        setPagination(response.pagination || pagination);
      } else if (Array.isArray(response)) {
        // Direct array response
        setUsers(response);
        setPagination(prev => ({ ...prev, total: response.length }));
      } else if (response && response.transactions) {
        // Response has transactions instead of users
        setUsers(response.transactions);
        setPagination(response.pagination || pagination);
      } else {
        // Fallback - treat response as users array
        setUsers(response || []);
        setPagination(prev => ({ ...prev, total: Array.isArray(response) ? response.length : 0 }));
      }
      console.log('✅ Users loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      console.log('🔄 Loading user stats...');
      const stats = await adminService.getUserStats();
      console.log('📊 User stats response:', stats);
      
      // Handle the response structure according to API spec
      if (stats) {
        setUserStats(stats);
      }
      console.log('✅ User stats loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load user stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setShowEditModal(true);
  };

  const handleViewDetails = (userData) => {
    setSelectedUser(userData);
    setShowDetailsModal(true);
  };

  const handleUpdateUser = async (updateData) => {
    try {
      await adminService.updateUser(selectedUser.id, updateData);
      setShowEditModal(false);
      setSelectedUser(null);
      loadUsers();
      loadUserStats();
    } catch (error) {
      console.error('Failed to update user:', error);
      setError(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminService.deleteUser(userId);
      loadUsers();
      loadUserStats();
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError(error.message || 'Failed to delete user');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'SUSPENDED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount, currencyCode = 'NGN') => {
    const symbols = {
      'NGN': '₦',
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF ',
      'ZAR': 'R'
    };
    
    // Handle very large numbers and scientific notation
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(numAmount)) return `${symbols[currencyCode] || ''}0`;
    
    // Convert from smallest currency unit to main unit if the number is very large
    let displayAmount = numAmount;
    if (displayAmount > 1e12) {
      displayAmount = displayAmount / 100; // Convert from cents to main currency unit
    }
    
    // Format with proper grouping and decimal places
    let formattedAmount;
    if (displayAmount >= 1e12) {
      formattedAmount = (displayAmount / 1e12).toFixed(2) + 'T';
    } else if (displayAmount >= 1e9) {
      formattedAmount = (displayAmount / 1e9).toFixed(2) + 'B';
    } else if (displayAmount >= 1e6) {
      formattedAmount = (displayAmount / 1e6).toFixed(2) + 'M';
    } else if (displayAmount >= 1e3) {
      formattedAmount = (displayAmount / 1e3).toFixed(2) + 'K';
    } else {
      formattedAmount = displayAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    return `${symbols[currencyCode] || ''}${formattedAmount}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className={`flex justify-between items-center px-4 lg:px-20 py-4 lg:py-6 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="flex items-center">
          <Logo className="w-10 h-7 lg:w-13 lg:h-9 mr-3" />
          <div className="text-black/80 dark:text-dark-text font-times text-lg lg:text-2xl font-bold transition-colors duration-300">
            FLOWWAVE ADMIN
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4 lg:gap-10">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-neutral-dark dark:text-dark-text">
              {user?.email || 'Admin'}
            </span>
          </div>

          <DarkModeToggle />

          <button
            onClick={handleLogout}
            className="px-4 py-2 lg:px-6 lg:py-3 border-2 border-primary-blue text-primary-blue rounded-lg font-bold text-sm lg:text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-4 lg:px-0 pb-24">
        <div className={`w-full max-w-7xl mx-auto ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-dark">User Management</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* User Stats */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-neutral-dark">{userStats.totalUsers?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Active Users</h3>
                <p className="text-2xl font-bold text-green-600">{userStats.activeUsers?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Pending Users</h3>
                <p className="text-2xl font-bold text-yellow-600">{userStats.pendingUsers?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Suspended Users</h3>
                <p className="text-2xl font-bold text-red-600">{userStats.suspendedUsers?.toLocaleString() || '0'}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by email, name, phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="email-asc">Email A-Z</option>
                <option value="email-desc">Email Z-A</option>
              </select>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mr-3"></div>
              <span className="text-neutral-dark">Loading users...</span>
            </div>
          )}

          {/* Users List */}
          {!loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-gray">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Transactions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Volume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-neutral-gray">{user.email}</div>
                              <div className="text-xs text-neutral-gray">{user.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {user.country || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {user.totalTransactions?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {formatCurrency(user.totalVolume)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(user)}
                                className="text-primary-blue hover:text-primary-blue/80"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditUser(user)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-neutral-gray">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-neutral-gray">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

// Edit User Modal Component
const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    phoneNumber: user.phoneNumber
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Edit User</h3>
          <button
            onClick={onClose}
            className="text-neutral-gray hover:text-neutral-dark"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">User Details</h3>
          <button
            onClick={onClose}
            className="text-neutral-gray hover:text-neutral-dark"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-neutral-gray">Name</label>
              <p className="text-neutral-dark">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-gray">Email</label>
              <p className="text-neutral-dark">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-gray">Phone</label>
              <p className="text-neutral-dark">{user.phoneNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-gray">Status</label>
              <p className="text-neutral-dark">{user.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-gray">Country</label>
              <p className="text-neutral-dark">{user.country || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-gray">Joined</label>
              <p className="text-neutral-dark">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-neutral-dark mb-2">Transaction Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-gray">Total Transactions</label>
                <p className="text-neutral-dark">{user.totalTransactions?.toLocaleString() || '0'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Total Volume</label>
                <p className="text-neutral-dark">${user.totalVolume?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
