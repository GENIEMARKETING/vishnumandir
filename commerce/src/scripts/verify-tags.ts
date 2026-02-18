import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Script to verify vendor tags in the database
 * Run with: medusa exec ./src/scripts/verify-tags.ts
 */
export default async function verifyTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productModule = container.resolve(Modules.PRODUCT);

  logger.info("Verifying vendor tags in database...");

  try {
    // Fetch all products with tags using productModule
    const [products] = await productModule.listAndCountProducts(
      {},
      { relations: ["tags"] }
    );

    logger.info(`Found ${products.length} products`);

    for (const product of products) {
      const tags = product.tags || [];
      const tagValues = tags.map((t: any) => {
        if (typeof t === 'string') return t;
        if (typeof t === 'object' && t.value) return t.value;
        return JSON.stringify(t);
      }).join(", ");
      logger.info(`${product.handle}: tags = [${tagValues || 'empty'}] (${tags.length} tags total)`);
      if (tags.length > 0) {
        logger.info(`  Full tag data: ${JSON.stringify(tags)}`);
      }
    }
  } catch (error: any) {
    logger.error("Error verifying tags:", error.message || error);
    throw error;
  }
}
