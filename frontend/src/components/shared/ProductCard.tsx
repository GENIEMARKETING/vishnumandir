"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { MedusaProduct } from "@/types/medusa";

interface ProductCardProps {
  product: MedusaProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  if (!product) return null;

  const imageUrl = product.images?.[0]?.url || product.thumbnail;
  const truncatedDescription = product.description
    ? product.description.substring(0, 90) + (product.description.length > 90 ? "..." : "")
    : null;
  const productLink = `/shop/product/${product.handle}`;

  return (
    <Link href={productLink} className="group block h-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-temple-red/20 transition-all duration-300 h-full flex flex-col">

        {/* Product image */}
        <div className="relative h-52 overflow-hidden bg-stone-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-stone-300" />
            </div>
          )}

          {/* Variant badge */}
          {product.variants && product.variants.length > 1 && (
            <span className="absolute top-3 left-3 bg-temple-gold text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {product.variants.length} variants
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-base font-bold text-stone-800 group-hover:text-temple-red transition-colors mb-2 line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {truncatedDescription && (
            <p className="text-stone-500 text-sm leading-relaxed mb-3 line-clamp-2 flex-1">
              {truncatedDescription}
            </p>
          )}

          {/* Sold by */}
          <p className="text-xs text-stone-400 mb-4">Sold by Vishnu Mandir</p>

          {/* CTA */}
          <button className="w-full bg-temple-red text-white py-2.5 px-4 rounded-xl font-semibold text-sm hover:bg-red-900 active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto">
            <ShoppingBag size={15} />
            View Product
          </button>
        </div>
      </div>
    </Link>
  );
}
