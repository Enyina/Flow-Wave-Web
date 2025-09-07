const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { listVirtualAccounts, createVirtualAccount } = require('../controllers/virtualAccountController');

router.get('/', asyncHandler(listVirtualAccounts));
router.post('/', asyncHandler(createVirtualAccount));

module.exports = router;
