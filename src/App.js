import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Authentication components
import CreateAccount from './components/CreateAccount';
import Signin from './components/Signin';
import VerifyEmail from './components/VerifyEmail';
import CreatePassword from './components/CreatePassword';
import CreatePin from './components/CreatePin';
import ConfirmPin from './components/ConfirmPin';
import PersonalInfo from './components/PersonalInfo';
import WelcomeOnboard from './components/WelcomeOnboard';

// Dashboard components
import Dashboard from './components/Dashboard';
import CountrySelector from './components/CountrySelector';
import Recipients from './components/Recipients';
import AddRecipient from './components/AddRecipient';
import PaymentDescription from './components/PaymentDescription';
import PaymentReview from './components/PaymentReview';
import EnterPin from './components/EnterPin';
import PaymentInstructions from './components/PaymentInstructions';
import TransactionSuccessful from './components/TransactionSuccessful';
import TransactionDetails from './components/TransactionDetails';
import Notification from './components/Notification';
import Transactions from './components/Transactions';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
          <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Signin />} />
              <Route path="/signup" element={<CreateAccount />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/create-password" element={<CreatePassword />} />
              <Route path="/create-pin" element={<CreatePin />} />
              <Route path="/confirm-pin" element={<ConfirmPin />} />
              <Route path="/personal-info" element={<PersonalInfo />} />
              <Route path="/welcome" element={<WelcomeOnboard />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/country-selector" 
                element={
                  <ProtectedRoute>
                    <CountrySelector />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recipients" 
                element={
                  <ProtectedRoute>
                    <Recipients />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/add-recipient"
                element={
                  <ProtectedRoute>
                    <AddRecipient />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-description"
                element={
                  <ProtectedRoute>
                    <PaymentDescription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review"
                element={
                  <ProtectedRoute>
                    <PaymentReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enter-pin"
                element={
                  <ProtectedRoute>
                    <EnterPin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-instructions"
                element={
                  <ProtectedRoute>
                    <PaymentInstructions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-successful"
                element={
                  <ProtectedRoute>
                    <TransactionSuccessful />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction-details"
                element={
                  <ProtectedRoute>
                    <TransactionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notification />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
