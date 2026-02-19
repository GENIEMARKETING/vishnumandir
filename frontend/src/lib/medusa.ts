/**
 * Medusa Commerce Store API client utility.
 * Provides type-safe functions to fetch products from Medusa Store API.
 * 
 * The Medusa Store API is public and requires a publishable API key in the header.
 * No authentication needed for product reads.
 */

import type { MedusaProduct, MedusaProductsResponse } from "@/types/medusa";

/**
 * Get Medusa configuration (lazy initialization).
 * Reads environment variables when called, not at module load time.
 */
function getMedusaConfig() {
  return {
    apiUrl: process.env.NEXT_PUBLIC_MEDUSA_API_URL || "http://localhost:9000",
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
  };
}

/**
 * Helper to build headers for Medusa Store API requests.
 * The Store API requires the x-publishable-api-key header.
 */
function getMedusaHeaders(): HeadersInit {
  const config = getMedusaConfig();
  return {
    "Content-Type": "application/json",
    "x-publishable-api-key": config.publishableKey,
  };
}

/**
 * Fetch all products from Medusa Store API.
 * Uses ISR-compatible fetch with revalidation for server-side caching.
 * 
 * @returns Promise with array of products or error
 * @throws Error if API call fails or publishable key is missing
 * 
 * @example
 * const products = await fetchProducts();
 * if (products.ok) {
 *   console.log(products.data.products);
 * } else {
 *   console.error(products.error);
 * }
 */
export async function fetchProducts(): Promise<
  { ok: true; data: MedusaProductsResponse } | { ok: false; error: string }
> {
  try {
    const config = getMedusaConfig();

    if (!config.publishableKey) {
      console.error("[fetchProducts] Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
      return {
        ok: false,
        error: "Medusa configuration missing. Unable to fetch products.",
      };
    }

    const url = `${config.apiUrl}/store/products`;

    const res = await fetch(url, {
      method: "GET",
      headers: getMedusaHeaders(),
      // ISR: Revalidate every 5 minutes (300 seconds)
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[fetchProducts] HTTP ${res.status}: ${res.statusText}`);
      console.error("[fetchProducts] Response body:", body);
      return {
        ok: false,
        error: `Failed to fetch products: ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()) as MedusaProductsResponse;
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[fetchProducts] Error:", message);
    return {
      ok: false,
      error: `Failed to fetch products: ${message}`,
    };
  }
}

/**
 * Fetch all products with vendor information from custom Store API endpoint.
 * This endpoint returns products with vendor data extracted from tags.
 * 
 * @returns Promise with array of products with vendor info or error
 * @throws Error if API call fails or publishable key is missing
 * 
 * @example
 * const result = await fetchProductsWithVendors();
 * if (result.ok) {
 *   result.data.products.forEach(p => console.log(p.vendor?.name));
 * }
 */
export async function fetchProductsWithVendors(): Promise<
  { ok: true; data: MedusaProductsResponse } | { ok: false; error: string }
> {
  try {
    const config = getMedusaConfig();

    if (!config.publishableKey) {
      console.error("[fetchProductsWithVendors] Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
      return {
        ok: false,
        error: "Medusa configuration missing. Unable to fetch products.",
      };
    }

    console.log("[fetchProductsWithVendors] Using publishable key:", config.publishableKey.substring(0, 20) + "...");

    const url = `${config.apiUrl}/store/products-with-vendors`;

    const res = await fetch(url, {
      method: "GET",
      headers: getMedusaHeaders(),
      // ISR: Revalidate every 5 minutes (300 seconds)
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[fetchProductsWithVendors] HTTP ${res.status}: ${res.statusText}`);
      console.error("[fetchProductsWithVendors] Response body:", body);
      return {
        ok: false,
        error: `Failed to fetch products with vendors: ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()) as MedusaProductsResponse;
    return { ok: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[fetchProductsWithVendors] Error:", message);
    return {
      ok: false,
      error: `Failed to fetch products with vendors: ${message}`,
    };
  }
}

