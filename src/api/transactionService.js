const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5600/api';

class TransactionService {
  // Check Exchange Rates
  async checkExchangeRate(amount, fromCurrency, toCurrency) {
    const response = await fetch(`${API_BASE_URL}/exchange-rate/convert?amount=${amount}&fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Rate check failed');
    }

    return response.json();
  }

  // Initiate Transaction
  async initiateTransaction(transactionData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/initiate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transaction initiation failed');
    }

    return response.json();
  }

  // Add Beneficiary Details
  async addBeneficiaryDetails(transactionId, beneficiaryData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/${transactionId}/beneficiary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(beneficiaryData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add beneficiary details');
    }

    return response.json();
  }

  // Generate Payment Reference
  async generatePaymentReference(transactionId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/${transactionId}/payment-reference`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate payment reference');
    }

    return response.json();
  }

  // Confirm Payment
  async confirmPayment(transactionId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/${transactionId}/confirm-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to confirm payment');
    }

    return response.json();
  }

  // Get Transaction Status
  async getTransactionStatus(transactionId) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get transaction status');
    }

    return response.json();
  }

  // Get User Transactions
  async getUserTransactions(page = 1, limit = 20) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get transactions');
    }

    return response.json();
  }

  // Cancel Transaction
  async cancelTransaction(transactionId, reason) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/flowwave/transactions/${transactionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel transaction');
    }

    return response.json();
  }
}

export default new TransactionService();
