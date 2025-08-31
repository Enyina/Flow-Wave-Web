import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ onClick, className = '', ariaLabel = 'Go back' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200 ${className}`}
      aria-label={ariaLabel}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-neutral-dark dark:text-dark-text">
        <path 
          d="M19 12H5M12 19L5 12L12 5" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;
