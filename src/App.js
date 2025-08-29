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
import Dashboard from './components/Dashboard';
import CountrySelector from './components/CountrySelector';
import Recipients from './components/Recipients';
import AddRecipient from './components/AddRecipient';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [recipients, setRecipients] = useState([]);

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleSaveRecipient = (recipientData) => {
    setRecipients(prev => [...prev, { id: Date.now(), ...recipientData }]);
  };

  const handleLogout = () => {
    handleScreenChange('create-account');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'create-account':
        return <CreateAccount onNext={() => handleScreenChange('verify-email')} onSignin={() => handleScreenChange('signin')} />;
      case 'signin':
        return <Signin onNext={() => handleScreenChange('dashboard')} onCreateAccount={() => handleScreenChange('create-account')} />;
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
        return <WelcomeOnboard onNext={() => handleScreenChange('dashboard')} />;
      case 'dashboard':
        return <Dashboard
          onCountrySelect={() => handleScreenChange('country-selector')}
          onRecipients={() => handleScreenChange('recipients')}
          onTransactions={() => handleScreenChange('dashboard')}
          onProfile={() => handleScreenChange('dashboard')}
          onLogout={handleLogout}
        />;
      case 'country-selector':
        return <CountrySelector
          onBack={() => handleScreenChange('dashboard')}
          onSelectCountry={handleCountrySelect}
          onLogout={handleLogout}
        />;
      case 'recipients':
        return <Recipients
          onBack={() => handleScreenChange('dashboard')}
          onAddRecipient={() => handleScreenChange('add-recipient')}
          onSelectRecipient={(recipient) => {
            console.log('Selected recipient:', recipient);
            handleScreenChange('dashboard');
          }}
          onLogout={handleLogout}
        />;
      case 'add-recipient':
        return <AddRecipient
          onBack={() => handleScreenChange('recipients')}
          onSave={handleSaveRecipient}
          onLogout={handleLogout}
        />;
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
