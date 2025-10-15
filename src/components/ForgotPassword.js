import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/enter-otp', { state: { email } });
      } else {
        setError(data.error || 'Failed to send OTP. Please try again.');
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
                <linearGradient id="flowwave-gradient-fp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C63FF" />
                  <stop offset="30%" stopColor="#9C5CFF" />
                  <stop offset="60%" stopColor="#FF5C8A" />
                  <stop offset="100%" stopColor="#FF8A5C" />
                </linearGradient>
              </defs>
              <path d="M8 28C8 28 12 20 20 20C28 20 32 28 40 28C48 28 52 20 52 20V37H0V20C0 20 4 28 8 28Z" fill="url(#flowwave-gradient-fp)" />
              <path d="M4 18C4 18 8 10 16 10C24 10 28 18 36 18C44 18 48 10 48 10V27H-4V10C-4 10 0 18 4 18Z" fill="url(#flowwave-gradient-fp)" opacity="0.7" />
              <path d="M0 8C0 8 4 0 12 0C20 0 24 8 32 8C40 8 44 0 44 0V17H-8V0C-8 0 -4 8 0 8Z" fill="url(#flowwave-gradient-fp)" opacity="0.4" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold">FLOWWAVE</div>
        </div>

        <div className="flex flex-col items-start gap-10 mt-20">
          <div className="flex flex-col items-center gap-4 w-full">
            <h1 className="text-primary-pink dark:text-primary-pink text-center text-3xl font-bold leading-10">
              Forgot Password
            </h1>
            <p className="text-neutral-gray dark:text-dark-textSecondary text-center text-base leading-5">
              Forgot your password? It happens. Please enter your email to receive password reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
            {error && (
              <div className="text-error text-sm p-3 bg-error/10 rounded-lg w-full animate-slide-in-down animate-once">
                {error}
              </div>
            )}

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-neutral-dark dark:text-dark-text text-base font-normal">
                Email
              </label>
              <div className={`flex min-w-60 px-4 py-3 items-center w-full rounded-lg border transition-all duration-150 ${error ? 'border-error' : 'border-neutral-300 dark:border-dark-border'} bg-white dark:bg-dark-card hover:border-primary-blue focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10`}>
                <input
                  type="email"
                  className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-placeholder dark:placeholder:text-dark-textSecondary text-xs"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full px-3 py-3 justify-center items-center gap-2 rounded-lg bg-primary-blue text-white text-lg font-bold hover:opacity-90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                'Get OTP'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
