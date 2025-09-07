const express = require('express');
const router = express.Router();
const { reconciliation } = require('../controllers/adminController');

router.get('/reconciliation', reconciliation);

module.exports = router;
