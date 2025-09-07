const prisma = require('../utils/prismaClient');

async function createTransaction(req, res) {
  const { amount, currency, fee = 0, idempotencyKey, recipientId } = req.body;
  if (!amount || !currency) return res.status(400).json({ error: 'amount and currency required' });

  // idempotency check
  if (idempotencyKey) {
    const existing = await prisma.transaction.findFirst({ where: { meta: { path: ['idempotencyKey'], equals: idempotencyKey } } });
    if (existing) return res.status(200).json(existing);
  }

  const tx = await prisma.transaction.create({ data: { userId: req.user.id, amount: parseFloat(amount), currency, fee: parseFloat(fee), meta: { idempotencyKey, recipientId } } });

  // In production: enqueue processing job, call Mastercard, etc.

  res.status(201).json(tx);
}

async function getTransaction(req, res) {
  const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
  if (!tx || tx.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  res.json(tx);
}

async function listTransactions(req, res) {
  const txs = await prisma.transaction.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
  res.json(txs);
}

module.exports = { createTransaction, getTransaction, listTransactions };
