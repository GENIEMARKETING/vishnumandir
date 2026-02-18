import { revalidatePath } from "next/cache";
import crypto from "crypto";

interface WebhookPayload {
  event: string;
  data: {
    product_id: string;
    product_title: string;
    product_handle: string;
    vendor_tags: Array<{ value: string }>;
  };
  timestamp: string;
}

/**
 * POST /api/webhooks/medusa
 * Receives product change events from Medusa backend and revalidates frontend pages
 * Verifies webhook signature for security before processing
 */
export async function POST(request: Request) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.MEDUSA_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[webhook/medusa] MEDUSA_WEBHOOK_SECRET not configured");
      return Response.json(
        { success: false, error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get signature from headers
    const signature = request.headers.get("x-medusa-signature");
    if (!signature) {
      console.warn("[webhook/medusa] Missing x-medusa-signature header");
      return Response.json(
        { success: false, error: "Missing signature" },
        { status: 401 }
      );
    }

    // Read raw body for signature verification
    const body = await request.text();

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("[webhook/medusa] Invalid webhook signature");
      return Response.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse payload
    const payload: WebhookPayload = JSON.parse(body);

    const { event, data } = payload;

    console.info(`[webhook/medusa] Received ${event} for product: ${data.product_title}`);

    // Revalidate shop pages
    const pathsToRevalidate = ["/shop", "/shop/vendors"];

    // Add vendor-specific pages if product has vendor tags
    if (data.vendor_tags && data.vendor_tags.length > 0) {
      data.vendor_tags.forEach((tag) => {
        const vendorSlug = tag.value.replace("vendor:", "");
        if (vendorSlug) {
          pathsToRevalidate.push(`/shop/vendor/${vendorSlug}`);
        }
      });
    }

    // Also revalidate all vendor pages with wildcard
    pathsToRevalidate.push("/shop/vendor");

    // Revalidate paths
    for (const path of pathsToRevalidate) {
      try {
        revalidatePath(path);
        console.info(`[webhook/medusa] Revalidated path: ${path}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[webhook/medusa] Failed to revalidate ${path}: ${message}`);
      }
    }

    return Response.json({
      success: true,
      message: `Webhook processed for event: ${event}`,
      product: {
        id: data.product_id,
        title: data.product_title,
        handle: data.product_handle,
      },
      revalidatedPaths: pathsToRevalidate,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[webhook/medusa] Error processing webhook: ${message}`);

    return Response.json(
      {
        success: false,
        error: "Failed to process webhook",
        details: message,
      },
      { status: 500 }
    );
  }
}
