import type { Metadata } from "next";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchProducts } from "@/lib/medusa";
import { ProductCard } from "@/components/shared/ProductCard";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Shop | Vishnu Mandir, Tampa - Spiritual Items & Temple Merchandise",
  description:
    "Browse and purchase temple merchandise, spiritual items, and products at Vishnu Mandir, Tampa. Authentic Hindu products and sacred items.",
  openGraph: {
    title: "Shop | Vishnu Mandir, Tampa",
    description: "Browse temple merchandise and spiritual products.",
    type: "website",
  },
};

export const revalidate = 300;

export default async function ShopPage() {
  const structuredData = generateWebPageSchema({
    name: "Shop",
    description: "Browse products and merchandise at Vishnu Mandir, Tampa",
    url: "/shop",
  });

  const result = await fetchProducts();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Temple Merchandise & Sacred Items"
        title="Temple Shop"
        subtitle="Explore our curated collection of authentic spiritual items, temple merchandise, and sacred goods."
        patternId="shop-pat"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top bar */}
          <div data-gsap="section-heading" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 opacity-0">
            <div>
              <div className="flex items-center gap-4 mb-1">
                <div data-gsap="gold-line" data-width="40px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
                <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">All Products</h2>
              </div>
              {result.ok && (
                <p className="text-stone-500 text-sm mt-1 ml-12">
                  {result.data.products.length} item{result.data.products.length !== 1 ? "s" : ""} available
                </p>
              )}
            </div>
          </div>

          {/* Error state */}
          {!result.ok && (
            <div data-gsap="fade-up" className="bg-red-50 border border-red-200 rounded-2xl p-8 flex items-start gap-4 opacity-0">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Unable to Load Products</h3>
                <p className="text-red-600 text-sm">{result.error || "There was an issue loading the shop. Please try again later."}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {result.ok && result.data.products.length === 0 && (
            <div data-gsap="fade-up" className="text-center py-20 opacity-0">
              <div className="w-20 h-20 bg-temple-red/10 rounded-3xl flex items-center justify-center text-temple-red mx-auto mb-6">
                <ShoppingBag size={36} />
              </div>
              <h2 className="font-display text-2xl text-stone-800 mb-3">Shop Coming Soon</h2>
              <p className="text-stone-500 max-w-md mx-auto">
                We&apos;re currently curating our collection. Check back soon for spiritual items and temple merchandise.
              </p>
            </div>
          )}

          {/* Product grid */}
          {result.ok && result.data.products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.data.products.map((product, i) => (
                <div key={product.id} data-gsap="card" className="opacity-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
