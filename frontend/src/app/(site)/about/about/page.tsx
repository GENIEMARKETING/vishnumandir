import type { Metadata } from "next";
import Image from "next/image";
import { Heart, Users, BookOpen, Globe, Shield, Sparkles } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchBoardMembers } from "@/lib/strapi";
import { BoardTree } from "@/components/shared/BoardTree";
import { AboutAnimations } from "@/components/animations/AboutAnimations";
import { ZeffyButton } from "@/components/ui/ZeffyButton";

export const metadata: Metadata = {
  title: "About Us | Vishnu Mandir, Tampa - Mission, Vision & Leadership",
  description:
    "Learn about Vishnu Mandir Tampa's mission, vision, history, and the Board of Trustees guiding our community since 2003.",
  openGraph: {
    title: "About Us | Vishnu Mandir, Tampa",
    description: "Our mission, vision, history and leadership team.",
    type: "website",
  },
};

export const revalidate = 3600;

const commitments = [
  {
    icon: <Heart size={24} />,
    title: "Spiritual Leadership",
    desc: "Fostering a deep spiritual environment where devotees can grow in their faith and connect with the divine.",
  },
  {
    icon: <Users size={24} />,
    title: "Community Service",
    desc: "Serving the broader Hindu community and promoting interfaith understanding across Tampa Bay.",
  },
  {
    icon: <Globe size={24} />,
    title: "Cultural Preservation",
    desc: "Preserving and promoting Hindu traditions, festivals, and values for generations to come.",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Educational Excellence",
    desc: "Providing quality educational programs in Sanskrit, scripture, and cultural arts for all ages.",
  },
  {
    icon: <Shield size={24} />,
    title: "Transparent Governance",
    desc: "Managing temple resources with full accountability, integrity, and open community reporting.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "New Temple Vision",
    desc: "Building a purpose-designed spiritual campus to serve our community for the next century.",
  },
];

export default async function AboutUsPage() {
  const structuredData = generateWebPageSchema({
    name: "About Us",
    description: "Mission, vision, history and leadership of Vishnu Mandir, Tampa",
    url: "/about/about",
  });

  // Fetch board members from Strapi — falls back to static data if empty
  const boardMembers = await fetchBoardMembers();

  // Static fallback data used when Strapi has no board members yet
  const staticPresident = {
    id: 0,
    attributes: {
      name: "Kishore Ramdhani",
      role: "President",
      tier: "President" as const,
      displayOrder: 1,
      publishedAt: null,
      createdAt: "",
      updatedAt: "",
    },
  };
  const staticExecutives = [
    { id: 1, attributes: { name: "Jonah Bajnath",        role: "Treasurer", tier: "Executive" as const, displayOrder: 2, publishedAt: null, createdAt: "", updatedAt: "" } },
    { id: 2, attributes: { name: "Dr. Ram P. Ramcharran", role: "Secretary", tier: "Executive" as const, displayOrder: 3, publishedAt: null, createdAt: "", updatedAt: "" } },
  ];
  const staticDirectors = [
    "Shantia Singh","Tara Dindial","Ramesh Maharana","Narie Persad",
    "Lettie Naraine","Jonah Bajnath","Dr. Ram Ramcharran","Mado Jaimangal",
    "Ramesh Sayroo","Omardeo Ramdhani","Raj Samlall","Harry K. Lekhram",
  ].map((name, i) => ({
    id: 10 + i,
    attributes: { name, role: "Director", tier: "Director" as const, displayOrder: 10 + i, publishedAt: null, createdAt: "", updatedAt: "" },
  }));

  const displayMembers =
    boardMembers.length > 0
      ? boardMembers
      : [staticPresident, ...staticExecutives, ...staticDirectors];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutAnimations />

      {/* ── PAGE HERO ─────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-temple-red">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hero-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span
            data-gsap="page-hero-tag"
            className="inline-block text-temple-gold font-serif italic text-lg mb-4 opacity-0"
          >
            Serving Tampa Bay Since 2003
          </span>
          <h1
            data-gsap="page-hero-title"
            className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0"
          >
            About Vishnu Mandir
          </h1>
          <p
            data-gsap="page-hero-sub"
            className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0"
          >
            A sacred community rooted in devotion, tradition, and service — welcoming all who seek spiritual growth and cultural connection.
          </p>
        </div>
      </section>

      {/* ── MISSION & HISTORY ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div data-gsap="about-image" className="relative opacity-0">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/home/event-major-festivals.jpg"
                  alt="Vishnu Mandir Tampa"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-temple-gold/10 rounded-full blur-3xl -z-10" />
              {/* Year badge */}
              <div className="absolute -top-4 -left-4 bg-temple-red text-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-3xl font-display font-bold leading-none">2003</p>
                <p className="text-xs text-stone-200 uppercase tracking-widest mt-1">Founded</p>
              </div>
            </div>

            <div data-gsap="about-text" className="space-y-6 opacity-0">
              <div className="inline-flex items-center gap-4">
                <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
                <h2 className="text-temple-red font-serif text-3xl uppercase tracking-widest">Our Story</h2>
                <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              </div>

              <div className="space-y-5 text-stone-600 leading-relaxed text-lg">
                <p>
                  Vishnu Mandir, Tampa has been serving the Hindu community in the Tampa Bay area
                  since 2003. Originally located in Ybor City&apos;s Palm Avenue, our temple relocated
                  to 5803 Lynn Road to better serve our growing community.
                </p>
                <p>
                  We follow the practices and doctrines of Hinduism, observing a wide range of Hindu
                  rites and ceremonies including Aarti, Sanskaaras, Havans, Bhoomi Pujan,
                  Yagyopaveet (Thread Ceremony), Namakaran (Naming ceremony), and Vivah (marriage).
                </p>
                <p>
                  Our mission is to establish a space of deep spiritual understanding for our
                  community, giving each member an equal opportunity to voice their opinion and lead
                  a life as defined by Hindu Dharma.
                </p>
              </div>

              <ZeffyButton
                formLink="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-medium hover:bg-red-900 transition-all shadow-lg mt-4"
              >
                <Heart size={18} fill="currentColor" />
                Support Our Mission
              </ZeffyButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR COMMITMENT ────────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-4">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Our Commitment</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg">The pillars that guide everything we do</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commitments.map((item, i) => (
              <div
                key={i}
                data-gsap="commit-card"
                className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group opacity-0"
              >
                <div className="w-12 h-12 rounded-xl bg-temple-red/10 flex items-center justify-center text-temple-red mb-5 group-hover:bg-temple-red group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOARD OF TRUSTEES ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-6 opacity-0">
            <div className="inline-flex items-center gap-4 mb-4">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Leadership</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg">
              Dedicated volunteers who guide our temple with vision and service
            </p>
          </div>

          <div className="mt-12">
            <BoardTree members={displayMembers} />
          </div>
        </div>
      </section>
    </>
  );
}
