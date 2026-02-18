"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { getVendorSlugFromTags, getVendorDisplayNameFromSlug, slugifyVendorName } from "@/lib/utils";
import type { ProductVendor } from "@/types/medusa";

interface VendorAttributionProps {
  tags?: string[] | null;
  vendor?: ProductVendor | null;
  variant?: "detail" | "card";
  className?: string;
  onClick?: (e: React.MouseEvent, vendorSlug: string) => void;
}

/**
 * VendorAttribution component - Displays vendor/store attribution for a product.
 * Shows "Sold by: [Vendor Name]" with link to vendor storefront.
 * @param {VendorAttributionProps} props - Component props
 * @returns {JSX.Element} The rendered vendor attribution
 */
export function VendorAttribution({
  tags,
  vendor,
  variant = "detail",
  className = "",
  onClick,
}: VendorAttributionProps) {
  // Get vendor slug from tags (preferred) or from vendor prop (deprecated)
  let vendorSlug = getVendorSlugFromTags(tags) || (vendor?.name ? slugifyVendorName(vendor.name) : null);
  
  // Get display name from slug or vendor prop
  let vendorName = "Temple Store";
  if (vendorSlug) {
    vendorName = getVendorDisplayNameFromSlug(vendorSlug);
  } else if (vendor?.name) {
    vendorName = vendor.name;
  }

  // Always ensure we have a slug (fallback to slugifying the vendor name)
  if (!vendorSlug) {
    vendorSlug = slugifyVendorName(vendorName);
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick && vendorSlug) {
      onClick(e, vendorSlug);
    }
  };

  if (variant === "detail") {
    // Detailed version for product detail pages
    
    // With vendor: use interactive element
    if (onClick) {
      // Button for ProductCard with custom handler
      return (
        <div className={`flex items-center gap-2 my-3 ${className}`}>
          <Store className="w-4 h-4 text-secondary flex-shrink-0" />
          <span className="text-sm text-text-secondary dark:text-gray-400">
            Sold by:{" "}
          </span>
          <button
            onClick={handleClick}
            className="text-sm font-medium text-text-primary dark:text-gray-300 hover:text-primary hover:underline dark:hover:text-primary/80 transition-colors cursor-pointer pointer-events-auto bg-transparent border-0 p-0 relative z-10"
          >
            {vendorName}
          </button>
        </div>
      );
    }

    // Link for product detail page (no onClick handler)
    return (
      <div className={`flex items-center gap-2 my-3 ${className}`}>
        <Store className="w-4 h-4 text-secondary flex-shrink-0" />
        <span className="text-sm text-text-secondary dark:text-gray-400">
          Sold by:{" "}
        </span>
        <Link
          href={`/shop/vendor/${vendorSlug}`}
          className="text-sm font-medium text-text-primary dark:text-gray-300 hover:text-primary hover:underline dark:hover:text-primary/80 transition-colors cursor-pointer pointer-events-auto bg-transparent relative z-10"
        >
          {vendorName}
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    // Compact version for product cards
    
    // With vendor: use interactive element
    if (onClick) {
      // Button for ProductCard with custom handler
      return (
        <div className={`text-xs text-text-secondary dark:text-gray-400 ${className}`}>
          Sold by:{" "}
          <button
            onClick={handleClick}
            className="font-medium text-text-primary dark:text-gray-300 hover:text-primary hover:underline dark:hover:text-primary/80 transition-colors cursor-pointer pointer-events-auto bg-transparent border-0 p-0 relative z-10"
          >
            {vendorName}
          </button>
        </div>
      );
    }

    // Link for product listing (no onClick handler)
    return (
      <div className={`text-xs text-text-secondary dark:text-gray-400 ${className}`}>
        Sold by:{" "}
        <Link
          href={`/shop/vendor/${vendorSlug}`}
          className="font-medium text-text-primary dark:text-gray-300 hover:text-primary hover:underline dark:hover:text-primary/80 transition-colors cursor-pointer pointer-events-auto bg-transparent relative z-10"
        >
          {vendorName}
        </Link>
      </div>
    );
  }

  return null;
}
