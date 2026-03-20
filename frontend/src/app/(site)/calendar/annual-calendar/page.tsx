import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Annual Calendar | Vishnu Mandir, Tampa - Full Year Events",
  description:
    "View the complete annual calendar of events, festivals, and activities at Vishnu Mandir, Tampa.",
  openGraph: {
    title: "Annual Calendar | Vishnu Mandir, Tampa",
    description: "Full year calendar of events and festivals.",
    type: "website",
  },
};

const months = [
  { name: "January",   events: ["New Year Puja", "Makar Sankranti"] },
  { name: "February",  events: ["Vasant Panchami (Saraswati Puja)", "Maha Shivaratri"] },
  { name: "March",     events: ["Holi", "Rama Navami", "Navratri (Spring)"] },
  { name: "April",     events: ["Ram Navami (varies)", "Hanuman Jayanti"] },
  { name: "May",       events: ["Buddha Purnima", "Special Pujas"] },
  { name: "June",      events: ["Monthly Satyanarayan Puja"] },
  { name: "July",      events: ["Guru Purnima", "Monthly Puja"] },
  { name: "August",    events: ["Janmashtami", "Ganesh Chaturthi", "Onam"] },
  { name: "September", events: ["Navratri (Fall)", "Ganesh Visarjan"] },
  { name: "October",   events: ["Dussehra", "Diwali (varies)", "Karva Chauth"] },
  { name: "November",  events: ["Diwali", "Bhai Dooj", "Annual Day"] },
  { name: "December",  events: ["Year-End Puja", "Special Aarti Services"] },
];

export default function AnnualCalendarPage() {
  const structuredData = generateWebPageSchema({
    name: "Annual Calendar",
    description: "Full year calendar of events and festivals at Vishnu Mandir, Tampa",
    url: "/calendar/annual-calendar",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Plan Your Year"
        title="Annual Calendar"
        subtitle="A guide to the major festivals, pujas, and events throughout the year at Vishnu Mandir, Tampa."
        patternId="annual-cal-pat"
      />

      {/* ── CALENDAR GRID ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">2026 Calendar</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">Exact dates follow the Hindu lunar calendar and may vary slightly</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {months.map((month, i) => (
              <div
                key={i}
                data-gsap="card"
                className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group opacity-0"
              >
                {/* Month header */}
                <div className="bg-gradient-to-r from-temple-red to-red-800 px-6 py-4 flex items-center gap-3">
                  <Calendar size={18} className="text-temple-gold" />
                  <h3 className="font-display font-bold text-white text-lg">{month.name}</h3>
                </div>
                {/* Events list */}
                <div className="p-5 space-y-2">
                  {month.events.map((event, j) => (
                    <div key={j} className="flex items-center gap-2 text-stone-600 text-sm">
                      <ChevronRight size={14} className="text-temple-gold flex-shrink-0" />
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div data-gsap="fade-up" className="mt-12 bg-stone-50 rounded-3xl p-8 border border-stone-100 text-center opacity-0">
            <p className="text-stone-600 mb-6 leading-relaxed">
              Festival dates are based on the Hindu lunar calendar and may vary each year.
              Check our events page for confirmed dates and times.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/calendar/current-events" className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
                <Calendar size={18} /> Upcoming Events
              </Link>
              <Link href="/calendar/newsletter" className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-8 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
