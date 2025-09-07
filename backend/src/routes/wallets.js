const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { listWallets, getWallet } = require('../controllers/walletController');

router.get('/', asyncHandler(listWallets));
router.get('/:walletId', asyncHandler(getWallet));

module.exports = router;
