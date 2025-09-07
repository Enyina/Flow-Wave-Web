const prisma = require('../utils/prismaClient');

async function getMe(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, email: true, isEmailVerified: true, mfaEnabled: true, createdAt: true } });
  res.json(user);
}

async function updateMe(req, res) {
  const { email } = req.body;
  const data = {};
  if (email) data.email = email;
  const updated = await prisma.user.update({ where: { id: req.user.id }, data });
  res.json({ id: updated.id, email: updated.email });
}

module.exports = { getMe, updateMe };
