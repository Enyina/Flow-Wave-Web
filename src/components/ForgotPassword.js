import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { apiFetch } from '../utils/api';

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
        <div className={`absolute top-8 left-0 right-0 px-6 md:px-20 flex items-center justify-between ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
          <div className="flex items-center space-x-4">
            <Logo className="w-13 h-9" />
            <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold">FLOWWAVE</div>
          </div>
          <div className="flex items-center">
            <DarkModeToggle />
          </div>
        </div>

        <div className="flex flex-col items-start gap-10 mt-28">
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
