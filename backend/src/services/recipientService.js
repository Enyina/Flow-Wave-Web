const prisma = require('../utils/prismaClient');

async function list(userId) {
  return prisma.recipient.findMany({ where: { userId } });
}

async function create(userId, payload) {
  return prisma.recipient.create({ data: { userId, ...payload } });
}

async function remove(id, userId) {
  const rec = await prisma.recipient.findUnique({ where: { id } });
  if (!rec || rec.userId !== userId) return null;
  await prisma.recipient.delete({ where: { id } });
  return true;
}

module.exports = { list, create, remove };
