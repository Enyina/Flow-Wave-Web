import React, { useState } from 'react';
import DarkModeToggle from './DarkModeToggle';

const CreatePin = ({ onNext }) => {
  const [pin, setPin] = useState(['', '', '', '']);
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
        const nextInput = document.querySelector(`input[data-pin-index="${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-pin-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    if (pin.every(digit => digit !== '')) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onNext();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-8 xl:p-10 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-dark-bg dark:to-dark-surface transition-colors duration-300">
      <div className={`flex items-center justify-between w-full max-w-md mb-8 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        <div className="flex items-center">
          <div className="w-13 h-9 mr-3">
            <svg width="52" height="37" viewBox="0 0 52 37" fill="none">
              <rect width="52" height="37" fill="#6C63FF" />
            </svg>
          </div>
          <div className="text-black/80 dark:text-dark-text font-times text-2xl font-bold transition-colors duration-300">FLOWWAVE</div>
        </div>
        <DarkModeToggle />
      </div>
      
      <div className={`flex flex-col items-center gap-10 w-full max-w-md ${hasAnimated ? 'animate-slide-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="gradient-text text-center text-3xl font-bold">Create Pin</h2>
          <p className="text-neutral-gray dark:text-dark-textSecondary text-center transition-colors duration-300">Enter a secure 4-digit pin to always access your app</p>
        </div>
        
        <div className={`flex items-center gap-6 ${hasAnimated ? 'animate-bounce-in animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
          {pin.map((digit, index) => (
            <input
              key={index}
              data-pin-index={index}
              type="text"
              className={`w-12 h-16 md:w-14 md:h-18 rounded-lg bg-white dark:bg-dark-card text-2xl font-bold text-neutral-dark dark:text-dark-text transition-all duration-200 border-2 border-neutral-gray/30 dark:border-dark-border cursor-pointer hover:bg-white dark:hover:bg-dark-surface hover:-translate-y-1 hover:border-primary-blue/50 focus:outline-none focus:border-primary-blue focus:bg-white dark:focus:bg-dark-surface focus:ring-4 focus:ring-primary-blue/10 focus:scale-105 text-center ${digit ? 'border-primary-blue shadow-lg' : ''}`}
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
              Creating...
            </>
          ) : (
            'Create'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePin;
