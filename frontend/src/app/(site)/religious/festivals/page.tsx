import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { ReligiousAnimations } from "@/components/animations/ReligiousAnimations";

export const metadata: Metadata = {
  title: "Hindu Festivals | Vishnu Mandir, Tampa - Celebrations & Events",
  description:
    "Explore major Hindu festivals celebrated at Vishnu Mandir, Tampa including Diwali, Navratri, Janmashtami, and more.",
  openGraph: {
    title: "Hindu Festivals | Vishnu Mandir, Tampa",
    description: "Major Hindu festivals and celebrations at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const festivals = [
  {
    name: "Diwali",
    image: "/images/festivals/festival-diwali.jpg",
    season: "Fall",
    time: "October / November",
    description: "The Festival of Lights celebrating the victory of light over darkness. Features Lakshmi Puja, fireworks, sweets, and community celebrations.",
    highlights: ["Lakshmi Puja", "Fireworks Display", "Community Gathering", "Cultural Programs"],
    deity: "Goddess Lakshmi",
  },
  {
    name: "Navratri",
    image: "/images/festivals/festival-navratri.jpg",
    season: "Fall",
    time: "March/April & September/October",
    description: "Nine nights dedicated to Goddess Durga, featuring daily special pujas, vibrant Garba and Dandiya dances, and community celebrations.",
    highlights: ["Daily Durga Puja", "Garba & Dandiya", "Havan", "Cultural Performances"],
    deity: "Goddess Durga",
  },
  {
    name: "Janmashtami",
    image: "/images/festivals/festival-janmashtami.jpg",
    season: "Summer",
    time: "August / September",
    description: "Birthday celebration of Lord Krishna featuring midnight puja, devotional bhajans, Dahi Handi, and beautiful Krishna decorations.",
    highlights: ["Midnight Puja", "Krishna Bhajans", "Dahi Handi", "Procession"],
    deity: "Lord Krishna",
  },
  {
    name: "Ganesh Chaturthi",
    image: "/images/festivals/festival-ganesh-chaturthi.jpg",
    season: "Summer",
    time: "August / September",
    description: "Joyful celebration of Lord Ganesha's birthday with special pujas, modak offerings, music, and community festivities.",
    highlights: ["Ganesh Puja", "Modak Prasad", "Cultural Programs", "Visarjan"],
    deity: "Lord Ganesha",
  },
  {
    name: "Holi",
    image: "/images/festivals/festival-holi.jpg",
    season: "Spring",
    time: "March",
    description: "The Festival of Colors welcoming spring and celebrating the victory of good over evil. Includes color play, music, and community bonding.",
    highlights: ["Color Celebration", "Holika Dahan", "Community Feast", "Music & Dance"],
    deity: "Lord Vishnu",
  },
  {
    name: "Rama Navami",
    image: "/images/festivals/festival-rama-navami.jpg",
    season: "Spring",
    time: "March / April",
    description: "Birthday celebration of Lord Rama featuring special pujas, Ramayana recitations, devotional singing, and temple decorations.",
    highlights: ["Ram Puja", "Ramayana Recitation", "Bhajans", "Prasad Distribution"],
    deity: "Lord Rama",
  },
];

const seasons = ["Spring", "Summer", "Fall"] as const;
const seasonColors: Record<string, string> = {
  Spring: "bg-green-100 text-green-700",
  Summer: "bg-orange-100 text-orange-700",
  Fall: "bg-amber-100 text-amber-700",
};

export default function FestivalsPage() {
  const structuredData = generateWebPageSchema({
    name: "Hindu Festivals",
    description: "Major Hindu festivals celebrated at Vishnu Mandir, Tampa",
    url: "/religious/festivals",
  });

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
            Celebrations Throughout the Year
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Festivals & Celebrations
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Join us throughout the year as we celebrate the rich tapestry of Hindu festivals with devotion, color, music, and community.
          </p>
        </div>
      </section>

      {/* ── FESTIVALS BY SEASON ───────────────────────────────────────── */}
      {seasons.map((season) => {
        const seasonFests = festivals.filter((f) => f.season === season);
        if (!seasonFests.length) return null;
        return (
          <section key={season} className="py-20 even:bg-stone-50 odd:bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div data-gsap="section-heading" className="flex items-center gap-4 mb-12 opacity-0">
                <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
                <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">{season}</h2>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {seasonFests.map((festival, i) => (
                  <div
                    key={i}
                    data-gsap="festival-card"
                    className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md hover:shadow-xl transition-all duration-500 opacity-0"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={festival.image}
                        alt={festival.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Season badge */}
                      <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full ${seasonColors[season]}`}>
                        {festival.time}
                      </span>

                      {/* Deity badge */}
                      <span className="absolute top-4 right-4 bg-temple-gold/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {festival.deity}
                      </span>

                      {/* Festival name over image */}
                      <div className="absolute bottom-4 left-6">
                        <h3 className="font-display text-2xl font-bold text-white">{festival.name}</h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-stone-600 text-sm leading-relaxed">{festival.description}</p>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-2">
                        {festival.highlights.map((h, j) => (
                          <span key={j} className="bg-temple-red/5 border border-temple-red/10 text-temple-red text-xs font-medium px-3 py-1 rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CALENDAR CTA ──────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div data-gsap="cta-block" className="max-w-3xl mx-auto px-4 text-center opacity-0">
          <div className="bg-white rounded-3xl p-10 border border-stone-100 shadow-md">
            <div className="w-14 h-14 bg-temple-red/10 rounded-2xl flex items-center justify-center text-temple-red mx-auto mb-6">
              <Calendar size={28} />
            </div>
            <h2 className="font-display text-3xl text-temple-red mb-4">See Exact Dates</h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Festival dates follow the Hindu calendar and change each year. Check our events calendar for exact dates, times, and special event details.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/calendar/current-events" className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
                <Calendar size={18} /> View Calendar
              </Link>
              <Link href="/calendar/newsletter" className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-8 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
                Subscribe to Newsletter <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
