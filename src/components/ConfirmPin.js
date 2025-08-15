import React, { useState } from 'react';

const ConfirmPin = ({ onNext }) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[data-confirm-pin-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-confirm-pin-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    if (pin.every(digit => digit !== '')) {
      setIsLoading(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsLoading(false);
        onNext();
      }, 2000);
    }
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
      
      {showToast && (
        <div className="fixed top-12 right-5 flex p-2 px-5 items-center gap-2 rounded-2xl bg-white shadow-toast z-50 animate-toast-slide-in animate-once">
          <svg className="w-6 h-6 text-success animate-checkmark animate-once" viewBox="0 0 24 24" fill="none">
            <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z" fill="currentColor"/>
            <path d="M9.54961 17.9996L3.84961 12.2996L5.27461 10.8746L9.54961 15.1496L18.7246 5.97461L20.1496 7.39961L9.54961 17.9996Z" fill="white"/>
          </svg>
          <span className="text-neutral-dark text-xl font-bold">Pin successfully created</span>
        </div>
      )}
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-md ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="gradient-text text-center text-3xl font-bold">Confirm Pin</h2>
          <p className="text-neutral-gray text-center">Enter a secure 4-digit pin to always access the app</p>
        </div>
        
        <div className={`flex items-center gap-6 ${hasAnimated ? 'animate-bounce-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {pin.map((digit, index) => (
            <input
              key={index}
              data-confirm-pin-index={index}
              type="text"
              className="w-12 h-16 md:w-14 md:h-18 rounded-lg bg-primary-light text-2xl font-bold text-neutral-dark transition-all duration-200 border-2 border-transparent cursor-pointer hover:bg-white hover:-translate-y-1 focus:outline-none focus:border-primary-blue focus:bg-white focus:ring-4 focus:ring-primary-blue/10 focus:scale-105 text-center"
              style={{ 
                background: digit ? 'white' : '#EBEDF6',
                borderColor: digit ? '#3A49A4' : 'transparent',
                boxShadow: digit ? '0 4px 12px rgba(58, 73, 164, 0.15)' : 'none'
              }}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength="1"
              disabled={isLoading}
            />
          ))}
        </div>
        
        <button 
          className={`flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 disabled:opacity-60 ${isLoading ? 'button-loading' : ''} ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`}
          style={{ animationDelay: '0.6s' }}
          onClick={handleSubmit}
          disabled={isLoading || !pin.every(digit => digit !== '')}
        >
          {isLoading ? (
            <>
              <div className="loading-spinner"></div>
              Confirming...
            </>
          ) : (
            'Confirm Pin'
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmPin;
