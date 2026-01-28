// Consolidated API exports
// This is the main entry point for all API functionality

export { 
  apiClient, 
  apiFetch, 
  api 
} from './consolidatedApi';

export { authApi } from './authApi';

// Transaction API exports
export {
  getExchangeRate,
  getRecipients,
  createRecipient,
  initiateTransaction,
  confirmPaymentWithInvoice,
  getTransactionStatus,
  getTransactions,
  calculateTransferFee,
  calculateTotalAmount
} from './transactionApi';

// Re-export auth service functions for backward compatibility
export {
  getStoredUser,
  getCurrentUser,
  login,
  register,
  logout,
  sendMagicLink,
  verifyMagicLink,
  updatePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail
} from './authService';

// Default export for convenience
export { apiClient as default } from './consolidatedApi';
