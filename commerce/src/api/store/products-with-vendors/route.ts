import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

interface VendorInfo {
  slug: string;
  name: string;
}

interface ProductWithVendor {
  [key: string]: any;
  vendor?: VendorInfo | null;
}

/**
 * Extract vendor slug from product metadata or tags (for backward compatibility).
 * Metadata format: metadata.vendor_slug = "temple-store"
 * Tags format (fallback): "vendor:<slug>"
 * @param metadata - Product metadata object
 * @param tags - Array of tag objects with value property (fallback)
 * @returns Vendor info with slug and name, or null if no vendor found
 */
function extractVendorFromProduct(
  metadata: Record<string, any> | undefined | null,
  tags: Array<{ value: string }> | undefined | null
): VendorInfo | null {
  let slug: string | null = null;

  // Try to get vendor from metadata first
  if (metadata && typeof metadata === 'object' && 'vendor_slug' in metadata) {
    slug = metadata.vendor_slug as string;
  }

  // Fallback to tag-based system for backward compatibility
  if (!slug && tags && Array.isArray(tags)) {
    const vendorTag = tags.find((tag) => tag.value?.startsWith("vendor:"));
    if (vendorTag) {
      slug = vendorTag.value.replace("vendor:", "");
    }
  }

  if (!slug) {
    return null;
  }

  // Convert slug to display name: "temple-store" -> "Temple Store"
  const name = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return { slug, name };
}

/**
 * Custom Store API endpoint that returns products with vendor information.
 * Vendor data is fetched from product metadata (primary) or tags (fallback).
 * Format: GET /store/products-with-vendors
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Get the product module from the container
    const productModule = req.scope.resolve(Modules.PRODUCT);

    // Query all products with tags and metadata relations
    const [products, count] = await productModule.listAndCountProducts(
      {},
      { relations: ["tags"] }
    );

    // Transform products to include vendor information
    const productsWithVendors: ProductWithVendor[] = products.map(
      (product: any) => ({
        ...product,
        vendor: extractVendorFromProduct(product.metadata, product.tags),
      })
    );

    // Return in Store API format
    res.json({
      products: productsWithVendors,
      count,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[products-with-vendors] Error:", message);

    res.status(500).json({
      success: false,
      error: "Failed to fetch products with vendor information",
      message,
    });
  }
}
