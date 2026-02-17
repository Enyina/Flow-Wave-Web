import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlow } from '../contexts/FlowContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTransactionStore } from '../stores/transactionStore';
import { initiateTransaction } from '../api/transactionApi';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const PaymentError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();
  const { flowState, updateFlowState } = useFlow();
  const { sendAmount, fromCurrency } = useCurrency();
  const { calculateTransferFee, calculateTotalAmount } = useTransactionStore();
  const [errorType, setErrorType] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
    const error = searchParams.get('error') || 'payment_failed';
    setErrorType(error);
  }, [searchParams]);

  const getErrorContent = () => {
    switch (errorType) {
      case 'payment_initiation_failed':
        return {
          title: 'Payment Initiation Failed',
          message: 'We couldn\'t initialize your payment. This could be due to a network issue or temporary server problem.',
          submessage: 'Please try again in a few moments.',
          icon: (
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case 'payment_failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed.',
          submessage: 'Please check your payment details and try again.',
          icon: (
            <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return {
          title: 'Payment Error',
          message: 'An unexpected error occurred during payment processing.',
          submessage: 'Please try again or contact support if the problem persists.',
          icon: (
            <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      // Calculate total amount including fee
      const userAmount = parseFloat(flowState.sendAmount || sendAmount || 0);
      const transferFee = calculateTransferFee(userAmount);
      const totalAmount = calculateTotalAmount(userAmount);

      // Prepare transaction data for initiation
      const transactionData = {
        amount: userAmount,
        fromCurrency: fromCurrency?.code || 'NGN',
        toCurrency: flowState.toCurrency?.code || 'NGN',
        userId: flowState.userId || flowState.selectedRecipient?.userId,
        recipientId: flowState.selectedRecipient?.id,
        description: flowState.purposeOfPayment || flowState.paymentDescription || 'Cross-border payment'
      };

      console.log('🔄 Retrying transaction initiation with data:', transactionData);

      // Initiate transaction
      const response = await initiateTransaction(transactionData);
      
      console.log('✅ Retry transaction initiated successfully:', response);
      
      // Extract actual data from response (backend wraps in data property)
      const responseData = response.data || response;
      
      console.log('✅ Retry response structure:', {
        hasPaymentUrl: !!responseData.paymentAuthorizationUrl,
        hasMetaPaymentUrl: !!responseData.meta?.paymentAuthorizationUrl,
        paymentUrl: responseData.paymentAuthorizationUrl,
        metaPaymentUrl: responseData.meta?.paymentAuthorizationUrl,
        fullResponse: JSON.stringify(responseData, null, 2)
      });
      
      // Check if response contains Paystack payment URL
      if (responseData.paymentAuthorizationUrl || responseData.meta?.paymentAuthorizationUrl) {
        const paymentUrl = responseData.paymentAuthorizationUrl || responseData.meta?.paymentAuthorizationUrl;
        
        console.log('🔗 Redirecting to Paystack URL:', paymentUrl);
        
        // Update flow state with transaction info
        updateFlowState({
          ...flowState,
          transactionId: responseData.id,
          paymentReference: responseData.referenceId,
          paymentAuthorizationUrl: paymentUrl,
          paymentAccessCode: responseData.paymentAccessCode || responseData.meta?.paymentAccessCode,
          paymentMethod: 'paystack',
          status: 'payment_initiated',
          totalAmount: responseData.total,
          transferFee: responseData.transferFee,
          exchangeRate: responseData.exchangeRate,
          initiatedAt: new Date().toISOString()
        });

        // Redirect to Paystack payment page
        setTimeout(() => {
          console.log('🚀 Executing redirect to Paystack...');
          window.location.href = paymentUrl;
        }, 100);
      } else {
        console.error('❌ No payment URL found in response');
        throw new Error('No payment authorization URL received');
      }
      
    } catch (error) {
      console.error('❌ Retry failed:', error);
      alert(`Retry failed: ${error.message}`);
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className={`text-center ${hasAnimated ? 'animate-fadeIn' : ''}`}>
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              {errorContent.icon}
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {errorContent.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {errorContent.message}
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            {errorContent.submessage}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isRetrying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Retrying...</span>
                </>
              ) : (
                'Try Again'
              )}
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Need help?</strong> Contact our support team at support@flowwave.com or call our helpline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentError;
