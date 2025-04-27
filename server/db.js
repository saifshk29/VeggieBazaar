import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

// Configure WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create database connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Drizzle ORM instance with our schema
export const db = drizzle(pool, { schema });

// Database initialization function
export async function initDatabase() {
  try {
    console.log("Initializing database connection...");
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log(`Database connection successful at ${result.rows[0].now}`);
    
    return true;
  } catch (error) {
    console.error("Database initialization error:", error);
    return false;
  }
}