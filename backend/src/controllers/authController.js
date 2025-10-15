const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ms = require('ms');
const prisma = require('../utils/prismaClient');
const { signAccessToken, generateRefreshToken } = require('../utils/jwt');
require('dotenv').config();

// ==================== CONSTANTS ====================
const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30', 10);
const BCRYPT_ROUNDS = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const OTP_LENGTH = 4;
const OTP_EXPIRY_DURATION = '5m';
const RESET_TOKEN_EXPIRY_DURATION = '15m';
const DEFAULT_CURRENCY = 'NGN';

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate a random OTP of specified length
 * @param {number} length - Length of OTP
 * @returns {string} Generated OTP
 */
const generateOtp = (length = OTP_LENGTH) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

/**
 * Hash data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
const hashWithSha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Set refresh token cookie
 * @param {object} res - Express response object
 * @param {string} token - Refresh token
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined
  });
};

// ==================== AUTHENTICATION CONTROLLERS ====================

/**
 * Register a new user
 * @route POST /api/auth/register
 * @route POST /api/auth/signup
 */
async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  });

  // Create default wallet for the user
  await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: DEFAULT_CURRENCY,
      balance: 0
    }
  });

  res.status(201).json({
    id: user.id,
    email: user.email
  });
}

/**
 * Login user
 * @route POST /api/auth/login
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if account is locked
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    return res.status(423).json({ error: 'Account locked. Try later.' });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const newFailedAttempts = user.failedLoginAttempts + 1;

    // Lock account after max attempts
    if (newFailedAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lockedUntil: lockUntil,
          failedLoginAttempts: 0
        }
      });
      return res.status(401).json({ error: 'Too many failed attempts. Account locked.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: newFailedAttempts }
    });

    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Reset failed login attempts on successful login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null
    }
  });

  // Generate tokens
  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const { token: refreshToken, hash: refreshTokenHash } = generateRefreshToken();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      tokenHash: refreshTokenHash,
      userId: user.id,
      expiresAt: refreshExpiresAt
    }
  });

  // Set refresh token cookie
  setRefreshTokenCookie(res, refreshToken);

  res.json({ accessToken });
}

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
async function refresh(req, res) {
  const token = req.cookies.refresh_token;

  if (!token) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  const tokenHash = hashWithSha256(token);
  const storedToken = await prisma.refreshToken.findFirst({
    where: { tokenHash, revoked: false }
  });

  if (!storedToken) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  if (new Date(storedToken.expiresAt) < new Date()) {
    return res.status(401).json({ error: 'Refresh token expired' });
  }

  // Rotate refresh token: revoke old and issue new
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true }
  });

  const { token: newRefreshToken, hash: newRefreshTokenHash } = generateRefreshToken();
  const newExpiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: newRefreshTokenHash,
      userId: storedToken.userId,
      expiresAt: newExpiresAt
    }
  });

  // Generate new access token
  const user = await prisma.user.findUnique({ where: { id: storedToken.userId } });
  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  // Set new refresh token cookie
  setRefreshTokenCookie(res, newRefreshToken);

  res.json({ accessToken });
}

/**
 * Logout user
 * @route POST /api/auth/logout
 */
async function logout(req, res) {
  const token = req.cookies.refresh_token;

  if (token) {
    const tokenHash = hashWithSha256(token);
    await prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true }
    });
  }

  res.clearCookie('refresh_token');
  res.json({ ok: true });
}

// ==================== PASSWORD RESET CONTROLLERS ====================

/**
 * Initiate password reset by sending OTP
 * @route POST /api/auth/forgot-password
 */
async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Respond generically to prevent user enumeration
  if (!user) {
    return res.json({ ok: true });
  }

  // Generate OTP
  const otp = generateOtp(OTP_LENGTH);
  const otpExpiry = new Date(Date.now() + ms(OTP_EXPIRY_DURATION));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetOtp: otp,
      resetOtpExpiry: otpExpiry
    }
  });

  // TODO: In production, send OTP via email service
  // For development, log to console
  console.log(`[PASSWORD RESET] OTP for ${email}: ${otp}`);

  res.json({ ok: true });
}

/**
 * Verify OTP and issue reset token
 * @route POST /api/auth/verify-otp
 */
async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Missing email or OTP' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.resetOtp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Check OTP expiry
  if (new Date(user.resetOtpExpiry) < new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { resetOtp: null, resetOtpExpiry: null }
    });
    return res.status(400).json({ error: 'OTP expired' });
  }

  // Verify OTP
  if (user.resetOtp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // Generate password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = hashWithSha256(resetToken);
  const tokenExpiresAt = new Date(Date.now() + ms(RESET_TOKEN_EXPIRY_DURATION));

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: resetTokenHash,
      expiresAt: tokenExpiresAt
    }
  });

  // Clear OTP from user record
  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtp: null, resetOtpExpiry: null }
  });

  res.json({ ok: true, token: resetToken });
}

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 */
async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Missing token or password' });
  }

  const tokenHash = hashWithSha256(token);
  const resetTokenRecord = await prisma.passwordResetToken.findFirst({
    where: { tokenHash, used: false }
  });

  if (!resetTokenRecord) {
    return res.status(400).json({ error: 'Invalid or used token' });
  }

  // Check token expiry
  if (new Date(resetTokenRecord.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'Token expired' });
  }

  const user = await prisma.user.findUnique({ where: { id: resetTokenRecord.userId } });

  if (!user) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  // Mark token as used
  await prisma.passwordResetToken.update({
    where: { id: resetTokenRecord.id },
    data: { used: true }
  });

  res.json({ ok: true });
}

// ==================== PIN MANAGEMENT ====================

/**
 * Create user PIN
 * @route POST /api/auth/create-pin
 * @protected
 */
async function createPin(req, res) {
  const { pin } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({ error: 'PIN is required' });
  }

  // Validate PIN format (4-6 digits)
  if (!/^\d{4,6}$/.test(pin)) {
    return res.status(400).json({ error: 'PIN must be 4-6 digits' });
  }

  const pinHash = await bcrypt.hash(pin, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { pinHash }
  });

  res.json({ ok: true });
}

// ==================== EXPORTS ====================

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  createPin
};
