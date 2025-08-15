import React, { useState, useEffect } from 'react';

const PersonalInfo = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: 'Enyina',
    middleName: 'Matthew',
    lastName: 'Johnson',
    dateOfBirth: '1990-05-15',
    country: 'NG',
    phoneNumber: '+234-803-123-4567',
    address: '123 Victoria Island, Lagos',
    postalCode: '101241',
    state: 'Lagos',
    city: 'Lagos',
    occupation: 'Software Engineer'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Demo profiles that cycle
  const demoProfiles = [
    {
      firstName: 'Enyina',
      middleName: 'Matthew',
      lastName: 'Johnson',
      dateOfBirth: '1990-05-15',
      country: 'NG',
      phoneNumber: '+234-803-123-4567',
      address: '123 Victoria Island, Lagos',
      postalCode: '101241',
      state: 'Lagos',
      city: 'Lagos',
      occupation: 'Software Engineer'
    },
    {
      firstName: 'Sarah',
      middleName: 'Grace',
      lastName: 'Wilson',
      dateOfBirth: '1988-09-22',
      country: 'US',
      phoneNumber: '+1-555-987-6543',
      address: '456 Silicon Valley Blvd',
      postalCode: '94105',
      state: 'California',
      city: 'San Francisco',
      occupation: 'Product Manager'
    },
    {
      firstName: 'Michael',
      middleName: 'David',
      lastName: 'Chen',
      dateOfBirth: '1985-12-03',
      country: 'CA',
      phoneNumber: '+1-647-555-0123',
      address: '789 Bay Street, Toronto',
      postalCode: 'M5H 2Y4',
      state: 'Ontario',
      city: 'Toronto',
      occupation: 'Financial Analyst'
    }
  ];

  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  useEffect(() => {
    // Cycle through profiles every 20 seconds if no fields have been touched
    const interval = setInterval(() => {
      if (Object.keys(touched).length === 0) {
        const nextIndex = (currentProfileIndex + 1) % demoProfiles.length;
        setCurrentProfileIndex(nextIndex);
        setFormData(demoProfiles[nextIndex]);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [currentProfileIndex, touched]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Clear error for this field if it becomes valid
    if (value.trim()) {
      const { [field]: fieldError, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'country', 'phoneNumber', 'address', 'postalCode', 'state', 'city', 'occupation'];
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format for phone
    if (formData.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Validate date of birth (must be at least 18 years old)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onNext();
    }, 2000);
  };

  const loadDemoProfile = (index) => {
    setFormData(demoProfiles[index]);
    setCurrentProfileIndex(index);
    setTouched({});
    setErrors({});
  };

  const countries = [
    { code: '', name: 'Select your country' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'US', name: 'United States' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'GH', name: 'Ghana' },
    { code: 'KE', name: 'Kenya' },
    { code: 'ZA', name: 'South Africa' }
  ];

  return (
    <div className="single-screen">
      <div className="logo-container">
        <div className="logo-icon">
          <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
            <rect width="52" height="37" fill="url(#pattern0)" />
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <rect width="52" height="37" fill="#6C63FF" />
              </pattern>
            </defs>
          </svg>
        </div>
        <div className="logo-text">FLOWWAVE</div>
      </div>
      
      <div className="single-screen-content" style={{ maxWidth: '515px' }}>
        <div className="form-title-section">
          <h2 className="large-title">Personal Information</h2>
          <p className="form-subtitle">Please provide the following information to set up your account</p>
        </div>

        {/* Demo Profile Switcher */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {demoProfiles.map((profile, index) => (
            <button
              key={index}
              onClick={() => loadDemoProfile(index)}
              style={{
                padding: '6px 12px',
                border: currentProfileIndex === index ? '2px solid var(--primary-blue)' : '1px solid var(--neutral-light-gray)',
                borderRadius: '16px',
                background: currentProfileIndex === index ? 'var(--primary-light)' : 'transparent',
                color: currentProfileIndex === index ? 'var(--primary-blue)' : 'var(--neutral-gray)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {profile.firstName} {profile.lastName}
            </button>
          ))}
        </div>
        
        <div className="form-fields" style={{ gap: '24px' }}>
          <div className="input-field">
            <label className="input-label">
              First Name <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.firstName ? 'input-error' : formData.firstName ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.firstName && (
              <div className="validation-message validation-error">{errors.firstName}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">Middle Name (Optional)</label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Middle Name"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Last Name <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.lastName ? 'input-error' : formData.lastName ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.lastName && (
              <div className="validation-message validation-error">{errors.lastName}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Date of Birth <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.dateOfBirth ? 'input-error' : formData.dateOfBirth ? 'input-success' : ''}`}>
              <input
                type="date"
                className="input"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.dateOfBirth && (
              <div className="validation-message validation-error">{errors.dateOfBirth}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Country <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.country ? 'input-error' : formData.country ? 'input-success' : ''}`}>
              <select
                className="input"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                style={{ appearance: 'none' }}
                disabled={isLoading}
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#333333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {errors.country && (
              <div className="validation-message validation-error">{errors.country}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Phone Number <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.phoneNumber ? 'input-error' : formData.phoneNumber ? 'input-success' : ''}`}>
              <input
                type="tel"
                className="input"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.phoneNumber && (
              <div className="validation-message validation-error">{errors.phoneNumber}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Address <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.address ? 'input-error' : formData.address ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.address && (
              <div className="validation-message validation-error">{errors.address}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Postal Code <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.postalCode ? 'input-error' : formData.postalCode ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.postalCode && (
              <div className="validation-message validation-error">{errors.postalCode}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              State <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.state ? 'input-error' : formData.state ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.state && (
              <div className="validation-message validation-error">{errors.state}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              City <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.city ? 'input-error' : formData.city ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.city && (
              <div className="validation-message validation-error">{errors.city}</div>
            )}
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Occupation <span className="input-required">*</span>
            </label>
            <div className={`input-container ${errors.occupation ? 'input-error' : formData.occupation ? 'input-success' : ''}`}>
              <input
                type="text"
                className="input"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
                disabled={isLoading}
              />
            </div>
            {errors.occupation && (
              <div className="validation-message validation-error">{errors.occupation}</div>
            )}
          </div>
        </div>
        
        <button 
          className={`primary-button ${isLoading ? 'button-loading' : ''}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Setting up your profile...
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
