import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { FlowProvider } from './contexts/FlowContext';
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

// Account Management components
import Account from './components/Account';
import PersonalInformation from './components/PersonalInformation';
import EmailAddress from './components/EmailAddress';
import AccountPin from './components/AccountPin';
import NewEmailAddress from './components/NewEmailAddress';
import AccountVerifyEmail from './components/AccountVerifyEmail';
import EmailUpdated from './components/EmailUpdated';
import MobileNumber from './components/MobileNumber';
import UpdateMobileNumber from './components/UpdateMobileNumber';
import VerifyNumber from './components/VerifyNumber';
import MobilePinEntry from './components/MobilePinEntry';
import MobileNumberUpdated from './components/MobileNumberUpdated';
import AccountLimit from './components/AccountLimit';
import TwoFactorAuth from './components/TwoFactorAuth';
import NotificationSettings from './components/NotificationSettings';

// Authentication Flow components
import VerifyIdentity from './components/VerifyIdentity';
import VerifyEmailAddress from './components/VerifyEmailAddress';
import CreateNewPin from './components/CreateNewPin';
import ConfirmNewPin from './components/ConfirmNewPin';
import PinUpdated from './components/PinUpdated';

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <FlowProvider>
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
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                }
              />

              {/* Account Management Routes */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/personal-information"
                element={
                  <ProtectedRoute>
                    <PersonalInformation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email-address"
                element={
                  <ProtectedRoute>
                    <EmailAddress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-pin"
                element={
                  <ProtectedRoute>
                    <AccountPin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/new-email-address"
                element={
                  <ProtectedRoute>
                    <NewEmailAddress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-verify-email"
                element={
                  <ProtectedRoute>
                    <AccountVerifyEmail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/email-updated"
                element={
                  <ProtectedRoute>
                    <EmailUpdated />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mobile-number"
                element={
                  <ProtectedRoute>
                    <MobileNumber />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-mobile-number"
                element={
                  <ProtectedRoute>
                    <UpdateMobileNumber />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-number"
                element={
                  <ProtectedRoute>
                    <VerifyNumber />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mobile-pin-entry"
                element={
                  <ProtectedRoute>
                    <MobilePinEntry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mobile-number-updated"
                element={
                  <ProtectedRoute>
                    <MobileNumberUpdated />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-limit"
                element={
                  <ProtectedRoute>
                    <AccountLimit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/two-factor-auth"
                element={
                  <ProtectedRoute>
                    <TwoFactorAuth />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notification-settings"
                element={
                  <ProtectedRoute>
                    <NotificationSettings />
                  </ProtectedRoute>
                }
              />

              {/* Authentication Flow Routes */}
              <Route
                path="/verify-identity"
                element={
                  <ProtectedRoute>
                    <VerifyIdentity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-email-address"
                element={
                  <ProtectedRoute>
                    <VerifyEmailAddress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-new-pin"
                element={
                  <ProtectedRoute>
                    <CreateNewPin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/confirm-new-pin"
                element={
                  <ProtectedRoute>
                    <ConfirmNewPin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pin-updated"
                element={
                  <ProtectedRoute>
                    <PinUpdated />
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
          </FlowProvider>
        </CurrencyProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
