import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Music, Users, Palette, Star, Video, Image as ImageIcon } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Cultural Programs | Vishnu Mandir, Tampa - Music, Dance & Media",
  description:
    "Discover cultural programs at Vishnu Mandir, Tampa including music performances, dance shows, drama, and media galleries from our celebrations.",
  openGraph: {
    title: "Cultural Programs | Vishnu Mandir, Tampa",
    description: "Music, dance, drama, and media from Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const programs = [
  {
    icon: <Music size={28} />,
    title: "Bhajan & Kirtan",
    desc: "Devotional singing sessions featuring traditional bhajans, kirtans, and spiritual music performed by our community during festivals and special events.",
    frequency: "Weekly & Festivals",
  },
  {
    icon: <Star size={28} />,
    title: "Classical Dance",
    desc: "Bharatanatyam and other classical Indian dance performances by talented community artists during major festivals and cultural celebrations.",
    frequency: "Festivals & Events",
  },
  {
    icon: <Users size={28} />,
    title: "Drama & Skits",
    desc: "Theatrical performances and skits depicting stories from Hindu epics like Ramayana and Mahabharata, performed by youth and community groups.",
    frequency: "Annual Events",
  },
  {
    icon: <Palette size={28} />,
    title: "Arts & Crafts",
    desc: "Traditional Indian art workshops including rangoli, mehndi, and other cultural art forms that preserve our rich heritage for younger generations.",
    frequency: "Workshops",
  },
  {
    icon: <Music size={28} />,
    title: "Instrumental Music",
    desc: "Performances featuring traditional Indian instruments including tabla, harmonium, sitar, and flute by community musicians.",
    frequency: "Regular Events",
  },
  {
    icon: <Users size={28} />,
    title: "Youth Programs",
    desc: "Cultural programs specially designed for children and youth to connect with their heritage through music, dance, storytelling, and creative expression.",
    frequency: "Monthly",
  },
];

const galleryPlaceholders = [
  { label: "Festival Celebrations", icon: <Camera size={24} /> },
  { label: "Dance Performances", icon: <Star size={24} /> },
  { label: "Music & Bhajans", icon: <Music size={24} /> },
  { label: "Community Events", icon: <Users size={24} /> },
  { label: "Youth Programs", icon: <Palette size={24} /> },
  { label: "Video Gallery", icon: <Video size={24} /> },
];

export default function CulturalPage() {
  const structuredData = generateWebPageSchema({
    name: "Cultural Programs",
    description: "Cultural programs and media gallery at Vishnu Mandir, Tampa",
    url: "/cultural",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Arts, Music & Heritage"
        title="Cultural Programs"
        subtitle="Celebrating the richness of Hindu culture through music, dance, drama, and the arts — preserving our traditions for generations to come."
        patternId="cultural-pat"
      />

      {/* ── PROGRAMS ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Our Programs</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Keeping our cultural heritage alive through community participation</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <div
                key={i}
                data-gsap="card"
                className="group bg-stone-50 rounded-2xl p-8 border border-stone-100 hover:border-temple-red/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 opacity-0"
              >
                <div className="w-14 h-14 rounded-2xl bg-temple-red/10 flex items-center justify-center text-temple-red mb-5 group-hover:bg-temple-red group-hover:text-white transition-all duration-300">
                  {p.icon}
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-lg font-bold text-stone-800 group-hover:text-temple-red transition-colors">{p.title}</h3>
                  <span className="text-xs font-bold bg-temple-gold/10 text-temple-orange px-2.5 py-1 rounded-full ml-2 whitespace-nowrap">{p.frequency}</span>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHOTO & VIDEO GALLERY ─────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Photo & Video Gallery</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Reliving memorable moments from our cultural events and celebrations</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryPlaceholders.map((item, i) => (
              <div
                key={i}
                data-gsap="card"
                className="group aspect-video bg-white rounded-2xl border-2 border-dashed border-stone-200 hover:border-temple-gold/40 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 hover:bg-temple-gold/5 opacity-0"
              >
                <div className="text-stone-300 group-hover:text-temple-gold transition-colors duration-300">{item.icon}</div>
                <p className="font-medium text-stone-400 group-hover:text-stone-600 text-sm transition-colors">{item.label}</p>
                <p className="text-xs text-stone-300 group-hover:text-stone-400">Photos coming soon</p>
              </div>
            ))}
          </div>

          <div data-gsap="fade-up" className="mt-12 text-center opacity-0">
            <div className="inline-flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-8 py-5 shadow-sm">
              <ImageIcon size={20} className="text-temple-gold" />
              <p className="text-stone-600 text-sm">
                Photos and videos from our events will be added here regularly.
                <span className="font-semibold text-temple-red ml-1">Check back after our next festival!</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET INVOLVED CTA ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div data-gsap="cta-block" className="max-w-3xl mx-auto px-4 opacity-0">
          <div className="bg-gradient-to-br from-temple-red to-red-900 rounded-3xl p-10 text-white text-center shadow-xl">
            <h2 className="font-display text-3xl font-bold mb-4">Participate in Our Programs</h2>
            <p className="text-stone-200 leading-relaxed mb-8 max-w-xl mx-auto">
              Whether you perform, volunteer, or attend — everyone has a place in our cultural community. Contact us to get involved or learn more about upcoming programs.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/about/volunteer" className="bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all shadow-md">
                Get Involved
              </Link>
              <Link href="/calendar/current-events" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all">
                View Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
