import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const MagicLinkVerifier = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyMagicLink, loading, message, clearMessage } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setIsVerifying(false);
        return;
      }

      try {
        await verifyMagicLink(token);
        setVerificationStatus('success');
        setIsVerifying(false);
        
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        setVerificationStatus('error');
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, verifyMagicLink, navigate]);

  const handleRequestNewLink = () => {
    navigate('/signup');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

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

          {/* Dark Mode Toggle */}
          <DarkModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 lg:px-0 pb-24">
        <div className={`w-full max-w-lg ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Verification Status */}
          <div className={`text-center mb-8 ${hasAnimated ? 'animate-bounce-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            {isVerifying ? (
              // Loading State
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
              </div>
            ) : verificationStatus === 'success' ? (
              // Success State
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : (
              // Error State
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-red-600">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          {/* Title and Message */}
          <div className={`text-center mb-8 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <h1 className="text-2xl lg:text-3xl font-bold text-primary-pink mb-4">
              {isVerifying ? 'Verifying Magic Link...' : 
               verificationStatus === 'success' ? 'Email Verified Successfully!' :
               'Invalid or Expired Link'}
            </h1>
            
            <p className="text-neutral-gray">
              {isVerifying ? 'Please wait while we verify your magic link' :
               verificationStatus === 'success' ? 'You are being redirected to your dashboard...' :
               'The magic link you clicked is invalid or has expired'}
            </p>
          </div>

          {/* Error State Actions */}
          {verificationStatus === 'error' && !isVerifying && (
            <div className={`space-y-4 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-medium text-red-800 mb-3">
                  What could have happened?
                </h3>
                <div className="space-y-2 text-sm text-red-700">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-800">!</span>
                    </div>
                    <p>The link has expired (magic links expire after 24 hours)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-800">!</span>
                    </div>
                    <p>The link was already used</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-800">!</span>
                    </div>
                    <p>The link is malformed or corrupted</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleRequestNewLink}
                className="w-full py-4 bg-primary-blue text-white text-lg font-bold rounded-lg hover:bg-primary-blue/90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                Request New Magic Link
              </button>

              <button
                onClick={handleGoToLogin}
                className="w-full py-4 border-2 border-primary-blue text-primary-blue text-lg font-bold rounded-lg hover:bg-primary-blue/10 transition-all duration-300"
              >
                Log In with Password
              </button>
            </div>
          )}

          {/* Success State Message */}
          {verificationStatus === 'success' && !isVerifying && (
            <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <div className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="font-medium text-green-800">Welcome to Flowwave!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your account has been verified and you're now signed in.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MagicLinkVerifier;
