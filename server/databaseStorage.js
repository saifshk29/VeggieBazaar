import { eq, and, desc } from 'drizzle-orm';
import { db } from './db.js';
import { 
  admins, 
  products, 
  orders, 
  orderItems,
  orderStatusEnum
} from '../shared/schema.js';

// Database storage implementation that maintains the same interface as MemStorage
export class DatabaseStorage {
  
  constructor() {
    console.log("Initializing DatabaseStorage with PostgreSQL...");
  }

  // Admin methods
  async getAdmin(id) {
    try {
      const [admin] = await db.select().from(admins).where(eq(admins.id, id));
      return admin || undefined;
    } catch (error) {
      console.error("Error in getAdmin:", error);
      throw error;
    }
  }

  async getAdminByUsername(username) {
    try {
      const [admin] = await db.select().from(admins).where(eq(admins.username, username));
      return admin || undefined;
    } catch (error) {
      console.error("Error in getAdminByUsername:", error);
      throw error;
    }
  }

  async createAdmin(admin) {
    try {
      const [newAdmin] = await db.insert(admins).values(admin).returning();
      return newAdmin;
    } catch (error) {
      console.error("Error in createAdmin:", error);
      throw error;
    }
  }

  // Product methods
  async getProducts() {
    try {
      return await db.select().from(products);
    } catch (error) {
      console.error("Error in getProducts:", error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product || undefined;
    } catch (error) {
      console.error("Error in getProduct:", error);
      throw error;
    }
  }

  async createProduct(product) {
    try {
      const [newProduct] = await db.insert(products).values(product).returning();
      return newProduct;
    } catch (error) {
      console.error("Error in createProduct:", error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const [updatedProduct] = await db
        .update(products)
        .set(productData)
        .where(eq(products.id, id))
        .returning();
      
      return updatedProduct || undefined;
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      
      return deleted.length > 0;
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      throw error;
    }
  }

  // Order methods
  async getOrders() {
    try {
      const allOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt));
      
      // Enrich each order with its items
      const enrichedOrders = [];
      for (const order of allOrders) {
        const enriched = await this.enrichOrderWithItems(order);
        enrichedOrders.push(enriched);
      }
      
      return enrichedOrders;
    } catch (error) {
      console.error("Error in getOrders:", error);
      throw error;
    }
  }

  async getOrder(id) {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      
      if (!order) {
        return undefined;
      }
      
      return await this.enrichOrderWithItems(order);
    } catch (error) {
      console.error("Error in getOrder:", error);
      throw error;
    }
  }

  async getOrderByOrderId(orderId) {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
      
      if (!order) {
        return undefined;
      }
      
      return await this.enrichOrderWithItems(order);
    } catch (error) {
      console.error("Error in getOrderByOrderId:", error);
      throw error;
    }
  }

  async createOrder(orderData, items) {
    try {
      // Start a transaction to ensure all operations succeed or fail together
      return await db.transaction(async (tx) => {
        // Create the order
        const [order] = await tx
          .insert(orders)
          .values(orderData)
          .returning();

        // Create all order items
        const orderItemValues = items.map(item => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity
        }));

        await tx.insert(orderItems).values(orderItemValues);

        // Return the full order with items
        return await this.enrichOrderWithItems(order);
      });
    } catch (error) {
      console.error("Error in createOrder:", error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      if (!Object.values(orderStatusEnum.enum).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      const [updatedOrder] = await db
        .update(orders)
        .set({ status })
        .where(eq(orders.orderId, orderId))
        .returning();

      if (!updatedOrder) {
        return undefined;
      }

      return await this.enrichOrderWithItems(updatedOrder);
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      throw error;
    }
  }

  // Helper method to add items to an order
  async enrichOrderWithItems(order) {
    try {
      // Get all order items for this order
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      // For each item, get the product details
      const itemsWithProducts = [];
      let total = 0;

      for (const item of items) {
        const [product] = await db
          .select()
          .from(products)
          .where(eq(products.id, item.productId));

        if (product) {
          itemsWithProducts.push({
            ...item,
            product
          });

          // Calculate the subtotal for this item
          total += parseFloat(product.price) * item.quantity;
        }
      }

      // Return the order with its items and total
      return {
        ...order,
        items: itemsWithProducts,
        total
      };
    } catch (error) {
      console.error("Error in enrichOrderWithItems:", error);
      throw error;
    }
  }

  // Initialize the database with seed data if needed
  async seedDatabase() {
    try {
      // Check if we have any products
      const existingProducts = await db.select().from(products);
      
      if (existingProducts.length === 0) {
        console.log("Seeding database with initial products...");
        
        // Seed some initial products
        const seedProducts = [
          { name: "Tomatoes", category: "Vegetable", price: "45", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1588391990846-dd96ba847bc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
          { name: "Potatoes", category: "Vegetable", price: "30", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
          { name: "Onions", category: "Vegetable", price: "35", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
          { name: "Apples", category: "Fruit", price: "120", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
          { name: "Bananas", category: "Fruit", price: "50", unit: "dozen", imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
          { name: "Carrots", category: "Vegetable", price: "60", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
        ];
        
        await db.insert(products).values(seedProducts);
        console.log("Database seeded successfully with products.");
      }
      
      // Check if we have any admins
      const existingAdmins = await db.select().from(admins);
      
      if (existingAdmins.length === 0) {
        console.log("Creating default admin account...");
        
        // Create a default admin account
        await db.insert(admins).values({
          username: "admin",
          password: "admin123" // In a real app, this should be hashed
        });
        
        console.log("Default admin account created.");
      }
      
      return true;
    } catch (error) {
      console.error("Error in seedDatabase:", error);
      return false;
    }
  }

  // Helper method to generate a unique order ID
  generateOrderId() {
    const prefix = "ORD";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}