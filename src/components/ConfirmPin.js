import React, { useState } from 'react';

const ConfirmPin = ({ onNext }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [showToast, setShowToast] = useState(false);

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Move to next input if value is entered
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[data-confirm-pin-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-confirm-pin-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    if (pin.every(digit => digit !== '')) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onNext();
      }, 2000);
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
      
      {showToast && (
        <div className="notification-toast">
          <svg className="success-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="#1FC16B"/>
            <path d="M9.54961 17.9996L3.84961 12.2996L5.27461 10.8746L9.54961 15.1496L18.7246 5.97461L20.1496 7.39961L9.54961 17.9996Z" fill="white"/>
          </svg>
          <span className="toast-text">Pin successfully created</span>
        </div>
      )}
      
      <div className="single-screen-content">
        <div className="form-title-section">
          <h2 className="large-title">Confirm Pin</h2>
          <p className="form-subtitle">Enter a secure 4-digit pin to always access the app</p>
        </div>
        
        <div className="otp-container">
          {pin.map((digit, index) => (
            <input
              key={index}
              data-confirm-pin-index={index}
              type="text"
              className="otp-box"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              style={{
                border: 'none',
                background: 'var(--primary-light)',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700'
              }}
            />
          ))}
        </div>
        
        <button className="primary-button" onClick={handleSubmit}>
          Confirm Pin
        </button>
      </div>
    </div>
  );
};

export default ConfirmPin;
