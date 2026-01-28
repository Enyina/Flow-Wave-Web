import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const TransactionManagement = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    reason: '',
    notes: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    currency: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadTransactions();
    loadTransactionStats();
  }, [activeTab, pagination.page, filters]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading transactions...');
      let response;
      if (activeTab === 'pending') {
        response = await adminService.getPendingTransactions(pagination.page, 20);
      } else if (activeTab === 'processing') {
        response = await adminService.getProcessingTransactions(pagination.page, 20);
      } else {
        response = await adminService.getAllTransactions(pagination.page, 20);
      }
      
      console.log('📊 Transactions response:', response);
      setTransactions(response.transactions || []);
      setPagination(prev => ({ ...prev, totalPages: response.totalPages || 1 }));
      console.log('✅ Transactions loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load transactions:', error);
      setError(error.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionStats = async () => {
    try {
      console.log('🔄 Loading transaction stats...');
      const stats = await adminService.getTransactionStats();
      console.log('📊 Transaction stats response:', stats);
      setTransactionStats(stats);
      console.log('✅ Transaction stats loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load transaction stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStatusUpdate = async (transactionId) => {
    try {
      await adminService.updateTransactionStatus(transactionId, statusUpdate);
      setShowStatusModal(false);
      setSelectedTransaction(null);
      setStatusUpdate({ status: '', reason: '', notes: '' });
      loadTransactions();
      loadTransactionStats();
    } catch (error) {
      console.error('Failed to update transaction status:', error);
      setError(error.message || 'Failed to update transaction status');
    }
  };

  const openStatusModal = (transaction) => {
    setSelectedTransaction(transaction);
    setStatusUpdate({
      status: transaction.status,
      reason: '',
      notes: ''
    });
    setShowStatusModal(true);
  };

  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'PROCESSING': return 'text-blue-600 bg-blue-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleExport = async (format) => {
    try {
      await adminService.exportTransactions(format, filters);
    } catch (error) {
      console.error('Failed to export transactions:', error);
      setError(error.message || 'Failed to export transactions');
    }
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
            <h1 className="text-2xl font-bold text-neutral-dark">Transaction Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export Excel
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Transaction Stats */}
          {transactionStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Total Transactions</h3>
                <p className="text-2xl font-bold text-neutral-dark">{transactionStats.totalTransactions?.toLocaleString() || '0'}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Total Volume</h3>
                <p className="text-2xl font-bold text-neutral-dark">{formatCurrency(transactionStats.totalVolume || 0)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Success Rate</h3>
                <p className="text-2xl font-bold text-green-600">{transactionStats.successRate || '0'}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-gray mb-1">Total Fees</h3>
                <p className="text-2xl font-bold text-neutral-dark">{formatCurrency(transactionStats.totalFees || 0)}</p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {['all', 'pending', 'processing', 'completed', 'failed'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-primary-blue border-primary-blue'
                    : 'text-neutral-gray border-transparent hover:text-neutral-dark'
                }`}
              >
                {tab} Transactions
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="User ID"
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />

              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />

              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />

              <select
                value={filters.currency}
                onChange={(e) => handleFilterChange('currency', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              >
                <option value="">All Currencies</option>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
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
              <span className="text-neutral-dark">Loading transactions...</span>
            </div>
          )}

          {/* Transactions List */}
          {!loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-gray">No {activeTab} transactions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Transaction</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Recipient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">{transaction.reference}</div>
                              <div className="text-xs text-neutral-gray">ID: {transaction.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {transaction.user?.firstName} {transaction.user?.lastName}
                              </div>
                              <div className="text-xs text-neutral-gray">{transaction.user?.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {formatCurrency(transaction.amount, transaction.fromCurrency)}
                              </div>
                              <div className="text-xs text-neutral-gray">
                                {formatCurrency(transaction.totalAmount, transaction.toCurrency)} total
                              </div>
                              {transaction.transferFee > 0 && (
                                <div className="text-xs text-neutral-gray">
                                  Fee: {formatCurrency(transaction.transferFee)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {transaction.recipient?.name || 'N/A'}
                              </div>
                              <div className="text-xs text-neutral-gray">
                                {transaction.recipient?.bank || 'N/A'}
                              </div>
                              <div className="text-xs text-neutral-gray">
                                {transaction.recipient?.accountNumber || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                            <div>{formatDate(transaction.createdAt)}</div>
                            {transaction.completedAt && (
                              <div className="text-xs">Completed: {formatDate(transaction.completedAt)}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openDetailsModal(transaction)}
                                className="text-primary-blue hover:text-primary-blue/80"
                              >
                                View
                              </button>
                              {transaction.status !== 'COMPLETED' && transaction.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => openStatusModal(transaction)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Update
                                </button>
                              )}
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

      {/* Status Update Modal */}
      {showStatusModal && selectedTransaction && (
        <StatusUpdateModal
          transaction={selectedTransaction}
          statusUpdate={statusUpdate}
          setStatusUpdate={setStatusUpdate}
          onClose={() => setShowStatusModal(false)}
          onUpdate={() => handleStatusUpdate(selectedTransaction.id)}
        />
      )}

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

// Status Update Modal Component
const StatusUpdateModal = ({ transaction, statusUpdate, setStatusUpdate, onClose, onUpdate }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Update Transaction Status</h3>
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
            <label className="block text-sm font-medium text-neutral-dark mb-2">Transaction</label>
            <div className="text-sm text-neutral-gray">
              Reference: {transaction.reference}<br />
              Current Status: {transaction.status}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">New Status</label>
            <select
              value={statusUpdate.status}
              onChange={(e) => setStatusUpdate({...statusUpdate, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Reason</label>
            <input
              type="text"
              value={statusUpdate.reason}
              onChange={(e) => setStatusUpdate({...statusUpdate, reason: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="Reason for status change"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Admin Notes</label>
            <textarea
              value={statusUpdate.notes}
              onChange={(e) => setStatusUpdate({...statusUpdate, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              rows="3"
              placeholder="Additional notes"
            />
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
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, onClose }) => {
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
    return `${symbols[currencyCode] || ''}${amount?.toLocaleString() || '0'}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'PROCESSING': return 'text-blue-600 bg-blue-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Transaction Details</h3>
          <button
            onClick={onClose}
            className="text-neutral-gray hover:text-neutral-dark"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Transaction Overview */}
          <div>
            <h4 className="font-medium text-neutral-dark mb-3">Transaction Overview</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-gray">Reference</label>
                <p className="text-neutral-dark">{transaction.reference}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Status</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Created</label>
                <p className="text-neutral-dark">{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Completed</label>
                <p className="text-neutral-dark">
                  {transaction.completedAt ? new Date(transaction.completedAt).toLocaleString() : 'Not completed'}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div>
            <h4 className="font-medium text-neutral-dark mb-3">Amount Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-gray">Amount</label>
                <p className="text-neutral-dark">{formatCurrency(transaction.amount, transaction.fromCurrency)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Total Amount</label>
                <p className="text-neutral-dark">{formatCurrency(transaction.totalAmount, transaction.toCurrency)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Transfer Fee</label>
                <p className="text-neutral-dark">{formatCurrency(transaction.transferFee)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Exchange Rate</label>
                <p className="text-neutral-dark">{transaction.exchangeRate || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div>
            <h4 className="font-medium text-neutral-dark mb-3">User Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-gray">Name</label>
                <p className="text-neutral-dark">
                  {transaction.user?.firstName} {transaction.user?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Email</label>
                <p className="text-neutral-dark">{transaction.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Recipient Information */}
          <div>
            <h4 className="font-medium text-neutral-dark mb-3">Recipient Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-gray">Name</label>
                <p className="text-neutral-dark">{transaction.recipient?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Bank</label>
                <p className="text-neutral-dark">{transaction.recipient?.bank || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Account Number</label>
                <p className="text-neutral-dark">{transaction.recipient?.accountNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-gray">Currency</label>
                <p className="text-neutral-dark">{transaction.recipient?.currency || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;
