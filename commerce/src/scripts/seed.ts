import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["us"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "eur",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const existingRegions = await container
    .resolve(Modules.REGION)
    .listRegions();
  
  let region;
  const usRegion = existingRegions.find(r => r.name === "United States");
  
  if (usRegion) {
    region = usRegion;
    logger.info("United States region already exists, skipping creation.");
  } else {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
  }
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions();
  
  const usTaxRegionExists = existingTaxRegions.some(tr => tr.country_code === "us");
  
  if (!usTaxRegionExists) {
    await createTaxRegionsWorkflow(container).run({
      input: countries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    });
    logger.info("Tax regions created.");
  } else {
    logger.info("Tax regions already exist, skipping creation.");
  }
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
  const existingLocations = await stockLocationModuleService.listStockLocations();
  
  let usaLocation;
  let europeanLocation;
  
  // Check if USA location already exists
  const existingUsaLocation = existingLocations.find(loc => 
    loc.name === "USA Warehouse - Tampa"
  );
  
  // Check if European location already exists
  const existingEuropeanLocation = existingLocations.find(loc =>
    loc.name === "European Warehouse - Copenhagen"
  );
  
  if (existingUsaLocation && existingEuropeanLocation) {
    usaLocation = existingUsaLocation;
    europeanLocation = existingEuropeanLocation;
    logger.info("Stock locations already exist, skipping creation.");
  } else if (existingUsaLocation) {
    usaLocation = existingUsaLocation;
    // Create European location if missing
    const { result: europeanResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "European Warehouse - Copenhagen",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    europeanLocation = europeanResult[0];
    logger.info("Created missing European warehouse.");
  } else if (existingEuropeanLocation) {
    europeanLocation = existingEuropeanLocation;
    // Create USA location if missing
    const { result: usaResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "USA Warehouse - Tampa",
            address: {
              city: "Tampa",
              country_code: "US",
              address_1: "Temple Location",
            },
          },
        ],
      },
    });
    usaLocation = usaResult[0];
    logger.info("Created missing USA warehouse.");
  } else {
    // Create both locations
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "USA Warehouse - Tampa",
            address: {
              city: "Tampa",
              country_code: "US",
              address_1: "Temple Location",
            },
          },
          {
            name: "European Warehouse - Copenhagen",
            address: {
              city: "Copenhagen",
              country_code: "DK",
              address_1: "",
            },
          },
        ],
      },
    });
    
    usaLocation = stockLocationResult[0];
    europeanLocation = stockLocationResult[1];
    logger.info("Stock locations created.");
  }

  // Set USA warehouse as default since temple is in Tampa, Florida
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: usaLocation.id,
      },
    },
  });

  // Link both warehouses to fulfillment
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: usaLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  } catch (error) {
    logger.info("USA warehouse fulfillment link already exists or failed silently.");
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: europeanLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  } catch (error) {
    logger.info("European warehouse fulfillment link already exists or failed silently.");
  }

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  // Check if fulfillment sets already exist
  const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets();
  const usaFulfillmentExists = existingFulfillmentSets.some(fs => fs.name === "USA Warehouse delivery");
  const europeanFulfillmentExists = existingFulfillmentSets.some(fs => fs.name === "European Warehouse delivery");
  
  let usaFulfillmentSet;
  let europeanFulfillmentSet;

  if (!usaFulfillmentExists) {
    // Create USA Fulfillment Set
    const result = await fulfillmentModuleService.createFulfillmentSets({
      name: "USA Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "USA",
          geo_zones: [
            {
              country_code: "us",
              type: "country",
            },
            {
              country_code: "ca",
              type: "country",
            },
            {
              country_code: "mx",
              type: "country",
            },
          ],
        },
      ],
    });
    usaFulfillmentSet = result[0];
    logger.info("Created USA fulfillment set.");
  } else {
    usaFulfillmentSet = existingFulfillmentSets.find(fs => fs.name === "USA Warehouse delivery");
    logger.info("USA fulfillment set already exists.");
  }

  if (!europeanFulfillmentExists) {
    // Create European Fulfillment Set
    const result = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: [
            {
              country_code: "gb",
              type: "country",
            },
            {
              country_code: "de",
              type: "country",
            },
            {
              country_code: "dk",
              type: "country",
            },
            {
              country_code: "se",
              type: "country",
            },
            {
              country_code: "fr",
              type: "country",
            },
            {
              country_code: "es",
              type: "country",
            },
            {
              country_code: "it",
              type: "country",
            },
          ],
        },
      ],
    });
    europeanFulfillmentSet = result[0];
    logger.info("Created European fulfillment set.");
  } else {
    europeanFulfillmentSet = existingFulfillmentSets.find(fs => fs.name === "European Warehouse delivery");
    logger.info("European fulfillment set already exists.");
  }

  // Link USA warehouse to fulfillment
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: usaLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: usaFulfillmentSet.id,
      },
    });
  } catch (error) {
    logger.info("USA warehouse to fulfillment link already exists.");
  }

  // Link European warehouse to fulfillment
  try {
    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: europeanLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: europeanFulfillmentSet.id,
      },
    });
  } catch (error) {
    logger.info("European warehouse to fulfillment link already exists.");
  }

  // Create shipping options for USA fulfillment set
  try {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping (USA)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: usaFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "usd",
              amount: 10,
            },
            {
              region_id: region.id,
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Express Shipping (USA)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: usaFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ship in 24 hours.",
            code: "express",
          },
          prices: [
            {
              currency_code: "usd",
              amount: 15,
            },
            {
              region_id: region.id,
              amount: 15,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
    logger.info("Created USA shipping options.");
  } catch (error) {
    logger.info("USA shipping options may already exist.");
  }

  // Create shipping options for European fulfillment set
  try {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping (Europe)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: europeanFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: "eur",
              amount: 10,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Express Shipping (Europe)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: europeanFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Ship in 24 hours.",
            code: "express",
          },
          prices: [
            {
              currency_code: "eur",
              amount: 15,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    });
    logger.info("Created European shipping options.");
  } catch (error) {
    logger.info("European shipping options may already exist.");
  }
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: usaLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: europeanLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const productModule = container.resolve(Modules.PRODUCT);
  
  // Check if products already exist
  const existingProducts = await productModule.listProducts();
  
  if (existingProducts.length > 0) {
    logger.info(`Products already exist (${existingProducts.length} found), skipping product seeding.`);
    logger.info("Finished seeding product data.");
  } else {
    logger.info("No existing products found. Seeding products...");
    
    // Define vendors for temple products
    const vendors = [
      { slug: "temple-store", name: "Temple Store" },
      { slug: "sacred-crafts", name: "Sacred Crafts Collective" },
      { slug: "spiritual-goods", name: "Spiritual Goods Studio" },
      { slug: "temple-community", name: "Temple Community Makers" },
    ];

    // Sample products with vendor metadata
    const productsData = [
      {
        title: "Winter Jacket",
        description: "warm and cozy",
        is_giftcard: false,
        status: ProductStatus.PUBLISHED,
        metadata: {
          vendor_slug: "temple-store",
        },
      },
      {
        title: "Sacred Beads",
        description: "Handcrafted spiritual beads",
        is_giftcard: false,
        status: ProductStatus.PUBLISHED,
        metadata: {
          vendor_slug: "sacred-crafts",
        },
      },
      {
        title: "Meditation Cushion",
        description: "Comfortable meditation support",
        is_giftcard: false,
        status: ProductStatus.PUBLISHED,
        metadata: {
          vendor_slug: "spiritual-goods",
        },
      },
      {
        title: "Temple Artwork",
        description: "Beautiful temple-inspired art",
        is_giftcard: false,
        status: ProductStatus.PUBLISHED,
        metadata: {
          vendor_slug: "temple-community",
        },
      },
    ];

    try {
      const { result: productsResult } = await createProductsWorkflow(
        container
      ).run({
        input: {
          products: productsData,
        },
      });
      
      logger.info(`Created ${productsResult.length} seed products with vendor metadata.`);
      logger.info("Finished seeding product data.");
    } catch (error) {
      logger.info(`Product seeding skipped or already exists: ${error instanceof Error ? error.message : String(error)}`);
      logger.info("Finished seeding product data.");
    }
  }

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    // Create inventory in USA warehouse (default)
    const usaInventoryLevel = {
      location_id: usaLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(usaInventoryLevel);

    // Also create inventory in European warehouse
    const europeanInventoryLevel = {
      location_id: europeanLocation.id,
      stocked_quantity: 500000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(europeanInventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
