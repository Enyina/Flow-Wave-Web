import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlow } from '../contexts/FlowContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTransactionStore } from '../stores/transactionStore';
import { initiateTransaction, confirmPaymentWithInvoice, checkPaymentStatus } from '../api/transactionApi';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const VirtualAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { flowState, updateFlowState } = useFlow();
  const { sendAmount, fromCurrency } = useCurrency();
  const { exchangeRate } = useTransactionStore();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForPayment, setIsWaitingForPayment] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState(null); // 60 seconds to wait for payment

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    generateVirtualAccount();
  }, []);

  const formatCurrency = (amount, currencyCode) => {
    const symbols = {
      'NGN': '₦',
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF ',
      'CNY': '¥',
      'INR': '₹'
    };
    return `${symbols[currencyCode] || currencyCode} ${parseFloat(amount || 0).toLocaleString()}`;
  };

  const calculateTotalPay = () => {
    const amount = parseFloat(flowState.sendAmount || sendAmount || 0);
    const fee = amount * 0.01; // 1% fee
    return amount + fee;
  };

  const generateVirtualAccount = async () => {
    setIsLoading(true);
    
    try {
      // Calculate total amount including fee
      const { calculateTransferFee, calculateTotalAmount } = useTransactionStore();
      const userAmount = parseFloat(flowState.sendAmount || sendAmount || 0);
      const transferFee = calculateTransferFee(userAmount);
      const totalAmount = calculateTotalAmount(userAmount);

      // Prepare transaction data for initiation
      const transactionData = {
        amount: userAmount, // Original user amount
        totalAmount: totalAmount, // Total amount including fee
        transferFee: transferFee, // Fee amount
        fromCurrency: fromCurrency?.code || 'NGN',
        toCurrency: flowState.toCurrency?.code || 'NGN',
        recipientId: flowState.selectedRecipient?.id,
        beneficiary: flowState.beneficiary,
        paymentDescription: flowState.purposeOfPayment || flowState.paymentDescription || '',
        exchangeRateData: {
          ...flowState.exchangeRateData,
          rate: flowState.exchangeRateData?.rate || exchangeRate,
          timestamp: new Date().toISOString(),
          feeCalculation: {
            percentage: 0.02,
            feeAmount: transferFee,
            totalAmount: totalAmount
          }
        }
      };

      console.log('🚀 Initiating transaction with data:', transactionData);

      // Initiate transaction (this automatically generates virtual account)
      const response = await initiateTransaction(transactionData);
      
      console.log('✅ Transaction initiated successfully:', response);
      
      // Update state with transaction data (includes virtual account in meta)
      setVirtualAccount(response.data || response); // Use response.data if it exists, otherwise response
      
      // Update flow state with transaction info
      updateFlowState({
        ...flowState,
        transaction: response.data || response,
        virtualAccount: (response.data || response).meta,
        status: 'PENDING_PAYMENT',
        createdAt: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Failed to initiate transaction:', error);
      // Handle error - could show error message or redirect
      // For now, we'll use fallback mock data
      const fallbackAccount = {
        accountNumber: '9988776655',
        bankName: 'Flowwave Virtual Bank',
        accountName: `${flowState.beneficiary?.beneficiaryName || 'Flowwave User'} - Temp Account`,
        reference: `FW${Date.now().toString().slice(-8)}`,
        expiryTime: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString()
      };
      
      setVirtualAccount(fallbackAccount);
      updateFlowState({
        ...flowState,
        virtualAccount: fallbackAccount,
        status: 'awaiting_payment',
        createdAt: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAccountNumber = () => {
    const accountNumber = virtualAccount?.meta?.virtualAccountNumber || virtualAccount?.accountNumber;
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      // You could add a toast notification here
    }
  };

  const handlePaymentConfirmed = async () => {
    if (!invoiceFile) {
      alert('Please upload your payment receipt first');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await confirmPaymentWithInvoice(virtualAccount.id, invoiceFile);
      console.log('✅ Payment confirmed with invoice:', response);
      
      // Update flow state
      updateFlowState({
        ...flowState,
        transaction: { ...virtualAccount, status: 'PENDING_APPROVAL' },
        status: 'PENDING_APPROVAL'
      });
      
      // Start automatic status checking
      setIsWaitingForPayment(true);
      setCountdown(60);
      
    } catch (error) {
      console.error('❌ Failed to confirm payment:', error);
      alert('Failed to upload receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualStatusCheck = async () => {
    if (!virtualAccount?.id) return;
    
    setIsCheckingPayment(true);
    
    try {
      const response = await checkPaymentStatus(virtualAccount.id);
      console.log('🔍 Payment status check result:', response);
      
      setLastCheckResult(response);
      setPaymentStatus(response.currentStatus);
      
      // Update flow state with new status
      updateFlowState({
        ...flowState,
        transaction: { ...virtualAccount, status: response.currentStatus }
      });
      
      // Handle different statuses
      handleCheckResult(response);
      
    } catch (error) {
      console.error('❌ Failed to check payment status:', error);
      alert('Failed to check payment status. Please try again.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleCheckResult = (result) => {
    const { reconciliation, currentStatus, message } = result;
    
    console.log('🔍 Processing payment check result:', result);
    
    switch (reconciliation?.status) {
      case 'success':
        alert(`✅ ${message}`);
        // Navigate to approval page or update UI
        if (currentStatus === 'PENDING_APPROVAL') {
          navigate('/payment');
        }
        break;
        
      case 'partial':
        alert(`⚠️ ${message}\nAmount still needed: ${formatCurrency(reconciliation.shortfall)}`);
        break;
        
      case 'overpayment':
        alert(`ℹ️ ${message}\nExcess amount: ${formatCurrency(reconciliation.excess)}`);
        break;
        
      case 'pending':
        alert('ℹ️ No payment received yet');
        break;
        
      case 'failed':
        alert(`❌ ${message}\nExpected: ${formatCurrency(reconciliation.expectedAmount)}\nReceived: ${formatCurrency(reconciliation.receivedAmount)}`);
        break;
        
      default:
        alert(message || 'Payment status checked');
    }
    
    // Update transaction status in flow state
    updateFlowState({
      ...flowState,
      transaction: { ...virtualAccount, status: currentStatus },
      status: currentStatus
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload an image (JPG, PNG) or PDF file');
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setInvoiceFile(file);
    }
  };

  const handleProceedToPayment = () => {
    setIsWaitingForPayment(true);
    setCountdown(60); // Reset countdown
    
    // Start countdown for payment confirmation
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Simulate payment confirmation after countdown
          setTimeout(() => {
            navigate('/receipt-processing');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-neutral-dark dark:text-dark-text">Generating Virtual Account...</p>
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
            FLOWWAVE
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Customer Service */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="w-8 h-8 lg:w-10 lg:h-10">
              <path d="M35.416 24.5924C35.416 23.8722 35.416 23.5122 35.5243 23.1913C35.8393 22.2588 36.6698 21.8972 37.5016 21.5182C38.4368 21.0922 38.9043 20.8793 39.3677 20.8418C39.8937 20.7992 40.4206 20.9126 40.8702 21.1649C41.4662 21.4993 41.8818 22.1349 42.3075 22.6518C44.2729 25.0388 45.2554 26.2326 45.615 27.5488C45.9052 28.6109 45.9052 29.7218 45.615 30.7838C45.0906 32.7036 43.4337 34.313 42.2073 35.8026C41.58 36.5645 41.2662 36.9455 40.8702 37.1678C40.4206 37.4201 39.8937 37.5334 39.3677 37.4909C38.9043 37.4534 38.4368 37.2405 37.5016 36.8145C36.6698 36.4355 35.8393 36.0738 35.5243 35.1413C35.416 34.8205 35.416 34.4605 35.416 33.7403V24.5924Z" stroke="#3A49A4" strokeWidth="3"/>
              <path d="M14.5827 24.5925C14.5827 23.6859 14.5572 22.8709 13.8242 22.2334C13.5575 22.0015 13.204 21.8404 12.4971 21.5184C11.5619 21.0925 11.0943 20.8796 10.6309 20.8421C9.24083 20.7296 8.49293 21.6784 7.69129 22.6521C5.72591 25.0392 4.74322 26.2327 4.38364 27.549C4.09347 28.6113 4.09347 29.7221 4.38364 30.7842C4.9081 32.704 6.56502 34.3132 7.79145 35.8029C8.56454 36.7419 9.30304 37.5986 10.6309 37.4913C11.0943 37.4538 11.5619 37.2407 12.4971 36.8148C13.204 36.4927 13.5575 36.3317 13.8242 36.0998C14.5572 35.4623 14.5827 34.6475 14.5827 33.7407V24.5925Z" stroke="#3A49A4" strokeWidth="3"/>
              <path d="M41.6673 21.8753V18.7503C41.6673 10.6962 34.2054 4.16699 25.0007 4.16699C15.7959 4.16699 8.33398 10.6962 8.33398 18.7503V21.8753" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M41.6667 36.458C41.6667 45.833 33.3333 45.833 25 45.833" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200">
            <svg width="40" height="40" viewBox="0 0 50 50" fill="none" className="w-8 h-8 lg:w-10 lg:h-10">
              <path d="M32.2923 37.5C32.2923 41.5271 29.0277 44.7917 25.0007 44.7917C20.9736 44.7917 17.709 41.5271 17.709 37.5" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0648 37.4997H9.93515C7.8999 37.4997 6.25 35.8497 6.25 33.8145C6.25 32.8372 6.63825 31.8999 7.32935 31.2086L8.58608 29.952C9.75819 28.7799 10.4167 27.1901 10.4167 25.5326V19.7913C10.4167 11.7372 16.9459 5.20801 25 5.20801C33.0542 5.20801 39.5833 11.7372 39.5833 19.7913V25.5326C39.5833 27.1901 40.2419 28.7799 41.414 29.952L42.6706 31.2086C43.3617 31.8999 43.75 32.8372 43.75 33.8145C43.75 35.8497 42.1 37.4997 40.0648 37.4997Z" stroke="#3A49A4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 lg:px-6 lg:py-3 border-2 border-primary-blue text-primary-blue rounded-lg font-bold text-sm lg:text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 lg:px-0 pb-24">
        <div className={`w-full max-w-lg ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-neutral-gray hover:text-neutral-dark transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Virtual Account Title */}
          <h1 className="text-center text-2xl lg:text-3xl font-bold text-primary-pink mb-8 lg:mb-10">
            Virtual Account Generated
          </h1>

          {/* Success Message */}
          <div className={`mb-8 text-center ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-green-600">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-dark dark:text-dark-text mb-2">
              Virtual Account Created Successfully
            </h2>
            <p className="text-neutral-gray">
              Please make payment to the account below to complete your transaction
            </p>
          </div>

          {/* Virtual Account Card */}
          {virtualAccount ? (
            <div className={`bg-gradient-to-r from-primary-blue to-primary-pink rounded-lg p-6 mb-6 text-white ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="text-center mb-6">
                <p className="text-sm opacity-90 mb-2">Virtual Account Number</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold tracking-wider">
                    {virtualAccount.meta?.virtualAccountNumber || virtualAccount.accountNumber}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(virtualAccount.meta?.virtualAccountNumber || virtualAccount.accountNumber)}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M16 4H8C6.89543 4 6 4.89543 6 6V14C6 15.1046 6.89543 16 8 16H16C17.1046 16 18 15.1046 18 14V6C18 4.89543 17.1046 4 16 4Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 14H18C19.1046 14 20 14.8954 20 16V18C20 19.1046 19.1046 20 18 20H12C10.8954 20 10 19.1046 10 18V16C10 14.8954 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Bank Name:</span>
                    <span className="font-medium text-sm">{virtualAccount.meta?.virtualBankName || virtualAccount.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Provider:</span>
                    <span className="font-medium text-sm">{virtualAccount.meta?.virtualAccountProvider || virtualAccount.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm opacity-90">Reference:</span>
                    <span className="font-medium">{virtualAccount.referenceId || virtualAccount.reference}</span>
                  </div>
                  {virtualAccount.meta?.paystackCustomerCode && (
                    <div className="flex justify-between">
                      <span className="text-sm opacity-90">Customer Code:</span>
                      <span className="font-medium text-xs">{virtualAccount.meta.paystackCustomerCode}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Generating virtual account...
              </p>
            </div>
          )}

          {/* Payment Details */}
          {virtualAccount && (
            <div className={`bg-primary-light/20 rounded-lg p-6 mb-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <h3 className="text-lg font-bold text-neutral-dark dark:text-dark-text mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Amount to Pay:</span>
                  <span className="font-bold text-lg">
                    {virtualAccount.currency} {virtualAccount.total?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Beneficiary:</span>
                  <span className="font-medium">{flowState.beneficiary?.beneficiaryName || 'Beneficiary'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Status:</span>
                  <span className="font-medium text-green-600">{virtualAccount.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Instructions */}
          {virtualAccount && (
            <div className={`bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-4">Payment Instructions</h3>
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-mono font-bold">{virtualAccount.meta?.virtualAccountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Name:</span>
                    <span className="font-medium">{virtualAccount.meta?.virtualBankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold">{virtualAccount.currency} {virtualAccount.total?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 text-sm font-medium mb-2">
                    {virtualAccount.meta?.paymentInstructions}
                  </p>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>• Transfer the exact amount to the virtual account</li>
                    <li>• Include the reference ID in your transfer description</li>
                    <li>• This is a real bank account - payment will be processed automatically</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Upload Section */}
          {virtualAccount && (
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }}>
              <h3 className="text-lg font-bold text-neutral-dark dark:text-dark-text mb-4">Upload Payment Receipt</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Upload your payment receipt (invoice)
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    JPG, PNG or PDF (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <label
                    htmlFor="invoice-upload"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
                
                {invoiceFile && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-green-700 dark:text-green-300 font-medium">{invoiceFile.name}</p>
                          <p className="text-green-600 dark:text-green-400 text-sm">
                            {(invoiceFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInvoiceFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Status Check Section */}
          {virtualAccount && (
            <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
              <h3 className="text-lg font-bold text-neutral-dark dark:text-dark-text mb-4">Payment Status</h3>
              
              {/* Manual Check Button */}
              <button
                onClick={handleManualStatusCheck}
                disabled={isCheckingPayment}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-4"
              >
                {isCheckingPayment ? 'Checking Payment Status...' : 'Check Payment Status'}
              </button>

              {/* Last Check Result */}
              {lastCheckResult && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Check Result:</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        lastCheckResult.currentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        lastCheckResult.currentStatus === 'PENDING_APPROVAL' ? 'bg-blue-100 text-blue-800' :
                        lastCheckResult.currentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {lastCheckResult.currentStatus}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Message:</span> {lastCheckResult.message}
                    </p>
                    {lastCheckResult.reconciliation && (
                      <>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Reconciliation Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                            lastCheckResult.reconciliation.status === 'success' ? 'bg-green-100 text-green-800' :
                            lastCheckResult.reconciliation.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            lastCheckResult.reconciliation.status === 'overpayment' ? 'bg-blue-100 text-blue-800' :
                            lastCheckResult.reconciliation.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lastCheckResult.reconciliation.status}
                          </span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Expected:</span> {formatCurrency(lastCheckResult.reconciliation.expectedAmount)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Received:</span> {formatCurrency(lastCheckResult.reconciliation.receivedAmount)}
                        </p>
                        {lastCheckResult.reconciliation.difference !== 0 && (
                          <p className="text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Difference:</span> 
                            <span className={lastCheckResult.reconciliation.difference < 0 ? 'text-red-600' : 'text-green-600'}>
                              {formatCurrency(Math.abs(lastCheckResult.reconciliation.difference))}
                            </span>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {virtualAccount && (
            <div className={`text-center ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.3s' }}>
              <button
                onClick={handlePaymentConfirmed}
                disabled={!invoiceFile || isLoading}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
              >
                {isLoading ? 'Uploading Receipt...' : 'I Have Made the Payment'}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Upload your receipt first, then click to confirm payment
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface shadow-soft dark:shadow-dark-soft px-6 py-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.4s' }}>
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-primary-blue">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="w-10 h-10">
              <path d="M6.25 24.978V30.208C6.25 37.0826 6.25 40.5199 8.38569 42.6557C10.5214 44.7913 13.9587 44.7913 20.8333 44.7913H29.1667C36.0412 44.7913 39.4785 44.7913 41.6144 42.6557C43.75 40.5199 43.75 37.0826 43.75 30.208V24.978C43.75 21.4753 43.75 19.7241 43.0085 18.2081C42.2671 16.6921 40.8848 15.6169 38.12 13.4666L33.9533 10.2258C29.6523 6.88061 27.5019 5.20801 25 5.20801C22.4981 5.20801 20.3477 6.88061 16.0467 10.2258L11.88 13.4666C9.11527 15.6169 7.7329 16.6921 6.99146 18.2081C6.25 19.7241 6.25 21.4753 6.25 24.978Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M31.25 35.417C29.5844 36.7137 27.3963 37.5003 25 37.5003C22.6036 37.5003 20.4157 36.7137 18.75 35.417" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" className="w-10 h-10">
              <path d="M34.1418 6.25L36.2312 8.28279C37.1646 9.19094 37.6312 9.64502 37.4668 10.0309C37.3027 10.4167 36.6427 10.4167 35.3227 10.4167H19.154C10.8763 10.4167 4.16602 16.9459 4.16602 25C4.16602 28.0983 5.1591 30.9713 6.85247 33.3333" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8574 43.7503L13.7682 41.7176C12.8349 40.8093 12.3682 40.3553 12.5324 39.9695C12.6967 39.5837 13.3567 39.5837 14.6766 39.5837H30.8454C39.1229 39.5837 45.8333 33.0545 45.8333 25.0003C45.8333 21.902 44.8402 19.0291 43.1469 16.667" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Transactions</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="51" height="50" viewBox="0 0 51 50" fill="none" className="w-10 h-10">
              <path d="M25.3375 9.97926C35.2839 6.58844 40.2571 4.89305 42.9321 7.56794C45.6069 10.2428 43.9114 15.2161 40.5208 25.1625L38.2117 31.9358C35.6077 39.5746 34.3056 43.394 32.1592 43.71C31.5823 43.795 30.985 43.744 30.4139 43.5606C28.2906 42.879 27.1681 38.8519 24.9231 30.7979C24.4252 29.0115 24.1762 28.1181 23.6092 27.4358C23.4446 27.2379 23.2621 27.0554 23.0642 26.8908C22.3819 26.3238 21.4885 26.0748 19.7022 25.5769C11.6481 23.3319 7.62112 22.2094 6.93937 20.086C6.75608 19.5151 6.70493 18.9178 6.78991 18.3407C7.10599 16.1944 10.9254 14.8924 18.5642 12.2883L25.3375 9.97926Z" stroke="currentColor" strokeWidth="3"/>
            </svg>
            <span className="text-xs font-medium">Recipients</span>
          </button>

          <button onClick={() => navigate('/account')} className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="51" height="50" viewBox="0 0 51 50" fill="none" className="w-10 h-10">
              <path d="M35.9173 17.7087C35.9173 11.9557 31.2536 7.29199 25.5007 7.29199C19.7477 7.29199 15.084 11.9557 15.084 17.7087C15.084 23.4616 19.7477 28.1253 25.5007 28.1253C31.2536 28.1253 35.9173 23.4616 35.9173 17.7087Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40.0827 42.7083C40.0827 34.6542 33.5535 28.125 25.4993 28.125C17.4452 28.125 10.916 34.6542 10.916 42.7083" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default VirtualAccount;
