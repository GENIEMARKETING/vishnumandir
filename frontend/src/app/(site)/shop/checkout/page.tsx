"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";

interface CheckoutFormData {
  email: string;
  fullName: string;
  phone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddressSame: boolean;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

/**
 * Checkout Page
 * Collects customer information and payment details to create a Stripe checkout session.
 * Displays order summary and checkout form.
 * 
 * @returns {JSX.Element} The checkout page
 */
export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    fullName: "",
    phone: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "US",
    },
    billingAddressSame: true,
  });

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-bold text-text-primary mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-text-secondary mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link href="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: "shipping" | "billing"
  ) => {
    const { name, value } = e.target;

    if (section === "shipping") {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [name]: value,
        },
      }));
    } else if (section === "billing") {
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
          ...prev.billingAddress,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate required fields
      if (
        !formData.email ||
        !formData.fullName ||
        !formData.shippingAddress.street ||
        !formData.shippingAddress.city ||
        !formData.shippingAddress.state ||
        !formData.shippingAddress.zip
      ) {
        throw new Error("Please fill in all required shipping address fields");
      }

      // Validate billing address if different from shipping
      if (!formData.billingAddressSame && formData.billingAddress) {
        if (
          !formData.billingAddress.street ||
          !formData.billingAddress.city ||
          !formData.billingAddress.state ||
          !formData.billingAddress.zip
        ) {
          throw new Error("Please fill in all required billing address fields");
        }
      }

      // Create checkout session
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: state.items,
          customerEmail: formData.email,
          customerName: formData.fullName,
          customerPhone: formData.phone,
          shippingAddress: formData.shippingAddress,
          billingAddress: formData.billingAddressSame
            ? formData.shippingAddress
            : formData.billingAddress,
          totals: {
            subtotal: state.subtotal,
            tax: state.tax,
            shipping: state.shipping,
            total: state.total,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link
          href="/shop/cart"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/90 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-serif font-bold text-text-primary mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Contact Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-text-primary mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.shippingAddress.street}
                      onChange={(e) => handleInputChange(e, "shipping")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="Tampa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.shippingAddress.state}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="FL"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        required
                        value={formData.shippingAddress.zip}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="33602"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.shippingAddress.country}
                        onChange={(e) => handleInputChange(e, "shipping")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="billingAddressSame"
                    checked={formData.billingAddressSame}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        billingAddressSame: e.target.checked,
                        billingAddress: e.target.checked ? undefined : prev.billingAddress || { street: "", city: "", state: "", zip: "", country: "US" },
                      }))
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                  <label
                    htmlFor="billingAddressSame"
                    className="ml-3 text-sm font-medium text-text-primary"
                  >
                    Billing address is the same as shipping address
                  </label>
                </div>

                {!formData.billingAddressSame && (
                  <div className="space-y-4 mt-4 pt-4 border-t border-border">
                    <h3 className="font-semibold text-text-primary">
                      Billing Address
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        required
                        value={formData.billingAddress?.street || ""}
                        onChange={(e) => handleInputChange(e, "billing")}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.billingAddress?.city || ""}
                          onChange={(e) => handleInputChange(e, "billing")}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                          placeholder="Tampa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.billingAddress?.state || ""}
                          onChange={(e) => handleInputChange(e, "billing")}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                          placeholder="FL"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zip"
                          required
                          value={formData.billingAddress?.zip || ""}
                          onChange={(e) => handleInputChange(e, "billing")}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                          placeholder="33602"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.billingAddress?.country || "US"}
                          onChange={(e) => handleInputChange(e, "billing")}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="MX">Mexico</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3"
              >
                {isLoading ? "Processing..." : "Continue to Payment"}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {state.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-text-secondary">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="text-text-primary font-medium">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal:</span>
                  <span>${(state.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Tax (8%):</span>
                  <span>${(state.tax / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping:</span>
                  <span>
                    {state.shipping === 0 ? "Free" : `$${(state.shipping / 100).toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-text-primary">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ${(state.total / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Info */}
              <div className="text-xs text-text-secondary text-center">
                <p>🔒 Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
