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
  const { token: rawToken, hash: incomingHash } = (() => {
    const crypto = require('crypto');
    const token = token; // raw
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
  })();

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

module.exports = { register, login, refresh, logout };
