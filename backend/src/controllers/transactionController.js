const asyncHandler = require('../middleware/asyncHandler');
const transactionService = require('../services/transactionService');

const createTransaction = asyncHandler(async (req, res) => {
  const tx = await transactionService.createTransaction(req.user.id, req.body);
  // enqueue job for processing in production
  res.status(201).json(tx);
});

const getTransaction = asyncHandler(async (req, res) => {
  const tx = await transactionService.getTransaction(req.user.id, req.params.id);
  if (!tx) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
});

const listTransactions = asyncHandler(async (req, res) => {
  const txs = await transactionService.listTransactions(req.user.id);
  res.json(txs);
});

module.exports = { createTransaction, getTransaction, listTransactions };
