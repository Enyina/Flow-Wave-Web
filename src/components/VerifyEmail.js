import React, { useState, useEffect } from 'react';
import DarkModeToggle from './DarkModeToggle';

const VerifyEmail = ({ onNext }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(256); // 4:16 in seconds
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Trigger animation only once
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input if value is entered
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('');
    
    const newOtp = ['', '', '', ''];
    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    const inputToFocus = document.querySelector(`input[data-index="${focusIndex}"]`);
    if (inputToFocus) inputToFocus.focus();
  };

  const handleSubmit = async () => {
    if (otp.every(digit => digit !== '')) {
      setIsLoading(true);
      
      // Simulate verification
      setTimeout(() => {
        setIsLoading(false);
        onNext();
      }, 1500);
    }
  };

  const handleResend = () => {
    setCountdown(256);
    setCanResend(false);
    setOtp(['', '', '', '']);
    
    // Focus first input
    const firstInput = document.querySelector(`input[data-index="0"]`);
    if (firstInput) firstInput.focus();
    
    // Show confirmation
    alert('Verification code has been resent to your email!');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 xl:p-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      {/* Logo */}
      <div className={`flex items-center justify-between w-full max-w-md mb-8 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        <div className="flex items-center">
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold hover:text-primary-blue transition-colors duration-300">FLOWWAVE</div>
        </div>
        <DarkModeToggle />
      </div>
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-md ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className={`flex flex-col items-center gap-4 w-full ${hasAnimated ? 'animate-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <h2 className="gradient-text text-center text-3xl font-bold">Verify your email address</h2>
          <p className="text-neutral-gray dark:text-dark-textSecondary text-center transition-colors duration-300">A verification code has been sent to your email</p>
        </div>
        
        <div className={`flex items-center gap-6 ${hasAnimated ? 'animate-bounce-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }} onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              data-index={index}
              type="text"
              className={`w-12 h-16 md:w-14 md:h-18 rounded-lg bg-primary-light dark:bg-dark-card flex items-center justify-center text-2xl font-bold text-neutral-dark dark:text-dark-text transition-all duration-200 border-2 border-transparent cursor-pointer hover:bg-white dark:hover:bg-dark-surface hover:-translate-y-1 focus:outline-none focus:border-primary-blue focus:bg-white dark:focus:bg-dark-surface focus:ring-4 focus:ring-primary-blue/10 focus:scale-105 ${digit ? 'bg-white dark:bg-dark-surface border-primary-blue shadow-lg' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              disabled={isLoading}
              style={{
                textAlign: 'center'
              }}
            />
          ))}
        </div>
        
        <div className={`flex flex-col gap-4 w-full ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          <button 
            className={`flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-blue/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${isLoading ? 'button-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || !otp.every(digit => digit !== '')}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
          
          <p className="text-neutral-gray dark:text-dark-textSecondary text-center text-sm transition-colors duration-300">
            {countdown > 0 ? (
              `Didn't receive an email? Resend in ${formatTime(countdown)}`
            ) : (
              <span 
                className="text-primary-blue cursor-pointer font-semibold hover:text-primary-pink transition-colors duration-200"
                onClick={handleResend}
              >
                Resend Code
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
