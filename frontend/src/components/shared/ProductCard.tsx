"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { VendorAttribution } from "@/components/shared/VendorAttribution";
import type { MedusaProduct } from "@/types/medusa";

interface ProductCardProps {
  product: MedusaProduct;
}

/**
 * ProductCard component - Displays a product in a card format for the shop.
 * @param {ProductCardProps} props - Component props
 * @returns {JSX.Element} The rendered product card
 */
export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();

  if (!product) {
    return null;
  }

  // Get the first available image or fallback to thumbnail
  const imageUrl = product.images?.[0]?.url || product.thumbnail;

  // Truncate description to 100 characters
  const truncatedDescription = product.description
    ? product.description.substring(0, 100) + (product.description.length > 100 ? "..." : "")
    : "Premium product";

  // Format product link
  const productLink = `/shop/product/${product.handle}`;

  const handleVendorClick = (e: React.MouseEvent, vendorSlug: string) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/shop/vendor/${vendorSlug}`);
  };

  return (
    <Link href={productLink} className="group">
      <div className="bg-white rounded-xl overflow-hidden border-2 border-primary/5 shadow-warm hover:shadow-lg hover:border-primary/20 transition-all dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary/40 h-full flex flex-col">
        {/* Product Image */}
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden bg-background dark:bg-gray-700">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Product Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <div className="flex items-start gap-2 mb-3">
            <ShoppingBag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <h3 className="font-serif text-lg font-semibold text-text-primary dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-text-secondary text-sm leading-relaxed mb-4 dark:text-gray-400 line-clamp-2">
              {truncatedDescription}
            </p>
          )}

          {/* Vendor Attribution */}
          <VendorAttribution 
            tags={product.tags}
            variant="card" 
            className="mb-3"
            onClick={handleVendorClick}
          />

          {/* Variants Count */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-auto">
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                {product.variants.length} {product.variants.length === 1 ? "variant" : "variants"}
              </span>
            </div>
          )}

          {/* CTA */}
          <button className="mt-4 w-full bg-primary text-white py-2 px-3 rounded-lg font-medium text-sm hover:bg-primary/90 active:scale-95 transition-all dark:hover:bg-primary/80">
            View Product
          </button>
        </div>
      </div>
    </Link>
  );
}
