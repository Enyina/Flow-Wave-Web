import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const PersonalInfo = ({ onNext }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    phoneNumber: '',
    occupation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'country', 'phoneNumber', 'occupation'];
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (typeof onNext === 'function') {
        onNext();
      } else {
        // Navigate to welcome and show profile created success modal
        navigate('/welcome', { state: { profileCreated: true } });
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 xl:p-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      <div className={`flex items-center justify-between w-full max-w-lg mb-8 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        <div className="flex items-center">
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold transition-colors duration-300">FLOWWAVE</div>
        </div>
        <DarkModeToggle />
      </div>
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-lg ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="gradient-text text-center text-3xl font-bold">Personal Information</h2>
          <p className="text-neutral-gray dark:text-dark-textSecondary text-center transition-colors duration-300">Please provide the following information to set up your account</p>
        </div>
        
        <div className={`flex flex-col gap-6 w-full ${hasAnimated ? 'animate-stagger-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {[
            { key: 'firstName', label: 'First Name', required: true, type: 'text' },
            { key: 'lastName', label: 'Last Name', required: true, type: 'text' },
            { key: 'phoneNumber', label: 'Phone Number', required: true, type: 'tel' },
            { key: 'occupation', label: 'Occupation', required: true, type: 'text' }
          ].map(({ key, label, required, type }) => (
            <div key={key} className="flex flex-col gap-2 w-full">
              <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">
                {label} {required && <span className="text-error">*</span>}
              </label>
              <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors[key] ? 'border-error ring-4 ring-error/10' : 'border-neutral-gray/40 dark:border-dark-border'} focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10`}>
                <input
                  type={type}
                  className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text placeholder:text-neutral-gray/70 dark:placeholder:text-dark-textSecondary transition-colors duration-300"
                  placeholder={label}
                  value={formData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {errors[key] && (
                <div className="text-error text-xs mt-1">{errors[key]}</div>
              )}
            </div>
          ))}
          
          <div className="flex flex-col gap-2 w-full">
            <label className="text-neutral-dark dark:text-dark-text text-base font-normal transition-colors duration-300">
              Country <span className="text-error">*</span>
            </label>
            <div className={`flex min-w-60 px-4 py-3 items-center rounded-lg border-2 transition-all duration-150 bg-white dark:bg-dark-card ${errors.country ? 'border-error ring-4 ring-error/10' : 'border-neutral-gray/40 dark:border-dark-border'} focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10`}>
              <select
                className="flex-1 border-none outline-none bg-transparent text-neutral-dark dark:text-dark-text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select your country</option>
                <option value="NG">Nigeria</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="GH">Ghana</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
              </select>
            </div>
            {errors.country && (
              <div className="text-error text-xs mt-1">{errors.country}</div>
            )}
          </div>
        </div>
        
        <button 
          className={`flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${isLoading ? 'button-loading' : ''} ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Setting up profile...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
