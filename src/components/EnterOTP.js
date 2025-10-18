import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import BackButton from './BackButton';
import DarkModeToggle from './DarkModeToggle';
import { apiFetch } from '../utils/api';

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
      const res = await apiFetch('/auth/verify-otp', { method: 'POST', body: { email, otp: otpString } });

      if (res.ok) {
        navigate('/reset-password', { state: { token: res.data.token, email } });
      } else {
        setError(res.data?.error || 'Invalid OTP. Please try again.');
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
      const res = await apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });

      if (res.ok) {
        setTimer(256);
        setCanResend(false);
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(res.data?.error || 'Failed to resend OTP');
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
        <div className={`absolute top-8 left-0 right-0 px-6 md:px-20 flex items-center justify-between ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
          <div className="flex items-center space-x-4">
            <BackButton />
            <Logo className="w-13 h-9" />
            <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold">FLOWWAVE</div>
          </div>
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 mt-28">
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-primary-pink dark:text-primary-pink text-center text-3xl font-bold leading-10">
              Enter OTP
            </h1>
            <p className="text-neutral-gray dark:text-dark-textSecondary text-center text-base leading-5">
              A 4-digit OTP has been sent to {email}
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-primary-blue text-sm hover:underline"
              >
                Change email
              </button>
            </div>
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
