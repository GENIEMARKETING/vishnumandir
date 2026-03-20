import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generateWebPageSchema } from "@/lib/seo";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { VendorAttribution } from "@/components/shared/VendorAttribution";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { fetchProductsWithVendors } from "@/lib/medusa";
import type { MedusaProduct, MedusaProductsResponse } from "@/types/medusa";

interface ProductDetailPageProps {
  params: {
    handle: string;
  };
}

/**
 * Fetch a single product by handle from Medusa Store API with no caching.
 * Enriches the product with vendor information from the custom endpoint.
 * Uses cache: "no-store" for fresh data on every request.
 * 
 * @param handle - Product handle (slug)
 * @returns Promise with product (optionally with vendor) or error
 */
async function fetchProductDirect(handle: string): Promise<
  { ok: true; data: { product: MedusaProduct } } | { ok: false; error: string }
> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_MEDUSA_API_URL || "http://localhost:9000";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    if (!publishableKey) {
      console.error("[fetchProductDirect] Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY");
      return {
        ok: false,
        error: "Medusa configuration missing.",
      };
    }

    if (!handle) {
      console.error("[fetchProductDirect] Missing handle");
      return {
        ok: false,
        error: "Invalid product handle",
      };
    }

    // Fetch the standard product
    const url = `${apiUrl}/store/products?handle=${encodeURIComponent(handle)}`;
    console.log("[fetchProductDirect] Fetching from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      cache: "no-store", // Fresh data every time
    });

    if (!res.ok) {
      console.error("[fetchProductDirect] HTTP error:", res.status, res.statusText);
      return {
        ok: false,
        error: `Failed to fetch product: ${res.status}`,
      };
    }

    let product = (await res.json() as MedusaProductsResponse).products[0];

    if (!product) {
      console.error("[fetchProductDirect] No product found for handle:", handle);
      return {
        ok: false,
        error: "Product not found",
      };
    }

    // Enrich with vendor info from the custom endpoint
    try {
      const vendorsResult = await fetchProductsWithVendors();
      if (vendorsResult.ok) {
        const enrichedProduct = vendorsResult.data.products.find(
          (p) => p.id === product.id
        );
        if (enrichedProduct?.vendor) {
          product.vendor = enrichedProduct.vendor;
          console.log("[fetchProductDirect] Enriched product with vendor:", enrichedProduct.vendor);
        }
      }
    } catch (enrichError) {
      console.warn("[fetchProductDirect] Could not enrich with vendor info:", enrichError);
      // Continue without vendor enrichment - not a fatal error
    }

    console.log("[fetchProductDirect] Found product:", product.title);
    console.log("[fetchProductDirect] Product has vendor:", !!product.vendor);
    return { ok: true, data: { product } };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[fetchProductDirect] Error:", message);
    return {
      ok: false,
      error: `Failed to fetch product: ${message}`,
    };
  }
}

/**
 * Generate metadata for individual product pages using actual product data.
 */
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle || '';

  if (!handle || typeof handle !== 'string') {
    return {
      title: "Invalid Product | Vishnu Mandir Shop",
      description: "The requested product URL is not valid.",
    };
  }

  const result = await fetchProductDirect(handle);

  if (!result.ok) {
    return {
      title: "Product Not Found | Vishnu Mandir Shop",
      description: "The requested product could not be found.",
    };
  }

  const product = result.data.product;

  return {
    title: `${product.title} | Vishnu Mandir Shop`,
    description:
      product.description || `Product details for ${product.title} at Vishnu Mandir, Tampa.`,
    openGraph: {
      title: `${product.title} | Vishnu Mandir Shop`,
      description:
        product.description || `Product details for ${product.title}.`,
      type: "website",
    },
  };
}

