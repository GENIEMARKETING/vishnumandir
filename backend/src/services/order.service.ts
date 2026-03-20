import { PrismaClient } from "@prisma/client";
import { Order, OrderItem, ShippingAddress, BillingAddress, OrderStatus } from "@prisma/client";

interface CreateOrderInput {
  email: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
  };
  billingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
  };
  items: Array<{
    variantId: string;
    variantTitle: string;
    productTitle: string;
    sku?: string;
    quantity: number;
    unitPrice: number; // in cents
  }>;
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  discountTotal?: number; // in cents
  stripeSessionId?: string;
}

interface UpdateOrderInput {
  status?: OrderStatus;
  paymentStatus?: string;
  externalId?: string;
  notes?: string;
}

/**
 * Order service for creating and managing orders.
 * Integrates with Medusa backend and PostgreSQL database for order tracking.
 */
export class OrderService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create a new order in the database.
   * In a full Medusa integration, this would also call Medusa's Order API.
   *
   * @param input - Order creation data
   * @returns Created order with all related data
   */
  async createOrder(input: CreateOrderInput): Promise<Order & {
    items: OrderItem[];
    shippingAddress: ShippingAddress | null;
    billingAddress: BillingAddress | null;
  }> {
    // Calculate totals
    const subtotal = input.subtotal;
    const tax = input.tax;
    const shipping = input.shipping;
    const discountTotal = input.discountTotal || 0;
    const total = subtotal + tax + shipping - discountTotal;

    // Create order with related data in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const createdOrder = await tx.order.create({
        data: {
          email: input.email.toLowerCase(),
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          subtotal,
          tax,
          shipping,
          discountTotal,
          total,
          status: OrderStatus.PENDING,
          stripeSessionId: input.stripeSessionId,
          items: {
            create: input.items.map((item) => ({
              variantId: item.variantId,
              variantTitle: item.variantTitle,
              productTitle: item.productTitle,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.unitPrice * item.quantity,
            })),
          },
          shippingAddress: {
            create: {
              address1: input.shippingAddress.address1,
              address2: input.shippingAddress.address2,
              city: input.shippingAddress.city,
              state: input.shippingAddress.state,
              postalCode: input.shippingAddress.postalCode,
              countryCode: input.shippingAddress.countryCode,
            },
          },
          billingAddress: input.billingAddress
            ? {
                create: {
                  address1: input.billingAddress.address1,
                  address2: input.billingAddress.address2,
                  city: input.billingAddress.city,
                  state: input.billingAddress.state,
                  postalCode: input.billingAddress.postalCode,
                  countryCode: input.billingAddress.countryCode,
                },
              }
            : undefined,
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
        },
      });

      return createdOrder;
    });

    return order;
  }

  /**
   * Retrieve an order by ID with all related data.
   * @param orderId - The order ID
   * @returns Order or null if not found
   */
  async getOrderById(
    orderId: string
  ): Promise<
    (Order & {
      items: OrderItem[];
      shippingAddress: ShippingAddress | null;
      billingAddress: BillingAddress | null;
    }) | null
  > {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
  }

  /**
   * Retrieve an order by external ID (e.g., Medusa order ID or Stripe session ID).
   * @param externalId - The external ID
   * @returns Order or null if not found
   */
  async getOrderByExternalId(
    externalId: string
  ): Promise<
    (Order & {
      items: OrderItem[];
      shippingAddress: ShippingAddress | null;
      billingAddress: BillingAddress | null;
    }) | null
  > {
    return this.prisma.order.findUnique({
      where: { externalId },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });
  }

  /**
   * Get all orders for a customer by email.
   * @param email - Customer email
   * @param limit - Maximum number of orders to return
   * @param offset - Number of orders to skip
   * @returns Array of orders
   */
  async getOrdersByCustomerEmail(
    email: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<
    Array<
      Order & {
        items: OrderItem[];
        shippingAddress: ShippingAddress | null;
        billingAddress: BillingAddress | null;
      }
    >
  > {
    return this.prisma.order.findMany({
      where: { email: email.toLowerCase() },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Count all orders for a customer by email.
   * @param email - Customer email
   * @returns Number of orders
   */
  async countOrdersByCustomerEmail(email: string): Promise<number> {
    return this.prisma.order.count({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Update an order status and metadata.
   * @param orderId - The order ID
   * @param input - Fields to update
   * @returns Updated order
   */
  async updateOrder(
    orderId: string,
    input: UpdateOrderInput
  ): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: input,
    });
  }

  /**
   * Update order to mark as confirmed (payment received).
   * @param orderId - The order ID
   * @param externalId - Optional external ID (Medusa/Stripe order ID)
   * @returns Updated order
   */
  async confirmOrder(
    orderId: string,
    externalId?: string
  ): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentStatus: "completed",
        externalId: externalId,
      },
    });
  }

  /**
   * Cancel an order.
   * @param orderId - The order ID
   * @param notes - Optional cancellation reason
   * @returns Updated order
   */
  async cancelOrder(orderId: string, notes?: string): Promise<Order> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCELLED,
        notes,
      },
    });
  }

  /**
   * Get orders by status.
   * @param status - Order status to filter by
   * @param limit - Maximum number of orders
   * @param offset - Number of orders to skip
   * @returns Array of orders
   */
  async getOrdersByStatus(
    status: OrderStatus,
    limit: number = 10,
    offset: number = 0
  ): Promise<
    Array<
      Order & {
        items: OrderItem[];
        shippingAddress: ShippingAddress | null;
        billingAddress: BillingAddress | null;
      }
    >
  > {
    return this.prisma.order.findMany({
      where: { status },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get order statistics for admin dashboard.
   * @returns Statistics object
   */
  async getOrderStatistics(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    totalRevenue: number; // in cents
  }> {
    const [totalOrders, pendingOrders, confirmedOrders] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { status: OrderStatus.CONFIRMED } }),
    ]);

    const result = await this.prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: { status: OrderStatus.CONFIRMED },
    });

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue: result._sum.total || 0,
    };
  }

  /**
   * Get recent orders (for admin dashboard).
   * @param limit - Number of recent orders to return
   * @returns Array of recent orders
   */
  async getRecentOrders(
    limit: number = 10
  ): Promise<
    Array<
      Order & {
        items: OrderItem[];
        shippingAddress: ShippingAddress | null;
        billingAddress: BillingAddress | null;
      }
    >
  > {
    return this.prisma.order.findMany({
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Search orders by customer email or name.
   * @param query - Search query
   * @param limit - Maximum results
   * @returns Array of matching orders
   */
  async searchOrders(
    query: string,
    limit: number = 10
  ): Promise<
    Array<
      Order & {
        items: OrderItem[];
        shippingAddress: ShippingAddress | null;
        billingAddress: BillingAddress | null;
      }
    >
  > {
    return this.prisma.order.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { customerName: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
