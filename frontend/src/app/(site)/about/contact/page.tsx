import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Navigation, Car, Video } from "lucide-react";
import { generatePlaceSchema } from "@/lib/seo";
import { AboutAnimations } from "@/components/animations/AboutAnimations";

export const metadata: Metadata = {
  title: "Visit Us | Vishnu Mandir, Tampa - Directions, Contact & Virtual Tour",
  description:
    "Find Vishnu Mandir at 5803 Lynn Road, Tampa, FL 33624. Get directions, contact info, hours, and take a virtual tour of our temple.",
  openGraph: {
    title: "Visit Us | Vishnu Mandir, Tampa",
    description: "Find us, contact us, or take a virtual tour.",
    type: "website",
  },
};

const hours = [
  { day: "Monday – Friday", time: "6:00 AM – 12:00 PM / 6:00 PM – 8:30 PM" },
  { day: "Saturday",         time: "6:00 AM – 1:00 PM / 5:00 PM – 8:30 PM" },
  { day: "Sunday",           time: "6:00 AM – 1:00 PM / 5:00 PM – 8:30 PM" },
  { day: "Festival Days",    time: "Extended hours — see calendar" },
];

export default function VisitUsPage() {
  const structuredData = generatePlaceSchema();

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
            5803 Lynn Road, Tampa FL 33624
          </span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">
            Visit Us
          </h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            We welcome all devotees and visitors. Come find us, call us, or explore the temple virtually from home.
          </p>
        </div>
      </section>

      {/* ── CONTACT + HOURS ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Get in Touch</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg mt-2">We&apos;re here to help with your spiritual needs and questions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact info card */}
            <div data-gsap="about-image" className="bg-stone-50 rounded-3xl p-8 border border-stone-100 shadow-sm space-y-6 opacity-0">
              <h3 className="font-serif text-2xl font-bold text-stone-800 mb-4">Contact Information</h3>

              {[
                {
                  icon: <MapPin size={22} />,
                  label: "Address",
                  content: <><span>5803 Lynn Road, Tampa, FL 33624</span><br/><a href="https://maps.google.com/?q=5803+Lynn+Road+Tampa+FL+33624" target="_blank" rel="noreferrer" className="text-temple-red text-sm hover:underline mt-1 inline-block">Open in Google Maps →</a></>
                },
                {
                  icon: <Phone size={22} />,
                  label: "Phone",
                  content: <a href="tel:+18132697262" className="hover:text-temple-red transition-colors">(813) 269-7262</a>
                },
                {
                  icon: <Mail size={22} />,
                  label: "Email",
                  content: <a href="mailto:info@vishnumandirtampa.com" className="hover:text-temple-red transition-colors break-all">info@vishnumandirtampa.com</a>
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-3 bg-temple-red/10 rounded-xl text-temple-red flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-stone-800 text-sm uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-stone-600">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Temple hours */}
            <div data-gsap="about-text" className="bg-temple-red rounded-3xl p-8 text-white space-y-5 opacity-0">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={24} className="text-temple-gold" />
                <h3 className="font-serif text-2xl font-bold">Temple Hours</h3>
              </div>
              {hours.map((h, i) => (
                <div key={i} className="flex justify-between items-start border-b border-white/10 pb-4 last:border-0 last:pb-0">
                  <span className="font-medium text-stone-200">{h.day}</span>
                  <span className="text-temple-gold text-sm text-right ml-4">{h.time}</span>
                </div>
              ))}
              <p className="text-stone-300 text-sm pt-2">
                Hours may vary on festival days. Please call ahead to confirm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAP + DIRECTIONS ──────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Directions & Parking</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Map embed */}
            <div data-gsap="about-image" className="md:col-span-2 opacity-0">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-stone-100 h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.3!2d-82.521!3d28.065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s5803+Lynn+Rd%2C+Tampa%2C+FL+33624!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vishnu Mandir Location"
                />
              </div>
              <a
                href="https://maps.google.com/?q=5803+Lynn+Road+Tampa+FL+33624"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-temple-red font-medium hover:gap-3 transition-all"
              >
                <Navigation size={16} />
                Open in Google Maps
              </a>
            </div>

            {/* Directions tips */}
            <div data-gsap="about-text" className="space-y-6 opacity-0">
              {[
                {
                  icon: <Car size={20} />,
                  title: "By Car",
                  desc: "Located off Lynn Road near Gunn Highway. Ample free parking is available in the temple lot.",
                },
                {
                  icon: <Navigation size={20} />,
                  title: "From I-275",
                  desc: "Take Exit 48 (Bearss Ave). Head west on Bearss, turn left onto N Dale Mabry Hwy, then right onto Lynn Rd.",
                },
                {
                  icon: <MapPin size={20} />,
                  title: "Landmark",
                  desc: "Near the intersection of Lynn Road and Ehrlich Road in the Carrollwood area.",
                },
              ].map((item, i) => (
                <div key={i} data-gsap="commit-card" className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm opacity-0">
                  <div className="p-2 bg-temple-red/10 rounded-lg text-temple-red flex-shrink-0 h-fit">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1">{item.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VIRTUAL VISIT ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-gsap="section-heading" className="mb-12 opacity-0">
            <div className="inline-flex items-center gap-4 mb-4">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Virtual Visit</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic text-lg">Can&apos;t visit in person? Explore our temple from home</p>
          </div>

          <div data-gsap="about-image" className="bg-stone-50 rounded-3xl p-10 border border-stone-100 shadow-sm opacity-0">
            <div className="w-16 h-16 bg-temple-red/10 rounded-2xl flex items-center justify-center text-temple-red mx-auto mb-6">
              <Video size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-800 mb-4">360° Temple Tour</h3>
            <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8">
              Take an immersive virtual tour of Vishnu Mandir, Tampa. Explore our main shrine,
              deity chambers, prayer hall, and courtyard — all from the comfort of your home.
              Perfect for devotees who cannot visit in person.
            </p>

            {/* Placeholder for virtual tour embed */}
            <div className="bg-gradient-to-br from-temple-red/5 to-temple-gold/5 border-2 border-dashed border-temple-gold/30 rounded-2xl h-64 flex flex-col items-center justify-center text-stone-400 mb-6">
              <Video size={40} className="mb-3 opacity-40" />
              <p className="font-medium">Virtual tour coming soon</p>
              <p className="text-sm mt-1">360° walkthrough will be embedded here</p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/cultural/media"
                className="inline-flex items-center gap-2 bg-temple-red text-white px-6 py-3 rounded-full font-medium hover:bg-red-900 transition-all shadow-md"
              >
                View Photo Gallery
              </Link>
              <a
                href="https://maps.google.com/?q=5803+Lynn+Road+Tampa+FL+33624"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-6 py-3 rounded-full font-medium hover:bg-temple-red hover:text-white transition-all"
              >
                Google Street View
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
