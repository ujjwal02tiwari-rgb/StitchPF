import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // create a simple seed user if none exists
  const any = await prisma.user.findFirst({ select: { id: true } });
  if (!any) {
    await prisma.user.create({
      data: {
        handle: 'demo',
        name: 'Demo User',
        email: 'demo@local', // optional unique
      },
    });
  }
}
main().finally(() => prisma.$disconnect());
