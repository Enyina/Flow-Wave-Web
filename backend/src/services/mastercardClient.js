const axios = require('axios');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

// This is a minimal, secure setup for calling Mastercard APIs that require mTLS.
// Provide MASTER_CARD_KEY_PEM_PATH and MASTER_CARD_CERT_PEM_PATH in env.

function createClient() {
  const keyPath = process.env.MASTER_CARD_KEY_PEM_PATH;
  const certPath = process.env.MASTER_CARD_CERT_PEM_PATH;
  const baseURL = process.env.MASTER_CARD_BASE_URL;

  let httpsAgent;
  if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsAgent = new https.Agent({
      cert: fs.readFileSync(certPath),
      key: fs.readFileSync(keyPath),
      rejectUnauthorized: true
    });
  }

  const client = axios.create({ baseURL, httpsAgent, timeout: 15000 });

  // attach consumer key if provided
  client.interceptors.request.use((config) => {
    if (process.env.MASTER_CARD_CONSUMER_KEY) {
      config.headers['Consumer-Key'] = process.env.MASTER_CARD_CONSUMER_KEY;
    }
    return config;
  });

  return client;
}

module.exports = { createClient };
