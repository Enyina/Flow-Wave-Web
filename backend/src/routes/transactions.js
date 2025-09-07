const express = require('express');
const router = express.Router();
const { createTransaction, getTransaction, listTransactions } = require('../controllers/transactionController');

router.post('/', createTransaction);
router.get('/', listTransactions);
router.get('/:id', getTransaction);

module.exports = router;
