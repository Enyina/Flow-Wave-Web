import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../contexts/AuthContext';

const CreatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { createPassword } = useAuth();
  React.useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    return hasMinLength && hasLetters && hasNumbers;
  };

 const handleSubmit = async () => {
  const newErrors = {};
console.log(password, confirmPassword);

  if (!validatePassword(password)) {
    newErrors.password = 'Minimum 8 characters with letters and numbers';
  }

  if (password !== confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) return;

  setIsLoading(true);
console.log(password, confirmPassword);

  try {
    // Get token stored after email verification
    const token = localStorage.getItem('flowAuthToken');
    if (!token) {
      setErrors({ general: 'Verification token not found. Please verify your email again.' });
      setIsLoading(false);
      return;
    }

    const result = await createPassword({ token, password }); // call your API

    if (result.success) {
      navigate('/create-pin'); // move to next step
    } else {
      setErrors({ general: result.error || 'Failed to create password. Please try again.' });
    }
  } catch (err) {
    setErrors({ general: 'Something went wrong. Please try again.' });
  } finally {
    setIsLoading(false);
  }
};


  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword !== '';

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 xl:p-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      <div className={`flex items-center justify-between w-full max-w-md mb-8 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        <div className="flex items-center">
          <div className="w-13 h-9 mr-3">
            {/* <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg> */}
                <img 
        src={"/assets/logo.svg"} 
        alt="Flow Wave Logo" 
        className="w-full h-full object-contain" 
      />
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold hover:text-primary-blue transition-colors duration-300">FLOWWAVE</div>
        </div>
        <DarkModeToggle />
      </div>
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-md ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className={`flex flex-col items-center gap-4 w-full ${hasAnimated ? 'animate-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <h2 className="gradient-text text-center text-3xl font-bold">Create Password</h2>
          <p className="text-neutral-gray dark:text-dark-textSecondary text-center transition-colors duration-300">This password helps you secure your app</p>
        </div>
        
        <div className={`flex flex-col gap-6 w-full ${hasAnimated ? 'animate-stagger-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-col gap-2 w-full">
            {errors.general && (
  <p className="text-red-500 text-sm mb-2">{errors.general}</p>
)}
{errors.otp && (
  <p className="text-red-500 text-sm mb-2">{errors.otp}</p>
)}

            <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">Password</label>
            <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors.password ? 'input-error' : isPasswordValid && password ? 'input-success' : 'border-neutral-gray/40 dark:border-dark-border'} focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 focus-within:-translate-y-px`}>
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-gray/70 dark:placeholder:text-dark-textSecondary placeholder:transition-all placeholder:duration-150 focus:placeholder:opacity-50 focus:placeholder:translate-x-2 transition-colors duration-300"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <svg
                className="w-4 h-4 cursor-pointer text-neutral-gray dark:text-dark-textSecondary hover:text-primary-blue hover:scale-110 transition-all duration-150"
                onClick={() => setShowPassword(!showPassword)}
                viewBox="0 0 16 16" fill="none"
              >
                {showPassword ? (
                  <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <>
                    <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </div>
            <span className={`text-xs mt-1 transition-colors duration-200 ${errors.password ? 'text-error' : (isPasswordValid && password ? 'text-success' : 'text-neutral-600 dark:text-dark-textSecondary')}`}>
              {errors.password || 'Minimum 8 characters with letters and numbers'}
            </span>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">Confirm Password</label>
            <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors.confirmPassword ? 'input-error' : isConfirmPasswordValid ? 'input-success' : 'border-neutral-gray/40 dark:border-dark-border'} focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 focus-within:-translate-y-px`}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-gray/70 dark:placeholder:text-dark-textSecondary placeholder:transition-all placeholder:duration-150 focus:placeholder:opacity-50 focus:placeholder:translate-x-2 transition-colors duration-300"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
              <svg
                className="w-4 h-4 cursor-pointer text-neutral-gray dark:text-dark-textSecondary hover:text-primary-blue hover:scale-110 transition-all duration-150"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                viewBox="0 0 16 16" fill="none"
              >
                {showConfirmPassword ? (
                  <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <>
                    <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </div>
            {confirmPassword && (
              <span className={`text-xs mt-1 transition-colors duration-200 ${errors.confirmPassword ? 'text-error' : (isConfirmPasswordValid ? 'text-success' : 'text-neutral-600 dark:text-dark-textSecondary')}`}>
                {errors.confirmPassword || (isConfirmPasswordValid ? 'Your password match' : '')}
              </span>
            )}
          </div>
        </div>
        
        <button 
          className={`flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-blue/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${isLoading ? 'button-loading' : ''} ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`}
          style={{ animationDelay: '0.8s' }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Creating Password...
            </>
          ) : (
            'Create Password'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
