import type { Metadata } from "next";
import Link from "next/link";
import { Heart, RefreshCw, Sparkles, Users, Shield, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { ZeffyButton } from "@/components/ui/ZeffyButton";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Support | Vishnu Mandir, Tampa - Ways to Give & Get Involved",
  description:
    "Support Vishnu Mandir, Tampa through donations, recurring giving, puja sponsorships, and membership. Every contribution helps preserve our temple and serve our community.",
  openGraph: {
    title: "Support | Vishnu Mandir, Tampa",
    description: "Ways to support Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const supportOptions = [
  {
    icon: <Heart size={32} fill="currentColor" />,
    title: "Make a Donation",
    desc: "Your one-time gift directly supports daily puja services, facility maintenance, and community programs. Every amount makes a difference.",
    cta: "Donate Now",
    zeffy: "https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true",
    highlight: true,
  },
  {
    icon: <RefreshCw size={32} />,
    title: "Recurring Donation",
    desc: "Set up a monthly or annual donation to provide consistent, reliable support that helps us plan and grow our programs year-round.",
    cta: "Set Up Recurring",
    href: "/recurring-donation",
    highlight: false,
  },
  {
    icon: <Sparkles size={32} />,
    title: "Sponsor a Puja",
    desc: "Sponsor a puja service at the temple in honor of a family occasion, in memory of a loved one, or for personal blessings and well-being.",
    cta: "Sponsor Online",
    zeffy: "https://www.zeffy.com/embed/donation-form/online-puja?modal=true",
    highlight: false,
  },
  {
    icon: <Users size={32} />,
    title: "Become a Member",
    desc: "Become an official member of Vishnu Mandir, Tampa. Membership gives you a voice in our community and supports all our programs.",
    cta: "Join Today",
    zeffy: "https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true",
    highlight: false,
  },
];

const transparency = [
  { title: "Financial Oversight", desc: "All funds are managed and reviewed by the Board of Trustees." },
  { title: "Regular Updates", desc: "Donors receive updates on how contributions are being used." },
  { title: "Tax Deductible", desc: "Vishnu Mandir is a registered 501(c)(3) non-profit organization." },
  { title: "Public Accounting", desc: "Financial reports are available to community members on request." },
];

export default function SupportPage() {
  const structuredData = generateWebPageSchema({
    name: "Support",
    description: "Ways to support Vishnu Mandir, Tampa",
    url: "/support",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Give Back to the Community"
        title="Support the Temple"
        subtitle="Your generosity keeps our sacred space alive — from daily pujas to the new building fund. Every contribution matters."
        patternId="support-pat"
      />

      {/* ── SUPPORT OPTIONS ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Ways to Give</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {supportOptions.map((opt, i) => (
              <div
                key={i}
                data-gsap="card"
                className={`group rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 opacity-0 ${
                  opt.highlight
                    ? "bg-temple-red border-temple-red text-white shadow-xl"
                    : "bg-white border-stone-100 shadow-md hover:shadow-xl hover:border-temple-red/20"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  opt.highlight ? "bg-white/20 text-white" : "bg-temple-red/10 text-temple-red"
                }`}>
                  {opt.icon}
                </div>
                <h3 className={`font-display text-2xl font-bold mb-3 ${opt.highlight ? "text-white" : "text-stone-800"}`}>
                  {opt.title}
                </h3>
                <p className={`leading-relaxed mb-7 ${opt.highlight ? "text-stone-200" : "text-stone-500"}`}>
                  {opt.desc}
                </p>
                {opt.zeffy ? (
                  <ZeffyButton
                    formLink={opt.zeffy}
                    className={`inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold transition-all shadow-md ${
                      opt.highlight
                        ? "bg-white text-temple-red hover:bg-stone-100"
                        : "bg-temple-red text-white hover:bg-red-900"
                    }`}
                  >
                    <Heart size={16} fill="currentColor" /> {opt.cta}
                  </ZeffyButton>
                ) : (
                  <Link
                    href={opt.href!}
                    className="inline-flex items-center gap-2 bg-temple-red text-white px-7 py-3 rounded-full font-bold hover:bg-red-900 transition-all shadow-md"
                  >
                    {opt.cta} <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILDING FUND ─────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="cta-block" className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-10 md:p-14 text-white text-center shadow-2xl opacity-0">
            <div className="w-16 h-16 bg-temple-gold/20 rounded-2xl flex items-center justify-center text-temple-gold mx-auto mb-6">
              <Heart size={32} fill="currentColor" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">New Temple Building Fund</h2>
            <p className="text-stone-300 leading-relaxed max-w-2xl mx-auto mb-8 text-lg">
              Help us build a permanent spiritual home for generations to come. Every donation to the building fund brings us closer to our vision of a purpose-built temple campus for the Tampa Bay community.
            </p>
            <ZeffyButton
              formLink="https://www.zeffy.com/embed/donation-form/vishnu-mandir-building-fund?modal=true"
              className="bg-temple-gold text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-600 transition-all shadow-xl inline-flex items-center gap-3"
            >
              <Heart size={20} fill="currentColor" /> Support the Building Fund
            </ZeffyButton>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCY ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-12 opacity-0">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">Transparency & Stewardship</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
            <p className="text-stone-500 italic mt-2">Your trust is sacred to us</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {transparency.map((t, i) => (
              <div key={i} data-gsap="card" className="bg-stone-50 rounded-2xl p-6 border border-stone-100 text-center group hover:border-temple-red/20 hover:shadow-md transition-all opacity-0">
                <div className="w-10 h-10 bg-temple-red/10 rounded-xl flex items-center justify-center text-temple-red mx-auto mb-4 group-hover:bg-temple-red group-hover:text-white transition-all">
                  <Shield size={18} />
                </div>
                <h3 className="font-serif font-bold text-stone-800 mb-2">{t.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
