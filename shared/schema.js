import { pgTable, text, serial, integer, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAdminSchema = createInsertSchema(admins).pick({
  username: true,
  password: true,
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price").notNull(),
  unit: text("unit").notNull(),
  imageUrl: text("image_url"),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  category: true,
  price: true,
  unit: true,
  imageUrl: true,
});

// Order status enum
export const orderStatusEnum = z.enum(["pending", "in_progress", "delivered"]);

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(), // Unique order ID like FB-12345
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  city: text("city").notNull(),
  pincode: text("pincode").notNull(),
  status: text("status").notNull().$defaultFn(() => "pending"), // Default status is pending
  createdAt: timestamp("created_at").notNull().$defaultFn(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  customerName: true,
  customerPhone: true,
  customerAddress: true,
  city: true,
  pincode: true,
});

// Order items table for many-to-many relationship
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: numeric("quantity").notNull(),
  price: numeric("price").notNull(), // Store price at the time of order
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  productId: true,
  quantity: true,
});