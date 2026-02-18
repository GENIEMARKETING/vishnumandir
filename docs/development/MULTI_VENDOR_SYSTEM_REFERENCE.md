# Vendor-Attributed Store - Complete Reference

## Important: Architecture Clarification

**This is NOT a multi-vendor marketplace.** It is a **vendor-attributed store** (single store with vendor labels).

| Concept | Reality |
|---------|---------|
| **Who adds products?** | Admins only (temple staff via Medusa Admin) |
| **Vendor logins** | None – vendors do not log in or manage anything |
| **Vendor slugs** | For customer-facing UX only: browsing, filtering, attribution |
| **Multi-vendor marketplace** | No – vendors do not have accounts, dashboards, or payouts |

Vendors are represented as **tags** on products (e.g., `vendor:temple-artisans`). Admins add products in Medusa Admin and assign vendor tags. Vendor slugs enable customers to browse products by supplier at `/shop/vendor/[slug]` and see "Sold by: [Vendor Name]" on product pages.

---

## System Architecture

The vendor-attributed store is built on a **tag-based vendor model** where products are associated with vendors through Medusa product tags.

### Core Components

#### 1. Vendor Representation
- **Format**: Product tags with prefix `vendor:<slug>`
- **Example vendors**:
  - `vendor:temple-artisans` → "Temple Artisans"
  - `vendor:sacred-crafts-collective` → "Sacred Crafts Collective"  
  - `vendor:spiritual-goods-studio` → "Spiritual Goods Studio"
  - `vendor:temple-community-makers` → "Temple Community Makers"

#### 2. Backend API

**Custom Store API Endpoint**: `GET /store/products-with-vendors`
- **Location**: `commerce/src/api/store/products-with-vendors/route.ts`
- **Purpose**: Extracts vendor info from product tags and includes in response
- **Response Format**:
  ```json
  {
    "products": [
      {
        "id": "...",
        "title": "...",
        "tags": [...],
        "vendor": {
          "slug": "temple-artisans",
          "name": "Temple Artisans"
        }
      }
    ]
  }
  ```

#### 3. Frontend API Clients

**fetchProductsWithVendors()** - `frontend/src/lib/medusa.ts`
```typescript
// Fetches all products with vendor enrichment
const result = await fetchProductsWithVendors();
if (result.ok) {
  result.data.products.forEach(p => {
    console.log(p.vendor?.name); // "Temple Artisans"
  });
}
```

**fetchProductDirect()** - `frontend/src/app/(site)/shop/product/[handle]/page.tsx`
```typescript
// Fetches single product and enriches with vendor info
const product = await fetchProductDirect(handle);
// product.vendor is populated if product has vendor tag
```

#### 4. Frontend Components

**VendorAttribution** - `frontend/src/components/shared/VendorAttribution.tsx`
```tsx
// Displays "Sold by: [Vendor Name]" with link
<VendorAttribution tags={product.tags} vendor={product.vendor} />
```

**ProductCard** - `frontend/src/components/shared/ProductCard.tsx`
```tsx
// Shows product image, title, price, and vendor attribution
<ProductCard product={product} />
```

**AddToCartButton** - `frontend/src/components/shared/AddToCartButton.tsx`
```tsx
// Shows availability and links to contact for ordering
<AddToCartButton product={product} />
```

---

## Page Architecture

### Shop Listing (`/shop`)
```
GET /store/products-with-vendors
    ↓
Map to ProductCard components
    ↓
Each product shows vendor attribution with link to vendor storefront
    ↓
Navigation link to /shop/vendors for vendor discovery
```

### Vendor Storefront (`/shop/vendor/[vendorSlug]`)
```
GET /store/products-with-vendors
    ↓
Filter by product.vendor.slug === vendorSlug
    ↓
Display vendor name and filtered products
    ↓
Each product shows vendor attribution (redundant but consistent)
```

### Product Detail (`/shop/product/[handle]`)
```
GET /store/products?handle=...
    ↓
Enrich with GET /store/products-with-vendors
    ↓
Find matching product and extract vendor
    ↓
Display full product info with vendor, AddToCartButton, and contact CTA
```

### Vendor Discovery (`/shop/vendors`)
```
GET /store/products-with-vendors
    ↓
Extract unique vendors
    ↓
Count products per vendor
    ↓
Sort by product count (descending)
    ↓
Display vendor cards with links to /shop/vendor/[slug]
```

---

## Data Models

### TypeScript Types

**VendorInfo** - `frontend/src/types/medusa.ts`
```typescript
export interface VendorInfo {
  slug: string;      // "temple-artisans"
  name: string;      // "Temple Artisans"
}
```

