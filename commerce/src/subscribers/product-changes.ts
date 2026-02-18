import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

interface ProductEventData {
  id: string;
  title: string;
  handle: string;
  tags?: Array<{ value: string }>;
}

/**
 * Subscriber that listens to product events and triggers frontend webhook
 * to revalidate shop pages instantly when products are created/updated/deleted
 * @param event - Event containing product data
 * @param container - Medusa container
 */
export default async function handleProductChanges({
  event: { data, name },
}: SubscriberArgs<ProductEventData>) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const webhookSecret = process.env.MEDUSA_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn(
        "[product-changes] MEDUSA_WEBHOOK_SECRET not configured. Skipping webhook call."
      );
      return;
    }

    const webhookPayload = {
      event: name,
      data: {
        product_id: data.id,
        product_title: data.title,
        product_handle: data.handle,
        vendor_tags:
          data.tags?.filter((t) => t.value.startsWith("vendor:")) || [],
      },
      timestamp: new Date().toISOString(),
    };

    // Generate webhook signature for security verification
    const signature = generateSignature(
      JSON.stringify(webhookPayload),
      webhookSecret
    );

    const response = await fetch(`${frontendUrl}/api/webhooks/medusa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-medusa-signature": signature,
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      console.error(
        `[product-changes] Webhook call failed: ${response.status} ${response.statusText}`
      );
    } else {
      console.info(
        `[product-changes] Webhook delivered successfully for product: ${data.title} (${name})`
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[product-changes] Error calling webhook: ${message}`);
    // Don't throw - webhook failures shouldn't break product operations
  }
}

// Subscriber configuration for all product events
export const config: SubscriberConfig = {
  event: ["product.created", "product.updated", "product.deleted"],
};

/**
 * Generate HMAC-SHA256 signature for webhook verification
 * @param payload - JSON payload to sign
 * @param secret - Secret key for HMAC
 * @returns Hex-encoded HMAC-SHA256 signature
 */
function generateSignature(payload: string, secret: string): string {
  const crypto = require("crypto");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}
