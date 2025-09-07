const prisma = require('../utils/prismaClient');

async function createTransaction(userId, payload) {
  const { amount, currency, fee = 0, idempotencyKey, recipientId } = payload;
  if (!amount || !currency) throw new Error('amount and currency required');

  if (idempotencyKey) {
    const existing = await prisma.transaction.findFirst({ where: { meta: { path: ['idempotencyKey'], equals: idempotencyKey } } });
    if (existing) return existing;
  }

  const tx = await prisma.transaction.create({ data: { userId, amount: parseFloat(amount), currency, fee: parseFloat(fee), meta: { idempotencyKey, recipientId } } });
  return tx;
}

async function getTransaction(userId, id) {
  const tx = await prisma.transaction.findUnique({ where: { id } });
  if (!tx || tx.userId !== userId) return null;
  return tx;
}

async function listTransactions(userId) {
  return prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

module.exports = { createTransaction, getTransaction, listTransactions };
