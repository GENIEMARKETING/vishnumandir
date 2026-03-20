"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Clock, MapPin, DollarSign, Sparkles, Phone, Mail } from "lucide-react";
import { gsap } from "gsap";
import { getStrapiImageUrl } from "@/lib/strapi-utils";
import type { StrapiPujaService, StrapiPriest } from "@/types/strapi";
import { ZeffyButton } from "@/components/ui/ZeffyButton";

const schedule = [
  { day: "Monday – Friday", sessions: [{ time: "6:00 AM – 12:00 PM", label: "Morning Puja & Aarti" }, { time: "6:00 PM – 8:30 PM", label: "Evening Aarti" }] },
  { day: "Saturday",         sessions: [{ time: "6:00 AM – 1:00 PM",  label: "Morning Puja & Aarti" }, { time: "5:00 PM – 8:30 PM", label: "Evening Aarti" }] },
  { day: "Sunday",           sessions: [{ time: "6:00 AM – 1:00 PM",  label: "Morning Puja & Aarti" }, { time: "5:00 PM – 8:30 PM", label: "Evening Aarti" }] },
  { day: "Festival Days",    sessions: [{ time: "Extended Hours",       label: "Multiple special pujas — see calendar" }] },
];

const specialServices = [
  { icon: "🔥", title: "Havans", desc: "Sacred fire rituals for special occasions and family ceremonies" },
  { icon: "👶", title: "Namakaran", desc: "Traditional Hindu naming ceremony for newborns" },
  { icon: "🧵", title: "Yagyopaveet", desc: "Sacred thread ceremony (Upanayanam) for young men" },
  { icon: "💍", title: "Vivah", desc: "Hindu wedding ceremonies conducted by our priests" },
  { icon: "🌱", title: "Bhoomi Pujan", desc: "Ground-breaking puja for new homes and projects" },
  { icon: "🕯️", title: "Griha Pravesh", desc: "Home entry/housewarming puja ceremonies" },
];

interface Props {
  pujaServices: StrapiPujaService[];
  priests: StrapiPriest[];
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

/** Animate tab panel content in on mount / tab switch */
function useTabAnimation(dep: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const items = ref.current.querySelectorAll("[data-animate]");
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out", clearProps: "all" }
    );
  }, [dep]);
  return ref;
}

