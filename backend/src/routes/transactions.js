const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { createTransaction, getTransaction, listTransactions } = require('../controllers/transactionController');

router.post('/', asyncHandler(createTransaction));
router.get('/', asyncHandler(listTransactions));
router.get('/:id', asyncHandler(getTransaction));

module.exports = router;
