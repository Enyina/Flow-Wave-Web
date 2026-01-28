import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const MagicLinkSignup = () => {
  const navigate = useNavigate();
  const { signup, loading, message, clearMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [hasAnimated, setHasAnimated] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear errors when user starts typing
    if (value && validateEmail(value)) {
      setErrors({});
    }
    
    // Clear auth message when user starts typing
    if (message) {
      clearMessage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await signup(email);
      // Navigate to check email page after successful signup
      setTimeout(() => {
        navigate('/check-email');
      }, 2000);
    } catch (error) {
      // Error is already set in auth context
      console.error('Signup error:', error);
    }
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

          {/* Login Button */}
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 lg:px-6 lg:py-3 border-2 border-primary-blue text-primary-blue rounded-lg font-bold text-sm lg:text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 lg:px-0 pb-24">
        <div className={`w-full max-w-lg ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 mb-6 text-neutral-gray hover:text-neutral-dark transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Back to Login</span>
          </button>

          {/* Sign Up Title */}
          <h1 className="text-center text-2xl lg:text-3xl font-bold text-primary-pink mb-4 lg:mb-6">
            Sign Up with Magic Link
          </h1>

          <p className="text-center text-neutral-gray mb-8 lg:mb-10">
            Enter your email address and we'll send you a magic link to sign in instantly
          </p>

          {/* Success/Error Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.includes('Check your email') || message.includes('resent') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className={`space-y-6 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-dark-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                    errors.email ? 'border-error' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-neutral-gray">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              {errors.email && (
                <p className="text-error text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-primary-blue text-white text-lg font-bold rounded-lg transition-all duration-300 ${
                loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-primary-blue/90 hover:-translate-y-1 hover:shadow-lg'
              } ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Magic Link...</span>
                </div>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className={`text-center mt-8 ${hasAnimated ? 'animate-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <p className="text-sm text-neutral-gray">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-blue font-medium hover:underline"
              >
                Log In
              </button>
            </p>
          </div>

          {/* Features */}
          <div className={`mt-12 space-y-4 ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-3 text-sm text-neutral-gray">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>No password required</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-gray">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Secure and instant</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-gray">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-green-600">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>Link expires in 24 hours</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MagicLinkSignup;
