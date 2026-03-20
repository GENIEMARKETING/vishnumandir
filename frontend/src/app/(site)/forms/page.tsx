import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Building2, FileText, MapPin, Mail, ClipboardList, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Forms | Vishnu Mandir, Tampa - Submit Requests & Applications",
  description:
    "Access all temple forms including puja sponsorships, facility rental, donation statements, address changes, and email subscriptions.",
  openGraph: {
    title: "Forms | Vishnu Mandir, Tampa",
    description: "Submit requests and forms to Vishnu Mandir, Tampa.",
    type: "website",
  },
};

const forms = [
  {
    icon: <Sparkles size={28} />,
    title: "Puja Sponsorship",
    desc: "Sponsor a puja service for your family's well-being, special occasions, or in honor of a loved one.",
    href: "/forms/puja-sponsorships",
    cta: "Sponsor a Puja",
    highlight: true,
  },
  {
    icon: <Building2 size={28} />,
    title: "Facility Rental",
    desc: "Request the use of temple facilities for community events, gatherings, and special occasions.",
    href: "/forms/request-facility",
    cta: "Request Facility",
    highlight: false,
  },
  {
    icon: <FileText size={28} />,
    title: "Donation Statement",
    desc: "Request an official tax-deductible donation statement for your charitable contributions to the temple.",
    href: "/forms/donation-statement",
    cta: "Request Statement",
    highlight: false,
  },
  {
    icon: <MapPin size={28} />,
    title: "Change of Address",
    desc: "Update your contact information including home address, phone number, or email to stay connected.",
    href: "/forms/change-of-address",
    cta: "Update Address",
    highlight: false,
  },
  {
    icon: <Mail size={28} />,
    title: "Email Subscription",
    desc: "Subscribe or manage your newsletter preferences to receive temple updates and event announcements.",
    href: "/forms/email-subscription",
    cta: "Manage Subscription",
    highlight: false,
  },
  {
    icon: <ClipboardList size={28} />,
    title: "Other Requests",
    desc: "All other forms, special requests, general inquiries, and additional temple service requests.",
    href: "/forms/all-other-forms",
    cta: "View Other Forms",
    highlight: false,
  },
];

export default function FormsHubPage() {
  const structuredData = generateWebPageSchema({
    name: "Forms",
    description: "All temple forms and requests at Vishnu Mandir, Tampa",
    url: "/forms",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Submit a Request"
        title="Forms & Requests"
        subtitle="Everything you need to connect with us — from puja sponsorships to facility rentals, all in one place."
        patternId="forms-pat"
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="section-heading" className="text-center mb-16 opacity-0">
            <div className="inline-flex items-center gap-4 mb-2">
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
              <h2 className="font-display text-4xl text-temple-red uppercase tracking-widest">Available Forms</h2>
              <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form, i) => (
              <Link
                key={i}
                href={form.href}
                data-gsap="card"
                className={`group rounded-3xl border p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 opacity-0 flex flex-col ${
                  form.highlight
                    ? "bg-temple-red border-temple-red text-white"
                    : "bg-white border-stone-100 shadow-sm hover:border-temple-red/20"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 ${
                  form.highlight
                    ? "bg-white/20 text-white"
                    : "bg-temple-red/10 text-temple-red group-hover:bg-temple-red group-hover:text-white"
                }`}>
                  {form.icon}
                </div>
                <h3 className={`font-serif text-xl font-bold mb-3 ${form.highlight ? "text-white" : "text-stone-800 group-hover:text-temple-red transition-colors"}`}>
                  {form.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${form.highlight ? "text-stone-200" : "text-stone-500"}`}>
                  {form.desc}
                </p>
                <div className={`flex items-center gap-2 font-semibold text-sm ${form.highlight ? "text-temple-gold" : "text-temple-red"}`}>
                  {form.cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