**MedusaProduct** (extended)
```typescript
export interface MedusaProduct {
  id: string;
  title: string;
  description: string;
  tags?: any[];           // Product tags as Medusa returns them
  vendor?: VendorInfo;    // NEW: Enriched vendor field
  // ... other fields
}
```

### Database Schema

**Medusa Product Tags** (commerce)
- Tag value: `vendor:temple-artisans`
- Stored in `product_tags` table
- Linked via `product_id`
- Multiple tags per product supported

---

## Scripts & Commands

### Add Vendor Tags to Products
```bash
# In commerce directory
medusa exec ./src/scripts/add-vendor-tags.ts
```
Uses mapping:
- `t-shirt` → `vendor:temple-artisans`
- `sweatshirt` → `vendor:sacred-crafts-collective`
- `sweatpants` → `vendor:spiritual-goods-studio`
- `shorts` → `vendor:temple-community-makers`

### Update Vendor Tags
```bash
# In commerce directory
medusa exec ./src/scripts/update-vendor-tags.ts
```
Same mapping as add-vendor-tags.ts

### Verify Tags
```bash
# In commerce directory
medusa exec ./src/scripts/verify-tags.ts
```
Checks tag persistence in database

---

## Adding New Vendors

**Note:** "Vendors" here means supplier labels for display. Admins create and assign them; vendors do not self-register.

### Step 1: Create Product Tag in Medusa Admin
- Medusa Admin → Products → Tags
- Create new tag: `vendor:your-vendor-slug`
- Format: `vendor:` + lowercase-slug

### Step 2: Assign Tag to Products (Admin Only)
- Product detail → Tags section
- Admin adds new vendor tag to product
- Save product

### Step 3: Automatic Integration
- No code changes needed!
- Vendor automatically appears in:
  - `/shop` with vendor attribution
  - `/shop/vendors` discovery page
  - `/shop/vendor/[slug]` storefront
  - Product detail pages

---

## Environment Variables

**Required for vendor functionality:**

```bash
# Frontend
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Commerce
DATABASE_URL=postgresql://...
STORE_CORS=http://localhost:3000
```

---

## Future Enhancement: Vendor Registry

If you want to add vendor metadata (description, logo, contact info):

```typescript
// frontend/src/config/vendors.ts
export interface VendorMetadata {
  slug: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
}

export const VENDOR_METADATA: Record<string, VendorMetadata> = {
  "temple-artisans": {
    slug: "temple-artisans",
    name: "Temple Artisans",
    description: "...",
    logo: "/images/vendors/temple-artisans.png",
    website: "https://...",
  }
};
```

Then use in vendor cards and pages.

---

## Troubleshooting

### Vendor Not Showing on Product
1. Check product has `vendor:*` tag in Medusa admin
2. Run verification script: `medusa exec ./src/scripts/verify-tags.ts`
3. Check ISR cache (5-minute revalidation)
4. Manually rebuild: `/api/revalidate?path=/shop`

### Product Not in Vendor Storefront
1. Confirm product has correct vendor tag
2. Check tag spelling (case-sensitive)
3. Verify product is published in Medusa
4. Check ISR cache

### Vendor Not in Vendors Discovery Page
1. Must have at least one published product with vendor tag
2. Verify vendor tag format: `vendor:slug`
3. Check ISR revalidation (5 minutes)

---

## Performance Considerations

- **ISR Caching**: 5 minutes for all product/vendor data
- **Vendor Deduplication**: Client-side in discovery page (minimal impact)
- **API Calls**: 
  - Shop page: 1 call (products-with-vendors)
  - Product detail: 2 calls (product detail + enrichment)
  - Vendor page: 1 call (products-with-vendors)
  - Vendors discovery: 1 call (products-with-vendors)

---

## Testing the System

### Local Development
```bash
# 1. Start Medusa
cd commerce && pnpm dev:commerce

# 2. Start Frontend
cd frontend && pnpm dev

# 3. Seed data (includes vendors)
medusa exec ./src/scripts/seed.ts

# 4. Navigate to:
# - http://localhost:3000/shop
# - http://localhost:3000/shop/vendors
# - http://localhost:3000/shop/vendor/temple-artisans
# - http://localhost:3000/shop/product/t-shirt
```

### Production Deployment
- All vendor data comes from Medusa product tags
- No hardcoded configuration
- ISR caching ensures performance
- Changes to tags auto-sync to frontend (on next revalidation)

---

## Related Documentation

- [Vendor-Attributed Store Implementation](./MULTI_VENDOR_IMPLEMENTATION_COMPLETE.md) - Detailed implementation summary
- [Medusa Commerce Docs](https://medusajs.com/) - Store API documentation
- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration) - Caching strategy
