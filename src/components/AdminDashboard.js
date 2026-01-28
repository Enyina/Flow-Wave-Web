import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardAnalytics();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      console.log('🔄 Loading users for dashboard...');
      const response = await adminService.getUsers(1, 20);
      console.log('📊 Dashboard users response:', response);
      
      // Handle the response structure
      if (response && response.users) {
        setUsers(response.users);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        setUsers(response || []);
      }
      console.log('✅ Dashboard users loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load dashboard users:', error);
      setUsersError(error.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      console.log('🔄 Loading transactions for dashboard...');
      const response = await adminService.getTransactions(1, 20);
      console.log('📊 Dashboard transactions response:', response);
      
      // Handle the response structure
      if (response && response.transactions) {
        setTransactions(response.transactions);
      } else if (Array.isArray(response)) {
        setTransactions(response);
      } else {
        setTransactions(response || []);
      }
      console.log('✅ Dashboard transactions loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load dashboard transactions:', error);
      setTransactionsError(error.message || 'Failed to load transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User action handlers
  const handleEditUser = (userData) => {
    console.log('Edit user:', userData);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleViewUser = (userData) => {
    console.log('View user details:', userData);
    // TODO: Open details modal or navigate to details page
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(userId);
        console.log('User deleted successfully');
        loadUsers(); // Reload users
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await adminService.updateUser(userId, { status: 'SUSPENDED' });
      console.log('User suspended successfully');
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await adminService.updateUser(userId, { status: 'ACTIVE' });
      console.log('User activated successfully');
      loadUsers(); // Reload users
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  // Transaction action handlers
  const handleViewTransaction = (transactionData) => {
    console.log('View transaction details:', transactionData);
    // TODO: Open transaction details modal or navigate to details page
  };

  const handleUpdateTransactionStatus = async (transactionId, status) => {
    try {
      await adminService.updateTransactionStatus(transactionId, { status });
      console.log('Transaction status updated successfully');
      loadTransactions(); // Reload transactions
    } catch (error) {
      console.error('Failed to update transaction status:', error);
    }
  };

  const handleApproveTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to approve this transaction?')) {
      await handleUpdateTransactionStatus(transactionId, 'COMPLETED');
    }
  };

  const handleRejectTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to reject this transaction?')) {
      await handleUpdateTransactionStatus(transactionId, 'FAILED');
    }
  };

  const handleCancelTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to cancel this transaction?')) {
      await handleUpdateTransactionStatus(transactionId, 'CANCELLED');
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'suspended':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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
    // This handles cases where amounts are stored in cents/kobo
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

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-dark dark:text-dark-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 border-b border-gray-200">
            {['overview', 'analytics', 'users', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-primary-blue border-primary-blue'
                    : 'text-neutral-gray border-transparent hover:text-neutral-dark'
                }`}
              >
                {tab}
              </button>
            ))}
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics - Only show when not loading and no error */}
              {!loading && !error && dashboardData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-gray">Total Users</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M23 21V19C23 18.0474 22.6792 17.1275 22.0991 16.4019C21.519 15.6763 20.7085 15.1936 19.816 15" stroke="currentColor" strokeWidth="2"/>
                        <path d="M16 3.13C16.8604 3.35031 17.6249 3.85071 18.1677 4.55232C18.7104 5.25392 19 6.1199 19 7.01005C19 7.90019 18.7104 8.76617 18.1677 9.46778C17.6249 10.1694 16.8604 10.6698 16 10.8901" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-dark">
                    {dashboardData.overview?.totalUsers?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-neutral-gray mt-1">
                    {dashboardData.overview?.activeUsers?.toLocaleString() || '0'} active
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-gray">Total Transactions</h3>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-green-600">
                        <path d="M13 7H18V12H13M6 12H11V7H6M13 12V17H18V12M11 12V7H6V12M11 12V17H6V12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-dark">
                    {dashboardData.overview?.totalTransactions?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-neutral-gray mt-1">
                    All time
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-gray">Total Volume</h3>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                        <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-dark">
                    {formatCurrency(dashboardData.overview?.totalVolume || 0)}
                  </p>
                  <p className="text-xs text-neutral-gray mt-1">
                    Transaction volume
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-neutral-gray">Total Revenue</h3>
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.81.45 1.61 1.67 1.61 1.16 0 1.6-.64 1.6-1.46 0-.84-.68-1.22-1.88-1.64-1.76-.59-3.03-1.35-3.03-3.08 0-1.56 1.03-2.76 2.81-3.12V5h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.63-1.63-1.63-1.01 0-1.46.54-1.46 1.34 0 .74.54 1.13 1.75 1.55 1.82.62 3.16 1.39 3.16 3.22 0 1.62-1.06 2.86-2.92 3.27z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-dark">
                    {formatCurrency(dashboardData.overview?.totalRevenue || 0)}
                  </p>
                  <p className="text-xs text-neutral-gray mt-1">
                    From fees
                  </p>
                </div>
              </div>
              )}

              {/* Top Metrics - Only show when not loading and no error */}
              {!loading && !error && dashboardData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Fastest Growing Countries</h3>
                  <div className="space-y-3">
                    {dashboardData.topMetrics?.fastestGrowingCountries?.slice(0, 5).map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-blue/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-blue">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium">{country.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">+{country.growth}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Top Recipients</h3>
                  <div className="space-y-3">
                    {dashboardData.topMetrics?.topRecipients?.slice(0, 5).map((recipient, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-blue/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-blue">{index + 1}</span>
                          </div>
                          <span className="text-sm font-medium">{recipient.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{recipient.count} transactions</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && dashboardData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-neutral-dark mb-6">Analytics & Trends</h2>
              
              {/* Daily Transactions Trend */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">Daily Transactions Trend</h3>
                <div className="space-y-2">
                  {dashboardData.trends?.dailyTransactions?.slice(-7).map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-neutral-gray">{formatDate(day.date)}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{day.count} transactions</span>
                        <span className="text-sm font-bold">{formatCurrency(day.volume)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Growth */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">Monthly Growth</h3>
                <div className="space-y-2">
                  {dashboardData.trends?.monthlyGrowth?.map((month, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-neutral-gray">{month.month}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">{month.users.toLocaleString()} users</span>
                        <span className="text-sm font-bold">{month.transactions.toLocaleString()} transactions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-dark">User Management</h2>
                <button
                  onClick={() => navigate('/admin/users')}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                >
                  Full User Management
                </button>
              </div>

              {/* Users Loading State */}
              {usersLoading && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mr-3"></div>
                    <span className="text-neutral-gray">Loading users...</span>
                  </div>
                </div>
              )}

              {/* Users Error State */}
              {usersError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-red-700">{usersError}</span>
                  </div>
                </div>
              )}

              {/* Users List */}
              {!usersLoading && !usersError && users.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                {user.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {user.country || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {user.totalTransactions || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                              {formatCurrency(user.totalVolume || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewUser(user)}
                                  className="text-primary-blue hover:text-primary-blue/80 transition-colors"
                                  title="View Details"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-green-600 hover:text-green-800 transition-colors"
                                  title="Edit User"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                {user.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => handleSuspendUser(user.id)}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                    title="Suspend User"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateUser(user.id)}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                    title="Activate User"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  title="Delete User"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!usersLoading && !usersError && users.length === 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-neutral-gray">No users found</h3>
                    <p className="mt-1 text-sm text-neutral-gray">Get started by adding some users to the system.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-neutral-dark">Transaction Management</h2>
                <button
                  onClick={() => navigate('/admin/transactions')}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                >
                  Full Transaction Management
                </button>
              </div>

              {/* Transactions Loading State */}
              {transactionsLoading && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mr-3"></div>
                    <span className="text-neutral-gray">Loading transactions...</span>
                  </div>
                </div>
              )}

              {/* Transactions Error State */}
              {transactionsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-red-700">{transactionsError}</span>
                  </div>
                </div>
              )}

              {/* Transactions List */}
              {!transactionsLoading && !transactionsError && transactions.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Transaction</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Recipient</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-neutral-dark">
                                  {transaction.reference || `TX-${transaction.id?.slice(-8)}`}
                                </div>
                                <div className="text-xs text-neutral-gray">
                                  {transaction.fromCurrency} → {transaction.toCurrency}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-neutral-dark">
                                  {transaction.user?.firstName} {transaction.user?.lastName}
                                </div>
                                <div className="text-sm text-neutral-gray">{transaction.user?.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-neutral-dark">
                                  {formatCurrency(transaction.amount || 0, transaction.fromCurrency)}
                                </div>
                                {transaction.transferFee && (
                                  <div className="text-xs text-neutral-gray">
                                    Fee: {formatCurrency(transaction.transferFee, transaction.fromCurrency)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionStatusColor(transaction.status)}`}>
                                {transaction.status || 'PENDING'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-neutral-dark">
                                  {transaction.recipient?.name || 'N/A'}
                                </div>
                                <div className="text-xs text-neutral-gray">
                                  {transaction.recipient?.bank} • {transaction.recipient?.accountNumber?.slice(-4) || '****'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              <div>
                                <div>{formatDate(transaction.createdAt)}</div>
                                <div className="text-xs">{new Date(transaction.createdAt).toLocaleTimeString()}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleViewTransaction(transaction)}
                                  className="text-primary-blue hover:text-primary-blue/80 transition-colors"
                                  title="View Details"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                {transaction.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => handleApproveTransaction(transaction.id)}
                                      className="text-green-600 hover:text-green-800 transition-colors"
                                      title="Approve Transaction"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => handleRejectTransaction(transaction.id)}
                                      className="text-red-600 hover:text-red-800 transition-colors"
                                      title="Reject Transaction"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </>
                                )}
                                {transaction.status === 'PROCESSING' && (
                                  <button
                                    onClick={() => handleCancelTransaction(transaction.id)}
                                    className="text-yellow-600 hover:text-yellow-800 transition-colors"
                                    title="Cancel Transaction"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!transactionsLoading && !transactionsError && transactions.length === 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-neutral-gray">No transactions found</h3>
                    <p className="mt-1 text-sm text-neutral-gray">No transactions have been processed yet.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
