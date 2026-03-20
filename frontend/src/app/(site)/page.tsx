import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Info,
  Users,
  Sparkles,
  Building2,
  Utensils,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { generateOrganizationSchema } from "@/lib/seo";
import { fetchAnnouncements, fetchEvents } from "@/lib/strapi";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { EventCard } from "@/components/shared/EventCard";
import { isFutureEvent } from "@/lib/strapi-utils";
import { ZeffyButton } from "@/components/ui/ZeffyButton";
import { HomeAnimations } from "@/components/animations/HomeAnimations";
import { AnnouncementsSlider } from "@/components/shared/AnnouncementsSlider";

export const metadata: Metadata = {
  title:
    "Vishnu Mandir, Tampa - Hindu Temple & Community Center | Puja Schedules & Events",
  description:
    "Welcome to Vishnu Mandir, Tampa. Serving the Hindu community in Tampa Bay since 2003 with daily puja schedules, festivals, cultural events, and spiritual services. Join us for worship, community, and celebration.",
  keywords: [
    "Vishnu Mandir Tampa",
    "Hindu temple Tampa",
    "Tampa Bay Hindu community",
    "puja services Florida",
    "Hindu temple Florida",
    "Tampa Hindu temple",
    "puja schedule Tampa",
    "Hindu festivals Tampa",
  ],
  openGraph: {
    title: "Vishnu Mandir, Tampa - Hindu Temple & Community Center",
    description:
      "Serving the Hindu community in Tampa Bay with daily puja schedules, festivals, and spiritual services.",
    type: "website",
    url: "https://vishnumandirtampa.com",
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const organizationSchema = generateOrganizationSchema();

  const today = new Date();
  const allAnnouncements = await fetchAnnouncements({ displayUntil: today });
  const validAnnouncements = allAnnouncements.filter((a) => a?.attributes);
  const sortedAnnouncements = [...validAnnouncements].sort((a, b) => {
    if (
      a.attributes.level === "High-Priority" &&
      b.attributes.level !== "High-Priority"
    )
      return -1;
    if (
      a.attributes.level !== "High-Priority" &&
      b.attributes.level === "High-Priority"
    )
      return 1;
    const dateA = new Date(a.attributes.publishedAt || a.attributes.createdAt);
    const dateB = new Date(b.attributes.publishedAt || b.attributes.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  const allEvents = await fetchEvents({ publishedAt: true, sort: "date:asc" });
  const validEvents = allEvents.filter((e) => e?.attributes);
  const futureEvents = validEvents
    .filter((event) => {
      if (!event.attributes.date || !event.attributes.startTime) return false;
      return isFutureEvent(event.attributes.date, event.attributes.startTime);
    })
    .slice(0, 3);

  const facilityFeatures = [
    { icon: <Users size={20} />, title: "Meditation & Gathering Spaces" },
    { icon: <Building2 size={20} />, title: "Main Shrine & Prayer Hall" },
    { icon: <Sparkles size={20} />, title: "Festival & Event Areas" },
    { icon: <Utensils size={20} />, title: "Prasad Hall / Kitchen & Community Dining" },
    { icon: <Sparkles size={20} />, title: "Peaceful Courtyard & Landscaping" },
    { icon: <Building2 size={20} />, title: "Accessible Parking & Facilities" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* GSAP animation layer — client-only, renders nothing visible */}
      <HomeAnimations />

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/home/hero-home.jpeg"
            alt="Vishnu Mandir Tampa"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white">
            <span
              data-gsap="hero-tagline"
              className="text-temple-gold font-serif italic text-xl mb-4 block opacity-0"
            >
              Om Namo Narayanaya
            </span>
            <h1
              data-gsap="hero-title"
              className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow opacity-0"
            >
              Vishnu Mandir{" "}
              <span className="text-temple-gold">Tampa</span>
            </h1>
            <p
              data-gsap="hero-desc"
              className="text-lg md:text-xl text-stone-200 mb-10 leading-relaxed font-light opacity-0"
            >
              A sacred space for devotion, community, and spiritual growth.
              Serving the Hindu community in Tampa Bay since 2003, we celebrate
              our rich traditions and foster unity through worship, education,
              and cultural programs.
            </p>
            <div data-gsap="hero-buttons" className="flex flex-wrap gap-4">
              <ZeffyButton
                formLink="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                className="bg-temple-red hover:bg-red-900 text-white px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all shadow-xl opacity-0"
              >
                <Heart size={20} fill="currentColor" />
                Make a Donation
              </ZeffyButton>
              <ZeffyButton
                formLink="https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/40 px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all opacity-0"
              >
                <Users size={20} />
                Become a Member
              </ZeffyButton>
              <Link
                href="/calendar"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all opacity-0"
              >
                <Calendar size={20} />
                View Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VISION SECTION ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div data-gsap="vision-image" className="relative opacity-0">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/home/event-major-festivals.jpg"
                  alt="Worship at Vishnu Mandir"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-temple-gold/10 rounded-full blur-3xl -z-10" />
            </div>

            {/* Content */}
            <div data-gsap="vision-text" className="space-y-8 opacity-0">
              <div className="inline-flex items-center gap-4">
                <div
                  data-gsap="gold-line"
                  data-width="48px"
                  className="h-px bg-temple-gold opacity-0"
                  style={{ width: 0 }}
                />
                <h2 className="text-temple-red font-serif text-3xl uppercase tracking-widest">
                  Our Vision
                </h2>
                <div
                  data-gsap="gold-line"
                  data-width="48px"
                  className="h-px bg-temple-gold opacity-0"
                  style={{ width: 0 }}
                />
              </div>

              <div className="space-y-6 text-stone-600 leading-relaxed text-lg">
                <p data-gsap="about-para" className="opacity-0">
                  We are embarking on a historic journey to build a new Hindu
                  Temple—a spiritual and cultural center that will serve
                  generations to come. This temple will be a place for prayer,
                  learning, festivals, community service, and the preservation
                  of Hindu traditions in a welcoming and inclusive environment.
                </p>
                <p data-gsap="about-para" className="opacity-0">
                  Our goal is to create a sanctuary that nurtures devotion,
                  strengthens families, educates youth, and unites our community
                  around shared values of dharma, seva, peace, and compassion.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div data-gsap="vision-feature" className="flex items-start gap-4 opacity-0">
                  <div className="p-3 bg-stone-100 rounded-xl text-temple-red">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Community</h4>
                    <p className="text-sm text-stone-500">Fostering unity and belonging</p>
                  </div>
                </div>
                <div data-gsap="vision-feature" className="flex items-start gap-4 opacity-0">
                  <div className="p-3 bg-stone-100 rounded-xl text-temple-red">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800">Spiritual</h4>
                    <p className="text-sm text-stone-500">Nurturing inner peace</p>
                  </div>
                </div>
              </div>

              <ZeffyButton
                formLink="https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true"
                className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-medium hover:bg-red-900 transition-all shadow-lg"
              >
                <Users size={18} />
                Become a Member
              </ZeffyButton>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FACILITY DETAILS ─────────────────────────────────────────── */}
      <section className="py-24 bg-stone-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="diamond-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div data-gsap="facility-heading" className="text-center mb-16 opacity-0">
            <h2 className="font-display text-4xl md:text-5xl text-temple-red mb-4">
              Vishnu Mandir New Facility
            </h2>
            <p className="text-temple-orange font-serif italic text-xl">
              A Sacred Space for Today and Tomorrow
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Why + Impact */}
            <div data-gsap="facility-left" className="space-y-8 opacity-0">
              <div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Why This Temple Is Needed</h3>
                <p className="text-stone-600 leading-relaxed">
                  Our growing community needs a permanent, purpose-built home
                  where we can conduct daily pujas, host festivals, offer youth
                  education, and provide charitable outreach.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-serif text-stone-800 mb-4">Community Impact</h3>
                <ul className="space-y-3 text-stone-600">
                  {[
                    "A spiritual anchor for devotees",
                    "A learning center for children and youth",
                    "A cultural bridge to the wider community",
                    "A hub for service, charity, and outreach",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <ChevronRight size={16} className="text-temple-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Features Card */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100 lg:col-span-2">
              <h3 className="text-2xl font-serif text-stone-800 mb-8 text-center">
                What the Temple Will Include
              </h3>
              <div className="grid sm:grid-cols-2 gap-8">
                {facilityFeatures.map((f, i) => (
                  <div
                    key={i}
                    data-gsap="facility-feature"
                    className="flex items-center gap-4 group opacity-0"
                  >
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-temple-red group-hover:bg-temple-red group-hover:text-white transition-all duration-300">
                      {f.icon}
                    </div>
                    <span className="font-medium text-stone-700">{f.title}</span>
                  </div>
                ))}
              </div>

              <div
                data-gsap="facility-cta"
                className="mt-12 p-8 bg-temple-red/5 rounded-2xl border border-temple-red/10 text-center opacity-0"
              >
                <h4 className="text-xl font-serif text-temple-red mb-4">
                  Join Us in Building Something Eternal
                </h4>
                <p className="text-stone-600 mb-6 max-w-lg mx-auto">
                  Together, we can create a spiritual home that will uplift
                  hearts and minds for generations. Let us build this
                  temple—stone by stone, prayer by prayer, donation by donation.
                </p>
                <ZeffyButton
                  formLink="https://www.zeffy.com/embed/donation-form/vishnu-mandir-building-fund?modal=true"
                  className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-medium hover:bg-red-900 transition-all shadow-lg"
                >
                  <Heart size={18} fill="currentColor" />
                  Support the Building Fund
                </ZeffyButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ANNOUNCEMENTS ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="flex items-center justify-center gap-4 mb-4 opacity-0">
            <div
              data-gsap="gold-line"
              data-width="32px"
              className="h-px bg-temple-gold opacity-0"
              style={{ width: 0 }}
            />
            <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">
              What&apos;s Happening Now
            </h2>
            <div
              data-gsap="gold-line"
              data-width="32px"
              className="h-px bg-temple-gold opacity-0"
              style={{ width: 0 }}
            />
          </div>
          <p data-gsap="section-heading" className="text-center text-stone-500 italic mb-12 opacity-0">
            Latest updates and announcements from the temple
          </p>

          {sortedAnnouncements.length > 0 ? (
            <div data-gsap="announce-card" className="px-6 opacity-0">
              <AnnouncementsSlider announcements={sortedAnnouncements} />
            </div>
          ) : (
            <div data-gsap="announce-card" className="bg-stone-50 rounded-2xl p-8 border border-stone-100 relative overflow-hidden opacity-0">
              <div className="absolute top-0 left-0 w-1 h-full bg-temple-gold" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-temple-gold/10 rounded-full text-temple-gold hidden md:block">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-stone-800 mb-2">
                    Temple Announcements
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    Stay connected with Vishnu Mandir, Tampa through our latest
                    announcements. Check back regularly or subscribe to our
                    newsletter to receive updates directly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── EVENTS SECTION ───────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="flex items-center justify-center gap-4 mb-4 opacity-0">
            <div
              data-gsap="gold-line"
              data-width="32px"
              className="h-px bg-temple-gold opacity-0"
              style={{ width: 0 }}
            />
            <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">
              Upcoming Events
            </h2>
            <div
              data-gsap="gold-line"
              data-width="32px"
              className="h-px bg-temple-gold opacity-0"
              style={{ width: 0 }}
            />
          </div>
          <p data-gsap="section-heading" className="text-center text-stone-500 italic mb-12 opacity-0">
            Join us in celebration and prayer
          </p>

          {futureEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {futureEvents.map((event) => (
                <div key={event.id} data-gsap="event-card" className="opacity-0">
                  <EventCard event={event} showDescription={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Major Festivals",
                  description: "Join us in celebrating major Hindu festivals including Diwali, Navratri, Janmashtami, and more.",
                  href: "/religious/festivals",
                  image: "/images/home/event-major-festivals.jpg",
                  imageAlt: "Major Hindu festivals celebration",
                  type: "Religious",
                },
                {
                  title: "Cultural Programs",
                  description: "Experience our rich cultural heritage through music, dance, drama, and traditional performances.",
                  href: "/cultural",
                  image: "/images/home/event-cultural-programs.jpg",
                  imageAlt: "Cultural programs at Vishnu Mandir",
                  type: "Cultural",
                },
                {
                  title: "Educational Classes",
                  description: "Learn Sanskrit, Hindu scriptures, music, and cultural arts through our educational programs.",
                  href: "/education/classes",
                  image: "/images/home/event-educational-classes.jpg",
                  imageAlt: "Educational classes at Vishnu Mandir",
                  type: "Educational",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  data-gsap="event-card"
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-stone-100 group hover:-translate-y-2 transition-transform duration-300 opacity-0"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-temple-red text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {card.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-stone-800 group-hover:text-temple-red transition-colors mb-3">
                      {card.title}
                    </h3>
                    <p className="text-stone-500 text-sm mb-4 line-clamp-2">{card.description}</p>
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1 text-temple-red text-sm font-medium hover:gap-2 transition-all"
                    >
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── QUICK LINKS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-12 opacity-0">
            <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest mb-4">
              Quick Links
            </h2>
            <div
              data-gsap="gold-line"
              data-width="80px"
              className="h-1 bg-temple-gold mx-auto rounded-full opacity-0"
              style={{ width: 0 }}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Puja Schedule", desc: "Daily & weekly timings", href: "/religious/puja-schedule", icon: <Clock size={32} /> },
              { title: "Puja Services", desc: "Available services",    href: "/religious/puja-services",  icon: <Sparkles size={32} /> },
              { title: "About Us",      desc: "Temple information",    href: "/about/about",              icon: <Info size={32} /> },
              { title: "Contact",       desc: "Get in touch",          href: "/about/contact",            icon: <MapPin size={32} /> },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                data-gsap="quick-card"
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center border border-stone-100 hover:border-temple-red/20 group opacity-0"
              >
                <div className="text-temple-gold mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-temple-red transition-colors">
                  {link.title}
                </h3>
                <p className="text-stone-500 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-gsap="section-heading" className="opacity-0">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div
                data-gsap="gold-line"
                data-width="32px"
                className="h-px bg-temple-gold opacity-0"
                style={{ width: 0 }}
              />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">
                About Us
              </h2>
              <div
                data-gsap="gold-line"
                data-width="32px"
                className="h-px bg-temple-gold opacity-0"
                style={{ width: 0 }}
              />
            </div>
            <p className="text-temple-orange font-serif italic text-xl mb-12">
              A place of worship, community, and spiritual growth
            </p>
          </div>

          <div className="space-y-6 text-stone-600 leading-relaxed text-lg text-left">
            <p data-gsap="about-para" className="opacity-0">
              Vishnu Mandir, Tampa has been serving the Hindu community in the
              Tampa Bay area since 2003. Originally located in Ybor City&apos;s
              Palm Avenue, our temple relocated to Lynn Road to better serve our
              growing community. We follow the practices and doctrines of
              Hinduism, observing a wide range of Hindu rites and ceremonies
              including Aarti, Sanskaaras, Havans, Bhoomi Pujan, Yagyopaveet
              (Thread Ceremony), Namakaran (Naming ceremony), and Vivah (marriage).
            </p>
            <p data-gsap="about-para" className="opacity-0">
              Our mission is to establish a space of deep spiritual understanding
              for our community, giving each member an equal opportunity to voice
              their opinion and lead a life as defined by Hindu Dharma. We strive
              to utilize novel methods to connect devotees with their faith while
              preserving our rich cultural heritage.
            </p>
            <div
              data-gsap="about-address"
              className="pt-8 border-t border-stone-200 text-center opacity-0"
            >
              <p className="font-medium text-stone-800">
                Visit us at 5803 Lynn Road, Tampa, FL 33624
              </p>
              <p className="text-temple-red font-bold text-xl mt-1">
                (813) 269-7262
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
