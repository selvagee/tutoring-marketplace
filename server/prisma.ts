import { PrismaClient } from '@prisma/client';
import { log } from './vite';

// Avoid multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
export const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Log when Prisma is initialized
log('Prisma client initialized', 'prisma');

// Save prisma client to global scope to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Function to ensure database connection
export async function connectDatabase() {
  try {
    // Test connection with a simple query
    await prisma.$connect();
    log('Successfully connected to the database', 'prisma');
    return true;
  } catch (error) {
    log(`Failed to connect to database: ${error.message}`, 'prisma');
    return false;
  }
}

// Export the Prisma client 
export default prisma;