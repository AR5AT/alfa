import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', users);
  } catch (error) {
    console.error('Ошибка при запросе:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
