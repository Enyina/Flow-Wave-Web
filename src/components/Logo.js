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
      <img 
        src={"/assets/logo.svg"} 
        alt="Flow Wave Logo" 
        className="w-full h-full object-contain" 
      />
    </button>
  );
};

export default Logo;
