import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { ExecArgs } from "@medusajs/framework/types";

/**
 * Script to add pricing to products created in the seed script.
 * Medusa uses a separate Pricing Module to manage prices per variant.
 *
 * Usage: npx medusa exec src/scripts/add-prices.ts
 * or:    pnpm commerce:seed:prices
 */
export default async function addProductPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const pricingModuleService = container.resolve(Modules.PRICING);

  logger.info("Adding prices to product variants...");

  // Product pricing configuration
  // Format: { productTitle, prices: { sku: priceInCents } }
  const productPricingConfig = [
    {
      productTitle: "Winter Jacket",
      prices: {
        "WJ-S": 9999,    // $99.99
        "WJ-M": 9999,
        "WJ-L": 9999,
        "WJ-XL": 9999,
      },
    },
    {
      productTitle: "Sacred Beads",
      prices: {
        "SB-RED": 2499,   // $24.99
        "SB-WHITE": 2499,
        "SB-BLACK": 2499,
      },
    },
    {
      productTitle: "Meditation Cushion",
      prices: {
        "MC-ROUND": 4999,  // $49.99
        "MC-SQUARE": 4999,
      },
    },
    {
      productTitle: "Temple Artwork",
      prices: {
        "TA-FRAMED": 7999,   // $79.99
        "TA-UNFRAMED": 4999, // $49.99
      },
    },
  ];

  try {
    // Fetch all products with their variants
    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "variants.id",
        "variants.sku",
        "variants.title",
      ],
    });

    logger.info(`Found ${products.length} products.`);

    // Track pricing entries to create
    const pricingEntries: Array<{
      variant_id: string;
      currency_code: string;
      amount: number;
    }> = [];

    // Match variants to pricing config
    for (const productConfig of productPricingConfig) {
      const matchedProduct = products.find(
        (p) => p.title === productConfig.productTitle
      );

      if (!matchedProduct) {
        logger.warn(
          `Product "${productConfig.productTitle}" not found. Skipping...`
        );
        continue;
      }

      logger.info(
        `Processing product: ${matchedProduct.title} (ID: ${matchedProduct.id})`
      );

      // Match variants by SKU and create pricing entries
      for (const variant of matchedProduct.variants || []) {
        const price = productConfig.prices[variant.sku];

        if (!price) {
          logger.warn(
            `No price configured for SKU "${variant.sku}". Skipping...`
          );
          continue;
        }

        logger.info(
          `  - Variant: ${variant.title} (SKU: ${variant.sku}) = $${(price / 100).toFixed(2)}`
        );

        // Add USD pricing
        pricingEntries.push({
          variant_id: variant.id,
          currency_code: "usd",
          amount: price,
        });

        // Optional: Add EUR pricing (e.g., ~1.1x for conversion)
        pricingEntries.push({
          variant_id: variant.id,
          currency_code: "eur",
          amount: Math.round(price * 1.1),
        });
      }
    }

    if (pricingEntries.length === 0) {
      logger.warn("No pricing entries to create.");
      return;
    }

    logger.info(`Creating ${pricingEntries.length} pricing entries...`);

    // Create pricing entries via the pricing module
    // In Medusa, pricing is typically created through the PriceListModule
    // We'll create price lists and add the prices to them
    try {
      // Create or fetch the default price list
      const priceLists = await pricingModuleService.listPriceLists({
        filters: { title: "Default" },
      });

      let priceListId: string;

      if (priceLists.length > 0) {
        priceListId = priceLists[0].id;
        logger.info(`Using existing price list: ${priceListId}`);
      } else {
        // Create a new price list if it doesn't exist
        const [newPriceList] = await pricingModuleService.createPriceLists([
          {
            title: "Default",
            description: "Default pricing for all products",
            type: "sale",
            status: "active",
          },
        ]);
        priceListId = newPriceList.id;
        logger.info(`Created new price list: ${priceListId}`);
      }

      // Add prices to the price list
      const pricesForList = pricingEntries.map((entry) => ({
        variant_id: entry.variant_id,
        currency_code: entry.currency_code,
        amount: entry.amount,
      }));

      await pricingModuleService.addPrices(priceListId, pricesForList);

      logger.info(
        `Successfully added ${pricingEntries.length} prices to the system.`
      );
    } catch (pricingError) {
      logger.error(
        `Error adding prices: ${pricingError instanceof Error ? pricingError.message : String(pricingError)}`
      );
      logger.warn(
        "Prices may need to be added manually through Medusa Admin or via API."
      );
    }
  } catch (error) {
    logger.error(
      `Script error: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }

  logger.info("Finished adding prices to products.");
}
