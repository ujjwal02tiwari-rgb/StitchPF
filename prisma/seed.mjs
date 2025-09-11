
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const handle = process.env.SEED_HANDLE || 'demo';
  const email  = process.env.SEED_EMAIL  || 'demo@example.com';

  
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      handle,        
      email,          
      
    },
  });

  console.log(`USER_ID=${user.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Seed failed:', e.message ?? e);
    if (e?.code) console.error('code:', e.code);
    if (e?.meta) console.error('meta:', e.meta);
    await prisma.$disconnect();
    process.exit(1);
  });