/**
 * Product Detail Page - Displays full product information from Medusa.
 * @returns {JSX.Element} The rendered product detail page
 */
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Extract handle from params - params may be a Promise in some contexts
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle || '';

  if (!handle || typeof handle !== 'string') {
    return (
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-temple-red hover:text-red-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        {/* Error Message */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg dark:bg-red-900/20 dark:border-red-700">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
            <div>
              <h1 className="font-semibold text-red-800 dark:text-red-300 mb-1 text-lg">
                Invalid Product URL
              </h1>
              <p className="text-red-700 dark:text-red-400 text-sm">
                The product URL is not valid. Please use a proper product handle.
              </p>
            </div>
          </div>
        </div>

        {/* Return to Shop CTA */}
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-block bg-temple-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  const result = await fetchProductDirect(handle);

  // Error state - Product not found
  if (!result.ok) {
    return (
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-temple-red hover:text-red-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        {/* Error Message */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg dark:bg-red-900/20 dark:border-red-700">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 dark:text-red-400" />
            <div>
              <h1 className="font-semibold text-red-800 dark:text-red-300 mb-1 text-lg">
                Product Not Found
              </h1>
              <p className="text-red-700 dark:text-red-400 text-sm">
                {result.error || "The product you're looking for doesn't exist."}
              </p>
            </div>
          </div>
        </div>

        {/* Return to Shop CTA */}
        <div className="mt-8">
          <Link
            href="/shop"
            className="inline-block bg-temple-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  const product = result.data.product;
  const imageUrl = product.images?.[0]?.url || product.thumbnail;

  const structuredData = generateWebPageSchema({
    name: product.title,
    description: product.description || "Product details",
    url: `/shop/product/${handle}`,
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
          className="inline-flex items-center gap-2 text-temple-red hover:text-red-900 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div>
            {imageUrl ? (
              <div className="relative w-full h-96 rounded-xl overflow-hidden bg-stone-50 dark:bg-gray-800 border-2 border-temple-red/10">
                <Image
                  src={imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="w-full h-96 rounded-xl overflow-hidden bg-stone-50 dark:bg-gray-800 border-2 border-temple-red/10 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingBag className="w-16 h-16 text-temple-red/30 mx-auto mb-4" />
                  <p className="text-stone-500 text-sm">No image available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-temple-red mb-4">
              {product.title}
            </h1>

            {/* Subtitle */}
            {product.subtitle && (
              <p className="text-xl text-stone-500 font-serif mb-6">{product.subtitle}</p>
            )}

            {/* Vendor Attribution */}
            <VendorAttribution tags={product.tags} vendor={product.vendor} variant="detail" />

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold text-text-temple-red mb-3">
                  Description
                </h2>
                <p className="text-stone-500 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Options/Variants */}
            {product.options && product.options.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-xl font-semibold text-text-temple-red mb-4">
                  Available Options
                </h2>
                <div className="space-y-4">
                  {product.options.map((option) => (
                    <div key={option.id}>
                      <h3 className="font-medium text-text-temple-red mb-2">{option.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {option.values && option.values.length > 0 ? (
                          option.values.map((value) => (
                            <span
                              key={value.id}
                              className="px-3 py-2 rounded-lg bg-temple-red/10 text-temple-red font-medium text-sm dark:bg-temple-red/20"
                            >
                              {value.value}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-500 text-sm">No options available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variants Count */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8 p-4 bg-stone-50 rounded-lg border border-temple-red/10 dark:bg-gray-800">
                <p className="text-stone-500">
                  <span className="font-medium text-text-temple-red">
                    {product.variants.length} variant{product.variants.length !== 1 ? "s" : ""}
                  </span>{" "}
                  available
                </p>
              </div>
            )}

            {/* Add to Cart Button */}
            <AddToCartButton product={product} />

            {/* Contact Link */}
            <Link
              href="/about/contact"
              className="mt-6 inline-block text-temple-red hover:text-red-900 font-medium transition-colors"
            >
              Have questions? Contact us →
            </Link>
          </div>
        </div>

        {/* Related Products Placeholder */}
        <div className="border-t border-border pt-12">
          <h2 className="font-serif text-3xl font-semibold text-text-temple-red mb-6">
            More Products
          </h2>
          <Link
            href="/shop"
            className="inline-block bg-temple-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </main>
    </>
  );
}
