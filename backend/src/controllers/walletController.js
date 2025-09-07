const asyncHandler = require('../middleware/asyncHandler');
const walletService = require('../services/walletService');

const listWallets = asyncHandler(async (req, res) => {
  const wallets = await walletService.listWallets(req.user.id);
  res.json(wallets);
});

const getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWallet(req.user.id, req.params.walletId);
  if (!wallet) return res.status(404).json({ error: 'Wallet not found' });
  res.json(wallet);
});

module.exports = { listWallets, getWallet };
