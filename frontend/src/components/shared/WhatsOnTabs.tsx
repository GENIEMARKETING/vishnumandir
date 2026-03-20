"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, Info } from "lucide-react";
import Link from "next/link";
import type { StrapiEvent, StrapiAnnouncement } from "@/types/strapi";
import { EventCard } from "@/components/shared/EventCard";
import { AnnouncementsSlider } from "@/components/shared/AnnouncementsSlider";

interface Props {
  events: StrapiEvent[];
  announcements: StrapiAnnouncement[];
}

export function WhatsOnTabs({ events, announcements }: Props) {
  const [tab, setTab] = useState<"events" | "announcements">("events");

  return (
    <div>
      {/* Sticky tab bar */}
      <div className="sticky top-20 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {[
            { id: "events" as const, label: `Upcoming Events (${events.length})` },
            { id: "announcements" as const, label: `Announcements (${announcements.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-300 ${
                tab === t.id
                  ? "border-temple-red text-temple-red"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events tab */}
      {tab === "events" && (
        <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} data-gsap="card" className="opacity-0">
                  <EventCard event={event} showDescription={false} />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="w-16 h-16 bg-temple-gold/10 rounded-2xl flex items-center justify-center text-temple-gold mx-auto mb-5">
                <Calendar size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">No Upcoming Events</h3>
              <p className="text-stone-500 mb-6">Check back soon or subscribe to our newsletter to stay informed.</p>
              <Link href="/calendar/newsletter" className="inline-flex items-center gap-2 bg-temple-red text-white px-6 py-3 rounded-full font-semibold hover:bg-red-900 transition-all">
                Subscribe to Newsletter
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Announcements tab */}
      {tab === "announcements" && (
        <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {announcements.length > 0 ? (
            <div className="px-6">
              <AnnouncementsSlider announcements={announcements} />
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="w-16 h-16 bg-temple-gold/10 rounded-2xl flex items-center justify-center text-temple-gold mx-auto mb-5">
                <Info size={28} />
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-2">No Announcements</h3>
              <p className="text-stone-500">Check back soon for temple updates and notices.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
