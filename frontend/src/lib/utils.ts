/**
 * Utility functions for the frontend application.
 */

/**
 * Convert a vendor name to a URL-friendly slug.
 * @param name - Vendor name
 * @returns URL-friendly slug (e.g., "Temple Artisans" -> "temple-artisans")
 */
export function slugifyVendorName(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'vendor'
  );
}

/**
 * Extract vendor slug from product tags.
 * Looks for tags with format "vendor:<slug>"
 * @param tags - Array of product tags
 * @returns Vendor slug or null if no vendor tag found
 */
export function getVendorSlugFromTags(tags: string[] | undefined | null): string | null {
  if (!tags || !Array.isArray(tags)) {
    return null;
  }

  const vendorTag = tags.find((tag) => tag.startsWith('vendor:'));
  if (!vendorTag) {
    return null;
  }

  return vendorTag.replace('vendor:', '');
}

/**
 * Convert vendor slug to display name.
 * Format: "temple-artisans" -> "Temple Artisans"
 * @param slug - Vendor slug
 * @returns Display name for vendor
 */
export function getVendorDisplayNameFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
