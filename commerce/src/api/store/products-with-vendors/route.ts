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
 * Extract vendor information from product tags.
 * Tags are in format: "vendor:<slug>"
 * @param tags - Array of tag objects with value property
 * @returns Vendor info with slug and name, or null if no vendor tag found
 */
function extractVendorFromTags(
  tags: Array<{ value: string }> | undefined | null
): VendorInfo | null {
  if (!tags || !Array.isArray(tags)) {
    return null;
  }

  const vendorTag = tags.find((tag) => tag.value?.startsWith("vendor:"));
  if (!vendorTag) {
    return null;
  }

  const slug = vendorTag.value.replace("vendor:", "");
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
 * Queries products with tags and extracts vendor data from tags.
 * Format: GET /store/products-with-vendors
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Get the product module from the container
    const productModule = req.scope.resolve(Modules.PRODUCT);

    // Query all products with tags relation
    const [products, count] = await productModule.listAndCountProducts(
      {},
      { relations: ["tags"] }
    );

    // Transform products to include vendor information
    const productsWithVendors: ProductWithVendor[] = products.map(
      (product: any) => ({
        ...product,
        vendor: extractVendorFromTags(product.tags),
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
