import React, { createContext, useContext, useState } from 'react';

const FlowContext = createContext();

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

export const FlowProvider = ({ children }) => {
  const [flowState, setFlowState] = useState({
    startedFromRecipient: false,
    selectedRecipient: null,
    sendAmount: '',
    fromCurrency: null,
    toCurrency: null,
    paymentDescription: '',
    currentStep: 'dashboard' // dashboard, recipients, amount, description, review, pin, instructions, success
  });

  const updateFlowState = (updates) => {
    setFlowState(prev => ({ ...prev, ...updates }));
  };

  const resetFlow = () => {
    setFlowState({
      startedFromRecipient: false,
      selectedRecipient: null,
      sendAmount: '',
      fromCurrency: null,
      toCurrency: null,
      paymentDescription: '',
      currentStep: 'dashboard'
    });
  };

  const startFromRecipient = (recipient) => {
    setFlowState({
      startedFromRecipient: true,
      selectedRecipient: recipient,
      sendAmount: '',
      fromCurrency: null,
      toCurrency: null,
      paymentDescription: '',
      currentStep: 'amount'
    });
  };

  const startFromAmount = (amount, fromCurrency, toCurrency) => {
    setFlowState({
      startedFromRecipient: false,
      selectedRecipient: null,
      sendAmount: amount,
      fromCurrency,
      toCurrency,
      paymentDescription: '',
      currentStep: 'recipients'
    });
  };

  const value = {
    flowState,
    updateFlowState,
    resetFlow,
    startFromRecipient,
    startFromAmount
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};
