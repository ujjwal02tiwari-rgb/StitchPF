
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handle = process.env.SEED_HANDLE ?? 'ujjwal';
const email  = process.env.SEED_EMAIL  ?? 'ujjwal@example.com';

const user = await prisma.user.upsert({
  where: { handle },
  update: {},
  create: { handle, email }, 
});

console.log('USER_ID=' + user.id);
await prisma.$disconnect();
