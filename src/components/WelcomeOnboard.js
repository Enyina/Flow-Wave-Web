import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const WelcomeOnboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileCreated = location.state && location.state.profileCreated;
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

      {profileCreated ? (
        <div className="fixed inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-fade-in animate-once">
          <div className="flex flex-col items-center gap-10 p-10 max-w-lg w-4/5 rounded-3xl bg-white dark:bg-dark-surface shadow-large dark:shadow-dark-large animate-modal-slide-up animate-once">
            <svg className="w-60 h-44 animate-float" viewBox="0 0 235 173" fill="none">
              <path d="M234.872 165.394C234.872 169.473 182.325 172.78 117.499 172.78C52.6787 172.78 0.12793 169.473 0.12793 165.394C0.12793 161.316 52.6795 158.011 117.499 158.011C182.326 158.012 234.872 161.316 234.872 165.394Z" fill="#ACBFE2"/>
              <path d="M206.282 82.2555C206.282 127.682 169.455 164.506 124.029 164.506C78.5995 164.506 41.7754 127.682 41.7754 82.2555C41.7754 36.8262 78.5995 0 124.029 0C169.455 0 206.282 36.8262 206.282 82.2555Z" fill="#6C63FF"/>
              <path d="M131.367 112.827C133.755 116.716 131.346 122.545 125.976 125.842C120.614 129.136 114.322 128.653 111.935 124.762L84.4731 80.0355C82.0832 76.1436 84.4918 70.3205 89.864 67.0243C95.2262 63.728 101.518 64.2132 103.906 68.102L131.367 112.827Z" fill="#F6F5F7"/>
              <path d="M130.367 122.588C127.073 127.95 120.051 129.634 114.689 126.34C109.316 123.046 107.64 116.025 110.934 110.654L148.78 48.9747C152.074 43.6071 159.095 41.9259 164.465 45.2198C169.83 48.5137 171.514 55.5329 168.22 60.9005L130.367 122.588Z" fill="#F6F5F7"/>
            </svg>
            <p className="text-neutral-dark dark:text-dark-text text-center transition-colors duration-300">Your profile has been created</p>
            <button className="flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-fade-in animate-once">
          <div className="flex flex-col items-center gap-10 p-10 max-w-lg w-4/5 rounded-3xl bg-white dark:bg-dark-surface shadow-large dark:shadow-dark-large animate-modal-slide-up animate-once">
            <svg className="w-60 h-44 animate-float" viewBox="0 0 235 173" fill="none">
              <path d="M234.872 165.394C234.872 169.473 182.325 172.78 117.499 172.78C52.6787 172.78 0.12793 169.473 0.12793 165.394C0.12793 161.316 52.6795 158.011 117.499 158.011C182.326 158.012 234.872 161.316 234.872 165.394Z" fill="#ACBFE2"/>
              <path d="M206.282 82.2555C206.282 127.682 169.455 164.506 124.029 164.506C78.5995 164.506 41.7754 127.682 41.7754 82.2555C41.7754 36.8262 78.5995 0 124.029 0C169.455 0 206.282 36.8262 206.282 82.2555Z" fill="#6C63FF"/>
              <path d="M131.367 112.827C133.755 116.716 131.346 122.545 125.976 125.842C120.614 129.136 114.322 128.653 111.935 124.762L84.4731 80.0355C82.0832 76.1436 84.4918 70.3205 89.864 67.0243C95.2262 63.728 101.518 64.2132 103.906 68.102L131.367 112.827Z" fill="#F6F5F7"/>
              <path d="M130.367 122.588C127.073 127.95 120.051 129.634 114.689 126.34C109.316 123.046 107.64 116.025 110.934 110.654L148.78 48.9747C152.074 43.6071 159.095 41.9259 164.465 45.2198C169.83 48.5137 171.514 55.5329 168.22 60.9005L130.367 122.588Z" fill="#F6F5F7"/>
            </svg>
            <div className="text-center">
              <h3 className="gradient-text text-2xl font-bold mb-2">Welcome Onboard!</h3>
              <p className="text-neutral-dark dark:text-dark-text transition-colors duration-300">Let's help you send money to anywhere, at anytime.</p>
            </div>
            <button
              className="flex px-3 py-3 justify-center items-center gap-2 rounded-lg bg-gradient-to-r from-primary-blue to-primary-pink border-none cursor-pointer w-full text-white text-lg font-bold hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/personal-info')}
            >
              Let's Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeOnboard;
