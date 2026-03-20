import type { Metadata } from "next";
import { BookOpen, Download, Mail } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { ReligiousAnimations } from "@/components/animations/ReligiousAnimations";

export const metadata: Metadata = {
  title: "Prayer Books & Resources | Vishnu Mandir, Tampa - Download PDFs",
  description:
    "Download prayer books, slokas, and religious materials from Vishnu Mandir, Tampa. Access PDFs for daily prayers, mantras, and spiritual practice.",
  openGraph: {
    title: "Prayer Books & Resources | Vishnu Mandir, Tampa",
    description: "Download prayer books, slokas, and religious materials in PDF format.",
    type: "website",
  },
};

const resources = [
  {
    name: "Daily Prayers",
    description: "Collection of daily prayers, mantras, and slokas for morning and evening worship. Includes Vishnu Sahasranama, Hanuman Chalisa, and more.",
    category: "Daily Practice",
    icon: "🌅",
    tags: ["Morning Prayers", "Evening Aarti", "Mantras"],
    available: false,
  },
  {
    name: "Festival Prayers",
    description: "Special prayers and mantras for major Hindu festivals including Diwali, Navratri, Janmashtami, and other celebrations.",
    category: "Festivals",
    icon: "🪔",
    tags: ["Diwali", "Navratri", "Janmashtami"],
    available: false,
  },
  {
    name: "Deity Slokas",
    description: "Devotional hymns and slokas dedicated to various Hindu deities including Vishnu, Shiva, Ganesha, Lakshmi, Saraswati, and Hanuman.",
    category: "Devotional",
    icon: "🛕",
    tags: ["Vishnu", "Shiva", "Ganesha", "Lakshmi"],
    available: false,
  },
  {
    name: "Aarti Collection",
    description: "Traditional Aarti songs and prayers performed during daily worship ceremonies at the temple and at home.",
    category: "Aarti",
    icon: "🕯️",
    tags: ["Morning Aarti", "Evening Aarti", "Special Aarti"],
    available: false,
  },
  {
    name: "Ceremony Guide",
    description: "Step-by-step guides for performing key Hindu ceremonies at home including Satyanarayan Puja, Griha Pravesh, and daily Puja.",
    category: "Ceremonies",
    icon: "📿",
    tags: ["Satyanarayan", "Home Puja", "Griha Pravesh"],
    available: false,
  },
  {
    name: "Children's Prayers",
    description: "Simple prayers, stories, and slokas designed for children and youth to learn the basics of Hindu worship and traditions.",
    category: "Youth",
    icon: "🌟",
    tags: ["Beginner", "Children", "Stories"],
    available: false,
  },
];

const categoryColors: Record<string, string> = {
  "Daily Practice": "bg-blue-50 text-blue-700 border-blue-100",
  "Festivals": "bg-orange-50 text-orange-700 border-orange-100",
  "Devotional": "bg-purple-50 text-purple-700 border-purple-100",
  "Aarti": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Ceremonies": "bg-green-50 text-green-700 border-green-100",
  "Youth": "bg-pink-50 text-pink-700 border-pink-100",
};

export default function PrayerBooksPage() {
  const structuredData = generateWebPageSchema({
    name: "Prayer Books & Resources",
    description: "Downloadable prayer books and religious resources from Vishnu Mandir, Tampa",
    url: "/religious/prayer-books",
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
            Spiritual Resources
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Prayer Books & Resources
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Download prayer books, slokas, and spiritual materials to support your daily practice and deepen your connection with the divine.
          </p>
        </div>
      </section>

      {/* ── RESOURCES GRID ────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Resource Library</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Free spiritual resources for your daily practice</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => (
              <div
                key={i}
                data-gsap="service-card"
                className="group bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-6 opacity-0"
              >
                {/* Icon + Category */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{resource.icon}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColors[resource.category]}`}>
                    {resource.category}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-800 mb-2 group-hover:text-temple-red transition-colors">
                  {resource.name}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{resource.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {resource.tags.map((tag, j) => (
                    <span key={j} className="bg-stone-100 text-stone-500 text-xs px-2.5 py-1 rounded-full">{tag}</span>
                  ))}
                </div>

                {/* Download button */}
                <button
                  disabled={!resource.available}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    resource.available
                      ? "bg-temple-red text-white hover:bg-red-900"
                      : "bg-stone-100 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  <Download size={16} />
                  {resource.available ? "Download PDF" : "Coming Soon"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REQUEST RESOURCES ─────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div data-gsap="cta-block" className="max-w-2xl mx-auto px-4 text-center opacity-0">
          <div className="bg-white rounded-3xl p-10 border border-stone-100 shadow-md">
            <div className="w-14 h-14 bg-temple-red/10 rounded-2xl flex items-center justify-center text-temple-red mx-auto mb-6">
              <BookOpen size={28} />
            </div>
            <h2 className="font-display text-3xl text-temple-red mb-4">Need a Specific Resource?</h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              If you need a specific prayer book, sloka, or religious material not listed here, contact us and we&apos;ll do our best to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+18132697262" className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
                Call (813) 269-7262
              </a>
              <a href="mailto:info@vishnumandirtampa.com" className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-8 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
                <Mail size={18} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
