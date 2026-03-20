import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
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
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map((c) => ({
          currency_code: c.currency_code,
          is_default: c.is_default ?? false,
        })),
      },
    }));
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

  // ─── Store & Currency (USD only) ──────────────────────────────────────────
  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();

  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    defaultSalesChannel = result;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [{ currency_code: "usd", is_default: true }],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_sales_channel_id: defaultSalesChannel[0].id },
    },
  });

  // ─── Region ────────────────────────────────────────────────────────────────
  logger.info("Seeding region data...");
  const existingRegions = await container.resolve(Modules.REGION).listRegions();
  let region = existingRegions.find((r) => r.name === "United States");

  if (!region) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "United States",
            currency_code: "usd",
            countries: ["us"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    region = regionResult[0];
  }

  // ─── Tax Regions ───────────────────────────────────────────────────────────
  logger.info("Seeding tax regions...");
  const taxModuleService = container.resolve(Modules.TAX);
  const existingTaxRegions = await taxModuleService.listTaxRegions();
  if (!existingTaxRegions.some((tr) => tr.country_code === "us")) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "us", provider_id: "tp_system" }],
    });
  }

  // ─── Stock Location (Tampa only) ───────────────────────────────────────────
  logger.info("Seeding stock location data...");
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION);
  const existingLocations = await stockLocationModule.listStockLocations();
  let tampaLocation = existingLocations.find(
    (l) => l.name === "Vishnu Mandir - Tampa"
  );

  if (!tampaLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Vishnu Mandir - Tampa",
            address: {
              city: "Tampa",
              country_code: "US",
              address_1: "5509 Harney Rd, Tampa, FL 33610",
            },
          },
        ],
      },
    });
    tampaLocation = result[0];
    logger.info("Created Tampa stock location.");
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: tampaLocation.id },
    },
  });

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: tampaLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
  } catch {
    logger.info("Tampa fulfillment provider link already exists.");
  }

  // ─── Fulfillment ───────────────────────────────────────────────────────────
  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles[0] ?? null;

  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    });
    shippingProfile = result[0];
  }

  const existingFulfillmentSets = await fulfillmentModuleService.listFulfillmentSets();
  let tampaFulfillmentSet = existingFulfillmentSets.find(
    (fs) => fs.name === "Vishnu Mandir Delivery"
  );

  if (!tampaFulfillmentSet) {
    const fulfillmentSetResult = await fulfillmentModuleService.createFulfillmentSets({
      name: "Vishnu Mandir Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "United States",
          geo_zones: [{ country_code: "us", type: "country" }],
        },
      ],
    });
    tampaFulfillmentSet = Array.isArray(fulfillmentSetResult)
      ? fulfillmentSetResult[0]
      : fulfillmentSetResult;
  }

  try {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: tampaLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: tampaFulfillmentSet.id },
    });
  } catch {
    logger.info("Tampa fulfillment set link already exists.");
  }

  try {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: tampaFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Delivered in 3-5 business days.",
            code: "standard",
          },
          prices: [
            { currency_code: "usd", amount: 799 },
            { region_id: region.id, amount: 799 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
        {
          name: "Express Shipping",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: tampaFulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Express",
            description: "Delivered in 1-2 business days.",
            code: "express",
          },
          prices: [
            { currency_code: "usd", amount: 1499 },
            { region_id: region.id, amount: 1499 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    });
    logger.info("Created shipping options.");
  } catch {
    logger.info("Shipping options already exist, skipping.");
  }

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: tampaLocation.id, add: [defaultSalesChannel[0].id] },
  });

  // ─── Publishable API Key ───────────────────────────────────────────────────
  logger.info("Seeding publishable API key...");
  const { data: apiKeyData } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  });
  let publishableApiKey: ApiKey | null = apiKeyData?.[0] ?? null;

  if (!publishableApiKey) {
    const {
      result: [keyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }],
      },
    });
    publishableApiKey = keyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  });

  // ─── Product Categories ────────────────────────────────────────────────────
  logger.info("Seeding product categories...");
  const productModule = container.resolve(Modules.PRODUCT);
  const existingCategories = await productModule.listProductCategories();

  const categoryTree = [
    {
      name: "Puja Items",
      handle: "puja-items",
      children: ["Diyas & Lamps", "Puja Thalis", "Kalash & Vessels", "Agarbatti & Dhoop"],
    },
    {
      name: "Idols & Murtis",
      handle: "idols-murtis",
      children: ["Vishnu & Lakshmi", "Ganesha", "Shiva", "Hanuman", "Other Deities"],
    },
    {
      name: "Books & Scriptures",
      handle: "books-scriptures",
      children: ["Bhagavad Gita", "Puranas", "Prayer Books", "Children's Books"],
    },
    {
      name: "Clothing & Accessories",
      handle: "clothing-accessories",
      children: ["Dhoti & Kurta", "Sarees", "Temple Jewelry", "Rudraksha"],
    },
    {
      name: "Incense & Oils",
      handle: "incense-oils",
      children: ["Agarbatti", "Camphor", "Essential Oils", "Attar"],
    },
    {
      name: "Donations",
      handle: "donations",
      children: ["Temple Fund", "Annadanam", "Special Puja Sponsorship"],
    },
  ];

  for (const cat of categoryTree) {
    const exists = existingCategories.find((c) => c.handle === cat.handle);
    if (exists) {
      logger.info(`Category "${cat.name}" already exists, skipping.`);
      continue;
    }

    const {
      result: [parent],
    } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: cat.name,
            handle: cat.handle,
            is_active: true,
            is_internal: false,
          },
        ],
      },
    });

    if (cat.children.length) {
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: cat.children.map((child) => ({
            name: child,
            handle: `${cat.handle}-${child.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            parent_category_id: parent.id,
            is_active: true,
            is_internal: false,
          })),
        },
      });
    }

    logger.info(
      `Created category "${cat.name}" with ${cat.children.length} subcategories.`
    );
  }

  // ─── Inventory Levels ─────────────────────────────────────────────────────
  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map(
    (item) => ({
      location_id: tampaLocation.id,
      stocked_quantity: 1000,
      inventory_item_id: item.id,
    })
  );

  if (inventoryLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    });
  }

  logger.info("✅ Seed complete. Vishnu Mandir store is ready.");
}
