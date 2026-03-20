import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for payment confirmations
 * Verifies webhook signature, updates order status, and sends confirmation email
 * 
 * @param {NextRequest} req - The webhook request from Stripe
 * @returns {Promise<NextResponse>} 200 OK on success, 400 on error
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing Stripe signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const medusaOrderId = session.metadata?.medusaOrderId;
        const customerName = session.metadata?.customerName;
        const customerEmail = session.customer_email;

        if (!medusaOrderId || !customerEmail) {
          console.error("Missing order ID or customer email in webhook");
          return NextResponse.json(
            { error: "Missing required metadata" },
            { status: 400 }
          );
        }

        // Update order status to paid via backend API
        try {
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
          const updateResponse = await fetch(
            `${backendUrl}/v1/orders/${medusaOrderId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.API_KEY || "",
              },
              body: JSON.stringify({
                payment_status: "paid",
                status: "completed",
              }),
            }
          );

          if (!updateResponse.ok) {
            console.error("Failed to update order status:", updateResponse.status);
          }
        } catch (error) {
          console.error("Error updating order:", error);
          // Don't throw - we still want to send the confirmation email
        }

        // Send order confirmation email
        try {
          await sendOrderConfirmationEmail({
            email: customerEmail,
            name: customerName || "Customer",
            orderId: medusaOrderId,
            amount: session.amount_total || 0,
          });
        } catch (error) {
          console.error("Failed to send confirmation email:", error);
          // Don't throw - order was still created successfully
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const medusaOrderId = session.metadata?.medusaOrderId;

        if (medusaOrderId) {
          console.log(`Checkout session expired for order ${medusaOrderId}`);
          // Optionally mark order as cancelled or pending
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Send order confirmation email via Resend
 * 
 * @param {Object} options - Email options
 * @param {string} options.email - Customer email address
 * @param {string} options.name - Customer name
 * @param {string} options.orderId - Medusa order ID
 * @param {number} options.amount - Order amount in cents
 */
async function sendOrderConfirmationEmail({
  email,
  name,
  orderId,
  amount,
}: {
  email: string;
  name: string;
  orderId: string;
  amount: number;
}) {
  const amountInDollars = (amount / 100).toFixed(2);

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #EA580C;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #EA580C;
            margin: 0;
          }
          .content {
            margin-bottom: 30px;
          }
          .order-details {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: 600;
            color: #555;
          }
          .detail-value {
            color: #333;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            color: #EA580C;
          }
          .footer {
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
            margin-top: 30px;
          }
          .button {
            display: inline-block;
            background-color: #EA580C;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Order Confirmation</h1>
            <p>Thank you for your purchase from Vishnu Mandir, Tampa</p>
          </div>

          <div class="content">
            <p>Dear ${name},</p>
            <p>Your payment has been received successfully! Your order has been confirmed and is being processed.</p>

            <div class="order-details">
              <div class="detail-row">
                <span class="detail-label">Order ID:</span>
                <span class="detail-value">${orderId.slice(0, 20)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Order Amount:</span>
                <span class="detail-value">$${amountInDollars}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${new Date().toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estimated Delivery:</span>
                <span class="detail-value">5-7 Business Days</span>
              </div>
            </div>

            <h3>What's Next?</h3>
            <p>Your order is being prepared for shipment. You will receive a tracking number via email within 24 hours.</p>

            <h3>Need Help?</h3>
            <p>If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:info@vishnumandirtampa.org">info@vishnumandirtampa.org</a></p>
          </div>

          <div class="footer">
            <p>© 2026 Vishnu Mandir, Tampa. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await resend.emails.send({
    from: process.env.SENDER_EMAIL_ADDRESS || "no-reply@vishnumandirtampa.com",
    to: email,
    subject: "Order Confirmation - Vishnu Mandir, Tampa",
    html: emailHtml,
  });
}
