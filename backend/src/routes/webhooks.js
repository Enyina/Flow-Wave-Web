const express = require('express');
const router = express.Router();
const { mastercardWebhook } = require('../controllers/webhookController');

// Mastercard may post raw JSON; ensure raw body is available in app
router.post('/mastercard', mastercardWebhook);

module.exports = router;
