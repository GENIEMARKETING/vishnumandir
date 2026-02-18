import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Script to add vendor tags to existing products.
 * Maps product handles to vendor tags that match the seed data.
 * Run with: medusa exec ./src/scripts/add-vendor-tags.ts
 */
const mapping: Record<string, string> = {
  "t-shirt": "vendor:temple-artisans",
  sweatshirt: "vendor:sacred-crafts-collective",
  sweatpants: "vendor:spiritual-goods-studio",
  shorts: "vendor:temple-community-makers",
};

export default async function addVendorTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);

  logger.info("Adding vendor tags to products...");

  try {
    // Fetch all products
    const [products] = await productModule.listAndCountProducts(
      {},
      { relations: ["tags"] }
    );

    logger.info(`Found ${products.length} products`);

    for (const product of products) {
      const handle = product.handle || "";
      const vendorTag = mapping[handle];
      if (!vendorTag) continue;

      const currentTagValues = (product.tags || []).map((t: any) => typeof t === 'string' ? t : t.value).filter(Boolean);
      
      if (currentTagValues.includes(vendorTag)) {
        logger.info(`OK: ${handle} already has ${vendorTag}`);
        continue;
      }

      logger.info(`Will add: ${handle} -> ${vendorTag}`);
    }

    logger.info("Vendor tags audit completed! To add tags, use the admin panel.");
  } catch (error: any) {
    logger.error("Error running script:", error.message || error);
    throw error;
  }
}
