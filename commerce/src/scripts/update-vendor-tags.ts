import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * Script to add vendor tags to existing products
 * Run with: medusa exec ./src/scripts/update-vendor-tags.ts
 */
export default async function updateVendorTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Updating products with vendor tags...");

  // Product handle to vendor tag mapping
  const vendorMapping: Record<string, string[]> = {
    "t-shirt": ["vendor:temple-artisans"],
    "sweatshirt": ["vendor:sacred-crafts-collective"],
    "sweatpants": ["vendor:spiritual-goods-studio"],
    "shorts": ["vendor:temple-community-makers"],
  };

  try {
    // Fetch all product tags first
    const { data: allTags } = await query.graph({
      entity: "product_tag",
      fields: ["id", "value"],
    });

    const tagIdByValue = new Map(
      (allTags || []).map((tag: any) => [tag.value, tag.id])
    );

    logger.info(`Found ${allTags?.length || 0} product tags`);

    // Fetch all products with their current tags
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "handle", "tags.id", "tags.value"],
    });

    logger.info(`Found ${products.length} products`);

    logger.info("Vendor tags update script completed (read-only for now)");
    logger.info(
      "To add tags, use the admin panel or seed script with vendor tags"
    );
  } catch (error) {
    logger.error("Error reading vendor tags:", error);
    throw error;
  }
}
