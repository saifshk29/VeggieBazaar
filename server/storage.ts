import { db } from './db';
import type { Admin, Product, Order, OrderItem, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Types that were previously in the Drizzle schema
export type OrderStatus = "pending" | "in_progress" | "delivered";

// This is the type returned by Prisma when including relations
type OrderWithItemsFromDB = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
}

// This is the final type we want to return from our storage layer, with the total calculated
export type OrderWithItems = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
  total: number;
};

// Redefine Insert types for clarity, using Prisma's generated types
type InsertAdmin = Prisma.AdminCreateInput;
type InsertProduct = Prisma.ProductCreateInput;
type InsertOrder = Omit<Prisma.OrderCreateInput, 'orderItems' | 'orderId'>;


// Storage interface
export interface IStorage {
  // Admin methods
  getAdmin(id: number): Promise<Admin | null>;
  getAdminByUsername(username: string): Promise<Admin | null>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | null>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Prisma.ProductUpdateInput): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<OrderWithItems[]>;
  getOrder(id: number): Promise<OrderWithItems | null>;
  getOrderByOrderId(orderId: string): Promise<OrderWithItems | null>;
  createOrder(order: InsertOrder, items: { productId: number; quantity: number }[]): Promise<OrderWithItems>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderWithItems | null>;
}

export class PrismaStorage implements IStorage {
  // Admin methods
  async getAdmin(id: number): Promise<Admin | null> {
    return db.admin.findUnique({ where: { id } });
  }

  async getAdminByUsername(username: string): Promise<Admin | null> {
    return db.admin.findUnique({ where: { username } });
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    return db.admin.create({ data: admin });
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.product.findMany();
  }

  async getProduct(id: number): Promise<Product | null> {
    return db.product.findUnique({ where: { id } });
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    return db.product.create({ data: product });
  }

  async updateProduct(id: number, product: Prisma.ProductUpdateInput): Promise<Product | null> {
    return db.product.update({ where: { id }, data: product });
  }

  async deleteProduct(id: number): Promise<boolean> {
    await db.product.delete({ where: { id } });
    return true;
  }

  // Order methods
  async getOrders(): Promise<OrderWithItems[]> {
    const orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return orders.map(this.enrichOrderWithItems);
  }

  async getOrder(id: number): Promise<OrderWithItems | null> {
    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return order ? this.enrichOrderWithItems(order) : null;
  }

  async getOrderByOrderId(orderId: string): Promise<OrderWithItems | null> {
    const order = await db.order.findUnique({
      where: { orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return order ? this.enrichOrderWithItems(order) : null;
  }

  async createOrder(orderData: InsertOrder, items: { productId: number; quantity: number }[]): Promise<OrderWithItems> {
    const products = await db.product.findMany({
      where: { id: { in: items.map(i => i.productId) } },
    });

    const order = await db.order.create({
      data: {
        ...orderData,
        orderId: `FB-${String(Date.now()).slice(-5)}`,
        orderItems: {
          create: items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
              throw new Error(`Product with id ${item.productId} not found`);
            }
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return this.enrichOrderWithItems(order);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderWithItems | null> {
    const order = await db.order.update({
      where: { orderId },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return order ? this.enrichOrderWithItems(order) : null;
  }

  // Helper method to enrich order with items and calculate total
  private enrichOrderWithItems(order: OrderWithItemsFromDB): OrderWithItems {
    // Calculate total
    const total = order.orderItems.reduce((sum, item) => {
      // Prisma's Decimal type needs to be converted to a number for arithmetic
      const price = item.price.toNumber();
      const quantity = new Decimal(item.quantity).toNumber();
      return sum + (price * quantity);
    }, 0);

    return {
      ...order,
      total
    };
  }
}

export const storage = new PrismaStorage();
