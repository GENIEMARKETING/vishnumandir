"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

export function CheckoutSuccessClient({ sessionId }: { sessionId?: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-4">
          Payment Successful!
        </h1>

        <p className="text-lg text-text-secondary mb-8">
          Thank you for your order. A confirmation email has been sent to your
          inbox with order details and tracking information.
        </p>

        {/* Order Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-8 shadow-sm">
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-text-secondary">
                Order Confirmation Email
              </p>
              <p className="text-lg font-semibold text-text-primary">
                Check your inbox for details
              </p>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-text-secondary mb-1">
                Estimated Delivery
              </p>
              <p className="text-lg font-semibold text-text-primary">
                5-7 Business Days
              </p>
            </div>
          </div>

          {/* Session ID for reference (if available) */}
          {sessionId && (
            <div className="text-xs text-text-secondary bg-gray-50 dark:bg-gray-700 p-3 rounded">
              Session ID: {sessionId.slice(0, 20)}...
            </div>
          )}
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            What&apos;s Next?
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2 text-left">
            <li>✓ Check your email for order confirmation</li>
            <li>✓ Click the tracking link in the email to monitor your package</li>
            <li>✓ Contact us if you have any questions about your order</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 rounded-lg font-semibold bg-transparent border border-border text-text-primary hover:bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
              Return Home
            </button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-text-secondary mb-2">Need help?</p>
          <p className="text-sm text-text-primary font-medium">
            Contact us at{" "}
            <a
              href="mailto:info@vishnumandirtampa.org"
              className="text-primary hover:underline"
            >
              info@vishnumandirtampa.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

