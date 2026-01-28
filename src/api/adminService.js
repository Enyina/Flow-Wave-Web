import { apiFetch } from './api';

class AdminService {
  constructor() {
    this.baseURL = '/admin';
  }

  // Dashboard Analytics
  async getDashboardAnalytics() {
    const response = await apiFetch(`${this.baseURL}/analytics/dashboard`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get dashboard analytics');
    }
    return response.data.data.data;
  }

  // User Management
  async getUsers(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status }),
      ...(filters.role && { role: filters.role }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder && { sortOrder: filters.sortOrder })
    });

    const response = await apiFetch(`${this.baseURL}/users?${params.toString()}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get users');
    }
    return response.data.data.data;
  }

  async getUserDetails(userId) {
    const response = await apiFetch(`${this.baseURL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get user details');
    }
    return response.data.data.data;
  }

  async updateUser(userId, updateData) {
    const response = await apiFetch(`${this.baseURL}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to update user');
    }
    return response.data.data.data;
  }

  async deleteUser(userId) {
    const response = await apiFetch(`${this.baseURL}/users/${userId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to delete user');
    }
    return response.data.data.data;
  }

  async getUserStats() {
    const response = await apiFetch(`${this.baseURL}/users/stats`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get user stats');
    }
    return response.data.data.data;
  }

  // Transaction Management
  async getTransactions(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.minAmount && { minAmount: filters.minAmount }),
      ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      ...(filters.currency && { currency: filters.currency })
    });

    const response = await apiFetch(`${this.baseURL}/transactions?${params.toString()}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get transactions');
    }
    return response.data.data.data;
  }

  async getAllTransactions(page = 1, limit = 20, filters = {}) {
    return this.getTransactions(page, limit, filters);
  }

  async getPendingTransactions(page = 1, limit = 20) {
    return this.getTransactions(page, limit, { status: 'PENDING' });
  }

  async getProcessingTransactions(page = 1, limit = 20) {
    return this.getTransactions(page, limit, { status: 'PROCESSING' });
  }

  async getTransactionDetails(transactionId) {
    const response = await apiFetch(`${this.baseURL}/transactions/${transactionId}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get transaction details');
    }
    return response.data.data.data;
  }

  async updateTransactionStatus(transactionId, statusData) {
    const response = await apiFetch(`${this.baseURL}/transactions/${transactionId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to update transaction status');
    }
    return response.data.data.data;
  }

  async getTransactionStats(dateRange = {}) {
    const params = new URLSearchParams();
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);

    const response = await apiFetch(`${this.baseURL}/transactions/stats?${params.toString()}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get transaction stats');
    }
    return response.data.data.data;
  }

  // Exchange Rates Management
  async getExchangeRates() {
    const response = await apiFetch(`${this.baseURL}/exchange-rates`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get exchange rates');
    }
    return response.data.data.data;
  }

  async createExchangeRate(rateData) {
    const response = await apiFetch(`${this.baseURL}/exchange-rates`, {
      method: 'POST',
      body: JSON.stringify(rateData)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to create exchange rate');
    }
    return response.data.data.data;
  }

  async updateExchangeRate(rateId, updateData) {
    const response = await apiFetch(`${this.baseURL}/exchange-rates/${rateId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to update exchange rate');
    }
    return response.data.data.data;
  }

  async deleteExchangeRate(rateId) {
    const response = await apiFetch(`${this.baseURL}/exchange-rates/${rateId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to delete exchange rate');
    }
    return response.data.data.data;
  }

  // Analytics & Reporting
  async getDailyReport(date) {
    const params = date ? `?date=${date}` : '';
    const response = await apiFetch(`${this.baseURL}/reports/daily${params}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get daily report');
    }
    return response.data.data.data;
  }

  // System Administration
  async getSystemHealth() {
    const response = await apiFetch(`${this.baseURL}/system/health`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get system health');
    }
    return response.data.data.data;
  }

  async getSystemSettings() {
    const response = await apiFetch(`${this.baseURL}/system/settings`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get system settings');
    }
    return response.data.data.data;
  }

  async updateSystemSettings(settings) {
    const response = await apiFetch(`${this.baseURL}/system/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to update system settings');
    }
    return response.data.data.data;
  }

  // Audit Trail
  async getAuditLogs(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.action && { action: filters.action }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate })
    });

    const response = await apiFetch(`${this.baseURL}/audit/logs?${params.toString()}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get audit logs');
    }
    return response.data.data.data;
  }

  // Transaction Trail
  async getTransactionTrail(transactionId) {
    const response = await apiFetch(`/api/audit/transaction/${transactionId}/trail`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get transaction trail');
    }
    return response.data.data.data;
  }

  // Export Transactions
  async exportTransactions(format = 'csv', filters = {}) {
    const params = new URLSearchParams({
      format,
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.status && { status: filters.status })
    });

    const response = await apiFetch(`${this.baseURL}/transactions/export?${params.toString()}`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to export transactions');
    }
    return response.data.data.data;
  }

  // Admin Management
  async createAdmin(adminData) {
    const response = await apiFetch(`${this.baseURL}/create-admin`, {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to create admin');
    }
    return response.data.data;
  }

  async promoteToAdmin(userId, reason) {
    const response = await apiFetch(`${this.baseURL}/promote-to-admin`, {
      method: 'POST',
      body: JSON.stringify({ userId, reason })
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to promote user to admin');
    }
    return response.data.data;
  }

  async demoteFromAdmin(userId, reason) {
    const response = await apiFetch(`${this.baseURL}/demote-from-admin`, {
      method: 'POST',
      body: JSON.stringify({ userId, reason })
    });
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to demote admin');
    }
    return response.data.data;
  }

  async getAdmins() {
    const response = await apiFetch(`${this.baseURL}/admins`);
    if (!response.ok) {
      throw new Error(response.data?.error || 'Failed to get admins');
    }
    return response.data.data;
  }
}

export const adminService = new AdminService();
