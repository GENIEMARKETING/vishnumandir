import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchPujaServices, fetchPriests } from "@/lib/strapi";
import { PujaWorshipTabs } from "@/components/shared/PujaWorshipTabs";
import { ReligiousAnimations } from "@/components/animations/ReligiousAnimations";

export const metadata: Metadata = {
  title: "Puja & Worship | Vishnu Mandir, Tampa - Schedule, Services & Priests",
  description:
    "View puja schedules, browse puja services with pricing, and meet our priests at Vishnu Mandir, Tampa.",
  openGraph: {
    title: "Puja & Worship | Vishnu Mandir, Tampa",
    description: "Schedule, services, and priests at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function PujaWorshipPage() {
  const structuredData = generateWebPageSchema({
    name: "Puja & Worship",
    description: "Puja schedule, services, and priests at Vishnu Mandir, Tampa",
    url: "/religious/puja-worship",
  });

  const [allServices, allPriests] = await Promise.all([
    fetchPujaServices(),
    fetchPriests(),
  ]);

  const pujaServices = allServices.filter((s) => s?.attributes);
  const priests = allPriests.filter((p) => p?.attributes);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ReligiousAnimations />

      {/* ── PAGE HERO ─────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-temple-red">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hero-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-pat)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span data-gsap="page-hero-tag" className="inline-block text-temple-gold font-serif italic text-lg mb-4 opacity-0">
            Daily Worship at Vishnu Mandir
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Puja & Worship
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Find worship timings, explore our puja services, and meet the dedicated priests who serve our community.
          </p>
        </div>
      </section>

      {/* ── TABBED CONTENT ────────────────────────────────────────────── */}
      <PujaWorshipTabs pujaServices={pujaServices} priests={priests} />
    </>
  );
}
