import { Pool, neonConfig } from '@neondatabase/serverless';
import { log } from './vite';
import { connectDatabase } from './prisma';
import * as dotenv from 'dotenv';
import ws from 'ws';

// Load environment variables
dotenv.config();

// Configure neon for websocket support
neonConfig.webSocketConstructor = ws;

// Declare database connection variables
export let pool: Pool | null = null;
export let db: any;

// Initialize database connections
export async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    try {
      log('PostgreSQL connection detected, initializing...', 'db');

      // Initialize PostgreSQL pool
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
      
      // Test the pool connection
      const client = await pool.connect();
      client.release();
      log('PostgreSQL pool initialized successfully', 'db');
      
      // Initialize Prisma client
      const prismaConnected = await connectDatabase();
      
      if (prismaConnected) {
        log('Using PostgreSQL storage with Prisma ORM', 'db');
        return true;
      } else {
        log('Failed to connect Prisma to PostgreSQL, falling back to in-memory storage', 'db');
        return false;
      }
    } catch (error) {
      log(`PostgreSQL connection error: ${error.message}`, 'db');
      log('Falling back to in-memory storage', 'db');
      return false;
    }
  } else {
    log('No DATABASE_URL provided, using in-memory storage', 'db');
    return false;
  }
}

export default { pool, initializeDatabase };