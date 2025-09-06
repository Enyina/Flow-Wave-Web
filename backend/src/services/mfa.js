const speakeasy = require('speakeasy');

function generateSecret() {
  return speakeasy.generateSecret({ length: 20 });
}

function verifyTOTP(secret, token) {
  return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

module.exports = { generateSecret, verifyTOTP };
