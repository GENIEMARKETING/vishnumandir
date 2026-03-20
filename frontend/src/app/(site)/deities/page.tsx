import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { ReligiousAnimations } from "@/components/animations/ReligiousAnimations";
import { ZeffyButton } from "@/components/ui/ZeffyButton";

export const metadata: Metadata = {
  title: "Our Deities | Vishnu Mandir, Tampa - Hindu Deities & Significance",
  description:
    "Discover the divine deities enshrined at Vishnu Mandir, Tampa. Learn about Lord Vishnu, Lakshmi, Ganesha, Shiva, Saraswati, and Hanuman.",
  openGraph: {
    title: "Our Deities | Vishnu Mandir, Tampa",
    description: "Discover the divine deities enshrined at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const deities = [
  {
    name: "Lord Vishnu",
    sanskrit: "विष्णु",
    image: "/images/deities/deity-vishnu.jpg",
    color: "from-blue-900/80 to-blue-700/60",
    description:
      "The Preserver of the universe, Lord Vishnu is the principal deity of our temple. He maintains cosmic order and protects dharma.",
    significance:
      "Vishnu represents preservation, compassion, and divine grace. His avatars include Rama and Krishna, who guide humanity toward righteousness.",
    festivals: ["Vishnu Jayanti", "Rama Navami", "Janmashtami"],
    day: "Wednesday & Thursday",
  },
  {
    name: "Goddess Lakshmi",
    sanskrit: "लक्ष्मी",
    image: "/images/deities/deity-lakshmi.jpg",
    color: "from-pink-900/80 to-pink-700/60",
    description:
      "Goddess of wealth, prosperity, and abundance. Lakshmi is the consort of Lord Vishnu and bestows material and spiritual prosperity.",
    significance:
      "Worshipping Lakshmi brings financial stability, success, and overall well-being. She is especially revered during Diwali.",
    festivals: ["Diwali (Lakshmi Puja)", "Varalakshmi Vratam"],
    day: "Friday",
  },
  {
    name: "Lord Ganesha",
    sanskrit: "गणेश",
    image: "/images/deities/deity-ganesha.jpg",
    color: "from-orange-900/80 to-orange-700/60",
    description:
      "The remover of obstacles and god of wisdom. Ganesha is worshipped at the beginning of all ceremonies and endeavors.",
    significance:
      "Ganesha is invoked before starting any new venture or important task. His blessings ensure smooth progress and success.",
    festivals: ["Ganesh Chaturthi", "Ganesh Jayanti"],
    day: "Tuesday & Sunday",
  },
  {
    name: "Lord Shiva",
    sanskrit: "शिव",
    image: undefined,
    color: "from-slate-900/80 to-slate-700/60",
    description:
      "The Destroyer and Transformer, Shiva represents the cycle of creation and destruction. He is the supreme yogi and source of spiritual knowledge.",
    significance:
      "Shiva worship brings spiritual transformation, inner peace, and liberation. He is especially revered during Maha Shivaratri.",
    festivals: ["Maha Shivaratri", "Shravan Month"],
    day: "Monday",
  },
  {
    name: "Goddess Saraswati",
    sanskrit: "सरस्वती",
    image: "/images/deities/deity-saraswati.jpg",
    color: "from-yellow-900/80 to-yellow-700/60",
    description:
      "Goddess of knowledge, wisdom, music, and arts. Saraswati is the patron of learning and creativity.",
    significance:
      "Saraswati bestows knowledge, wisdom, and artistic abilities. She is especially honored during Vasant Panchami and educational ceremonies.",
    festivals: ["Vasant Panchami", "Saraswati Puja"],
    day: "Thursday",
  },
  {
    name: "Lord Hanuman",
    sanskrit: "हनुमान",
    image: "/images/deities/deity-hanuman.jpg",
    color: "from-red-900/80 to-red-700/60",
    description:
      "The devoted servant of Lord Rama, Hanuman represents strength, devotion, and selfless service. He protects devotees and removes obstacles.",
    significance:
      "Hanuman worship brings courage, strength, and protection. He is especially revered on Tuesdays and during Hanuman Jayanti.",
    festivals: ["Hanuman Jayanti", "Ram Navami"],
    day: "Tuesday & Saturday",
  },
];

export default function DeitiesPage() {
  const structuredData = generateWebPageSchema({
    name: "Our Deities",
    description: "Hindu deities enshrined at Vishnu Mandir, Tampa",
    url: "/deities",
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
            Sacred Shrines of Vishnu Mandir
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Our Deities
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Each deity enshrined at Vishnu Mandir represents a unique aspect of the divine, offering blessings, guidance, and grace to all devotees.
          </p>
        </div>
      </section>

      {/* ── INTRO BANNER ──────────────────────────────────────────────── */}
      <section className="py-14 bg-stone-50 border-b border-stone-100">
        <div data-gsap="section-heading" className="max-w-3xl mx-auto px-4 text-center opacity-0">
          <p className="text-stone-600 leading-relaxed text-lg">
            Vishnu Mandir is home to beautiful shrines dedicated to six divine deities. Regular puja services
            are conducted daily, and devotees can sponsor special ceremonies or visit during open hours for personal worship.
          </p>
        </div>
      </section>

      {/* ── DEITIES GRID ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deities.map((deity, i) => (
              <div
                key={i}
                data-gsap="deity-card"
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md hover:shadow-xl transition-all duration-500 opacity-0"
              >
                {/* Image / Gradient header */}
                <div className="relative h-64 overflow-hidden">
                  {deity.image ? (
                    <>
                      <Image
                        src={deity.image}
                        alt={deity.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${deity.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                    </>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${deity.color} flex items-center justify-center`}>
                      <Sparkles size={48} className="text-white/40" />
                    </div>
                  )}

                  {/* Sanskrit name overlay */}
                  <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-serif">
                    {deity.sanskrit}
                  </div>

                  {/* Worship day badge */}
                  <div className="absolute bottom-4 left-4 bg-temple-gold text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {deity.day}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 space-y-4">
                  <h2 className="font-display text-2xl font-bold text-stone-800 group-hover:text-temple-red transition-colors">
                    {deity.name}
                  </h2>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {deity.description}
                  </p>

                  {/* Significance */}
                  <div className="bg-temple-red/5 border border-temple-red/10 rounded-xl p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-temple-red mb-2">Significance</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{deity.significance}</p>
                  </div>

                  {/* Festivals */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Key Festivals</h3>
                    <div className="flex flex-wrap gap-2">
                      {deity.festivals.map((f, j) => (
                        <span key={j} className="bg-stone-100 text-stone-600 text-xs px-3 py-1 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORSHIP CTA ───────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="cta-block" className="grid md:grid-cols-3 gap-6 opacity-0">
            {[
              { title: "Puja Schedule", desc: "View daily & weekly worship timings for each deity.", href: "/religious/puja-worship", label: "View Schedule" },
              { title: "Sponsor a Puja", desc: "Sponsor a special puja for your family's well-being.", href: "/religious/puja-worship", label: "Book a Puja", zeffy: "https://www.zeffy.com/embed/donation-form/online-puja?modal=true" },
              { title: "Festivals Calendar", desc: "Join us for deity festivals throughout the year.", href: "/religious/festivals", label: "View Festivals" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm text-center group hover:border-temple-red/20 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-1 bg-temple-gold rounded-full mx-auto mb-5 group-hover:w-20 transition-all duration-300" />
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-3 group-hover:text-temple-red transition-colors">{item.title}</h3>
                <p className="text-stone-500 text-sm mb-6">{item.desc}</p>
                {item.zeffy ? (
                  <ZeffyButton formLink={item.zeffy} className="inline-flex items-center gap-2 bg-temple-red text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-900 transition-all">
                    <Heart size={14} fill="currentColor" /> {item.label}
                  </ZeffyButton>
                ) : (
                  <Link href={item.href} className="inline-flex items-center gap-2 bg-temple-red text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-red-900 transition-all">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
