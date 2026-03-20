import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
}

/**
 * Validation schema for checkout session creation
 */
const CheckoutSessionSchema = z.object({
  cartItems: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      title: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().int().min(0),
      thumbnail: z.string().nullable().optional(),
      handle: z.string(),
    })
  ),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().min(1),
    country: z.string().min(1),
  }),
  billingAddress: z
    .object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zip: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
  totals: z.object({
    subtotal: z.number().int().min(0),
    tax: z.number().int().min(0),
    shipping: z.number().int().min(0),
    total: z.number().int().min(0),
  }),
  discountCode: z.string().optional(),
});

/**
 * POST /api/checkout/create-session
 * Creates a Stripe checkout session and a backend order
 * Returns the checkout session URL for the frontend to redirect to
 * 
 * @param {NextRequest} req - The request object containing checkout data
 * @returns {Promise<NextResponse>} JSON response with sessionUrl or error
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validated = CheckoutSessionSchema.parse(body);

    const {
      cartItems,
      customerEmail,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      totals,
      discountCode,
    } = validated;

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate discount code and calculate discount if provided
    let discountAmount = 0;
    if (discountCode) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
        const discountResponse = await fetch(
          `${backendUrl}/v1/discounts/${encodeURIComponent(discountCode)}`,
          {
            method: "GET",
            headers: {
              "x-api-key": process.env.API_KEY || "",
            },
          }
        );

        if (discountResponse.ok) {
          const discountData = await discountResponse.json();
          // Discount validation would happen at backend
          // For now, assume backend validates and passes discount info
        }
      } catch (error) {
        console.warn("Could not validate discount code:", error);
        // Continue without discount if validation fails
      }
    }

    // Create order via backend API
    let medusaOrderId: string;
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const orderResponse = await fetch(`${backendUrl}/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY || "",
        },
        body: JSON.stringify({
          email: customerEmail,
          customer_name: customerName,
          customer_phone: customerPhone,
          shipping_address: {
            address_1: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zip,
            country_code: shippingAddress.country,
          },
          billing_address: billingAddress
            ? {
                address_1: billingAddress.street,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.zip,
                country_code: billingAddress.country,
              }
            : undefined,
          items: cartItems.map((item) => ({
            variant_id: item.variantId,
            variant_title: item.title,
            product_title: item.title,
            sku: item.productId,
            quantity: item.quantity,
            unit_price: item.price,
          })),
          totals: {
            subtotal: totals.subtotal,
            tax: totals.tax,
            shipping: totals.shipping,
            total: totals.total,
            discount_total: discountAmount,
          },
          discount_code: discountCode,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", errorData);
        return NextResponse.json(
          { error: "Failed to create order. Please try again." },
          { status: 500 }
        );
      }

      const orderData = await orderResponse.json();
      medusaOrderId = orderData.data?.id || orderData.orderId;

      if (!medusaOrderId) {
        throw new Error("No order ID returned");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      return NextResponse.json(
        { error: "Failed to create order. Please try again." },
        { status: 500 }
      );
    }

    // Build line items for Stripe, including products, tax, and shipping
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.thumbnail ? [item.thumbnail] : undefined,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    // Add tax as separate line item if applicable
    if (totals.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax",
          },
          unit_amount: totals.tax,
        },
        quantity: 1,
      });
    }

    // Add shipping as separate line item if applicable
    if (totals.shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: totals.shipping,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${medusaOrderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/shop/checkout/cancelled`,
      metadata: {
        medusaOrderId,
        customerName,
        discountCode: discountCode || "",
      },
    });

    if (!session.url) {
      throw new Error("No checkout URL generated");
    }

    return NextResponse.json(
      { url: session.url, sessionId: session.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout session creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
