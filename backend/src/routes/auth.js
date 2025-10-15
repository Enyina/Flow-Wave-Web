const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  createPin
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/auth/register
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);
router.post('/signup', register); // Alias for client compatibility

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get tokens
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public (requires refresh token cookie)
 */
router.post('/refresh', refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and revoke refresh token
 * @access  Public
 */
router.post('/logout', logout);

// ==================== PASSWORD RESET ROUTES ====================

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset - send OTP to email
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and get reset token
 * @access  Public
 */
router.post('/verify-otp', verifyOtp);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPassword);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/auth/create-pin
 * @desc    Create user PIN for transactions
 * @access  Protected
 */
router.post('/create-pin', protect, createPin);

module.exports = router;
