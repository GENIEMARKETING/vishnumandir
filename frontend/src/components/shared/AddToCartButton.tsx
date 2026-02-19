"use client";

import { useState } from "react";
import { ShoppingCart, AlertCircle, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { MedusaProduct } from "@/types/medusa";
import type { CartItem } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: MedusaProduct;
  variant?: "primary" | "outline";
}

/**
 * AddToCartButton component - Allows users to select product variants and add items to cart.
 * Integrates with CartContext for state management and localStorage persistence.
 * 
 * @param product - Medusa product object
 * @param variant - Button style variant (primary or outline)
 * @returns JSX.Element The rendered component with variant selection, quantity selector, and add to cart button
 */
export function AddToCartButton({ product, variant = "primary" }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Check if product has available variants
  const hasAvailableVariants = product.variants && product.variants.length > 0;

  const buttonClasses =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primary/90"
      : "border-2 border-primary text-primary hover:bg-primary/5";

  /**
   * Handle adding product to cart
   */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!selectedVariantId) {
      alert("Please select a product option before adding to cart");
      return;
    }

    setIsLoading(true);

    try {
      const selectedVariant = product.variants?.find(
        (v) => v.id === selectedVariantId
      );

      if (!selectedVariant) {
        console.error("Selected variant not found");
        return;
      }

      // Extract price from variant (prices are in cents)
      const priceInCents =
        selectedVariant.prices?.[0]?.amount ||
        product.variants?.[0]?.prices?.[0]?.amount ||
        0;

      // Create cart item
      const cartItem: CartItem = {
        productId: product.id,
        variantId: selectedVariantId,
        title: product.title,
        quantity,
        price: priceInCents,
        thumbnail: product.thumbnail,
        handle: product.handle,
      };

      // Add to cart context (which also persists to localStorage)
      addToCart(cartItem);

      // Show success message
      setSuccessMessage(`Added ${quantity} to cart!`);

      // Reset form
      setSelectedVariantId("");
      setQuantity(1);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Increment quantity
   */
  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  /**
   * Decrement quantity
   */
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      {hasAvailableVariants && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Select Option
          </label>
          <div className="grid grid-cols-2 gap-2">
            {product.variants?.map((prod_variant) => {
              const optionTitle = prod_variant.title || `Option ${prod_variant.id.slice(0, 8)}`;
              return (
                <button
                  key={prod_variant.id}
                  onClick={() => setSelectedVariantId(prod_variant.id)}
                  className={`p-2 text-sm border-2 rounded-lg transition-all ${
                    selectedVariantId === prod_variant.id
                      ? "border-primary bg-primary/10 text-text-primary font-medium"
                      : "border-border text-text-secondary hover:border-primary/50"
                  }`}
                >
                  {optionTitle}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {selectedVariantId && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Quantity
          </label>
          <div className="flex items-center gap-2 border border-border rounded-lg p-2">
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="p-1.5 hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val >= 1 && val <= 10) {
                  setQuantity(val);
                }
              }}
              className="flex-1 text-center bg-transparent border-0 focus:outline-none font-medium"
              aria-label="Quantity"
            />
            <button
              onClick={incrementQuantity}
              disabled={quantity >= 10}
              className="p-1.5 hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!hasAvailableVariants || !selectedVariantId || isLoading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Adding...
          </>
        ) : successMessage ? (
          <>
            <Check className="w-5 h-5" />
            {successMessage}
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            {hasAvailableVariants ? "Add to Cart" : "Out of Stock"}
          </>
        )}
      </button>

      {/* Availability Message */}
      {!hasAvailableVariants && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This product is currently unavailable.
          </p>
        </div>
      )}

      {/* Options Available Info */}
      {hasAvailableVariants && !selectedVariantId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300">
          {product.variants?.length} option{product.variants?.length !== 1 ? "s" : ""} available
        </div>
      )}
    </div>
  );
}
