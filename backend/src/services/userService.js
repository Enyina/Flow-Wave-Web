const prisma = require('../utils/prismaClient');
const ApiError = require('../errors/ApiError');

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

async function updateUser(id, data) {
  try {
    const user = await prisma.user.update({ where: { id }, data });
    return user;
  } catch (err) {
    throw new ApiError(400, 'Unable to update user', err.message);
  }
}

module.exports = { getUserById, updateUser };
