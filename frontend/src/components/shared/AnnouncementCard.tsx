import Image from "next/image";
import Link from "next/link";
import { Info, AlertCircle } from "lucide-react";
import type { StrapiAnnouncement } from "@/types/strapi";

interface AnnouncementCardProps {
  announcement: StrapiAnnouncement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  if (!announcement?.attributes) return null;

  const { attributes } = announcement;
  const isHighPriority = attributes.level === "High-Priority";

  // Resolve image URL
  const strapiBase = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
  const rawUrl =
    attributes.image?.data?.attributes?.url ??
    (attributes.image as unknown as { url?: string })?.url;
  const imageUrl = rawUrl
    ? rawUrl.startsWith("http") ? rawUrl : `${strapiBase}${rawUrl}`
    : null;

  // Clean up content text
  const contentText =
    typeof attributes.content === "string"
      ? attributes.content.replace(/<[^>]*>/g, "").trim()
      : String(attributes.content ?? "");

  return (
    <Link
      href="/calendar/current-events"
      className="group block bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
    >
      {/* Image — full natural height, no cropping */}
      {imageUrl ? (
        <div className="relative w-full overflow-hidden">
          {isHighPriority && (
            <span className="absolute top-3 left-3 z-10 bg-temple-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              Important
            </span>
          )}
          <Image
            src={imageUrl}
            alt={attributes.title}
            width={0}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
            style={{ width: "100%", height: "auto" }}
            className="group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-temple-red/10 to-temple-gold/10 flex items-center justify-center">
          <div className="p-4 bg-white/60 rounded-2xl">
            {isHighPriority
              ? <AlertCircle size={32} className="text-temple-orange" />
              : <Info size={32} className="text-temple-red" />
            }
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className={`w-8 h-0.5 rounded-full mb-3 ${isHighPriority ? "bg-temple-gold" : "bg-temple-red"}`} />
        <h3 className={`font-serif text-lg font-bold leading-snug mb-2 group-hover:text-temple-red transition-colors ${
          isHighPriority ? "text-temple-orange" : "text-stone-800"
        }`}>
          {attributes.title}
        </h3>
        {contentText && (
          <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">
            {contentText}
          </p>
        )}
        <p className="text-temple-red text-xs font-semibold mt-3 group-hover:underline">
          Read more →
        </p>
      </div>
    </Link>
  );
}
