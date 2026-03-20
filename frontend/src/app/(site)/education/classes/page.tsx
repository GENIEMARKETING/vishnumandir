import type { Metadata } from "next";
import { BookOpen, Music, Palette, ScrollText, Users, Download, Phone } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Learn With Us | Vishnu Mandir, Tampa - Classes & Educational Resources",
  description:
    "Join educational classes at Vishnu Mandir, Tampa — Sanskrit, Hindu scriptures, music, bhajans, and cultural arts. Resources and learning materials also available.",
  openGraph: {
    title: "Learn With Us | Vishnu Mandir, Tampa",
    description: "Classes, programs, and educational resources at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const classes = [
  {
    icon: <ScrollText size={26} />,
    name: "Sanskrit Language",
    description: "Learn Sanskrit, the ancient language of Hindu scriptures. Classes available for beginners through advanced levels with experienced instructors.",
    audience: "All Ages",
    schedule: "Sundays",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: <BookOpen size={26} />,
    name: "Hindu Scriptures",
    description: "Study the Bhagavad Gita, Ramayana, Mahabharata, and Upanishads with guided instruction from knowledgeable teachers.",
    audience: "Youth & Adults",
    schedule: "Sundays",
    color: "from-amber-500 to-amber-700",
  },
  {
    icon: <Music size={26} />,
    name: "Music & Bhajans",
    description: "Learn devotional music, bhajans, and traditional Indian music. Classes available for vocal and instrumental music at all skill levels.",
    audience: "All Ages",
    schedule: "Saturdays",
    color: "from-rose-500 to-rose-700",
  },
  {
    icon: <Palette size={26} />,
    name: "Cultural Arts",
    description: "Explore traditional Indian dance, art, and cultural practices. Classes help preserve and share our rich heritage with younger generations.",
    audience: "Children & Youth",
    schedule: "Saturdays",
    color: "from-green-500 to-green-700",
  },
];

const resources = [
  { icon: "📖", name: "Study Guides", desc: "Downloadable study guides for Hindu scriptures and texts.", available: false },
  { icon: "🎵", name: "Bhajan Lyrics", desc: "Lyrics and translations for popular bhajans and devotional songs.", available: false },
  { icon: "🗣️", name: "Sanskrit Primer", desc: "Beginner's guide to Sanskrit alphabets, words, and pronunciation.", available: false },
  { icon: "📚", name: "Reading List", desc: "Curated list of recommended books for spiritual and cultural learning.", available: false },
  { icon: "🎨", name: "Art Templates", desc: "Templates for rangoli, mehndi, and other traditional art forms.", available: false },
  { icon: "📝", name: "Sloka Collection", desc: "Collection of important slokas with meaning and pronunciation guide.", available: false },
];

export default function LearnWithUsPage() {
  const structuredData = generateWebPageSchema({
    name: "Learn With Us",
    description: "Educational classes and resources at Vishnu Mandir, Tampa",
    url: "/education/classes",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Sunday Pathshala & More"
        title="Learn With Us"
        subtitle="Deepening knowledge of Hindu dharma, culture, and traditions through classes, workshops, and educational resources for all ages."
        patternId="edu-pat"
      />

      {/* ── CLASSES ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Classes & Programs</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Open to all community members — beginners welcome</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {classes.map((cls, i) => (
              <div
                key={i}
                data-gsap="card"
                className="group bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-md hover:shadow-xl transition-all duration-500 opacity-0"
              >
                {/* Coloured header strip */}
                <div className={`bg-gradient-to-r ${cls.color} px-8 py-6 flex items-center gap-4`}>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                    {cls.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">{cls.name}</h3>
                    <p className="text-white/80 text-sm">{cls.schedule}</p>
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <p className="text-stone-600 leading-relaxed">{cls.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-temple-gold/10 rounded-lg text-temple-gold">
                      <Users size={14} />
                    </div>
                    <span className="text-sm font-semibold text-stone-600">For: {cls.audience}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enroll CTA */}
          <div data-gsap="cta-block" className="mt-14 bg-gradient-to-br from-temple-red to-red-900 rounded-3xl p-10 text-white text-center shadow-xl opacity-0">
            <h3 className="font-display text-2xl font-bold mb-3">Ready to Enroll?</h3>
            <p className="text-stone-200 mb-7 max-w-lg mx-auto">Contact us to register for any class or to learn about the current schedule and requirements.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+18132697262" className="bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all shadow-md inline-flex items-center gap-2">
                <Phone size={16} /> (813) 269-7262
              </a>
              <a href="mailto:info@vishnumandirtampa.com" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all">
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESOURCES ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Learning Resources</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Free materials to support your spiritual learning journey</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((r, i) => (
              <div key={i} data-gsap="card" className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 group hover:border-temple-red/20 hover:shadow-md transition-all duration-300 opacity-0">
                <span className="text-4xl block mb-4">{r.icon}</span>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-2 group-hover:text-temple-red transition-colors">{r.name}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-5">{r.desc}</p>
                <button
                  disabled={!r.available}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all bg-stone-100 text-stone-400 cursor-not-allowed"
                >
                  <Download size={15} /> Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
