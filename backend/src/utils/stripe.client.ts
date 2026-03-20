import Stripe from "stripe";

const apiVersion = process.env.STRIPE_API_VERSION || "2025-02-24.acacia";

let stripeInstance: Stripe | null = null;

/**
 * Get Stripe client instance (lazy initialization).
 * Only creates Stripe instance when first accessed.
 * Throws error if STRIPE_SECRET_KEY is not configured.
 */
function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey || !apiKey.trim()) {
      throw new Error(
        "STRIPE_SECRET_KEY is not configured. Please set STRIPE_SECRET_KEY in your .env file."
      );
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: apiVersion as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeInstance;
}

/**
 * Stripe client singleton (lazy-loaded).
 * Access via getter to ensure initialization only when needed.
 * Uses Proxy pattern to intercept property access and initialize on first use.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe];
  },
});
