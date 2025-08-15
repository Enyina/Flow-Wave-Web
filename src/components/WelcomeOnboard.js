import React, { useState, useEffect } from 'react';

const WelcomeOnboard = ({ onNext }) => {
  const [showProfileSuccess, setShowProfileSuccess] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProfileSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="single-screen">
      <div className="logo-container">
        <div className="logo-icon">
          {/* Logo SVG would go here */}
        </div>
        <div className="logo-text">FLOWWAVE</div>
      </div>
      
      {showProfileSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <svg className="success-illustration" width="235" height="173" viewBox="0 0 235 173" fill="none">
              <path d="M234.872 165.394C234.872 169.473 182.325 172.78 117.499 172.78C52.6787 172.78 0.12793 169.473 0.12793 165.394C0.12793 161.316 52.6795 158.011 117.499 158.011C182.326 158.012 234.872 161.316 234.872 165.394Z" fill="#ACBFE2"/>
              <path d="M206.282 82.2555C206.282 127.682 169.455 164.506 124.029 164.506C78.5995 164.506 41.7754 127.682 41.7754 82.2555C41.7754 36.8262 78.5995 0 124.029 0C169.455 0 206.282 36.8262 206.282 82.2555Z" fill="#6C63FF"/>
              <path d="M131.367 112.827C133.755 116.716 131.346 122.545 125.976 125.842C120.614 129.136 114.322 128.653 111.935 124.762L84.4731 80.0355C82.0832 76.1436 84.4918 70.3205 89.864 67.0243C95.2262 63.728 101.518 64.2132 103.906 68.102L131.367 112.827Z" fill="#F6F5F7"/>
              <path d="M130.367 122.588C127.073 127.95 120.051 129.634 114.689 126.34C109.316 123.046 107.64 116.025 110.934 110.654L148.78 48.9747C152.074 43.6071 159.095 41.9259 164.465 45.2198C169.83 48.5137 171.514 55.5329 168.22 60.9005L130.367 122.588Z" fill="#F6F5F7"/>
            </svg>
            <p className="success-text">Your profile has been created</p>
            <button className="primary-button" onClick={() => setShowProfileSuccess(false)}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
      
      {!showProfileSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <svg className="success-illustration" width="235" height="173" viewBox="0 0 235 173" fill="none">
              <path d="M234.872 165.394C234.872 169.473 182.325 172.78 117.499 172.78C52.6787 172.78 0.12793 169.473 0.12793 165.394C0.12793 161.316 52.6795 158.011 117.499 158.011C182.326 158.012 234.872 161.316 234.872 165.394Z" fill="#ACBFE2"/>
              <path d="M206.282 82.2555C206.282 127.682 169.455 164.506 124.029 164.506C78.5995 164.506 41.7754 127.682 41.7754 82.2555C41.7754 36.8262 78.5995 0 124.029 0C169.455 0 206.282 36.8262 206.282 82.2555Z" fill="#6C63FF"/>
              <path d="M131.367 112.827C133.755 116.716 131.346 122.545 125.976 125.842C120.614 129.136 114.322 128.653 111.935 124.762L84.4731 80.0355C82.0832 76.1436 84.4918 70.3205 89.864 67.0243C95.2262 63.728 101.518 64.2132 103.906 68.102L131.367 112.827Z" fill="#F6F5F7"/>
              <path d="M130.367 122.588C127.073 127.95 120.051 129.634 114.689 126.34C109.316 123.046 107.64 116.025 110.934 110.654L148.78 48.9747C152.074 43.6071 159.095 41.9259 164.465 45.2198C169.83 48.5137 171.514 55.5329 168.22 60.9005L130.367 122.588Z" fill="#F6F5F7"/>
            </svg>
            <div style={{ textAlign: 'center' }}>
              <h3 className="welcome-title">Welcome Onboard!</h3>
              <p className="success-text">Let's help you send money to anywhere, at anytime.</p>
            </div>
            <button className="primary-button" onClick={onNext}>
              Let's Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeOnboard;
