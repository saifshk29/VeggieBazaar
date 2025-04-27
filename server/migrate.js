import { db } from './db.js';
import * as schema from '../shared/schema.js';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

// Apply migrations to the database
export async function runMigrations() {
  try {
    console.log("Starting database migrations...");
    
    // Push the schema to the database
    await db.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price TEXT NOT NULL,
        unit TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        description TEXT
      );
      
      CREATE TYPE order_status AS ENUM ('pending', 'in_progress', 'delivered');
      
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        orderId TEXT NOT NULL UNIQUE,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        deliveryAddress TEXT NOT NULL,
        status order_status NOT NULL DEFAULT 'pending',
        createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        orderId INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        productId INTEGER NOT NULL REFERENCES products(id),
        quantity TEXT NOT NULL,
        price TEXT NOT NULL
      );
    `);
    
    console.log("Database migrations completed successfully.");
    return true;
  } catch (error) {
    console.error("Error during migrations:", error);
    return false;
  }
}