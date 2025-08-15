import React, { useState, useEffect } from 'react';

const VerifyEmail = ({ onNext }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(256); // 4:16 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input if value is entered
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    if (otp.every(digit => digit !== '')) {
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
      
      <div className="single-screen-content">
        <div className="form-title-section">
          <h2 className="large-title">Verify your email address</h2>
          <p className="form-subtitle">A verification code has been sent to aostglc@gmail.com</p>
        </div>
        
        <div className="otp-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              data-index={index}
              type="text"
              className="otp-box"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
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
        
        <div className="form-actions">
          <button className="primary-button" onClick={handleSubmit}>
            Verify Email
          </button>
          <p className="form-subtitle">
            {countdown > 0 
              ? `Didn't receive an email? Resend in ${formatTime(countdown)} secs`
              : <span className="link-text">Resend</span>
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
