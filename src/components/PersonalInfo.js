import React, { useState } from 'react';

const PersonalInfo = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    phoneNumber: '',
    address: '',
    postalCode: '',
    state: '',
    city: '',
    occupation: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'country', 'phoneNumber', 'address', 'postalCode', 'state', 'city', 'occupation'];
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    if (isValid) {
      onNext();
    }
  };

  return (
    <div className="single-screen">
      <div className="logo-container">
        <div className="logo-icon">
          {/* Logo SVG would go here */}
        </div>
        <div className="logo-text">FLOWWAVE</div>
      </div>
      
      <div className="single-screen-content" style={{ maxWidth: '515px' }}>
        <div className="form-title-section">
          <h2 className="large-title">Personal Information</h2>
          <p className="form-subtitle">Please provide the following information to set up your account</p>
        </div>
        
        <div className="form-fields" style={{ gap: '24px' }}>
          <div className="input-field">
            <label className="input-label">
              First Name <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </div>
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
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Last Name <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Date of Birth <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="date"
                className="input"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Country <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <select
                className="input"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                style={{ appearance: 'none' }}
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
              </select>
              <svg className="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#333333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Phone Number <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="tel"
                className="input"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Address <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Postal Code <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Postal Code"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              State <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              City <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />
            </div>
          </div>
          
          <div className="input-field">
            <label className="input-label">
              Occupation <span className="input-required">*</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                className="input"
                placeholder="Occupation"
                value={formData.occupation}
                onChange={(e) => handleInputChange('occupation', e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <button className="primary-button" onClick={handleSubmit}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;
