import React, { useState, useEffect } from 'react';
import { useTransactionStore } from '../stores/transactionStore';

const ExchangeRateCalculator = ({ 
  amount, 
  fromCurrency = 'USD', 
  toCurrency = 'NGN',
  onRateCalculated,
  className = '' 
}) => {
  const { exchangeRate, fetchExchangeRate, loading, error, calculateTransferFee, calculateTotalAmount } = useTransactionStore();
  const [localAmount, setLocalAmount] = useState(amount || 100);

  useEffect(() => {
    const loadRate = async () => {
      try {
        await fetchExchangeRate(fromCurrency, toCurrency);
      } catch (err) {
        console.error('Failed to load exchange rate:', err);
      }
    };
    loadRate();
  }, [fetchExchangeRate, fromCurrency, toCurrency]);

  useEffect(() => {
    if (onRateCalculated && exchangeRate) {
      const fee = calculateTransferFee(localAmount);
      const total = calculateTotalAmount(localAmount);
      const convertedAmount = localAmount * exchangeRate.rate;
      
      onRateCalculated({
        amount: localAmount,
        fromCurrency,
        toCurrency,
        rate: exchangeRate.rate,
        convertedAmount,
        fee,
        total,
        timestamp: exchangeRate.timestamp
      });
    }
  }, [localAmount, exchangeRate, fromCurrency, toCurrency, calculateTransferFee, calculateTotalAmount, onRateCalculated]);

  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value) || 0;
    setLocalAmount(newAmount);
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 ${className}`}>
        <p className="text-red-600 dark:text-red-400 text-center">
          Unable to load exchange rates. Please try again.
        </p>
      </div>
    );
  }

  if (!exchangeRate) {
    return (
      <div className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 ${className}`}>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Loading exchange rates...
        </p>
      </div>
    );
  }

  const convertedAmount = localAmount * exchangeRate.rate;
  const fee = calculateTransferFee(localAmount);
  const total = calculateTotalAmount(localAmount);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Exchange Rate
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {fromCurrency} → {toCurrency}
          </span>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount ({fromCurrency})
          </label>
          <input
            type="number"
            value={localAmount}
            onChange={handleAmountChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            min="0"
            step="0.01"
          />
        </div>

        {/* Exchange Rate Display */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              1 {fromCurrency} = 
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {exchangeRate.rate.toLocaleString()} {toCurrency}
            </span>
          </div>
          {exchangeRate.timestamp && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last updated: {new Date(exchangeRate.timestamp).toLocaleString()}
            </p>
          )}
        </div>

        {/* Conversion Result */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">
              You'll receive:
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} {toCurrency}
            </span>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Transfer Fee:</span>
            <span className="text-gray-800 dark:text-white">
              ${fee.toFixed(2)} {fromCurrency}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span className="text-gray-800 dark:text-white">Total Amount:</span>
            <span className="text-lg text-blue-600 dark:text-blue-400">
              ${total.toFixed(2)} {fromCurrency}
            </span>
          </div>
        </div>

        {/* Fee Note */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded p-3">
          <p>
            <strong>Fee Structure:</strong> 2% of amount or $10 USD, whichever is higher.
            This covers processing and virtual account generation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateCalculator;
