const prisma = require('../utils/prismaClient');

async function listWallets(req, res) {
  const wallets = await prisma.wallet.findMany({ where: { userId: req.user.id } });
  res.json(wallets);
}

async function getWallet(req, res) {
  const wallet = await prisma.wallet.findUnique({ where: { id: req.params.walletId } });
  if (!wallet || wallet.userId !== req.user.id) return res.status(404).json({ error: 'Wallet not found' });
  res.json(wallet);
}

module.exports = { listWallets, getWallet };
