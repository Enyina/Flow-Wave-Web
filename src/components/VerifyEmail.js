import React, { useState, useEffect } from 'react';

const VerifyEmail = ({ onNext }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(256); // 4:16 in seconds
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  // Demo OTP codes that cycle
  const demoCodes = ['1234', '5678', '9012', '3456'];
  const [currentDemoIndex, setCurrentDemoIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-fill demo code every 15 seconds
    const autoFillTimer = setInterval(() => {
      if (otp.every(digit => digit === '')) {
        setIsAutoFilling(true);
        const demoCode = demoCodes[currentDemoIndex];
        
        // Animate filling each digit
        demoCode.split('').forEach((digit, index) => {
          setTimeout(() => {
            setOtp(prev => {
              const newOtp = [...prev];
              newOtp[index] = digit;
              return newOtp;
            });
          }, index * 200);
        });
        
        setTimeout(() => {
          setIsAutoFilling(false);
          setCurrentDemoIndex((prev) => (prev + 1) % demoCodes.length);
        }, 1000);
      }
    }, 15000);

    return () => clearInterval(autoFillTimer);
  }, [otp, currentDemoIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('');
    
    const newOtp = ['', '', '', ''];
    digits.forEach((digit, index) => {
      if (index < 4) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus on the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    const inputToFocus = document.querySelector(`input[data-index="${focusIndex}"]`);
    if (inputToFocus) inputToFocus.focus();
  };

  const handleSubmit = async () => {
    if (otp.every(digit => digit !== '')) {
      setIsLoading(true);
      
      // Simulate verification
      setTimeout(() => {
        setIsLoading(false);
        onNext();
      }, 1500);
    }
  };

  const handleResend = () => {
    setCountdown(256);
    setCanResend(false);
    setOtp(['', '', '', '']);
    
    // Focus first input
    const firstInput = document.querySelector(`input[data-index="0"]`);
    if (firstInput) firstInput.focus();
    
    // Show confirmation
    alert('Verification code has been resent to your email!');
  };

  const handleAutoFill = () => {
    const demoCode = demoCodes[currentDemoIndex];
    setIsAutoFilling(true);
    
    // Clear first
    setOtp(['', '', '', '']);
    
    // Fill with animation
    demoCode.split('').forEach((digit, index) => {
      setTimeout(() => {
        setOtp(prev => {
          const newOtp = [...prev];
          newOtp[index] = digit;
          return newOtp;
        });
      }, index * 150);
    });
    
    setTimeout(() => {
      setIsAutoFilling(false);
      setCurrentDemoIndex((prev) => (prev + 1) % demoCodes.length);
    }, 800);
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
          <h2 className="large-title">Verify your email address</h2>
          <p className="form-subtitle">A verification code has been sent to enyina3848@gmail.com</p>
        </div>
        
        <div className="otp-container" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              data-index={index}
              type="text"
              className={`otp-box ${isAutoFilling ? 'auto-filling' : ''}`}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              disabled={isLoading || isAutoFilling}
              style={{
                border: 'none',
                background: digit ? 'var(--neutral-white)' : 'var(--primary-light)',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: '700',
                boxShadow: digit ? '0 0 0 2px var(--primary-blue)' : 'none',
                transform: isAutoFilling ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={handleAutoFill}
            style={{
              background: 'transparent',
              border: '1px dashed var(--primary-blue)',
              color: 'var(--primary-blue)',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--primary-blue)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary-blue)';
            }}
          >
            📱 Try Demo Code
          </button>
        </div>
        
        <div className="form-actions">
          <button 
            className={`primary-button ${isLoading ? 'button-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || isAutoFilling || !otp.every(digit => digit !== '')}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>
          
          <p className="form-subtitle">
            {countdown > 0 ? (
              `Didn't receive an email? Resend in ${formatTime(countdown)}`
            ) : (
              <span 
                className="link-text" 
                onClick={handleResend}
                style={{ 
                  color: 'var(--primary-blue)', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Resend Code
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
