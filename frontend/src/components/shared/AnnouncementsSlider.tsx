"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import type { StrapiAnnouncement } from "@/types/strapi";

interface Props {
  announcements: StrapiAnnouncement[];
}

export function AnnouncementsSlider({ announcements }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // How many cards to show at a time based on count
  const visibleCount =
    announcements.length === 1 ? 1 :
    announcements.length === 2 ? 2 : 3;

  const maxIndex = Math.max(0, announcements.length - visibleCount);

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
  }, [maxIndex]);

  const prev = () => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1));
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (announcements.length <= visibleCount) return;
    if (paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused, announcements.length, visibleCount]);

  // Single card — no slider needed
  if (announcements.length === 1) {
    return (
      <div className="max-w-md mx-auto">
        <AnnouncementCard announcement={announcements[0]} />
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Arrow: Previous */}
      {announcements.length > visibleCount && (
        <button
          onClick={prev}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-md flex items-center justify-center text-stone-600 hover:text-temple-red hover:border-temple-red/30 transition-all"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Slides viewport */}
      <div className="overflow-hidden">
        <div
          className="flex gap-5 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(calc(-${current} * (100% / ${visibleCount} + ${20 / visibleCount}px)))` }}
        >
          {announcements.map((a) => (
            <div
              key={a.id}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / visibleCount}% - ${(20 * (visibleCount - 1)) / visibleCount}px)` }}
            >
              <AnnouncementCard announcement={a} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow: Next */}
      {announcements.length > visibleCount && (
        <button
          onClick={next}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-md flex items-center justify-center text-stone-600 hover:text-temple-red hover:border-temple-red/30 transition-all"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* Dot indicators */}
      {announcements.length > visibleCount && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                current === i
                  ? "w-6 h-2 bg-temple-red"
                  : "w-2 h-2 bg-stone-300 hover:bg-stone-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
