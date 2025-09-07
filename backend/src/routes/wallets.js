const express = require('express');
const router = express.Router();
const { listWallets, getWallet } = require('../controllers/walletController');

router.get('/', listWallets);
router.get('/:walletId', getWallet);

module.exports = router;
