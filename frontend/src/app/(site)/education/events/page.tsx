import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Info } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchEvents } from "@/lib/strapi";
import { EventCard } from "@/components/shared/EventCard";
import { isFutureEvent } from "@/lib/strapi-utils";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Events & Workshops | Vishnu Mandir, Tampa - Educational Programs",
  description:
    "Discover educational events, workshops, and seminars at Vishnu Mandir, Tampa. Guest lectures, special workshops, and learning sessions for all ages.",
  openGraph: {
    title: "Events & Workshops | Vishnu Mandir, Tampa",
    description: "Educational events and workshops at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

export const revalidate = 300;

export default async function EducationEventsPage() {
  const structuredData = generateWebPageSchema({
    name: "Events & Workshops",
    description: "Educational events and workshops at Vishnu Mandir, Tampa",
    url: "/education/events",
  });

  const allEvents = await fetchEvents({ publishedAt: true, sort: "date:asc" });
  const validEvents = allEvents.filter((e) => e?.attributes);
  const futureEvents = validEvents.filter((e) => {
    if (!e.attributes.date || !e.attributes.startTime) return false;
    return isFutureEvent(e.attributes.date, e.attributes.startTime);
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Workshops & Seminars"
        title="Events & Workshops"
        subtitle="Guest lectures, special workshops, and learning sessions that enrich our community's spiritual and cultural knowledge."
        patternId="edu-events-pat"
      />

      {/* ── EVENTS GRID ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Upcoming Events</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
          </div>

          {futureEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureEvents.map((event, i) => (
                <div key={event.id} data-gsap="card" className="opacity-0">
                  <EventCard event={event} showDescription />
                </div>
              ))}
            </div>
          ) : (
            <div data-gsap="fade-up" className="max-w-xl mx-auto text-center opacity-0">
              <div className="bg-stone-50 rounded-3xl p-12 border border-stone-100">
                <div className="w-16 h-16 bg-temple-gold/10 rounded-2xl flex items-center justify-center text-temple-gold mx-auto mb-6">
                  <Info size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-800 mb-3">No Upcoming Events</h3>
                <p className="text-stone-500 leading-relaxed mb-8">
                  Check back soon for upcoming educational workshops and seminars, or subscribe to our newsletter to get notified.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/calendar/current-events" className="inline-flex items-center gap-2 bg-temple-red text-white px-6 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
                    <Calendar size={16} /> All Events
                  </Link>
                  <Link href="/calendar/newsletter" className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-6 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
                    Subscribe <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
