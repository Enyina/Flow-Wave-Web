const express = require('express');
const router = express.Router();
const { listVirtualAccounts, createVirtualAccount } = require('../controllers/virtualAccountController');

router.get('/', listVirtualAccounts);
router.post('/', createVirtualAccount);

module.exports = router;
