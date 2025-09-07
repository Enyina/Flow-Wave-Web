const prisma = require('../utils/prismaClient');

async function listWallets(userId) {
  return prisma.wallet.findMany({ where: { userId } });
}

async function getWallet(userId, id) {
  const w = await prisma.wallet.findUnique({ where: { id } });
  if (!w || w.userId !== userId) return null;
  return w;
}

module.exports = { listWallets, getWallet };
