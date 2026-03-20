"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-temple-red hover:text-red-900 mb-10 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Back to Shop
          </Link>
          <div className="bg-white rounded-3xl p-16 border border-stone-100 shadow-sm">
            <div className="w-20 h-20 bg-temple-red/10 rounded-3xl flex items-center justify-center text-temple-red mx-auto mb-6">
              <ShoppingBag size={36} />
            </div>
            <h1 className="font-display text-3xl text-stone-800 mb-4">Your Cart is Empty</h1>
            <p className="text-stone-500 mb-8 leading-relaxed">
              Browse our collection of spiritual goods and add items to your cart.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md"
            >
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-temple-red hover:text-red-900 mb-5 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          <h1 className="font-display text-4xl text-stone-800">Shopping Cart</h1>
          <p className="text-stone-500 mt-1">{state.itemCount} {state.itemCount === 1 ? "item" : "items"} in cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 flex gap-4"
              >
                {/* Image */}
                {item.thumbnail && (
                  <div className="flex-shrink-0 w-24 h-24 relative rounded-xl overflow-hidden bg-stone-50">
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <Link href={`/shop/product/${item.handle}`}>
                    <h3 className="font-serif font-bold text-stone-800 hover:text-temple-red transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-400 mt-1">ID: {item.variantId.slice(0, 8)}</p>
                  <p className="text-lg font-bold text-temple-red mt-2">
                    ${(item.price / 100).toFixed(2)}
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <div className="flex items-center gap-1 border border-stone-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 rounded-lg transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      className="w-7 h-7 flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 rounded-lg transition-colors"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="flex items-center gap-1 text-stone-400 hover:text-red-500 transition-colors text-sm mt-3"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-7 sticky top-24">
              <h2 className="font-display text-2xl text-stone-800 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-stone-100 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>${(state.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Tax (8%)</span>
                  <span>${(state.tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Shipping</span>
                  <span>{state.shipping === 0 ? "Free" : `$${(state.shipping / 100).toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-7">
                <span className="font-bold text-stone-800 text-lg">Total</span>
                <span className="font-bold text-temple-red text-2xl">${(state.total / 100).toFixed(2)}</span>
              </div>

              <Link
                href="/shop/checkout"
                className="block w-full bg-temple-red text-white py-3.5 px-6 rounded-xl font-bold text-center hover:bg-red-900 transition-all shadow-md mb-3"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/shop"
                className="block w-full py-3 px-6 rounded-xl font-semibold text-center border-2 border-stone-200 text-stone-600 hover:border-temple-red/30 hover:text-temple-red transition-all"
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => clearCart()}
                className="w-full mt-4 text-sm text-stone-400 hover:text-stone-600 transition-colors py-2"
              >
                Clear Cart
              </button>

              {state.subtotal < 5000 && (
                <div className="mt-5 p-3 bg-temple-gold/10 border border-temple-gold/20 rounded-xl">
                  <p className="text-xs text-temple-orange font-medium text-center">
                    Add ${((5000 - state.subtotal) / 100).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
