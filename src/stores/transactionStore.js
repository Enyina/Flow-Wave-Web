import { create } from 'zustand';
import { 
  getExchangeRate, 
  getRecipients, 
  createRecipient, 
  initiateTransaction, 
  confirmPaymentWithInvoice, 
  getTransactionStatus, 
  getTransactions,
  calculateTransferFee,
  calculateTotalAmount
} from '../api/transactionApi';

const useTransactionStore = create((set, get) => ({
  // State
  exchangeRate: null,
  recipients: [],
  transactions: [],
  currentTransaction: null,
  loading: false,
  error: null,
  
  // Exchange Rate
  fetchExchangeRate: async (fromCurrency, toCurrency) => {
    set({ loading: true, error: null });
    try {
      const rateData = await getExchangeRate(fromCurrency, toCurrency);
      set({ exchangeRate: rateData, loading: false });
      return rateData;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  // Recipients
  fetchRecipients: async (page = 1, limit = 100, search = '') => {
    set({ loading: true, error: null });
    try {
      const recipientsData = await getRecipients(page, limit, search);
      // The actual recipients array is in the data property
      const recipientsArray = recipientsData.data || recipientsData;
      set({ recipients: recipientsArray, loading: false });
      return recipientsArray;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  addRecipient: async (recipientData) => {
    set({ loading: true, error: null });
    try {
      const newRecipient = await createRecipient(recipientData);
      set(state => ({ 
        recipients: [...state.recipients, newRecipient],
        loading: false 
      }));
      return newRecipient;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  // Transactions
  initiateTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const transaction = await initiateTransaction(transactionData);
      set({ currentTransaction: transaction, loading: false });
      return transaction;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  confirmPayment: async (transactionId, invoiceFile, notes = '') => {
    set({ loading: true, error: null });
    try {
      const result = await confirmPaymentWithInvoice(transactionId, invoiceFile, notes);
      set(state => ({
        currentTransaction: { ...state.currentTransaction, ...result },
        loading: false
      }));
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  fetchTransactionStatus: async (transactionId) => {
    try {
      const status = await getTransactionStatus(transactionId);
      set(state => ({
        currentTransaction: { ...state.currentTransaction, ...status }
      }));
      return status;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  fetchTransactions: async (page = 1, limit = 20, status = '') => {
    set({ loading: true, error: null });
    try {
      const transactionsData = await getTransactions(page, limit, status);
      set({ transactions: transactionsData, loading: false });
      return transactionsData;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  // Status polling for real-time updates
  startStatusPolling: (transactionId, interval = 30000) => {
    const pollInterval = setInterval(async () => {
      try {
        await get().fetchTransactionStatus(transactionId);
      } catch (error) {
        console.error('Error polling transaction status:', error);
      }
    }, interval);
    
    // Store interval ID for cleanup
    set({ statusPollInterval: pollInterval });
    
    return pollInterval;
  },
  
  stopStatusPolling: () => {
    const { statusPollInterval } = get();
    if (statusPollInterval) {
      clearInterval(statusPollInterval);
      set({ statusPollInterval: null });
    }
  },
  
  // Utility functions
  calculateTransferFee,
  calculateTotalAmount,
  
  // Clear state
  clearError: () => set({ error: null }),
  clearCurrentTransaction: () => set({ currentTransaction: null }),
  reset: () => set({
    exchangeRate: null,
    recipients: [],
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
    statusPollInterval: null
  })
}));

export { useTransactionStore };
