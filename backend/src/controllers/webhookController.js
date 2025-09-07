const prisma = require('../utils/prismaClient');

async function mastercardWebhook(req, res) {
  // Mastercard sends raw JSON; verify signature using certs (not implemented yet)
  const payload = req.body;

  // store raw event
  await prisma.webhookEvent.create({ data: { provider: 'mastercard', payload } });

  // TODO: verify signature, process idempotently, update transaction status

  res.status(200).send('OK');
}

module.exports = { mastercardWebhook };
