"use client";

import { useState } from "react";
import { ShoppingCart, AlertCircle } from "lucide-react";
import type { MedusaProduct } from "@/types/medusa";

interface AddToCartButtonProps {
  product: MedusaProduct;
  variant?: "primary" | "outline";
}

/**
 * AddToCartButton component - Shows product availability and placeholder for cart integration.
 * Currently displays availability status; full cart integration coming soon.
 * 
 * @param product - Medusa product object
 * @param variant - Button style variant (primary or outline)
 * @returns JSX.Element The rendered button
 */
export function AddToCartButton({ product, variant = "primary" }: AddToCartButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Check if product has available variants
  const hasAvailableVariants =
    product.variants && product.variants.length > 0;

  const buttonClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : "border-2 border-primary text-primary hover:bg-primary/5";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Placeholder for future cart integration
    console.log("[AddToCartButton] Add to cart not yet implemented for:", product.title);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddToCart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={!hasAvailableVariants}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
      >
        <ShoppingCart className="w-5 h-5" />
        {hasAvailableVariants ? "Add to Cart" : "Out of Stock"}
      </button>

      {!hasAvailableVariants && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This product is currently unavailable.
          </p>
        </div>
      )}

      {hasAvailableVariants && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300">
          {product.variants.length} option{product.variants.length !== 1 ? "s" : ""} available
        </div>
      )}

      <p className="text-xs text-text-secondary text-center">
        Cart functionality is coming soon. Please contact us to place an order.
      </p>
    </div>
  );
}
