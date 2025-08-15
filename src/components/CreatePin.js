import React, { useState } from 'react';

const CreatePin = ({ onNext }) => {
  const [pin, setPin] = useState(['', '', '', '']);

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Move to next input if value is entered
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[data-pin-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-pin-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    if (pin.every(digit => digit !== '')) {
      onNext();
    }
  };

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
      
      <div className="single-screen-content">
        <div className="form-title-section">
          <h2 className="large-title">Create Pin</h2>
          <p className="form-subtitle">Enter a secure 4-digit pin to always access your app</p>
        </div>
        
        <div className="otp-container">
          {pin.map((digit, index) => (
            <input
              key={index}
              data-pin-index={index}
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
          Create
        </button>
      </div>
    </div>
  );
};

export default CreatePin;
