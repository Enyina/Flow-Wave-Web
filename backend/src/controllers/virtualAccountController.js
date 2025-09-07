const asyncHandler = require('../middleware/asyncHandler');
const vaService = require('../services/virtualAccountService');

const listVirtualAccounts = asyncHandler(async (req, res) => {
  const v = await vaService.listVirtualAccounts(req.user.id);
  res.json(v);
});

const createVirtualAccount = asyncHandler(async (req, res) => {
  const { currency } = req.body;
  if (!currency) return res.status(400).json({ error: 'Currency required' });

  // In real integration, call Mastercard client to create VA and store providerId
  const va = await vaService.createVirtualAccount(req.user.id, { currency });
  res.status(201).json(va);
});

module.exports = { listVirtualAccounts, createVirtualAccount };
