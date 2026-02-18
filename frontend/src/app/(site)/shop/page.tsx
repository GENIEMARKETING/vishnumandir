import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchProductsWithVendors } from "@/lib/medusa";
import { ProductCard } from "@/components/shared/ProductCard";

export const metadata: Metadata = {
  title: "Shop | Vishnu Mandir, Tampa - Products & Merchandise",
  description:
    "Browse and purchase temple merchandise, spiritual items, and products at Vishnu Mandir, Tampa. Authentic Hindu products and sacred items.",
  keywords: [
    "Vishnu Mandir shop",
    "Hindu merchandise Tampa",
    "temple products",
    "spiritual items",
    "Hindu gifts",
    "sacred items Tampa",
  ],
  openGraph: {
    title: "Shop | Vishnu Mandir, Tampa",
    description: "Browse temple merchandise and spiritual products.",
    type: "website",
  },
};

// ISR revalidation: 5 minutes for shop products
export const revalidate = 300;

/**
 * Shop page - Browse and view products from Medusa.
 * @returns {JSX.Element} The rendered shop page
 */
export default async function ShopPage() {
  const structuredData = generateWebPageSchema({
    name: "Shop",
    description: "Browse products and merchandise at Vishnu Mandir, Tampa",
    url: "/shop",
  });

  // Fetch products with vendor information from custom endpoint
  const result = await fetchProductsWithVendors();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
          Temple Shop
        </h1>
        <p className="text-xl text-text-secondary mb-8 font-serif">
          Explore our collection of spiritual items and temple merchandise.
        </p>

        {/* Navigation Links */}
        <div className="flex gap-4 mb-8">
          <a href="/shop/vendors" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
            Browse Vendors
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Error State */}
        {!result.ok && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg dark:bg-red-900/20 dark:border-red-700">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Unable to Load Products
                </h3>
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {result.error || "There was an issue loading the shop. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {result.ok && result.data.products.length === 0 && (
          <div className="bg-background rounded-xl p-12 border-2 border-primary/5 text-center">
            <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-2">
              No Products Available
            </h2>
            <p className="text-text-secondary">
              We're currently updating our shop. Please check back soon!
            </p>
          </div>
        )}

        {/* Product Grid */}
        {result.ok && result.data.products.length > 0 && (
          <section>
            <div className="mb-6">
              <p className="text-text-secondary">
                Showing {result.data.products.length} product
                {result.data.products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
