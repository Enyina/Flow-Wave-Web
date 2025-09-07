require('dotenv').config();

const get = (k, fallback) => process.env[k] || fallback;

module.exports = {
  port: get('PORT', 4000),
  nodeEnv: get('NODE_ENV', 'development'),
  dbUrl: get('DATABASE_URL'),
  jwt: {
    accessSecret: get('JWT_ACCESS_TOKEN_SECRET'),
    refreshSecret: get('JWT_REFRESH_TOKEN_SECRET'),
    accessExpires: get('JWT_ACCESS_EXPIRES', '15m'),
    refreshExpiresDays: parseInt(get('REFRESH_TOKEN_EXPIRES_DAYS', '30'), 10)
  },
  cookie: {
    domain: get('COOKIE_DOMAIN'),
    secure: get('COOKIE_SECURE', 'false') === 'true'
  },
  mastercard: {
    consumerKey: get('MASTER_CARD_CONSUMER_KEY'),
    baseUrl: get('MASTER_CARD_BASE_URL', 'https://sandbox.api.mastercard.com'),
    keyPath: get('MASTER_CARD_KEY_PEM_PATH'),
    certPath: get('MASTER_CARD_CERT_PEM_PATH')
  }
};