export function PujaWorshipTabs({ pujaServices, priests }: Props) {
  const [activeTab, setActiveTab] = useState<"schedule" | "services" | "priests">("schedule");

  const scheduleRef = useTabAnimation(activeTab === "schedule" ? "schedule" : "");
  const servicesRef = useTabAnimation(activeTab === "services" ? "services" : "");
  const priestsRef  = useTabAnimation(activeTab === "priests"  ? "priests"  : "");

  const tabs = [
    { id: "schedule" as const, label: "Puja Schedule" },
    { id: "services" as const, label: "Services & Pricing" },
    { id: "priests"  as const, label: "Our Priests" },
  ];

  return (
    <div>
      {/* ── STICKY TAB BAR ─────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? "border-temple-red text-temple-red"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── SCHEDULE TAB ────────────────────────────────────────────── */}
      {activeTab === "schedule" && (
        <div ref={scheduleRef} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {schedule.map((item, i) => (
                <div key={i} data-animate className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                  <div className="bg-temple-red px-6 py-4">
                    <h3 className="font-display text-white font-bold text-lg">{item.day}</h3>
                  </div>
                  <div className="divide-y divide-stone-100">
                    {item.sessions.map((s, j) => (
                      <div key={j} className="flex items-center gap-4 px-6 py-4">
                        <div className="p-2 bg-temple-gold/10 rounded-lg text-temple-gold flex-shrink-0">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-stone-800 text-sm">{s.label}</p>
                          <p className="text-temple-red font-medium text-sm">{s.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Special ceremonies */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-4">
                <div className="h-px w-12 bg-temple-gold" />
                <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">Special Ceremonies</h2>
                <div className="h-px w-12 bg-temple-gold" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {specialServices.map((s, i) => (
                <div key={i} data-animate className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <span className="text-3xl flex-shrink-0">{s.icon}</span>
                  <div>
                    <h4 className="font-bold text-stone-800 mb-1">{s.title}</h4>
                    <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div data-animate className="bg-temple-red/5 border border-temple-red/10 rounded-3xl p-10 text-center">
              <p className="text-stone-600 mb-4 text-lg">Timings may vary during festivals. Call to confirm.</p>
              <a href="tel:+18132697262" className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
                <Phone size={18} /> (813) 269-7262
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── SERVICES TAB ────────────────────────────────────────────── */}
      {activeTab === "services" && (
        <div ref={servicesRef} className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {pujaServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {pujaServices.map((service, i) => {
                  const { name, description, price, location } = service.attributes;
                  const imageUrl = getStrapiImageUrl(service.attributes.image);
                  return (
                    <div key={i} data-animate className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      {imageUrl && (
                        <div className="relative h-44 overflow-hidden">
                          <Image src={imageUrl} alt={name} fill className="object-cover" sizes="33vw" />
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <h3 className="font-serif text-lg font-bold text-stone-800">{name}</h3>
                        {description && <p className="text-stone-500 text-sm leading-relaxed line-clamp-3">{description}</p>}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1 text-temple-red font-bold">
                            <DollarSign size={16} />
                            <span>{price > 0 ? `$${price.toFixed(2)}` : "Contact for pricing"}</span>
                          </div>
                          {location && (
                            <div className="flex items-center gap-1 text-stone-400 text-xs">
                              <MapPin size={12} /><span>{location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {specialServices.map((s, i) => (
                  <div key={i} data-animate className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
                    <span className="text-4xl block mb-4">{s.icon}</span>
                    <h3 className="font-serif text-lg font-bold text-stone-800 mb-2">{s.title}</h3>
                    <p className="text-stone-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            <div data-animate className="bg-gradient-to-br from-temple-red to-red-900 rounded-3xl p-10 text-white text-center">
              <h3 className="font-display text-2xl font-bold mb-4">Ready to Sponsor a Puja?</h3>
              <p className="text-stone-200 mb-8 max-w-xl mx-auto">Book online or contact us to schedule your ceremony.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <ZeffyButton formLink="https://www.zeffy.com/embed/donation-form/online-puja?modal=true" className="bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all shadow-md">
                  Book Online Puja
                </ZeffyButton>
                <a href="tel:+18132697262" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all">
                  Call (813) 269-7262
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIESTS TAB ─────────────────────────────────────────────── */}
      {activeTab === "priests" && (
        <div ref={priestsRef} className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {priests.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {priests.map((priest, i) => {
                  const { name, title, bio } = priest.attributes;
                  const photoUrl = getStrapiImageUrl(priest.attributes.profileImage);
                  const strapiBase = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
                  const fullPhoto = photoUrl?.startsWith("http") ? photoUrl : `${strapiBase}${photoUrl}`;
                  return (
                    <div key={i} data-animate className="bg-white rounded-3xl border border-stone-100 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center">
                      <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mt-8 ring-4 ring-temple-gold/30">
                        {photoUrl ? (
                          <Image src={fullPhoto} alt={name} width={112} height={112} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-temple-red to-temple-orange flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{getInitials(name)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-xl font-bold text-stone-800">{name}</h3>
                        {title && <p className="text-temple-red font-medium text-sm mt-1 uppercase tracking-wider">{title}</p>}
                        {bio && <p className="text-stone-500 text-sm mt-3 leading-relaxed line-clamp-4">{bio}</p>}
                        <a href="tel:+18132697262" className="inline-flex items-center gap-2 mt-5 text-temple-red text-sm font-semibold hover:underline">
                          <Phone size={14} /> Contact
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div data-animate className="text-center py-16">
                <div className="w-16 h-16 bg-temple-red/10 rounded-2xl flex items-center justify-center text-temple-red mx-auto mb-6">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-800 mb-4">Meet Our Priests</h3>
                <p className="text-stone-500 mb-8 max-w-md mx-auto">Our dedicated priests are available for temple and home ceremonies. Contact us to speak with a priest.</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a href="tel:+18132697262" className="inline-flex items-center gap-2 bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all">
                    <Phone size={18} /> (813) 269-7262
                  </a>
                  <a href="mailto:info@vishnumandirtampa.com" className="inline-flex items-center gap-2 border-2 border-temple-red text-temple-red px-8 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
                    <Mail size={18} /> Email Us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
