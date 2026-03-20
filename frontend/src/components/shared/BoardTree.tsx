"use client";

import Image from "next/image";
import type { StrapiBoardMember } from "@/types/strapi";

interface BoardTreeProps {
  members: StrapiBoardMember[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function MemberCard({
  member,
  size = "md",
  gsapAttr,
}: {
  member: StrapiBoardMember;
  size?: "lg" | "md" | "sm";
  gsapAttr: string;
}) {
  const { name, role, bio, photo } = member.attributes;
  const photoUrl = photo?.data?.attributes?.url || (photo as unknown as { url?: string })?.url;
  const strapiBase = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
  const fullUrl = photoUrl?.startsWith("http") ? photoUrl : `${strapiBase}${photoUrl}`;

  const avatarSize =
    size === "lg" ? "w-24 h-24 text-2xl" :
    size === "md" ? "w-16 h-16 text-lg" :
                    "w-12 h-12 text-sm";

  const cardPad =
    size === "lg" ? "p-8" :
    size === "md" ? "p-5" :
                    "p-4";

  const nameSz =
    size === "lg" ? "text-xl" :
    size === "md" ? "text-base" :
                    "text-sm";

  return (
    <div
      data-gsap={gsapAttr}
      className={`opacity-0 flex flex-col items-center text-center bg-white rounded-2xl border border-stone-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${cardPad}`}
    >
      {/* Avatar / Photo */}
      <div className={`${avatarSize} rounded-full overflow-hidden mb-3 ring-4 ring-temple-gold/30 flex-shrink-0`}>
        {photoUrl ? (
          <Image
            src={fullUrl}
            alt={name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-temple-red to-temple-orange flex items-center justify-center">
            <span className={`font-bold text-white ${nameSz}`}>
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>

      <h3 className={`font-serif font-bold text-stone-800 ${nameSz} leading-tight`}>
        {name}
      </h3>
      <p className="text-temple-red font-medium text-xs mt-1 uppercase tracking-wider">
        {role}
      </p>
      {bio && size === "lg" && (
        <p className="text-stone-500 text-sm mt-3 leading-relaxed line-clamp-3">
          {bio}
        </p>
      )}
    </div>
  );
}

export function BoardTree({ members }: BoardTreeProps) {
  const president  = members.filter((m) => m.attributes.tier === "President");
  const executives = members.filter((m) => m.attributes.tier === "Executive");
  const directors  = members.filter((m) => m.attributes.tier === "Director");

  return (
    <div className="w-full">
      {/* ── PRESIDENT ── */}
      {president.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="max-w-xs w-full">
            <MemberCard member={president[0]} size="lg" gsapAttr="board-president" />
          </div>

          {/* Vertical connector */}
          {(executives.length > 0 || directors.length > 0) && (
            <div
              data-gsap="tree-line"
              className="w-px h-10 bg-temple-gold/60 my-1"
            />
          )}
        </div>
      )}

      {/* ── EXECUTIVES ── */}
      {executives.length > 0 && (
        <div className="flex flex-col items-center">
          {/* Horizontal bar */}
          <div
            data-gsap="tree-hline"
            className="h-px bg-temple-gold/60"
            style={{ width: `${Math.min(executives.length * 220, 660)}px` }}
          />
          {/* Tick lines above each card */}
          <div className="flex gap-4 justify-center">
            {executives.map((_, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: "200px" }}>
                <div data-gsap="tree-line" className="w-px h-6 bg-temple-gold/60" />
              </div>
            ))}
          </div>
          {/* Executive cards */}
          <div className="flex flex-wrap gap-4 justify-center">
            {executives.map((m) => (
              <div key={m.id} className="w-48">
                <MemberCard member={m} size="md" gsapAttr="board-executive" />
              </div>
            ))}
          </div>

          {/* Connector to directors */}
          {directors.length > 0 && (
            <div data-gsap="tree-line" className="w-px h-10 bg-temple-gold/60 my-1" />
          )}
        </div>
      )}

      {/* ── DIRECTORS ── */}
      {directors.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-temple-gold mb-4">
              Board of Directors
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {directors.map((m) => (
                <MemberCard key={m.id} member={m} size="sm" gsapAttr="board-director" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
