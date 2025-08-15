import React, { useState } from 'react';
import './App.css';
import { DarkModeProvider } from './contexts/DarkModeContext';
import CreateAccount from './components/CreateAccount';
import Signin from './components/Signin';
import VerifyEmail from './components/VerifyEmail';
import CreatePassword from './components/CreatePassword';
import CreatePin from './components/CreatePin';
import ConfirmPin from './components/ConfirmPin';
import PersonalInfo from './components/PersonalInfo';
import WelcomeOnboard from './components/WelcomeOnboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState('create-account');

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'create-account':
        return <CreateAccount onNext={() => handleScreenChange('verify-email')} onSignin={() => handleScreenChange('signin')} />;
      case 'signin':
        return <Signin onNext={() => handleScreenChange('create-pin')} onCreateAccount={() => handleScreenChange('create-account')} />;
      case 'verify-email':
        return <VerifyEmail onNext={() => handleScreenChange('create-password')} />;
      case 'create-password':
        return <CreatePassword onNext={() => handleScreenChange('create-pin')} />;
      case 'create-pin':
        return <CreatePin onNext={() => handleScreenChange('confirm-pin')} />;
      case 'confirm-pin':
        return <ConfirmPin onNext={() => handleScreenChange('personal-info')} />;
      case 'personal-info':
        return <PersonalInfo onNext={() => handleScreenChange('welcome')} />;
      case 'welcome':
        return <WelcomeOnboard onNext={() => handleScreenChange('create-account')} />;
      default:
        return <CreateAccount onNext={() => handleScreenChange('verify-email')} onSignin={() => handleScreenChange('signin')} />;
    }
  };

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex bg-white dark:bg-dark-bg transition-colors duration-300">
        {renderScreen()}
      </div>
    </DarkModeProvider>
  );
}

export default App;
