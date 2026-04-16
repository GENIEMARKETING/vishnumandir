"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Checkout Cancelled Page
 * Displays if the user cancels the Stripe payment process.
 * Provides options to return to cart or continue shopping.
 * 
 * @returns {JSX.Element} The cancelled page
 */
export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">
          Payment Cancelled
        </h1>

        <p className="text-lg text-text-secondary mb-8">
          Your payment was cancelled. Your cart is still saved, and you can return to checkout whenever you&apos;re ready.
        </p>

        {/* Info Box */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow-sm">
          <div className="space-y-4">
            <div className="text-left">
              <p className="text-sm font-semibold text-text-primary mb-2">
                What happened?
              </p>
              <p className="text-sm text-text-secondary">
                You have cancelled the Stripe checkout. Your items remain in your shopping cart.
              </p>
            </div>
            <div className="text-left border-t border-border pt-4">
              <p className="text-sm font-semibold text-text-primary mb-2">
                What can you do?
              </p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Review your cart and proceed to checkout again</li>
                <li>• Continue shopping and add more items</li>
                <li>• Contact us if you experience any issues</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop/cart">
            <Button>
              Return to Cart
            </Button>
          </Link>
          <Link href="/shop">
            <button className="px-6 py-3 rounded-lg font-semibold bg-transparent border border-border text-text-primary hover:bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">
            Need assistance with your order?
          </p>
          <p className="text-sm text-text-primary font-medium">
            Contact us at <a href="mailto:info@vishnumandirtampa.org" className="text-primary hover:underline">
              info@vishnumandirtampa.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
