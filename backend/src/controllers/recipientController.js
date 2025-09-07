const prisma = require('../utils/prismaClient');

async function listRecipients(req, res) {
  const items = await prisma.recipient.findMany({ where: { userId: req.user.id } });
  res.json(items);
}

async function createRecipient(req, res) {
  const { name, accountNumber, bankCode, currency } = req.body;
  if (!name || !currency) return res.status(400).json({ error: 'name and currency required' });
  const rec = await prisma.recipient.create({ data: { userId: req.user.id, name, accountNumber, bankCode, currency } });
  res.status(201).json(rec);
}

async function deleteRecipient(req, res) {
  const rec = await prisma.recipient.findUnique({ where: { id: req.params.id } });
  if (!rec || rec.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  await prisma.recipient.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
}

module.exports = { listRecipients, createRecipient, deleteRecipient };
