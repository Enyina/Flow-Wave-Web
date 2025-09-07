const prisma = require('../utils/prismaClient');

async function reconciliation(req, res) {
  // simple stub: return pending transactions
  const pending = await prisma.transaction.findMany({ where: { status: 'pending' } });
  res.json({ pending });
}

module.exports = { reconciliation };
