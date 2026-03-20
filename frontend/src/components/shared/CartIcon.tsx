"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

/**
 * CartIcon component - Displays shopping cart icon with item count badge.
 * Located in header for quick access to cart.
 * 
 * @returns JSX.Element The rendered cart icon with badge
 */
export function CartIcon() {
  const { state } = useCart();

  return (
    <Link
      href="/shop/cart"
      className="relative p-2 rounded-lg hover:bg-background/80 transition-colors"
      aria-label={`Shopping cart with ${state.itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6 text-text-primary" />
      
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {state.itemCount > 99 ? "99+" : state.itemCount}
        </span>
      )}
    </Link>
  );
}
