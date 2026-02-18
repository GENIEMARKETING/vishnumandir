import type { Metadata } from "next";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchProductsWithVendors } from "@/lib/medusa";

export const metadata: Metadata = {
  title: "Vendors | Vishnu Mandir Shop - Browse Our Partners",
  description:
    "Discover our trusted vendor partners at Vishnu Mandir, Tampa. Explore unique spiritual items and products from our community makers.",
  keywords: [
    "vendors",
    "Vishnu Mandir shop vendors",
    "temple artisans",
    "spiritual goods",
    "Hindu merchandise Tampa",
    "temple partners",
  ],
  openGraph: {
    title: "Vendors | Vishnu Mandir Shop",
    description: "Discover our trusted vendor partners and their collections.",
    type: "website",
  },
};

// ISR revalidation: 5 minutes for vendor data
export const revalidate = 300;

/**
 * Fetch unique vendors from all products
 */
async function fetchAllVendors() {
  const result = await fetchProductsWithVendors();
  
  if (!result.ok) {
    return { ok: false, error: result.error, vendors: [] };
  }

  // Extract unique vendors with product counts
  const vendorMap = new Map<
    string,
    { slug: string; name: string; productCount: number }
  >();

  for (const product of result.data.products) {
    if (product.vendor?.slug) {
      const existing = vendorMap.get(product.vendor.slug);
      if (existing) {
        existing.productCount += 1;
      } else {
        vendorMap.set(product.vendor.slug, {
          slug: product.vendor.slug,
          name: product.vendor.name,
          productCount: 1,
        });
      }
    }
  }

  const vendors = Array.from(vendorMap.values()).sort(
    (a, b) => b.productCount - a.productCount
  );

  return { ok: true, error: null, vendors };
}

/**
 * Vendors page - displays all vendors with links to their storefronts
 */
export default async function VendorsPage() {
  const { ok, error, vendors } = await fetchAllVendors();

  const structuredData = generateWebPageSchema({
    name: "Vendors",
    description: "Browse our vendor partners and their product collections",
    url: "/shop/vendors",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Our Vendors
          </h1>
          <p className="text-xl text-text-secondary font-serif max-w-2xl">
            Discover the talented artisans and craftspeople who create our spiritual items and
            merchandise. Each vendor brings unique expertise and dedication to their craft.
          </p>
        </div>

        {/* Error State */}
        {!ok && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg dark:bg-red-900/20 dark:border-red-700">
            <div className="flex items-start gap-3">
              <Store className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
              <div>
                <h2 className="font-semibold text-red-800 dark:text-red-300 mb-1">
                  Unable to Load Vendors
                </h2>
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {error || "There was an issue loading our vendor information. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {ok && vendors.length === 0 && (
          <div className="bg-background rounded-xl p-12 border-2 border-primary/5 text-center">
            <Store className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-text-primary mb-2">
              No Vendors Available
            </h2>
            <p className="text-text-secondary">
              We're currently adding vendors to our platform. Please check back soon!
            </p>
          </div>
        )}

        {/* Vendors Grid */}
        {ok && vendors.length > 0 && (
          <>
            <div className="mb-8">
              <p className="text-text-secondary">
                {vendors.length} vendor{vendors.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor) => (
                <Link
                  key={vendor.slug}
                  href={`/shop/vendor/${vendor.slug}`}
                  className="group relative overflow-hidden rounded-xl border-2 border-primary/10 bg-gradient-to-br from-background to-background/50 p-8 hover:border-primary/30 transition-all hover:shadow-lg dark:from-gray-900 dark:to-gray-800"
                >
                  {/* Background accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Store className="w-6 h-6 text-primary" />
                    </div>

                    {/* Name */}
                    <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {vendor.name}
                    </h3>

                    {/* Product Count */}
                    <p className="text-sm text-text-secondary mb-6">
                      {vendor.productCount} product{vendor.productCount !== 1 ? "s" : ""}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                      <span>View Collection</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Browse All Products CTA */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <h2 className="font-serif text-2xl font-semibold text-text-primary mb-4">
            Browse All Products
          </h2>
          <Link
            href="/shop"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            View All Items
          </Link>
        </div>
      </main>
    </>
  );
}
