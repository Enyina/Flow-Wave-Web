import { apiFetch } from './api';

// Exchange Rates
export const getExchangeRate = async (fromCurrency, toCurrency) => {
  try {
    const response = await apiFetch(`/exchange-rate/rate?from=${fromCurrency}&to=${toCurrency}`);
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get exchange rate');
  } catch (error) {
    console.error('Error getting exchange rate:', error);
    throw error;
  }
};

// Get user's recipients
export const getRecipients = async (page = 1, limit = 100, search = '') => {
  try {
    const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await apiFetch(`/recipients?page=${page}&limit=${limit}${searchQuery}`);
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get recipients');
  } catch (error) {
    console.error('Error getting recipients:', error);
    throw error;
  }
};

// Create new recipient
export const createRecipient = async (recipientData) => {
  try {
    const response = await apiFetch('/recipients', {
      method: 'POST',
      body: recipientData
    });
    if (response.ok) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to create recipient');
  } catch (error) {
    console.error('Error creating recipient:', error);
    throw error;
  }
};

// Initiate transaction
export const initiateTransaction = async (transactionData) => {
  try {
    const response = await apiFetch('/flowwave/transactions/initiate', {
      method: 'POST',
      body: transactionData
    });
    if (response.ok) {
      return response.data;
    }
    throw new Error(response.data?.message || 'Failed to initiate transaction');
  } catch (error) {
    console.error('Error initiating transaction:', error);
    throw error;
  }
};

// Confirm payment with invoice
export const confirmPaymentWithInvoice = async (transactionId, invoiceFile, notes = '') => {
  try {
    const formData = new FormData();
    formData.append('invoice', invoiceFile);
    if (notes) {
      formData.append('notes', notes);
    }

    const response = await apiFetch(`/flowwave/transactions/${transactionId}/confirm-payment-with-invoice`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to confirm payment');
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

// Get transaction status
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await apiFetch(`/flowwave/transactions/${transactionId}`);
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get transaction status');
  } catch (error) {
    console.error('Error getting transaction status:', error);
    throw error;
  }
};

// List user transactions
export const getTransactions = async (page = 1, limit = 20, status = '') => {
  try {
    const statusQuery = status ? `&status=${status}` : '';
    const response = await apiFetch(`/flowwave/transactions?page=${page}&limit=${limit}${statusQuery}`);
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get transactions');
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

// Calculate transfer fee (0.02% of amount)
export const calculateTransferFee = (amount) => {
  return amount * 0.0002; // 0.02% = 0.0002
};

// Calculate total amount including fee
export const calculateTotalAmount = (amount) => {
  const fee = calculateTransferFee(amount);
  return amount + fee;
};

// Get transaction by ID (for status polling)
export const getTransactionById = async (transactionId) => {
  try {
    const response = await apiFetch(`/flowwave/transactions/${transactionId}`);
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get transaction');
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
};

// Poll transaction status (for real-time updates)
export const pollTransactionStatus = async (transactionId, callback, interval = 5000, maxAttempts = 60) => {
  let attempts = 0;
  
  const poll = async () => {
    attempts++;
    
    try {
      const response = await apiFetch(`/flowwave/transactions/${transactionId}/status`);
      if (response.ok) {
        const status = response.data;
        callback(status);
        
        // Stop polling if transaction is completed or failed
        if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(status.status)) {
          return;
        }
      }
      
      // Continue polling if not max attempts
      if (attempts < maxAttempts) {
        setTimeout(poll, interval);
      }
    } catch (error) {
      console.error('Polling error:', error);
      
      // Continue polling if not max attempts
      if (attempts < maxAttempts) {
        setTimeout(poll, interval);
      }
    }
  };
  
  poll();
  
  // Return cleanup function
  return () => {
    attempts = maxAttempts; // Stop further polling
  };
};

// Manual payment status check (calls backend to check Paystack)
export const checkPaymentStatus = async (transactionId) => {
  try {
    console.log('🔍 Checking payment status for transaction:', transactionId);
    
    const response = await apiFetch(`/paystack/transaction/${transactionId}/check-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('✅ Payment status check successful:', response.data);
      return response.data;
    }
    
    throw new Error('Failed to check payment status');
  } catch (error) {
    console.error('❌ Error checking payment status:', error);
    throw error;
  }
};

// Generate virtual account for transaction
export const generateVirtualAccount = async (transactionData) => {
  try {
    console.log('🚀 Generating virtual account with data:', transactionData);
    
    const response = await apiFetch('/flowwave/virtual-accounts/generate', {
      method: 'POST',
      body: transactionData
    });
    
    console.log('📡 API Response:', response);
    
    if (response.ok) {
      console.log('✅ Virtual account generated successfully:', response.data);
      return response.data;
    }
    
    console.error('❌ API Error Response:', response);
    throw new Error(response.data?.message || 'Failed to generate virtual account');
  } catch (error) {
    console.error('❌ Error generating virtual account:', error);
    throw error;
  }
};

// Get virtual account details
export const getVirtualAccount = async (accountId) => {
  try {
    const response = await apiFetch(`/flowwave/virtual-accounts/${accountId}`);
    
    if (response.ok) {
      return response.data;
    }
    throw new Error('Failed to get virtual account details');
  } catch (error) {
    console.error('Error getting virtual account:', error);
    throw error;
  }
};
