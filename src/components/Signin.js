import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';

const Signin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setTouched({ ...touched, email: true });
    
    if (value && !validateEmail(value)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      const { email: emailError, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setTouched({ ...touched, password: true });
    
    if (value && !validatePassword(value)) {
      setErrors({ ...errors, password: 'Password must be at least 6 characters' });
    } else {
      const { password: passwordError, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password || !validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here. A reset link would be sent to your email.');
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`${provider} login would happen here`);
    }, 1000);
  };

  return (
    <div className="flex w-full min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/10 to-transparent animate-float" />
        
        <div className={`flex flex-col items-center px-16 xl:px-20 py-20 z-10 w-full ${hasAnimated ? 'animate-slide-in-left animate-once' : 'opacity-0'}`}>
          <div className="flex flex-col gap-10 w-full max-w-2xl">
            <div className={`flex items-center relative ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full max-w-lg h-96 xl:h-[536px] rounded-2xl border border-primary-light backdrop-blur-sm bg-white/10 hover:transform hover:-translate-y-2 hover:shadow-large transition-all duration-300">
                <div className="absolute left-8 top-20 xl:left-9 xl:top-28 w-4/5 h-80">
                  <h1 className="text-white text-3xl xl:text-5xl font-bold leading-tight text-center">
                    <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Cross Border Payment Made Easy
                    </span>
                  </h1>
                </div>
                <div className="absolute right-4 bottom-20 w-44 h-38 bg-secondary-light rounded-3xl animate-pulse-slow" />
              </div>
              <div className="w-36 h-38 bg-primary-pink rounded-3xl animate-bounce-slow" />
            </div>
            
            <div className={`flex items-center gap-2 w-full ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <span className="text-white text-lg xl:text-2xl font-bold">Get the app on:</span>
              <div className="flex items-center gap-2 flex-1">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on App Store" 
                  className="h-10 hover:transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer rounded-lg"
                  onClick={() => alert('Redirecting to App Store...')}
                />
                <img 
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                  alt="Get it on Google Play" 
                  className="h-10 hover:transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer rounded-lg"
                  onClick={() => alert('Redirecting to Google Play...')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 xl:p-10 bg-white dark:bg-dark-bg relative transition-colors duration-300">
        <div className={`absolute top-12 left-20 flex items-center ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold hover:text-primary-blue transition-colors duration-300">FLOWWAVE</div>
        </div>

        <div className={`absolute top-12 right-20 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
          <DarkModeToggle />
        </div>
        
        <div className={`flex flex-col justify-center items-center w-full max-w-lg p-8 xl:p-12 rounded-2xl bg-white dark:bg-dark-surface shadow-soft dark:shadow-dark-soft hover:shadow-large dark:hover:shadow-dark-large hover:-translate-y-1 transition-all duration-300 ${hasAnimated ? 'animate-scale-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className={`flex flex-col items-center gap-10 w-full ${hasAnimated ? 'animate-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col items-center gap-2 w-full">
                <h2 className="gradient-text text-center text-2xl font-bold">Login to your account</h2>
                <p className="text-neutral-gray dark:text-dark-textSecondary text-center opacity-80 transition-colors duration-300">Send money across borders with ease and confidence</p>
              </div>
              
              <form onSubmit={handleSubmit} className={`flex flex-col gap-6 w-full ${hasAnimated ? 'animate-stagger-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">Email</label>
                  <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors.email ? 'input-error' : email && validateEmail(email) ? 'input-success' : 'border-neutral-gray/40 dark:border-dark-border'} ${!errors.email && !email ? 'hover:border-primary-blue focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 focus-within:-translate-y-px' : ''}`}>
                    <input
                      type="email"
                      className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-gray/70 dark:placeholder:text-dark-textSecondary placeholder:transition-all placeholder:duration-150 focus:placeholder:opacity-50 focus:placeholder:translate-x-2 transition-colors duration-300"
                      placeholder="your@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => setTouched({ ...touched, email: true })}
                      required
                      disabled={isLoading}
                    />
                    {email && validateEmail(email) && (
                      <svg className="w-4 h-4 text-success animate-checkmark animate-once" viewBox="0 0 24 24" fill="none">
                        <path d="M9.54961 17.9996L3.84961 12.2996L5.27461 10.8746L9.54961 15.1496L18.7246 5.97461L20.1496 7.39961L9.54961 17.9996Z" fill="currentColor"/>
                      </svg>
                    )}
                  </div>
                  {errors.email && (
                    <div className="text-error text-xs mt-1 animate-slide-in-down animate-once">{errors.email}</div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">Password</label>
                  <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors.password ? 'input-error' : password && validatePassword(password) ? 'input-success' : 'border-neutral-gray/40 dark:border-dark-border'} ${!errors.password && !password ? 'hover:border-primary-blue focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 focus-within:-translate-y-px' : ''}`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-gray/70 dark:placeholder:text-dark-textSecondary placeholder:transition-all placeholder:duration-150 focus:placeholder:opacity-50 focus:placeholder:translate-x-2 transition-colors duration-300"
                      placeholder="Enter Password"
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => setTouched({ ...touched, password: true })}
                      required
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
                  {errors.password && (
                    <div className="text-error text-xs mt-1 animate-slide-in-down animate-once">{errors.password}</div>
                  )}
                </div>
                
                <span className="text-neutral-dark dark:text-dark-text text-xs underline cursor-pointer hover:text-primary-blue hover:-translate-y-px transition-all duration-150" onClick={handleForgotPassword}>Reset Password?</span>
              </form>
            </div>
            
            <div className={`flex flex-col gap-4 w-full ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
              <button 
                type="submit" 
                className={`flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-blue/30 transition-all duration-300 ${isLoading ? 'button-loading' : ''}`}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Login'
                )}
              </button>
              <span className="text-neutral-dark dark:text-dark-text text-xs text-center underline cursor-pointer hover:text-primary-blue hover:-translate-y-px transition-all duration-150" onClick={onCreateAccount}>
                Don't have an account? <strong>Create an account</strong>
              </span>
            </div>
            
            <div className="flex justify-center items-center gap-0.5 w-full relative my-2">
              <div className="flex-1 h-px bg-neutral-lightgray dark:bg-dark-border transition-colors duration-150 hover:bg-primary-blue"></div>
              <span className="text-neutral-dark dark:text-dark-text text-base px-4 bg-white dark:bg-dark-surface transition-colors duration-300">or</span>
              <div className="flex-1 h-px bg-neutral-lightgray dark:bg-dark-border transition-colors duration-150 hover:bg-primary-blue"></div>
            </div>
            
            <div className="flex flex-col gap-4 w-full">
              <button 
                className="flex px-3 py-3 justify-center items-center gap-2 rounded-lg border border-neutral-lightgray dark:border-dark-border bg-white dark:bg-dark-card cursor-pointer w-full text-neutral-dark dark:text-dark-text text-lg font-bold hover:bg-gray-50 dark:hover:bg-dark-surface hover:border-primary-blue hover:-translate-y-px hover:shadow-lg transition-all duration-300"
                type="button"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none">
                  <g clipPath="url(#clip0_1398_302)">
                    <path d="M19.8156 10.2222C19.8156 9.39995 19.7499 8.79995 19.6076 8.17773H10.3555V11.8888H15.7862C15.6768 12.8111 15.0855 14.1999 13.7716 15.1332L13.7532 15.2575L16.6785 17.5572L16.8812 17.5777C18.7425 15.8333 19.8156 13.2666 19.8156 10.2222Z" fill="#4285F4"/>
                    <path d="M10.354 19.9997C13.0146 19.9997 15.2482 19.1108 16.8797 17.5775L13.7701 15.133C12.938 15.7219 11.8211 16.133 10.354 16.133C7.74809 16.133 5.53636 14.3886 4.74794 11.9775L4.63237 11.9875L1.59056 14.3764L1.55078 14.4886C3.17125 17.7552 6.49982 19.9997 10.354 19.9997Z" fill="#34A853"/>
                    <path d="M4.74826 11.9773C4.54023 11.3551 4.41983 10.6883 4.41983 9.99948C4.41983 9.31055 4.54023 8.64391 4.73731 8.0217L4.7318 7.88918L1.65187 5.46191L1.5511 5.51055C0.883227 6.86613 0.5 8.38838 0.5 9.99948C0.5 11.6106 0.883227 13.1328 1.5511 14.4883L4.74826 11.9773Z" fill="#FBBC05"/>
                    <path d="M10.354 3.86664C12.2044 3.86664 13.4526 4.67775 14.1643 5.35557L16.9454 2.6C15.2374 0.988893 13.0146 0 10.354 0C6.49982 0 3.17125 2.24443 1.55078 5.51107L4.73699 8.02221C5.53636 5.6111 7.74809 3.86664 10.354 3.86664Z" fill="#EB4335"/>
                  </g>
                </svg>
                Continue with Google
              </button>
              
              <button 
                className="flex px-3 py-3 justify-center items-center gap-2 rounded-lg border border-neutral-lightgray dark:border-dark-border bg-white dark:bg-dark-card cursor-pointer w-full text-neutral-dark dark:text-dark-text text-lg font-bold hover:bg-gray-50 dark:hover:bg-dark-surface hover:border-primary-blue hover:-translate-y-px hover:shadow-lg transition-all duration-300"
                type="button"
                onClick={() => handleSocialLogin('Apple')}
                disabled={isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10.828 1.63807C12.1176 0.00794709 13.9103 0 13.9103 0C13.9103 0 14.177 1.53259 12.8959 3.00897C11.528 4.58541 9.97326 4.32745 9.97326 4.32745C9.97326 4.32745 9.68131 3.08763 10.828 1.63807ZM10.1373 5.40103C10.8007 5.40103 12.0319 4.52641 13.6345 4.52641C16.3932 4.52641 17.4784 6.40908 17.4784 6.40908C17.4784 6.40908 15.3559 7.4499 15.3559 9.97542C15.3559 12.8244 18 13.8063 18 13.8063C18 13.8063 16.1517 18.7959 13.6551 18.7959C12.5084 18.7959 11.6169 18.0548 10.4087 18.0548C9.1775 18.0548 7.95568 18.8235 7.1599 18.8235C4.88013 18.8236 2 14.0904 2 10.2858C2 6.54251 4.43784 4.57885 6.72444 4.57885C8.21094 4.57885 9.36447 5.40103 10.1373 5.40103Z" fill="#1A1C29"/>
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
