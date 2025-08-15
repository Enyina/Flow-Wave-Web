import React, { useState, useEffect } from 'react';

const PersonalInfo = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: 'Enyina',
    lastName: 'Johnson',
    country: 'NG',
    phoneNumber: '+234-803-123-4567',
    occupation: 'Software Engineer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 xl:p-10 bg-gradient-to-br from-slate-50 to-slate-200">
      <div className={`flex items-center mb-8 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        <div className="w-13 h-9 mr-3">
          <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
            <rect width="52" height="37" fill="#6C63FF" />
          </svg>
        </div>
        <div className="text-black/80 font-times text-2xl font-bold">FLOWWAVE</div>
      </div>
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-lg ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="gradient-text text-center text-3xl font-bold">Personal Information</h2>
          <p className="text-neutral-gray text-center">Please provide the following information to set up your account</p>
        </div>
        
        <div className={`flex flex-col gap-6 w-full ${hasAnimated ? 'animate-stagger-fade-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {/* Simplified form with key fields */}
          {[
            { key: 'firstName', label: 'First Name', required: true },
            { key: 'lastName', label: 'Last Name', required: true },
            { key: 'phoneNumber', label: 'Phone Number', required: true },
            { key: 'occupation', label: 'Occupation', required: true }
          ].map(({ key, label, required }) => (
            <div key={key} className="flex flex-col gap-2 w-full">
              <label className="text-neutral-dark text-base font-normal">
                {label} {required && <span className="text-error">*</span>}
              </label>
              <div className="flex min-w-60 px-4 py-3 items-center rounded-lg border border-neutral-lightgray focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 transition-all duration-150">
                <input
                  type="text"
                  className="flex-1 border-none outline-none bg-transparent text-neutral-dark placeholder:text-neutral-placeholder"
                  placeholder={label}
                  value={formData[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          ))}
          
          <div className="flex flex-col gap-2 w-full">
            <label className="text-neutral-dark text-base font-normal">
              Country <span className="text-error">*</span>
            </label>
            <div className="flex min-w-60 px-4 py-3 items-center rounded-lg border border-neutral-lightgray focus-within:border-primary-blue focus-within:ring-4 focus-within:ring-primary-blue/10 transition-all duration-150">
              <select
                className="flex-1 border-none outline-none bg-transparent text-neutral-dark"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={isLoading}
              >
                <option value="NG">Nigeria</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>
            </div>
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
