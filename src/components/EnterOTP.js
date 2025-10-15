import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';

const EnterOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(256);
  const [canResend, setCanResend] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    const animTimer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(animTimer);
  }, []);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 4) newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpString })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/reset-password', { state: { token: data.token, email } });
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setTimer(256);
        setCanResend(false);
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError('Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 p-4">
      <div className={`w-full max-w-md ${hasAnimated ? 'animate-scale-in animate-once' : 'opacity-0'}`}>
        <div className="absolute top-12 left-8 md:left-20 flex items-center">
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <defs>
                <linearGradient id="flowwave-gradient-otp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="30%" stopColor="#9C5CFF" />
                  <stop offset="60%" stopColor="#FF5C8A" />
                  <stop offset="100%" stopColor="#FF8A5C" />
                </linearGradient>
              </defs>
              <path d="M8 28C8 28 12 20 20 20C28 20 32 28 40 28C48 28 52 20 52 20V37H0V20C0 20 4 28 8 28Z" fill="url(#flowwave-gradient-otp)" />
              <path d="M4 18C4 18 8 10 16 10C24 10 28 18 36 18C44 18 48 10 48 10V27H-4V10C-4 10 0 18 4 18Z" fill="url(#flowwave-gradient-otp)" opacity="0.7" />
              <path d="M0 8C0 8 4 0 12 0C20 0 24 8 32 8C40 8 44 0 44 0V17H-8V0C-8 0 -4 8 0 8Z" fill="url(#flowwave-gradient-otp)" opacity="0.4" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold">FLOWWAVE</div>
        </div>

        <div className="flex flex-col items-center gap-10 mt-20">
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-primary-pink dark:text-primary-pink text-center text-3xl font-bold leading-10">
              Enter OTP
            </h1>
            <p className="text-neutral-gray dark:text-dark-textSecondary text-center text-base leading-5">
              A 4-digit OTP has been sent to {email}
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col items-center gap-10 w-full">
            {error && (
              <div className="text-error text-sm p-3 bg-error/10 rounded-lg w-full text-center animate-slide-in-down animate-once">
                {error}
              </div>
            )}

            <div className="flex items-center gap-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-16 md:w-14 md:h-18 text-center text-2xl font-bold rounded-lg border-2 border-transparent bg-primary-light dark:bg-dark-card text-neutral-dark dark:text-dark-text focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 outline-none transition-all duration-150"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="flex w-full px-3 py-3 justify-center items-center gap-2 rounded-lg bg-primary-blue text-white text-lg font-bold hover:opacity-90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>

            <div className="w-full text-center">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary-blue text-base font-normal hover:underline transition-all duration-150"
                  disabled={isLoading}
                >
                  Resend
                </button>
              ) : (
                <p className="text-neutral-dark dark:text-dark-text text-base">
                  Didn't receive an OTP? Resend in {formatTime(timer)} secs
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterOTP;
