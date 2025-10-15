const express = require('express');
const router = express.Router();
const { register, login, refresh, logout, forgotPassword, resetPassword, createPin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/signup', register); // alias to match client expectation
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/create-pin', protect, createPin);

module.exports = router;
