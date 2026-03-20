import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchEvents, fetchAnnouncements } from "@/lib/strapi";
import { isFutureEvent } from "@/lib/strapi-utils";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";
import { WhatsOnTabs } from "@/components/shared/WhatsOnTabs";

export const metadata: Metadata = {
  title: "What's On | Vishnu Mandir, Tampa - Events & Announcements",
  description:
    "View upcoming events and latest announcements at Vishnu Mandir, Tampa. Stay connected with puja services, festivals, cultural programs, and temple news.",
  openGraph: {
    title: "What's On | Vishnu Mandir, Tampa",
    description: "Upcoming events and announcements at Vishnu Mandir, Tampa.",
    type: "website",
  },
};

export const revalidate = 300;

export default async function WhatsOnPage() {
  const structuredData = generateWebPageSchema({
    name: "What's On",
    description: "Events and announcements at Vishnu Mandir, Tampa",
    url: "/calendar/current-events",
  });

  const [allEvents, allAnnouncements] = await Promise.all([
    fetchEvents({ publishedAt: true, sort: "date:asc" }),
    fetchAnnouncements({ displayUntil: new Date() }),
  ]);

  const events = allEvents
    .filter((e) => e?.attributes)
    .filter((e) => {
      if (!e.attributes.date || !e.attributes.startTime) return false;
      return isFutureEvent(e.attributes.date, e.attributes.startTime);
    });

  const announcements = allAnnouncements
    .filter((a) => a?.attributes)
    .sort((a, b) => {
      if (a.attributes.level === "High-Priority" && b.attributes.level !== "High-Priority") return -1;
      if (a.attributes.level !== "High-Priority" && b.attributes.level === "High-Priority") return 1;
      return new Date(b.attributes.publishedAt || b.attributes.createdAt).getTime() -
             new Date(a.attributes.publishedAt || a.attributes.createdAt).getTime();
    });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Stay Connected"
        title="What's On"
        subtitle="Upcoming events, festivals, programs, and the latest announcements from Vishnu Mandir, Tampa."
        patternId="whats-on-pat"
      />

      <WhatsOnTabs events={events} announcements={announcements} />
    </>
  );
}
