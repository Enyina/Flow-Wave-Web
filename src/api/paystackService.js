const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5600/api';

class PaystackService {
  constructor() {
    this.secretKey = process.env.REACT_APP_PAYSTACK_SECRET_KEY || 'pk_test_your_paystack_public_key';
    this.paystackBaseUrl = 'https://api.paystack.co';
  }

  // Initialize Payment
  async initializePayment(paymentData) {
    const response = await fetch(`${API_BASE_URL}/paystack/payment/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: paymentData.email,
        amount: paymentData.amount, // in kobo/cents
        reference: paymentData.reference,
        callback_url: paymentData.callbackUrl || `${window.location.origin}/payment/callback`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment initialization failed');
    }

    return response.json();
  }

  // Verify Payment
  async verifyPayment(reference) {
    const response = await fetch(`${API_BASE_URL}/paystack/payment/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment verification failed');
    }

    return response.json();
  }

  // Resolve Bank Account
  async resolveBankAccount(accountNumber, bankCode) {
    const response = await fetch(`${API_BASE_URL}/paystack/bank/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountNumber,
        bankCode,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Bank resolution failed');
    }

    return response.json();
  }

  // Get Banks List
  async getBanks() {
    const response = await fetch(`${API_BASE_URL}/paystack/banks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get banks list');
    }

    return response.json();
  }

  // Direct Paystack API call (fallback)
  async directInitializePayment(paymentData) {
    const response = await fetch(`${this.paystackBaseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: paymentData.email,
        amount: paymentData.amount,
        reference: paymentData.reference,
        callback_url: paymentData.callbackUrl || `${window.location.origin}/payment/callback`,
        metadata: paymentData.metadata || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment initialization failed');
    }

    return response.json();
  }

  // Direct Paystack verification (fallback)
  async directVerifyPayment(reference) {
    const response = await fetch(`${this.paystackBaseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment verification failed');
    }

    return response.json();
  }

  // Initialize Payment with Paystack Popup
  initializePaymentWithPopup(paymentData) {
    return new Promise((resolve, reject) => {
      const handler = window.PaystackPop.setup({
        key: this.secretKey,
        email: paymentData.email,
        amount: paymentData.amount,
        reference: paymentData.reference,
        callback: (response) => {
          resolve(response);
        },
        onClose: () => {
          reject(new Error('Payment popup was closed'));
        },
      });

      handler.openIframe();
    });
  }

  // Generate Transaction Reference
  generateReference() {
    const date = new Date();
    const timestamp = date.getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `FW_${timestamp}_${randomString}`;
  }

  // Format Amount for Paystack (convert to kobo)
  formatAmount(amount) {
    return Math.round(amount * 100); // Convert to kobo/cents
  }

  // Parse Amount from Paystack (convert from kobo)
  parseAmount(amountInKobo) {
    return (amountInKobo / 100).toFixed(2);
  }
}

export default new PaystackService();
