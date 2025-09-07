const prisma = require('../utils/prismaClient');
const { createClient } = require('../services/mastercardClient');

async function listVirtualAccounts(req, res) {
  const v = await prisma.virtualAccount.findMany({ where: { userId: req.user.id } });
  res.json(v);
}

async function createVirtualAccount(req, res) {
  const { currency } = req.body;
  if (!currency) return res.status(400).json({ error: 'Currency required' });

  // In real integration, call Mastercard client to create VA and store providerId
  let providerId = null;
  try {
    // const client = createClient();
    // const resp = await client.post('/virtual-accounts', { currency });
    // providerId = resp.data.id;
  } catch (err) {
    console.error('Mastercard VA creation failed', err.message);
  }

  const va = await prisma.virtualAccount.create({ data: { userId: req.user.id, currency, providerId } });
  res.status(201).json(va);
}

module.exports = { listVirtualAccounts, createVirtualAccount };
