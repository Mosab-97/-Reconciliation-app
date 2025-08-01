import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Test database connection
export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ SQLite Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ SQLite Database connection failed:', error);
    return false;
  }
}