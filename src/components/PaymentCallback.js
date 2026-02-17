import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useFlow } from '../contexts/FlowContext';
import { checkPaymentStatus } from '../api/transactionApi';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();
  const { flowState, updateFlowState } = useFlow();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment parameters from URL
        const reference = searchParams.get('reference');
        const transaction = searchParams.get('transaction');
        const status = searchParams.get('status');

        console.log('Payment callback params:', { reference, transaction, status });

        if (!reference && !transaction) {
          throw new Error('No payment reference or transaction ID found');
        }

        // Use transaction ID from URL params or from flow state
        const transactionId = transaction || flowState.transactionId;
        
        if (!transactionId) {
          throw new Error('No transaction ID available for verification');
        }

        // Call backend to verify payment status
        const paymentStatus = await checkPaymentStatus(transactionId);
        
        console.log('Payment verification response:', paymentStatus);

        if (paymentStatus.status === 'COMPLETED' || paymentStatus.status === 'SUCCESS' || status === 'success') {
          // Payment successful
          setVerificationStatus('success');
          setMessage('Payment successful! Redirecting to your receipt...');
          
          // Update flow state with payment details
          updateFlowState({
            ...flowState,
            paymentReference: reference || paymentStatus.reference,
            paymentStatus: 'completed',
            status: 'payment_successful',
            paidAt: new Date().toISOString(),
            totalAmount: paymentStatus.total || flowState.totalAmount,
            transferFee: paymentStatus.transferFee || flowState.transferFee,
            exchangeRate: paymentStatus.exchangeRate || flowState.exchangeRate
          });

          // Redirect to receipt page after 2 seconds
          setTimeout(() => {
            navigate('/receipt-completed');
          }, 2000);
        } else if (paymentStatus.status === 'FAILED' || paymentStatus.status === 'CANCELLED' || status === 'failed') {
          // Payment failed
          setVerificationStatus('failed');
          setMessage('Payment was not completed. Please try again.');
          setIsVerifying(false);
        } else {
          // Payment still processing
          setVerificationStatus('processing');
          setMessage('Payment is still being processed. Please wait...');
          
          // Poll again after 5 seconds
          setTimeout(() => {
            verifyPayment();
          }, 5000);
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationStatus('error');
        setMessage('Payment verification failed. Please contact support.');
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, flowState, updateFlowState]);

  const handleRetryPayment = () => {
    navigate('/payment');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          {/* Status Icon */}
          <div className="mb-6">
            {verificationStatus === 'processing' && (
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            )}
            {verificationStatus === 'success' && (
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}
            {verificationStatus === 'failed' && (
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            )}
            {verificationStatus === 'error' && (
              <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {verificationStatus === 'processing' && 'Processing Payment'}
            {verificationStatus === 'success' && 'Payment Successful!'}
            {verificationStatus === 'failed' && 'Payment Failed'}
            {verificationStatus === 'error' && 'Verification Error'}
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          {verificationStatus === 'failed' && (
            <div className="space-y-4">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Verification Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
