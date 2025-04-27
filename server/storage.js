import { 
  admins,
  products,
  orders,
  orderItems,
  orderStatusEnum
} from "@shared/schema";

// Storage interface
export class MemStorage {
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

  seedProducts() {
    const sampleProducts = [
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
  generateOrderId() {
    const paddedCounter = String(this.orderCounter++).padStart(5, '0');
    return `FB-${paddedCounter}`;
  }

  // Admin methods
  async getAdmin(id) {
    return this.admins.get(id);
  }

  async getAdminByUsername(username) {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(admin) {
    const id = this.currentAdminId++;
    const newAdmin = { ...admin, id };
    this.admins.set(id, newAdmin);
    return newAdmin;
  }

  // Product methods
  async getProducts() {
    return Array.from(this.products.values());
  }

  async getProduct(id) {
    return this.products.get(id);
  }

  async createProduct(product) {
    const id = this.currentProductId++;
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id, product) {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id) {
    return this.products.delete(id);
  }

  // Order methods
  async getOrders() {
    const orders = Array.from(this.orders.values());
    return Promise.all(orders.map(order => this.enrichOrderWithItems(order)));
  }

  async getOrder(id) {
    const order = this.orders.get(id);
    if (!order) {
      return undefined;
    }
    return this.enrichOrderWithItems(order);
  }

  async getOrderByOrderId(orderId) {
    const order = Array.from(this.orders.values()).find(
      (order) => order.orderId === orderId,
    );
    if (!order) {
      return undefined;
    }
    return this.enrichOrderWithItems(order);
  }

  async createOrder(orderData, items) {
    // Create order
    const id = this.currentOrderId++;
    const orderId = this.generateOrderId();
    const order = { 
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
        const orderItem = {
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

  async updateOrderStatus(orderId, status) {
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
  async enrichOrderWithItems(order) {
    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === order.id)
      .map(item => {
        const product = this.products.get(item.productId);
        return {
          ...item,
          product: product,
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