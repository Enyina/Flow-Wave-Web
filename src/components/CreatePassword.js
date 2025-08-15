import React, { useState } from 'react';

const CreatePassword = ({ onNext }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    return hasMinLength && hasLetters && hasNumbers;
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!validatePassword(password)) {
      newErrors.password = 'Minimum 8 characters with letters and numbers';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword !== '';

  return (
    <div className="single-screen">
      <div className="logo-container">
        <div className="logo-icon">
          {/* Logo SVG would go here */}
        </div>
        <div className="logo-text">FLOWWAVE</div>
      </div>
      
      <div className="single-screen-content">
        <div className="form-title-section">
          <h2 className="large-title">Create Password</h2>
          <p className="form-subtitle">This password helps you secure your app</p>
        </div>
        
        <div className="form-fields">
          <div className="input-field">
            <label className="input-label">Password</label>
            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                {showPassword ? (
                  <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <>
                    <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </div>
            <span style={{
              color: errors.password ? 'var(--error-red)' : (isPasswordValid ? 'var(--success-green)' : '#606060'),
              fontSize: '12px',
              lineHeight: '18px'
            }}>
              {errors.password || 'Minimum 8 characters with letters and numbers'}
            </span>
          </div>
          
          <div className="input-field">
            <label className="input-label">Confirm Password</label>
            <div className="input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="input"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <svg
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                width="16" height="16" viewBox="0 0 16 16" fill="none"
              >
                {showConfirmPassword ? (
                  <path d="M11.9603 11.9603C10.8207 12.829 9.43306 13.3102 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033C1.49625 6.45492 2.64642 5.10473 4.04033 4.04033M6.60032 2.82699C7.05921 2.71958 7.52903 2.66588 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C14.929 8.7574 14.4464 9.47015 13.8937 10.127M9.41366 9.41366C9.23056 9.61016 9.00976 9.76776 8.76443 9.87707C8.51909 9.98639 8.25426 10.0452 7.98572 10.0499C7.71718 10.0546 7.45043 10.0052 7.2014 9.90465C6.95236 9.80406 6.72614 9.65434 6.53622 9.46443C6.34631 9.27451 6.19659 9.04829 6.096 8.79925C5.99541 8.55022 5.94601 8.28347 5.95075 8.01493C5.95549 7.74639 6.01426 7.48156 6.12358 7.23622C6.23289 6.99089 6.39049 6.77009 6.58699 6.58699M0.666992 0.666992L15.3337 15.3337" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <>
                    <path d="M0.666992 8.00033C0.666992 8.00033 3.33366 2.66699 8.00033 2.66699C12.667 2.66699 15.3337 8.00033 15.3337 8.00033C15.3337 8.00033 12.667 13.3337 8.00033 13.3337C3.33366 13.3337 0.666992 8.00033 0.666992 8.00033Z" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.00033 10.0003C9.10489 10.0003 10.0003 9.10489 10.0003 8.00033C10.0003 6.89576 9.10489 6.00033 8.00033 6.00033C6.89576 6.00033 6.00033 6.89576 6.00033 8.00033C6.00033 9.10489 6.89576 10.0003 8.00033 10.0003Z" stroke="#777777" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </div>
            {confirmPassword && (
              <span style={{
                color: errors.confirmPassword ? 'var(--error-red)' : (isConfirmPasswordValid ? 'var(--success-green)' : '#606060'),
                fontSize: '12px',
                lineHeight: '18px'
              }}>
                {errors.confirmPassword || (isConfirmPasswordValid ? 'Your password match' : '')}
              </span>
            )}
          </div>
        </div>
        
        <button className="primary-button" onClick={handleSubmit}>
          Create Password
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
