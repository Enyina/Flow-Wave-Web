const asyncHandler = require('../middleware/asyncHandler');
const recipientService = require('../services/recipientService');

const listRecipients = asyncHandler(async (req, res) => {
  const items = await recipientService.list(req.user.id);
  res.json(items);
});

const createRecipient = asyncHandler(async (req, res) => {
  const { name, accountNumber, bankCode, currency } = req.body;
  if (!name || !currency) return res.status(400).json({ error: 'name and currency required' });
  const rec = await recipientService.create(req.user.id, { name, accountNumber, bankCode, currency });
  res.status(201).json(rec);
});

const deleteRecipient = asyncHandler(async (req, res) => {
  const ok = await recipientService.remove(req.params.id, req.user.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = { listRecipients, createRecipient, deleteRecipient };
