import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [fromCurrency, setFromCurrency] = useState({ 
    code: 'NGN', 
    flag: 'https://flagcdn.com/21x21/ng.png', 
    name: 'Nigeria' 
  });
  
  const [toCurrency, setToCurrency] = useState({ 
    code: 'USD', 
    flag: 'https://flagcdn.com/21x21/us.png', 
    name: 'United States' 
  });

  const [sendAmount, setSendAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');

  const updateFromCurrency = (currency) => {
    setFromCurrency(currency);
  };

  const updateToCurrency = (currency) => {
    setToCurrency(currency);
  };

  const updateSendAmount = (amount) => {
    setSendAmount(amount);
    // Simple conversion calculation (1500 NGN = 1 USD)
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      const rate = fromCurrency.code === 'NGN' ? 1500 : 1;
      const converted = (parseFloat(amount) / rate).toFixed(2);
      setReceiveAmount(converted);
    } else {
      setReceiveAmount('');
    }
  };

  const value = {
    fromCurrency,
    toCurrency,
    sendAmount,
    receiveAmount,
    updateFromCurrency,
    updateToCurrency,
    updateSendAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
