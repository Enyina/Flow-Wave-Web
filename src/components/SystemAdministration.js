import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import adminService from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const SystemAdministration = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('health');
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemSettings, setSystemSettings] = useState(null);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditRateModal, setShowEditRateModal] = useState(false);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadSystemData();
  }, [activeTab, pagination.page]);

  const loadSystemData = async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case 'health':
          const health = await adminService.getSystemHealth();
          setSystemHealth(health);
          break;
        case 'settings':
          const settings = await adminService.getSystemSettings();
          setSystemSettings(settings);
          break;
        case 'rates':
          const rates = await adminService.getExchangeRates();
          setExchangeRates(rates);
          break;
        case 'audit':
          const logs = await adminService.getAuditLogs(pagination.page, pagination.limit);
          setAuditLogs(logs.logs || []);
          setPagination(logs.pagination || pagination);
          break;
      }
    } catch (error) {
      console.error('Failed to load system data:', error);
      setError(error.message || 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateSettings = async (settingsData) => {
    try {
      await adminService.updateSystemSettings(settingsData);
      setShowSettingsModal(false);
      loadSystemData();
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError(error.message || 'Failed to update settings');
    }
  };

  const handleCreateExchangeRate = async (rateData) => {
    try {
      await adminService.createExchangeRate(rateData);
      setShowAddRateModal(false);
      loadSystemData();
    } catch (error) {
      console.error('Failed to create exchange rate:', error);
      setError(error.message || 'Failed to create exchange rate');
    }
  };

  const handleUpdateExchangeRate = async (rateId, updateData) => {
    try {
      await adminService.updateExchangeRate(rateId, updateData);
      setShowEditRateModal(false);
      setSelectedRate(null);
      loadSystemData();
    } catch (error) {
      console.error('Failed to update exchange rate:', error);
      setError(error.message || 'Failed to update exchange rate');
    }
  };

  const handleDeleteExchangeRate = async (rateId) => {
    if (!confirm('Are you sure you want to delete this exchange rate?')) return;
    
    try {
      await adminService.deleteExchangeRate(rateId);
      loadSystemData();
    } catch (error) {
      console.error('Failed to delete exchange rate:', error);
      setError(error.message || 'Failed to delete exchange rate');
    }
  };

  const openEditRateModal = (rate) => {
    setSelectedRate(rate);
    setShowEditRateModal(true);
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
            <h1 className="text-2xl font-bold text-neutral-dark">System Administration</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {['health', 'settings', 'rates', 'audit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-primary-blue border-primary-blue'
                    : 'text-neutral-gray border-transparent hover:text-neutral-dark'
                }`}
              >
                {tab === 'health' ? 'System Health' : tab === 'settings' ? 'Settings' : tab === 'rates' ? 'Exchange Rates' : 'Audit Logs'}
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mr-3"></div>
              <span className="text-neutral-dark">Loading system data...</span>
            </div>
          )}

          {/* System Health Tab */}
          {activeTab === 'health' && systemHealth && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">System Health Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getHealthStatusColor(systemHealth.overallStatus).split(' ')[0]}`}>
                      {systemHealth.overallStatus?.toUpperCase() || 'UNKNOWN'}
                    </div>
                    <div className="text-sm text-neutral-gray mt-1">Overall Status</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-blue">{systemHealth.uptime || 'N/A'}</div>
                    <div className="text-sm text-neutral-gray mt-1">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{systemHealth.responseTime || 'N/A'}ms</div>
                    <div className="text-sm text-neutral-gray mt-1">Response Time</div>
                  </div>
                </div>
              </div>

              {/* Service Status */}
              {systemHealth.services && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Service Status</h3>
                  <div className="space-y-3">
                    {systemHealth.services.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            service.status === 'healthy' ? 'bg-green-500' :
                            service.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}></div>
                          <span className="text-sm font-medium">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getHealthStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                          <span className="text-sm text-neutral-gray">{service.responseTime}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Metrics */}
              {systemHealth.metrics && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">System Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-dark">{systemHealth.metrics.cpuUsage || 'N/A'}%</div>
                      <div className="text-sm text-neutral-gray mt-1">CPU Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-dark">{systemHealth.metrics.memoryUsage || 'N/A'}%</div>
                      <div className="text-sm text-neutral-gray mt-1">Memory Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-dark">{systemHealth.metrics.diskUsage || 'N/A'}%</div>
                      <div className="text-sm text-neutral-gray mt-1">Disk Usage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-dark">{systemHealth.metrics.activeConnections || 'N/A'}</div>
                      <div className="text-sm text-neutral-gray mt-1">Active Connections</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'settings' && systemSettings && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-dark">System Settings</h2>
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                >
                  Edit Settings
                </button>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">Maintenance Mode</label>
                    <p className="text-neutral-dark">{systemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">Max Transaction Amount</label>
                    <p className="text-neutral-dark">${systemSettings.maxTransactionAmount?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">Fee Percentage</label>
                    <p className="text-neutral-dark">{systemSettings.feePercentage || 'N/A'}%</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-gray">Auto-approve Transactions</label>
                    <p className="text-neutral-dark">{systemSettings.autoApproveTransactions ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exchange Rates Tab */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-dark">Exchange Rates Management</h2>
                <button
                  onClick={() => setShowAddRateModal(true)}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
                >
                  Add Exchange Rate
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {exchangeRates.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-neutral-gray">No exchange rates found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">From Currency</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">To Currency</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Updated</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {exchangeRates.map((rate) => (
                          <tr key={rate.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                              {rate.fromCurrency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {rate.toCurrency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {rate.rate}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                rate.isActive ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50'
                              }`}>
                                {rate.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {formatDate(rate.updatedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openEditRateModal(rate)}
                                  className="text-primary-blue hover:text-primary-blue/80"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteExchangeRate(rate.id)}
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
            </div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-dark">Audit Logs</h2>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-neutral-gray">No audit logs found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Timestamp</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Action</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Resource</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">IP Address</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {formatDate(log.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {log.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {log.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {log.resource}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                              {log.ipAddress}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
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
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettingsModal && systemSettings && (
        <SettingsModal
          settings={systemSettings}
          onClose={() => setShowSettingsModal(false)}
          onUpdate={handleUpdateSettings}
        />
      )}

      {/* Add Exchange Rate Modal */}
      {showAddRateModal && (
        <ExchangeRateModal
          onClose={() => setShowAddRateModal(false)}
          onSave={handleCreateExchangeRate}
        />
      )}

      {/* Edit Exchange Rate Modal */}
      {showEditRateModal && selectedRate && (
        <ExchangeRateModal
          rate={selectedRate}
          onClose={() => setShowEditRateModal(false)}
          onSave={(data) => handleUpdateExchangeRate(selectedRate.id, data)}
        />
      )}
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ settings, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    maintenanceMode: settings.maintenanceMode || false,
    maxTransactionAmount: settings.maxTransactionAmount || 0,
    feePercentage: settings.feePercentage || 0,
    autoApproveTransactions: settings.autoApproveTransactions || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">Edit System Settings</h3>
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
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({...formData, maintenanceMode: e.target.checked})}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm font-medium text-neutral-dark">Maintenance Mode</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Max Transaction Amount</label>
            <input
              type="number"
              value={formData.maxTransactionAmount}
              onChange={(e) => setFormData({...formData, maxTransactionAmount: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Fee Percentage</label>
            <input
              type="number"
              value={formData.feePercentage}
              onChange={(e) => setFormData({...formData, feePercentage: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              step="0.001"
              min="0"
              max="1"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.autoApproveTransactions}
                onChange={(e) => setFormData({...formData, autoApproveTransactions: e.target.checked})}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm font-medium text-neutral-dark">Auto-approve Transactions</span>
            </label>
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
              Update Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Exchange Rate Modal Component
const ExchangeRateModal = ({ rate, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fromCurrency: rate?.fromCurrency || '',
    toCurrency: rate?.toCurrency || '',
    rate: rate?.rate || '',
    isActive: rate?.isActive !== undefined ? rate.isActive : true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-dark">
            {rate ? 'Edit Exchange Rate' : 'Add Exchange Rate'}
          </h3>
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
            <label className="block text-sm font-medium text-neutral-dark mb-2">From Currency</label>
            <select
              value={formData.fromCurrency}
              onChange={(e) => setFormData({...formData, fromCurrency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              disabled={!!rate}
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
              <option value="CHF">CHF</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">To Currency</label>
            <select
              value={formData.toCurrency}
              onChange={(e) => setFormData({...formData, toCurrency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              disabled={!!rate}
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="GBP">GBP</option>
              <option value="EUR">EUR</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="JPY">JPY</option>
              <option value="CHF">CHF</option>
              <option value="ZAR">ZAR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-2">Exchange Rate</label>
            <input
              type="number"
              value={formData.rate}
              onChange={(e) => setFormData({...formData, rate: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              step="0.0001"
              min="0"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
              />
              <span className="text-sm font-medium text-neutral-dark">Active</span>
            </label>
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
              {rate ? 'Update Rate' : 'Add Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemAdministration;
