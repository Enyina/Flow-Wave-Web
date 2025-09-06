const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';

function signAccessToken(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function generateRefreshToken() {
  const token = crypto.randomBytes(64).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

module.exports = { signAccessToken, verifyAccessToken, generateRefreshToken };
