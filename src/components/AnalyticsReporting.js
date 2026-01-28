import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import adminService from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const AnalyticsReporting = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyReport, setDailyReport] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [transactionStats, setTransactionStats] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTab, selectedDate]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'daily') {
        const report = await adminService.getDailyReport(selectedDate);
        setDailyReport(report);
      } else if (activeTab === 'overview') {
        const data = await adminService.getDashboardAnalytics();
        setDashboardData(data);
      } else if (activeTab === 'transactions') {
        const stats = await adminService.getTransactionStats();
        setTransactionStats(stats);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
    return `${symbols[currencyCode] || ''}${amount?.toLocaleString() || '0'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const handleExportReport = async (type, format) => {
    try {
      // This would integrate with the export functionality
      console.log(`Exporting ${type} report as ${format}`);
    } catch (error) {
      console.error('Failed to export report:', error);
      setError(error.message || 'Failed to export report');
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
            <h1 className="text-2xl font-bold text-neutral-dark">Analytics & Reporting</h1>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {['daily', 'overview', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-primary-blue border-primary-blue'
                    : 'text-neutral-gray border-transparent hover:text-neutral-dark'
                }`}
              >
                {tab === 'daily' ? 'Daily Report' : tab === 'overview' ? 'Overview Analytics' : 'Transaction Analytics'}
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
              <span className="text-neutral-dark">Loading analytics...</span>
            </div>
          )}

          {/* Daily Report Tab */}
          {activeTab === 'daily' && dailyReport && (
            <div className="space-y-6">
              {/* Date Selector and Export */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-neutral-dark">Select Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportReport('daily', 'csv')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExportReport('daily', 'pdf')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Daily Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">Daily Summary - {formatDate(dailyReport.date)}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-blue">{dailyReport.totalTransactions?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-neutral-gray mt-1">Total Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{formatCurrency(dailyReport.totalVolume || 0)}</div>
                    <div className="text-sm text-neutral-gray mt-1">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{formatCurrency(dailyReport.totalFees || 0)}</div>
                    <div className="text-sm text-neutral-gray mt-1">Total Fees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{dailyReport.newUsers?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-neutral-gray mt-1">New Users</div>
                  </div>
                </div>
              </div>

              {/* Transaction Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Transaction Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-gray">Successful</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-green-600">{dailyReport.successfulTransactions?.toLocaleString() || '0'}</span>
                        <span className="text-xs text-neutral-gray ml-2">
                          ({dailyReport.totalTransactions ? formatPercentage(dailyReport.successfulTransactions / dailyReport.totalTransactions) : '0%'})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-gray">Failed</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-red-600">{dailyReport.failedTransactions?.toLocaleString() || '0'}</span>
                        <span className="text-xs text-neutral-gray ml-2">
                          ({dailyReport.totalTransactions ? formatPercentage(dailyReport.failedTransactions / dailyReport.totalTransactions) : '0%'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">User Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-gray">Active Users</span>
                      <span className="text-sm font-bold">{dailyReport.activeUsers?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-gray">New Users</span>
                      <span className="text-sm font-bold">{dailyReport.newUsers?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly Breakdown */}
              {dailyReport.breakdown?.byHour && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Hourly Transaction Breakdown</h3>
                  <div className="space-y-2">
                    {dailyReport.breakdown.byHour.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-sm text-neutral-gray">{hour.hour}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary-blue h-2 rounded-full" 
                              style={{ width: `${Math.min((hour.transactions / (dailyReport.totalTransactions || 1)) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{hour.transactions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Currency Breakdown */}
              {dailyReport.breakdown?.byCurrency && (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Currency Breakdown</h3>
                  <div className="space-y-2">
                    {dailyReport.breakdown.byCurrency.map((currency, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-blue/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-blue">{currency.currency}</span>
                          </div>
                          <span className="text-sm font-medium">{currency.currency}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">{currency.count} transactions</span>
                          <span className="text-sm font-bold">{formatCurrency(currency.volume)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Overview Analytics Tab */}
          {activeTab === 'overview' && dashboardData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-dark">Overview Analytics</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportReport('overview', 'csv')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExportReport('overview', 'pdf')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-primary-blue">{dashboardData.overview?.totalUsers?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-neutral-gray mt-1">{dashboardData.overview?.activeUsers?.toLocaleString() || '0'} active</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Transactions</h3>
                  <p className="text-3xl font-bold text-green-600">{dashboardData.overview?.totalTransactions?.toLocaleString() || '0'}</p>
                  <p className="text-xs text-neutral-gray mt-1">All time</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Volume</h3>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(dashboardData.overview?.totalVolume || 0)}</p>
                  <p className="text-xs text-neutral-gray mt-1">Transaction volume</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-yellow-600">{formatCurrency(dashboardData.overview?.totalRevenue || 0)}</p>
                  <p className="text-xs text-neutral-gray mt-1">From fees</p>
                </div>
              </div>

              {/* Trends */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Daily Transaction Trends</h3>
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
            </div>
          )}

          {/* Transaction Analytics Tab */}
          {activeTab === 'transactions' && transactionStats && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-dark">Transaction Analytics</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportReport('transactions', 'csv')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExportReport('transactions', 'pdf')}
                    className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Transaction Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Transactions</h3>
                  <p className="text-3xl font-bold text-primary-blue">{transactionStats.totalTransactions?.toLocaleString() || '0'}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Volume</h3>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(transactionStats.totalVolume || 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Success Rate</h3>
                  <p className="text-3xl font-bold text-purple-600">{transactionStats.successRate || '0'}%</p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="text-sm font-medium text-neutral-gray mb-2">Total Fees</h3>
                  <p className="text-3xl font-bold text-yellow-600">{formatCurrency(transactionStats.totalFees || 0)}</p>
                </div>
              </div>

              {/* Additional transaction analytics can be added here */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-neutral-dark mb-4">Transaction Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-neutral-dark mb-2">Average Transaction Value</h4>
                    <p className="text-2xl font-bold">{formatCurrency(transactionStats.averageTransactionValue || 0)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-neutral-dark mb-2">Peak Transaction Hour</h4>
                    <p className="text-2xl font-bold">{transactionStats.peakHour || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnalyticsReporting;
