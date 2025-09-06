const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password,
      isEmailVerified: true
    }
  });

  await prisma.wallet.upsert({
    where: { id: 'default-wallet-' + user.id },
    update: {},
    create: {
      id: 'default-wallet-' + user.id,
      userId: user.id,
      currency: 'NGN',
      balance: 100000
    }
  });

  console.log('Seed completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
