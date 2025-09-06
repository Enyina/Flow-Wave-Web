import React from 'react';

import { useNavigate } from 'react-router-dom';

const Logo = ({ className = "w-10 h-7 lg:w-13 lg:h-9" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/dashboard')}
      className={`${className} inline-flex items-center justify-center`}
      aria-label="Go to home"
    >
      <svg width="52" height="37" viewBox="0 0 52 37" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="flowwave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="30%" stopColor="#9C5CFF" />
            <stop offset="60%" stopColor="#FF5C8A" />
            <stop offset="100%" stopColor="#FF8A5C" />
          </linearGradient>
        </defs>
        <path d="M8 28C8 28 12 20 20 20C28 20 32 28 40 28C48 28 52 20 52 20V37H0V20C0 20 4 28 8 28Z" fill="url(#flowwave-gradient)" />
        <path d="M4 18C4 18 8 10 16 10C24 10 28 18 36 18C44 18 48 10 48 10V27H-4V10C-4 10 0 18 4 18Z" fill="url(#flowwave-gradient)" opacity="0.7" />
        <path d="M0 8C0 8 4 0 12 0C20 0 24 8 32 8C40 8 44 0 44 0V17H-8V0C-8 0 -4 8 0 8Z" fill="url(#flowwave-gradient)" opacity="0.4" />
      </svg>
    </button>
  );
};

export default Logo;
