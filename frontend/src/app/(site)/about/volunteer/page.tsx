import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Calendar, BookOpen, Music, Utensils, Wrench, MessageSquare } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { AboutAnimations } from "@/components/animations/AboutAnimations";

export const metadata: Metadata = {
  title: "Get Involved | Vishnu Mandir, Tampa - Volunteer & Share Feedback",
  description:
    "Volunteer at Vishnu Mandir, Tampa and serve the Hindu community. Also share your feedback to help us improve.",
  openGraph: {
    title: "Get Involved | Vishnu Mandir, Tampa",
    description: "Volunteer with us and share your feedback.",
    type: "website",
  },
};

const volunteerRoles = [
  { icon: <Calendar size={22} />,  title: "Festival & Events",  desc: "Help coordinate and run major festivals like Diwali, Navratri, and Holi — from setup to cleanup." },
  { icon: <BookOpen size={22} />,  title: "Education & Youth",  desc: "Assist with Sunday Pathshala, language classes, and youth programs. Share your knowledge with the next generation." },
  { icon: <Utensils size={22} />,  title: "Prasad & Kitchen",   desc: "Help prepare and serve prasad during pujas and community meals. A sacred act of seva." },
  { icon: <Music size={22} />,     title: "Bhajan & Music",     desc: "Join our kirtan or bhajan groups to lead devotional singing during regular services and events." },
  { icon: <Wrench size={22} />,    title: "Temple Maintenance",  desc: "Support the upkeep, cleaning, and beautification of our sacred spaces and grounds." },
  { icon: <Users size={22} />,     title: "Community Outreach",  desc: "Represent Vishnu Mandir at interfaith events, community fairs, and charitable drives across Tampa Bay." },
];

export default function GetInvolvedPage() {
  const structuredData = generateWebPageSchema({
    name: "Get Involved",
    description: "Volunteer and feedback page for Vishnu Mandir, Tampa",
    url: "/about/volunteer",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutAnimations />

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
            Seva — Selfless Service
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Get Involved
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Volunteer your time and talents to serve the temple community — or share your thoughts to help us grow.
          </p>
        </div>
      </section>

      {/* ── VOLUNTEER SECTION ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Volunteer</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">
              Every act of seva, however small, contributes to the spiritual fabric of our community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {volunteerRoles.map((role, i) => (
              <div
                key={i}
                data-gsap="commit-card"
                className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:border-temple-red/20 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group opacity-0"
              >
                <div className="w-12 h-12 rounded-xl bg-temple-red/10 flex items-center justify-center text-temple-red mb-5 group-hover:bg-temple-red group-hover:text-white transition-all duration-300">
                  {role.icon}
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">{role.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>

          {/* Volunteer CTA */}
          <div data-gsap="facility-cta" className="bg-gradient-to-br from-temple-red to-red-900 rounded-3xl p-10 text-white text-center shadow-xl opacity-0">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-temple-gold mx-auto mb-6">
              <Heart size={32} fill="currentColor" />
            </div>
            <h3 className="font-display text-3xl font-bold mb-4">Ready to Serve?</h3>
            <p className="text-stone-200 leading-relaxed max-w-xl mx-auto mb-8">
              Contact us directly to express your interest. Our volunteer coordinator will be in
              touch to match you with opportunities that fit your skills and availability.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="tel:+18132697262"
                className="bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all shadow-md"
              >
                Call (813) 269-7262
              </a>
              <a
                href="mailto:info@vishnumandirtampa.com"
                className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEEDBACK SECTION ──────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-12 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Feedback</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">
              Your thoughts help us serve you better
            </p>
          </div>

          <div data-gsap="about-image" className="bg-white rounded-3xl p-10 border border-stone-100 shadow-sm opacity-0">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-temple-red/10 rounded-xl text-temple-red">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-stone-800">Share Your Thoughts</h3>
                <p className="text-stone-500 text-sm">All feedback is reviewed by temple leadership</p>
              </div>
            </div>

            <form className="space-y-5" action="mailto:info@vishnumandirtampa.com" method="GET">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-temple-red/30 focus:border-temple-red transition-all text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-temple-red/30 focus:border-temple-red transition-all text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Category</label>
                <select className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-temple-red/30 focus:border-temple-red transition-all text-stone-600 bg-white">
                  <option value="">Select a category</option>
                  <option>Puja Services</option>
                  <option>Events & Festivals</option>
                  <option>Facility & Cleanliness</option>
                  <option>Education Programs</option>
                  <option>Website & Communication</option>
                  <option>General Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Your Feedback</label>
                <textarea
                  rows={5}
                  placeholder="Share your thoughts, suggestions, or concerns..."
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-temple-red/30 focus:border-temple-red transition-all text-stone-800 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-temple-red text-white py-4 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md hover:shadow-lg"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
