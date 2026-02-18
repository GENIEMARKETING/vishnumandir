/**
 * TypeScript interfaces for Medusa Commerce Store API.
 * These types are based on the actual Medusa Store API response structure.
 */

/**
 * Product image in Medusa.
 */
export interface MedusaImage {
  id: string;
  url: string;
  metadata: Record<string, unknown> | null;
  rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Product option value (e.g., "S", "M", "L", "XL" for Size).
 */
export interface MedusaOptionValue {
  id: string;
  value: string;
  metadata: Record<string, unknown> | null;
  option_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Product option (e.g., "Size", "Color").
 */
export interface MedusaOption {
  id: string;
  title: string;
  metadata: Record<string, unknown> | null;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  values: MedusaOptionValue[];
}

/**
 * Product variant (e.g., "Size S", "Size M / Color Blue").
 */
export interface MedusaVariant {
  id: string;
  title: string;
  sku: string;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: string | null;
  length: string | null;
  height: string | null;
  width: string | null;
  metadata: Record<string, unknown> | null;
  variant_rank: number;
  thumbnail: string | null;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  options: MedusaOptionValue[];
}

/**
 * Product collection.
 */
export interface MedusaCollection {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Product type.
 */
export interface MedusaProductType {
  id: string;
  value: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Vendor information.
 */
export interface VendorInfo {
  slug: string;
  name: string;
}

/**
 * Vendor information stored in product metadata.
 */
export interface ProductVendor {
  name: string;
  id?: string;
  email?: string;
}

/**
 * Main product object from Medusa Store API.
 */
export interface MedusaProduct {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  handle: string;
  is_giftcard: boolean;
  discountable: boolean;
  thumbnail: string | null;
  collection_id: string | null;
  type_id: string | null;
  weight: string | null;
  length: string | null;
  height: string | null;
  width: string | null;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type: MedusaProductType | null;
  collection: MedusaCollection | null;
  options: MedusaOption[];
  tags: string[];
  images: MedusaImage[];
  variants: MedusaVariant[];
  metadata?: {
    vendor?: ProductVendor;
    [key: string]: unknown;
  } | null;
  // Vendor information from custom Store API endpoint
  vendor?: VendorInfo | null;
}

/**
 * Paginated response from Medusa Store API products endpoint.
 */
export interface MedusaProductsResponse {
  products: MedusaProduct[];
  count: number;
  offset: number;
  limit: number;
}
