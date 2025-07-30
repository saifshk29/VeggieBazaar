import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import type { Admin } from "@prisma/client";

// Extend express-session to add admin to the session data
declare module "express-session" {
  interface SessionData {
    admin: Omit<Admin, "password">;
  }
}

// Zod Schemas for validation
const insertProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number(),
  unit: z.string(),
  imageUrl: z.string().optional(),
});

const insertOrderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive(),
});

const insertOrderSchema = z.object({
  customerName: z.string(),
  customerPhone: z.string(),
  customerAddress: z.string(),
  city: z.string(),
  pincode: z.string(),
});

const orderStatusEnum = z.enum(["pending", "in_progress", "delivered"]);

// Setup session middleware
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup sessions
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // Prune expired entries every 24h
      }),
    })
  );

  // Custom middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.session.admin) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // API Routes
  const apiRouter = express.Router();
  
  // Health check
  apiRouter.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Admin login
  apiRouter.post("/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set admin in session
      req.session.admin = { id: admin.id, username: admin.username };
      
      res.json({ 
        message: "Login successful",
        admin: { id: admin.id, username: admin.username }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  });

  // Admin logout
  apiRouter.post("/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Admin session check
  apiRouter.get("/admin/session", (req, res) => {
    if (req.session.admin) {
      res.json({ 
        isAuthenticated: true, 
        admin: req.session.admin 
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // Product endpoints
  apiRouter.get("/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  apiRouter.get("/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  apiRouter.post("/products", isAuthenticated, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: result.error.format() 
        });
      }

      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });

  apiRouter.put("/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Partial validation for update
      const productSchema = insertProductSchema.partial();
      const result = productSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: result.error.format() 
        });
      }

      const product = await storage.updateProduct(productId, result.data);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Error updating product" });
    }
  });

  apiRouter.delete("/products/:id", isAuthenticated, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await storage.deleteProduct(productId);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Order endpoints
  apiRouter.get("/orders", isAuthenticated, async (_req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  apiRouter.get("/orders/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await storage.getOrderByOrderId(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // Place order
  apiRouter.post("/orders", async (req, res) => {
    try {
      // Validate order
      const orderSchema = insertOrderSchema.extend({
        items: z.array(insertOrderItemSchema).min(1),
      });

      const result = orderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid order data", 
          errors: result.error.format() 
        });
      }

      const { items, ...orderData } = result.data;
      const order = await storage.createOrder(orderData, items);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
    }
  });

  // Update order status
  apiRouter.put("/orders/:orderId/status", isAuthenticated, async (req, res) => {
    try {
      const orderId = req.params.orderId;
      
      const statusSchema = z.object({
        status: orderStatusEnum,
      });

      const result = statusSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid status", 
          errors: result.error.format() 
        });
      }

      const order = await storage.updateOrderStatus(orderId, result.data.status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Error updating order status" });
    }
  });

  // Register API router with prefix
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
