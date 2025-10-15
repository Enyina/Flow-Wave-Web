const bcrypt = require('bcrypt');
const prisma = require('../utils/prismaClient');
const { signAccessToken, generateRefreshToken } = require('../utils/jwt');
const ms = require('ms');
require('dotenv').config();

const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30', 10);

async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed } });

  // create default wallet
  await prisma.wallet.create({ data: { userId: user.id, currency: 'NGN', balance: 0 } });

  res.status(201).json({ id: user.id, email: user.email });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // lockout check
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    return res.status(423).json({ error: 'Account locked. Try later.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: user.failedLoginAttempts + 1 } });
    // lock after 5 attempts
    if (user.failedLoginAttempts + 1 >= 5) {
      const until = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      await prisma.user.update({ where: { id: user.id }, data: { lockedUntil: until, failedLoginAttempts: 0 } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // reset failed attempts
  await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null } });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const { token, hash } = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({ data: { tokenHash: hash, userId: user.id, expiresAt } });

  // set refresh token in httpOnly secure cookie
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined
  });

  res.json({ accessToken });
}

async function refresh(req, res) {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  const crypto = require('crypto');
  const incomingHash = crypto.createHash('sha256').update(token).digest('hex');

  const stored = await prisma.refreshToken.findFirst({ where: { tokenHash: incomingHash, revoked: false } });
  if (!stored) return res.status(401).json({ error: 'Invalid refresh token' });

  if (new Date(stored.expiresAt) < new Date()) return res.status(401).json({ error: 'Refresh token expired' });

  // rotate: revoke existing token and issue a new one
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
  const { token: newToken, hash: newHash } = generateRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { tokenHash: newHash, userId: stored.userId, expiresAt } });

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  const accessToken = signAccessToken({ sub: user.id, email: user.email });

  res.cookie('refresh_token', newToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined
  });

  res.json({ accessToken });
}

async function logout(req, res) {
  const token = req.cookies.refresh_token;
  if (token) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    await prisma.refreshToken.updateMany({ where: { tokenHash: hash }, data: { revoked: true } });
  }
  res.clearCookie('refresh_token');
  res.json({ ok: true });
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const user = await prisma.user.findUnique({ where: { email } });
  // Respond generically to prevent user enumeration
  if (!user) return res.json({ ok: true });

  // Generate 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const otpExpiry = new Date(Date.now() + ms('5m'));

  await prisma.user.update({
    where: { id: user.id },
    data: { resetOtp: otp, resetOtpExpiry: otpExpiry }
  });

  // In production, send OTP via email to the user
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ ok: true });
}

async function verifyOtp(req, res) {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Missing email or OTP' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.resetOtp) return res.status(400).json({ error: 'Invalid OTP' });
  if (new Date(user.resetOtpExpiry) < new Date()) {
    await prisma.user.update({ where: { id: user.id }, data: { resetOtp: null, resetOtpExpiry: null } });
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (user.resetOtp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  // Generate reset token
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + ms('15m'));

  await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: hash, expiresAt } });
  await prisma.user.update({ where: { id: user.id }, data: { resetOtp: null, resetOtpExpiry: null } });

  res.json({ ok: true, token });
}

async function resetPassword(req, res) {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });

  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const record = await prisma.passwordResetToken.findFirst({ where: { tokenHash: hash, used: false } });
  if (!record) return res.status(400).json({ error: 'Invalid or used token' });
  if (new Date(record.expiresAt) < new Date()) return res.status(400).json({ error: 'Token expired' });

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) return res.status(400).json({ error: 'Invalid token' });

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  await prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } });

  res.json({ ok: true });
}

async function createPin(req, res) {
  const { pin } = req.body;
  if (!req.user || !req.user.id) return res.status(401).json({ error: 'Unauthorized' });
  if (!pin || typeof pin !== 'string') return res.status(400).json({ error: 'PIN is required' });
  if (!/^\d{4,6}$/.test(pin)) return res.status(400).json({ error: 'PIN must be 4-6 digits' });

  const hash = await bcrypt.hash(pin, 10);
  await prisma.user.update({ where: { id: req.user.id }, data: { pinHash: hash } });
  res.json({ ok: true });
}

module.exports = { register, login, refresh, logout, forgotPassword, verifyOtp, resetPassword, createPin };
