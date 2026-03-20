import type { Metadata } from "next";
import Link from "next/link";
import { Store, ArrowRight, ShoppingBag } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchProductsWithVendors } from "@/lib/medusa";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Vendors | Vishnu Mandir Shop - Browse Our Partners",
  description: "Discover our trusted vendor partners at Vishnu Mandir, Tampa.",
  openGraph: { title: "Vendors | Vishnu Mandir Shop", type: "website" },
};

export const revalidate = 300;

async function fetchAllVendors() {
  const result = await fetchProductsWithVendors();
  if (!result.ok) return { ok: false as const, error: result.error, vendors: [] };

  const vendorMap = new Map<string, { slug: string; name: string; productCount: number }>();
  for (const product of result.data.products) {
    if (product.vendor?.slug) {
      const existing = vendorMap.get(product.vendor.slug);
      if (existing) existing.productCount += 1;
      else vendorMap.set(product.vendor.slug, { slug: product.vendor.slug, name: product.vendor.name, productCount: 1 });
    }
  }
  return { ok: true as const, error: null, vendors: Array.from(vendorMap.values()).sort((a, b) => b.productCount - a.productCount) };
}

export default async function VendorsPage() {
  const { ok, error, vendors } = await fetchAllVendors();
  const structuredData = generateWebPageSchema({ name: "Vendors", description: "Browse vendor partners", url: "/shop/vendors" });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Our Trusted Partners"
        title="Shop by Vendor"
        subtitle="Explore unique spiritual items and products from our curated community of trusted vendors and makers."
        patternId="vendors-pat"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div data-gsap="section-heading" className="flex items-center justify-between mb-12 opacity-0">
            <div className="flex items-center gap-4">
              <div data-gsap="gold-line" data-width="40px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">All Vendors</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-temple-red font-medium hover:underline text-sm">
              <ShoppingBag size={15} /> All Products
            </Link>
          </div>

          {!ok && (
            <div data-gsap="fade-up" className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center opacity-0">
              <p className="text-red-600">{error || "Unable to load vendors. Please try again later."}</p>
            </div>
          )}

          {ok && vendors.length === 0 && (
            <div data-gsap="fade-up" className="text-center py-20 opacity-0">
              <div className="w-20 h-20 bg-temple-red/10 rounded-3xl flex items-center justify-center text-temple-red mx-auto mb-6">
                <Store size={36} />
              </div>
              <h2 className="font-display text-2xl text-stone-800 mb-3">No Vendors Yet</h2>
              <p className="text-stone-500">Vendor profiles will appear here once products are added to the shop.</p>
            </div>
          )}

          {ok && vendors.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((vendor, i) => (
                <Link
                  key={vendor.slug}
                  href={`/shop/vendor/${vendor.slug}`}
                  data-gsap="card"
                  className="group bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-temple-red/20 hover:-translate-y-1 transition-all duration-300 p-7 flex flex-col opacity-0"
                >
                  <div className="w-14 h-14 bg-temple-red/10 rounded-2xl flex items-center justify-center text-temple-red mb-5 group-hover:bg-temple-red group-hover:text-white transition-all duration-300">
                    <Store size={26} />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-800 group-hover:text-temple-red transition-colors mb-2">
                    {vendor.name}
                  </h3>
                  <p className="text-stone-500 text-sm mb-5">
                    {vendor.productCount} {vendor.productCount === 1 ? "product" : "products"}
                  </p>
                  <div className="flex items-center gap-1 text-temple-red text-sm font-semibold mt-auto group-hover:gap-2 transition-all">
                    View Collection <ArrowRight size={15} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
