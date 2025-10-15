import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import DarkModeToggle from './DarkModeToggle';
import { apiFetch } from '../utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || '';
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      newErrors.newPassword = passwordError;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiFetch('/auth/reset-password', { method: 'POST', body: { token, password: newPassword } });

      if (res.ok) {
        navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
      } else {
        setErrors({ general: res.data?.error || 'Failed to reset password. Please try again.' });
      }
    } catch (err) {
      setErrors({ general: 'Network error. Please try again.' });
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
          <div className="flex justify-center items-center w-full">
            <h1 className="text-primary-pink dark:text-primary-pink text-center text-3xl font-bold leading-10">
              Reset Password
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-start gap-6 w-full">
            {errors.general && (
              <div className="text-error text-sm p-3 bg-error/10 rounded-lg w-full animate-slide-in-down animate-once">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-neutral-dark dark:text-dark-text text-base font-normal">
                New Password
              </label>
              <div className={`flex min-w-60 px-4 py-3 items-center w-full rounded-lg border transition-all duration-150 ${errors.newPassword ? 'border-error' : 'border-neutral-300 dark:border-dark-border'} bg-white dark:bg-dark-card hover:border-primary-blue focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10`}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-placeholder dark:placeholder:text-dark-textSecondary text-xs"
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <svg
                  className="w-4 h-4 cursor-pointer text-neutral-gray dark:text-dark-textSecondary hover:text-primary-blue transition-all duration-150"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  {showNewPassword ? (
                    <g clipPath="url(#clip0_eye_off)">
                      <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  ) : (
                    <>
                      <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                </svg>
              </div>
              {errors.newPassword && (
                <div className="text-error text-xs mt-1 animate-slide-in-down animate-once">{errors.newPassword}</div>
              )}
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="text-neutral-dark dark:text-dark-text text-base font-normal">
                Confirm Password
              </label>
              <div className={`flex min-w-60 px-4 py-3 items-center w-full rounded-lg border transition-all duration-150 ${errors.confirmPassword ? 'border-error' : 'border-neutral-300 dark:border-dark-border'} bg-white dark:bg-dark-card hover:border-primary-blue focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10`}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-placeholder dark:placeholder:text-dark-textSecondary text-xs"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <svg
                  className="w-4 h-4 cursor-pointer text-neutral-gray dark:text-dark-textSecondary hover:text-primary-blue transition-all duration-150"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  {showConfirmPassword ? (
                    <g clipPath="url(#clip1_eye_off)">
                      <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  ) : (
                    <>
                      <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </>
                  )}
                </svg>
              </div>
              {errors.confirmPassword && (
                <div className="text-error text-xs mt-1 animate-slide-in-down animate-once">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full px-3 py-3 justify-center items-center gap-2 rounded-lg bg-primary-blue text-white text-lg font-bold hover:opacity-90 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
