import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { ProductCard } from "@/components/shared/ProductCard";
import { fetchProductsWithVendors } from "@/lib/medusa";
import type { MedusaProductsResponse } from "@/types/medusa";

interface VendorPageProps {
  params: {
    vendorSlug: string;
  };
}

/**
 * Generate metadata for vendor pages.
 */
export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const vendorSlug = resolvedParams?.vendorSlug || '';

  if (!vendorSlug || typeof vendorSlug !== 'string') {
    return {
      title: "Vendor Not Found | Vishnu Mandir Shop",
      description: "The requested vendor store could not be found.",
    };
  }

  // Fetch products to find vendor name from API response
  const result = await fetchProductsWithVendors();
  
  if (!result.ok) {
    return {
      title: "Vendor Shop | Vishnu Mandir, Tampa",
      description: "Browse products from our vendors.",
    };
  }

  // Find first product with matching vendor slug
  const matchingProduct = result.data.products.find(
    (product) => product.vendor?.slug === vendorSlug
  );

  const vendorName = matchingProduct?.vendor?.name || 'Vendor';

  return {
    title: `${vendorName} | Vishnu Mandir Shop`,
    description: `Shop products from ${vendorName} at Vishnu Mandir, Tampa.`,
  };
}

/**
 * Vendor storefront page - displays products from a specific vendor.
 * Uses products from the custom Store API endpoint with vendor information.
 * @returns {JSX.Element} The rendered vendor page
 */
export default async function VendorPage({ params }: VendorPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const vendorSlug = resolvedParams?.vendorSlug || '';

  // Fetch products with vendor information from custom endpoint
  const result = await fetchProductsWithVendors();

  // Filter products by vendor slug from API response
  const filteredProducts = result.ok
    ? result.data.products.filter((product) =>
        product.vendor?.slug === vendorSlug
      )
    : [];

  // Get vendor name from first matching product
  const vendorName = filteredProducts[0]?.vendor?.name || null;

  const structuredData = generateWebPageSchema({
    name: vendorName ? `${vendorName} Store` : "Vendor Store",
    description: `Browse products from ${vendorName || "this vendor"} at Vishnu Mandir, Tampa`,
    url: `/shop/vendor/${vendorSlug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

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
                  {result.error || "There was an issue loading products. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Not Found State */}
        {(result.ok && filteredProducts.length === 0) && (
          <div className="bg-background rounded-xl p-12 border-2 border-primary/5 text-center">
            <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-2">
              Vendor Not Found
            </h2>
            <p className="text-text-secondary mb-6">
              We couldn't find a vendor matching "{vendorSlug}".
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        )}

        {/* Vendor Page */}
        {result.ok && vendorName && filteredProducts.length > 0 && (
          <>
            {/* Vendor Header */}
            <div className="mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {vendorName}
              </h1>
              <p className="text-xl text-text-secondary font-serif">
                Explore our collection of products from {vendorName}.
              </p>
            </div>

            {/* Product Count */}
            <section>
              <div className="mb-6">
                <p className="text-text-secondary">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
