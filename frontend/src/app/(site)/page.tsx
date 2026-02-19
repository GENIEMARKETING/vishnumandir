import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Calendar, ArrowRight, Heart, Info, Users } from "lucide-react";
import { generateOrganizationSchema } from "@/lib/seo";
import { fetchAnnouncements, fetchEvents } from "@/lib/strapi";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { EventCard } from "@/components/shared/EventCard";
import { isFutureEvent } from "@/lib/strapi-utils";
import { ZeffyButton } from "@/components/ui/ZeffyButton";

export const metadata: Metadata = {
  title: "Vishnu Mandir, Tampa - Hindu Temple & Community Center | Puja Schedules & Events",
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

// ISR revalidation: 5 minutes
export const revalidate = 300;

/**
 * Home page featuring hero section, announcements, and quick links.
 * Updated with new "Spiritual & Serene" design system.
 * @returns {JSX.Element} The rendered home page
 */
export default async function HomePage() {
  const organizationSchema = generateOrganizationSchema();

  // Fetch active announcements
  const today = new Date();
  const allAnnouncements = await fetchAnnouncements({
    displayUntil: today,
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[HomePage] Announcements after fetchAnnouncements:", {
      count: allAnnouncements.length,
      items: allAnnouncements.map((a) => ({
        id: a.id,
        title: a.attributes?.title,
        publishedAt: a.attributes?.publishedAt,
      })),
    });
  }

  // Filter out items with missing attributes
  const validAnnouncements = allAnnouncements.filter((announcement) => announcement?.attributes);

  if (process.env.NODE_ENV === "development") {
    console.log("[HomePage] Announcements after validating attributes:", {
      count: validAnnouncements.length,
    });
  }

  // Sort: High-Priority first, then by publishedAt (newest first)
  const sortedAnnouncements = [...validAnnouncements].sort((a, b) => {
    if (a.attributes.level === "High-Priority" && b.attributes.level !== "High-Priority") {
      return -1;
    }
    if (a.attributes.level !== "High-Priority" && b.attributes.level === "High-Priority") {
      return 1;
    }
    const dateA = new Date(a.attributes.publishedAt || a.attributes.createdAt);
    const dateB = new Date(b.attributes.publishedAt || b.attributes.createdAt);
    return dateB.getTime() - dateA.getTime();
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[HomePage] Announcements after sorting:", {
      count: sortedAnnouncements.length,
      items: sortedAnnouncements.map((a) => ({
        title: a.attributes?.title,
        level: a.attributes?.level,
      })),
    });
  }

  // Fetch featured/upcoming events (limit to 6)
  const allEvents = await fetchEvents({
    publishedAt: true,
    sort: "date:asc",
  });

  // Filter out items with missing attributes before processing
  const validEvents = allEvents.filter((event) => event?.attributes);

  const futureEvents = validEvents
    .filter((event) => {
      // Guard against undefined date/startTime
      if (!event.attributes.date || !event.attributes.startTime) {
        return false;
      }
      return isFutureEvent(event.attributes.date, event.attributes.startTime);
    })
    .slice(0, 6);

  // Production-safe logging for event filtering (controlled by environment variable)
  if (process.env.DEBUG_EVENT_FILTERING === "true" || process.env.NODE_ENV === "development") {
    console.log("[HomePage] Event filtering analysis:", {
      allEventsCount: allEvents.length,
      validEventsCount: validEvents.length,
      futureEventsCount: futureEvents.length,
      debugInfo: {
        fetchedWithPublishedAtFilter: "publishedAt: true",
        sortedBy: "date:asc",
        limitedTo: 6,
      },
      sampleFilteredOut: validEvents
        .filter((event) => {
          if (!event.attributes.date || !event.attributes.startTime) {
            return true;
          }
          return !isFutureEvent(event.attributes.date, event.attributes.startTime);
        })
        .slice(0, 3)
        .map((event) => ({
          title: event.attributes?.title,
          date: event.attributes?.date,
          startTime: event.attributes?.startTime,
          reason: !event.attributes.date || !event.attributes.startTime 
            ? "Missing date or startTime" 
            : "Date/time is in the past",
        })),
    });
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/home/hero-home.jpeg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden />
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-accent blur-3xl opacity-10" aria-hidden />
          <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-primary blur-3xl opacity-10" aria-hidden />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-accent/50 bg-black/20 text-primary text-sm font-serif tracking-wider uppercase">
            Om Namo Narayanaya
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow">
            Vishnu Mandir <span className="text-primary">Tampa</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto mb-10 font-serif leading-relaxed drop-shadow">
            A sacred space for devotion, community, and spiritual growth. Serving
            the Hindu community in Tampa Bay since 2003, we celebrate our rich
            traditions and foster unity through worship, education, and cultural
            programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ZeffyButton
              formLink="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
              className="group relative px-8 py-4 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Make a Donation <Heart className="w-4 h-4" />
              </span>
            </ZeffyButton>
            <ZeffyButton
              formLink="https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true"
              className="group px-8 py-4 bg-white/90 text-primary border-2 border-primary/20 rounded-lg font-semibold hover:bg-white hover:border-primary/30 transition-all duration-300 flex items-center gap-2"
            >
              <span className="flex items-center gap-2">
                Become a Member <Users className="w-4 h-4" />
              </span>
            </ZeffyButton>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* New Facility Campaign */}
        <section className="mb-20">
          <div className="bg-white rounded-xl overflow-hidden border-2 border-primary/5 shadow-warm">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
                Vishnu Mandir New Facility
              </h2>
              <p className="font-serif text-2xl text-primary mb-8">
                A Sacred Space for Today and Tomorrow
              </p>
            </div>

            <div className="p-8 md:p-12 space-y-8">
              {/* Our Vision */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  Our Vision
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  We are embarking on a historic journey to build a new Hindu Temple—a
                  spiritual and cultural center that will serve generations to come. This
                  temple will be a place for prayer, learning, festivals, community
                  service, and the preservation of Hindu traditions in a welcoming and
                  inclusive environment.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Our goal is to create a sanctuary that nurtures devotion, strengthens
                  families, educates youth, and unites our community around shared values
                  of dharma, seva, peace, and compassion.
                </p>
              </div>

              {/* Why This Temple Is Needed */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  Why This Temple Is Needed
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Our growing community needs a permanent, purpose-built home where we can:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                  <li>Conduct daily pujas and major festivals</li>
                  <li>Offer youth education, language, and scripture classes</li>
                  <li>Host Satsangs, lectures, and cultural programs</li>
                  <li>Support weddings, naming ceremonies, and memorial services</li>
                  <li>Provide charitable outreach and community service</li>
                  <li>Preserve Hindu heritage for future generations</li>
                </ul>
                <p className="text-text-secondary leading-relaxed mt-4">
                  This project is not only about constructing a building—it is about
                  building a spiritual legacy for the community.
                </p>
              </div>

              {/* What the Temple Will Include */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  What the Temple Will Include
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🧘</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Meditation & Gathering Spaces
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🛕</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Main Shrine & Prayer Hall
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Festival & Event Areas
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🍽️</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Prasad Hall / Kitchen & Community Dining
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🌿</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Peaceful Courtyard & Landscaping
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🚗</span>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        Accessible Parking & Facilities
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Impact */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  Community Impact
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  This temple will become:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                  <li>A spiritual anchor for devotees</li>
                  <li>A learning center for children and youth</li>
                  <li>A cultural bridge to the wider community</li>
                  <li>A hub for service, charity, and outreach</li>
                  <li>A symbol of unity and continuity</li>
                </ul>
                <p className="text-text-secondary leading-relaxed mt-4">
                  Every brick laid will represent faith, generosity, and collective effort.
                </p>
              </div>

              {/* How You Can Support */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  How You Can Support the Building Fund
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  This sacred endeavor can only succeed through the participation of our
                  community. You can contribute by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4 mb-6">
                  <li>💝 Making a one-time or recurring donation</li>
                  <li>🧱 Sponsoring bricks, rooms, or sacred spaces</li>
                  <li>📜 Participating in naming opportunities</li>
                  <li>🤝 Corporate or foundation gifts</li>
                  <li>🙏 Volunteering time and skills</li>
                  <li>📢 Sharing this project with friends and family</li>
                </ul>
                <p className="text-text-secondary leading-relaxed">
                  All donations will go directly towards the construction and temple facilities.
                </p>
              </div>

              {/* Transparency & Stewardship */}
              <div>
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  Transparency & Stewardship
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  We are committed to the responsible management of all funds:
                </p>
                <ul className="list-disc list-inside space-y-2 text-text-secondary ml-4">
                  <li>Financial oversight by the temple board</li>
                  <li>Regular community updates</li>
                  <li>Construction milestones shared publicly</li>
                  <li>Clear accounting of donations and expenses</li>
                </ul>
                <p className="text-text-secondary leading-relaxed mt-4">
                  Your trust is sacred to us.
                </p>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 border-2 border-primary/20 text-center">
                <h3 className="font-serif text-2xl font-semibold text-text-primary mb-4">
                  Join Us in Building Something Eternal
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Together, we can create a spiritual home that will uplift hearts and
                  minds for generations. Let us build this temple—stone by stone, prayer
                  by prayer, donation by donation.
                </p>
                <ZeffyButton
                  formLink="https://www.zeffy.com/embed/donation-form/vishnu-mandir-building-fund?modal=true"
                  className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 inline-flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Support the Building Fund
                </ZeffyButton>
              </div>
            </div>
          </div>
        </section>

        {/* What's Happening Now */}
        <section className="mb-20">
          <SectionHeading
            title="What's Happening Now"
            subtitle="Latest updates and announcements from the temple"
          />
          {sortedAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {sortedAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border-2 border-primary/5 shadow-warm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full text-accent hidden md:block">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold text-text-primary mb-2">
                    Temple Announcements
                  </h2>
                  <p className="text-text-secondary leading-relaxed">
                    Stay connected with Vishnu Mandir, Tampa through our latest
                    announcements. We regularly update our community about upcoming
                    festivals, special puja services, cultural events, and temple
                    activities. Check back regularly or subscribe to our newsletter
                    to receive updates directly.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Festivals/Events */}
        <section className="mb-20">
          <SectionHeading
            title="Upcoming Festivals & Events"
            subtitle="Join us in celebration and prayer"
          />
          {futureEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureEvents.map((event) => (
                <EventCard key={event.id} event={event} showDescription={false} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Major Festivals",
                  description:
                    "Join us in celebrating major Hindu festivals including Diwali, Navratri, Janmashtami, and more. Each festival brings our community together in prayer, celebration, and devotion.",
                  href: "/religious/festivals",
                  image: "/images/home/event-major-festivals.jpg",
                  imageAlt: "Major Hindu festivals celebration at Vishnu Mandir, Tampa",
                  linkClass: "text-primary font-medium hover:text-primary/80",
                },
                {
                  title: "Cultural Programs",
                  description:
                    "Experience our rich cultural heritage through music, dance, drama, and traditional performances. These programs celebrate our traditions and bring families together.",
                  href: "/cultural",
                  image: "/images/home/event-cultural-programs.jpg",
                  imageAlt: "Cultural programs at Vishnu Mandir, Tampa",
                  linkClass: "text-secondary font-medium hover:text-secondary/80",
                },
                {
                  title: "Educational Classes",
                  description:
                    "Learn Sanskrit, Hindu scriptures, music, and cultural arts through our educational programs designed for children, youth, and adults.",
                  href: "/education/classes",
                  image: "/images/home/event-educational-classes.jpg",
                  imageAlt: "Educational classes at Vishnu Mandir, Tampa",
                  linkClass: "text-accent font-medium hover:text-accent/80",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-xl overflow-hidden border border-border hover:border-accent/50 shadow-md hover:shadow-warm transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-text-secondary mb-4 line-clamp-2">
                      {card.description}
                    </p>
                    <Link
                      href={card.href}
                      className={`inline-flex items-center transition-colors ${card.linkClass}`}
                    >
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section>
          <SectionHeading
            title="Quick Links"
            subtitle="Access common temple services and information"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Puja Schedule",
                desc: "Daily & weekly timings",
                href: "/religious/puja-schedule",
              },
              {
                title: "Puja Services",
                desc: "Available services",
                href: "/religious/puja-services",
              },
              {
                title: "About Us",
                desc: "Temple information",
                href: "/about/about",
              },
              {
                title: "Contact",
                desc: "Get in touch",
                href: "/about/contact",
              },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group bg-white rounded-xl p-6 border border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center justify-center h-full"
              >
                <div className="w-12 h-1 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/30 transition-colors" />
                <h3 className="font-serif font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-text-secondary">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* About Temple Section */}
        <section className="mb-20">
          <SectionHeading
            title="About Vishnu Mandir, Tampa"
            subtitle="A place of worship, community, and spiritual growth"
          />
          <div className="bg-white rounded-xl p-8 border-2 border-primary/5 shadow-warm">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary leading-relaxed mb-4">
                Vishnu Mandir, Tampa has been serving the Hindu community in the
                Tampa Bay area since 2003. Originally located in Ybor City's Palm
                Avenue, our temple relocated to Lynn Road to better serve our
                growing community. We follow the practices and doctrines of
                Hinduism, observing a wide range of Hindu rites and ceremonies
                including Aarti, Sanskaaras, Havans, Bhoomi Pujan, Yagyopaveet
                (Thread Ceremony), Namakaran (Naming ceremony), and Vivah
                (marriage).
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                Our mission is to establish a space of deep spiritual understanding
                for our community, giving each member an equal opportunity to voice
                their opinion and lead a life as defined by Hindu Dharma. We strive
                to utilize novel methods to connect devotees with their faith while
                preserving our rich cultural heritage.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Whether you're seeking daily puja services, celebrating festivals,
                participating in cultural programs, or looking for spiritual
                guidance, Vishnu Mandir welcomes you with open arms. Visit us at{" "}
                <strong>5803 Lynn Road, Tampa, FL 33624</strong> or contact us at{" "}
                <strong>(813) 269-7262</strong>.
              </p>
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}
