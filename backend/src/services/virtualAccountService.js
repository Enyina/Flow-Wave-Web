const prisma = require('../utils/prismaClient');

async function listVirtualAccounts(userId) {
  return prisma.virtualAccount.findMany({ where: { userId } });
}

async function createVirtualAccount(userId, payload) {
  const { currency, providerId } = payload;
  if (!currency) throw new Error('currency required');
  const va = await prisma.virtualAccount.create({ data: { userId, currency, providerId } });
  return va;
}

module.exports = { listVirtualAccounts, createVirtualAccount };
