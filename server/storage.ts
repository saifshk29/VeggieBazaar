import { 
  admins, Admin, InsertAdmin, 
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  OrderWithItems, OrderStatus 
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<OrderWithItems[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  getOrderByOrderId(orderId: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: { productId: number; quantity: number }[]): Promise<OrderWithItems>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderWithItems | undefined>;
}

export class MemStorage implements IStorage {
  private admins: Map<number, Admin>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private currentAdminId: number;
  private currentProductId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private orderCounter: number; // For generating unique order IDs

  constructor() {
    this.admins = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.currentAdminId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.orderCounter = 1;

    // Create default admin
    this.createAdmin({
      username: "admin",
      password: "admin123",
    });

    // Add some sample products
    this.seedProducts();
  }

  private seedProducts() {
    const sampleProducts: InsertProduct[] = [
      { name: "Tomatoes", category: "Vegetable", price: "45", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1588391990846-dd96ba847bc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Potatoes", category: "Vegetable", price: "30", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Onions", category: "Vegetable", price: "35", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Apples", category: "Fruit", price: "120", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1528825871115-3581a5387919?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Bananas", category: "Fruit", price: "50", unit: "dozen", imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
      { name: "Carrots", category: "Vegetable", price: "60", unit: "kg", imageUrl: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Generate a unique order ID like FB-12345
  private generateOrderId(): string {
    const paddedCounter = String(this.orderCounter++).padStart(5, '0');
    return `FB-${paddedCounter}`;
  }

  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const id = this.currentAdminId++;
    const newAdmin: Admin = { ...admin, id };
    this.admins.set(id, newAdmin);
    return newAdmin;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrders(): Promise<OrderWithItems[]> {
    const orders = Array.from(this.orders.values());
    return Promise.all(orders.map(order => this.enrichOrderWithItems(order)));
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) {
      return undefined;
    }
    return this.enrichOrderWithItems(order);
  }

  async getOrderByOrderId(orderId: string): Promise<OrderWithItems | undefined> {
    const order = Array.from(this.orders.values()).find(
      (order) => order.orderId === orderId,
    );
    if (!order) {
      return undefined;
    }
    return this.enrichOrderWithItems(order);
  }

  async createOrder(orderData: InsertOrder, items: { productId: number; quantity: number }[]): Promise<OrderWithItems> {
    // Create order
    const id = this.currentOrderId++;
    const orderId = this.generateOrderId();
    const order: Order = { 
      ...orderData, 
      id, 
      orderId,
      status: "pending",
      createdAt: new Date()
    };
    this.orders.set(id, order);

    // Create order items
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        const orderItemId = this.currentOrderItemId++;
        const orderItem: OrderItem = {
          id: orderItemId,
          orderId: id,
          productId: item.productId,
          quantity: item.quantity.toString(),
          price: product.price,
        };
        this.orderItems.set(orderItemId, orderItem);
      }
    }

    return this.enrichOrderWithItems(order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderWithItems | undefined> {
    const order = Array.from(this.orders.values()).find(
      (order) => order.orderId === orderId,
    );
    if (!order) {
      return undefined;
    }

    const updatedOrder = { ...order, status };
    this.orders.set(order.id, updatedOrder);
    return this.enrichOrderWithItems(updatedOrder);
  }

  // Helper method to enrich order with items
  private async enrichOrderWithItems(order: Order): Promise<OrderWithItems> {
    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === order.id)
      .map(item => {
        const product = this.products.get(item.productId);
        return {
          ...item,
          product: product!,
        };
      });

    // Calculate total
    const total = items.reduce((sum, item) => {
      return sum + (Number(item.price) * Number(item.quantity));
    }, 0);

    return {
      ...order,
      items,
      total
    };
  }
}

export const storage = new MemStorage();
