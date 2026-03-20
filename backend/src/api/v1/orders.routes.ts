import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { OrderService } from "../../services/order.service";
import { DiscountService } from "../../services/discount.service";

const router = Router();
const orderService = new OrderService(prisma);
const discountService = new DiscountService(prisma);

/**
 * Validation schema for order creation
 */
const CreateOrderSchema = z.object({
  email: z.string().email(),
  customer_name: z.string().min(1),
  customer_phone: z.string().optional(),
  shipping_address: z.object({
    address_1: z.string().min(1),
    city: z.string().min(1),
    postal_code: z.string().min(1),
    country_code: z.string().min(1),
    state: z.string().optional(),
    address_2: z.string().optional(),
  }),
  billing_address: z
    .object({
      address_1: z.string().min(1),
      city: z.string().min(1),
      postal_code: z.string().min(1),
      country_code: z.string().min(1),
      state: z.string().optional(),
      address_2: z.string().optional(),
    })
    .optional(),
  items: z.array(
    z.object({
      variant_id: z.string(),
      variant_title: z.string(),
      product_title: z.string(),
      sku: z.string().optional(),
      quantity: z.number().int().min(1),
      unit_price: z.number().int().min(0), // in cents
    })
  ),
  totals: z.object({
    subtotal: z.number().int().min(0),
    tax: z.number().int().min(0),
    shipping: z.number().int().min(0),
    total: z.number().int().min(0),
    discount_total: z.number().int().min(0).optional(),
  }),
  discount_code: z.string().optional(),
  stripe_session_id: z.string().optional(),
});

/**
 * POST /v1/orders
 * Creates an order with customer information and persists to PostgreSQL.
 * 
 * @route POST /v1/orders
 * @param {Object} req.body - Order data
 * @returns {Object} Created order data with ID
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validated = CreateOrderSchema.parse(req.body);

    // Validate discount code if provided
    let discountAmount = 0;
    if (validated.discount_code) {
      const discount = await discountService.validateDiscount(
        validated.discount_code,
        validated.totals.subtotal,
        validated.items.map((i) => i.variant_id)
      );

      if (discount) {
        discountAmount = discountService.calculateDiscountAmount(
          discount,
          validated.totals.subtotal
        );
      }
    }

    // Create order in database
    const order = await orderService.createOrder({
      email: validated.email,
      customerName: validated.customer_name,
      customerPhone: validated.customer_phone,
      shippingAddress: {
        address1: validated.shipping_address.address_1,
        address2: validated.shipping_address.address_2,
        city: validated.shipping_address.city,
        state: validated.shipping_address.state || "",
        postalCode: validated.shipping_address.postal_code,
        countryCode: validated.shipping_address.country_code,
      },
      billingAddress: validated.billing_address
        ? {
            address1: validated.billing_address.address_1,
            address2: validated.billing_address.address_2,
            city: validated.billing_address.city,
            state: validated.billing_address.state || "",
            postalCode: validated.billing_address.postal_code,
            countryCode: validated.billing_address.country_code,
          }
        : undefined,
      items: validated.items.map((item) => ({
        variantId: item.variant_id,
        variantTitle: item.variant_title,
        productTitle: item.product_title,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      })),
      subtotal: validated.totals.subtotal,
      tax: validated.totals.tax,
      shipping: validated.totals.shipping,
      discountTotal: discountAmount,
      stripeSessionId: validated.stripe_session_id,
    });

    // Apply discount if valid
    if (validated.discount_code && discountAmount > 0) {
      const discount = await discountService.getDiscountByCode(
        validated.discount_code
      );
      if (discount) {
        await discountService.applyDiscountToOrder(
          order.id,
          validated.discount_code,
          discount,
          discountAmount
        );
      }
    }

    res.status(201).json({
      success: true,
      data: {
        id: order.id,
        email: order.email,
        customer_name: order.customerName,
        status: order.status,
        total: order.total,
        created_at: order.createdAt.toISOString(),
      },
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        issues: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create order",
    });
  }
});

/**
 * GET /v1/orders/:orderId
 * Retrieves order details from database
 * 
 * @route GET /v1/orders/:orderId
 * @param {string} req.params.orderId - Order ID
 * @returns {Object} Order data
 */
router.get("/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve order",
    });
  }
});

/**
 * GET /v1/customers/:email/orders
 * Retrieves all orders for a customer
 * 
 * @route GET /v1/customers/:email/orders
 * @param {string} req.params.email - Customer email
 * @returns {Array} Array of customer orders
 */
router.get("/customer/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const orders = await orderService.getOrdersByCustomerEmail(
      email,
      limit,
      offset
    );
    const count = await orderService.countOrdersByCustomerEmail(email);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total: count,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Order retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve customer orders",
    });
  }
});

/**
 * PATCH /v1/orders/:orderId
 * Updates order status (e.g., mark as paid after Stripe webhook)
 * 
 * @route PATCH /v1/orders/:orderId
 * @param {string} req.params.orderId - Order ID
 * @param {Object} req.body - Update data (status, payment_status, external_id, etc.)
 * @returns {Object} Updated order data
 */
router.patch("/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, payment_status, external_id, notes } = req.body;

    const order = await orderService.updateOrder(orderId, {
      status,
      paymentStatus: payment_status,
      externalId: external_id,
      notes,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Order update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order",
    });
  }
});

/**
 * POST /v1/orders/:orderId/confirm
 * Confirms an order (marks as paid)
 * 
 * @route POST /v1/orders/:orderId/confirm
 * @param {string} req.params.orderId - Order ID
 * @param {Object} req.body - Optional external_id (Medusa/Stripe order ID)
 * @returns {Object} Confirmed order data
 */
router.post("/:orderId/confirm", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { external_id } = req.body;

    const order = await orderService.confirmOrder(orderId, external_id);

    res.status(200).json({
      success: true,
      data: order,
      message: "Order confirmed successfully",
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to confirm order",
    });
  }
});

/**
 * POST /v1/orders/:orderId/cancel
 * Cancels an order
 * 
 * @route POST /v1/orders/:orderId/cancel
 * @param {string} req.params.orderId - Order ID
 * @param {Object} req.body - Optional notes (cancellation reason)
 * @returns {Object} Cancelled order data
 */
router.post("/:orderId/cancel", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { notes } = req.body;

    const order = await orderService.cancelOrder(orderId, notes);

    res.status(200).json({
      success: true,
      data: order,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    console.error("Order cancellation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to cancel order",
    });
  }
});

export { router as ordersRoutes };
