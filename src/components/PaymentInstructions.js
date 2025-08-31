import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import DarkModeToggle from './DarkModeToggle';

const PaymentInstructions = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { fromCurrency, sendAmount } = useCurrency();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateFee = () => {
    const amount = parseFloat(sendAmount) || 0;
    const feePercentage = 0.02; // 2% fee
    return (amount * feePercentage).toFixed(2);
  };

  const calculateTotalPay = () => {
    const amount = parseFloat(sendAmount) || 0;
    const fee = parseFloat(calculateFee());
    return (amount + fee).toFixed(2);
  };

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
      'ZAR': 'R'
    };
    return `${symbols[currencyCode] || ''}${amount}`;
  };

  const handleSentMoney = () => {
    navigate('/transaction-successful');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  // Mock payment details
  const paymentDetails = {
    accountNumber: '12345678901',
    accountName: 'Flowwave',
    bankName: 'Mastercard',
    amountPayable: formatCurrency(calculateTotalPay(), fromCurrency.code),
    referenceId: 'FLOW-12345'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className={`flex justify-between items-center px-4 lg:px-20 py-4 lg:py-6 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-7 lg:w-13 lg:h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="flowwave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="30%" stopColor="#9C5CFF" />
                  <stop offset="60%" stopColor="#FF5C8A" />
                  <stop offset="100%" stopColor="#FF8A5C" />
                </linearGradient>
              </defs>
              <path d="M8 28C8 28 12 20 20 20C28 20 32 28 40 28C48 28 52 20 52 20V37H0V20C0 20 4 28 8 28Z" fill="url(#flowwave-gradient)" />
              <path d="M4 18C4 18 8 10 16 10C24 10 28 18 36 18C44 18 48 10 48 10V27H-4V10C-4 10 0 18 4 18Z" fill="url(#flowwave-gradient)" opacity="0.7" />
              <path d="M0 8C0 8 4 0 12 0C20 0 24 8 32 8C40 8 44 0 44 0V17H-8V0C-8 0 -4 8 0 8Z" fill="url(#flowwave-gradient)" opacity="0.4" />
            </svg>
          </div>
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
            onClick={() => navigate('/enter-pin')}
            className="flex items-center gap-2 mb-6 text-neutral-gray hover:text-neutral-dark transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Title and Description */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <h1 className="text-center text-2xl lg:text-3xl font-bold text-primary-pink">
              Payment Instructions
            </h1>
            <p className="text-center text-neutral-gray text-base">
              Please complete your payment by transferring funds to the temporary virtual account generated specifically for this transaction.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Payment Details */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-primary-blue text-base font-normal">Your Unique Payment Details</p>
              
              <div className="relative w-full p-7 rounded-lg bg-secondary-light">
                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(paymentDetails.accountNumber)}
                  className="absolute top-4 right-4 p-2 hover:bg-white rounded transition-colors flex items-center gap-1"
                >
                  {copyFeedback ? (
                    <span className="text-xs text-green-600 font-medium">{copyFeedback}</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary-blue">
                      <path d="M6 10C6 8.1144 6 7.1716 6.58579 6.58579C7.1716 6 8.1144 6 10 6H10.6667C12.5523 6 13.4951 6 14.0809 6.58579C14.6667 7.1716 14.6667 8.1144 14.6667 10V10.6667C14.6667 12.5523 14.6667 13.4951 14.0809 14.0809C13.4951 14.6667 12.5523 14.6667 10.6667 14.6667H10C8.1144 14.6667 7.1716 14.6667 6.58579 14.0809C6 13.4951 6 12.5523 6 10.6667V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11.3329 6.00065C11.3313 4.02926 11.3015 3.00812 10.7277 2.30894C10.6169 2.17391 10.4931 2.0501 10.3581 1.93929C9.62047 1.33398 8.52467 1.33398 6.33301 1.33398C4.14135 1.33398 3.04553 1.33398 2.30796 1.93929C2.17293 2.0501 2.04913 2.17391 1.93831 2.30894C1.33301 3.0465 1.33301 4.14233 1.33301 6.33398C1.33301 8.52565 1.33301 9.62145 1.93831 10.3591C2.04912 10.4941 2.17293 10.6179 2.30796 10.7287C3.00715 11.3025 4.02828 11.3323 5.99967 11.3339" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-dark dark:text-dark-text text-xs">Account Number</span>
                    <span className="text-neutral-dark dark:text-dark-text text-xs">{paymentDetails.accountNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-dark dark:text-dark-text text-xs">Account Name</span>
                    <span className="text-neutral-dark dark:text-dark-text text-xs">{paymentDetails.accountName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-dark dark:text-dark-text text-xs">Bank Name</span>
                    <span className="text-neutral-dark dark:text-dark-text text-xs">{paymentDetails.bankName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-dark dark:text-dark-text text-xs">Amount Payable</span>
                    <span className="text-neutral-dark dark:text-dark-text text-xs">{paymentDetails.amountPayable}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-dark dark:text-dark-text text-xs">Reference ID</span>
                    <span className="text-neutral-dark dark:text-dark-text text-xs">{paymentDetails.referenceId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="border-t border-b border-neutral-300 py-4">
              <div className="text-center mb-4">
                <h3 className="text-primary-blue text-base font-normal">How to Pay</h3>
              </div>
              <div className="space-y-3 text-xs text-neutral-dark">
                <p>• Log in to your local bank account (app or internet banking).</p>
                <p>• Initiate a transfer using the account number and bank details above.</p>
                <p>• Enter the exact payment amount in Naira.</p>
                <p>• Important: In the payment reference field, include {paymentDetails.referenceId} exactly as shown. This helps us match your deposit to your transaction.</p>
                <p>• Complete the transfer. You should see a confirmation message or receipt from your bank.</p>
              </div>
            </div>

            {/* Timer */}
            <p className="text-center text-xs text-neutral-dark">
              This account is for this transaction only and expires in {formatTime(timeLeft)}
            </p>

            {/* Action Button */}
            <button
              onClick={handleSentMoney}
              className="w-full py-3 bg-primary-blue text-white text-lg font-bold rounded-lg hover:bg-primary-blue/90 transition-all duration-300"
            >
              I've sent the money
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface shadow-soft dark:shadow-dark-soft px-6 py-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
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

          <button onClick={() => navigate('/recipients')} className="flex flex-col items-center gap-1 text-neutral-gray">
            <svg width="51" height="50" viewBox="0 0 51 50" fill="none" className="w-10 h-10">
              <path d="M25.3375 9.97926C35.2839 6.58844 40.2571 4.89305 42.9321 7.56794C45.6069 10.2428 43.9114 15.2161 40.5208 25.1625L38.2117 31.9358C35.6077 39.5746 34.3056 43.394 32.1592 43.71C31.5823 43.795 30.985 43.744 30.4139 43.5606C28.2906 42.879 27.1681 38.8519 24.9231 30.7979C24.4252 29.0115 24.1762 28.1181 23.6092 27.4358C23.4446 27.2379 23.2621 27.0554 23.0642 26.8908C22.3819 26.3238 21.4885 26.0748 19.7022 25.5769C11.6481 23.3319 7.62112 22.2094 6.93937 20.086C6.75608 19.5151 6.70493 18.9178 6.78991 18.3407C7.10599 16.1944 10.9254 14.8924 18.5642 12.2883L25.3375 9.97926Z" stroke="currentColor" strokeWidth="3"/>
            </svg>
            <span className="text-xs font-medium">Recipients</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-neutral-gray">
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

export default PaymentInstructions;
