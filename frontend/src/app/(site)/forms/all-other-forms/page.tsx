import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Other Requests | Vishnu Mandir, Tampa",
  description: "Special requests, general inquiries, and additional forms for Vishnu Mandir, Tampa.",
  openGraph: { title: "Other Requests | Vishnu Mandir, Tampa", type: "website" },
};

const otherForms = [
  { title: "General Inquiry", desc: "Questions or requests not covered by our other forms." },
  { title: "Volunteer Application", desc: "Apply to volunteer for temple events and services.", href: "/about/volunteer" },
  { title: "Membership Application", desc: "Apply to become an official member of Vishnu Mandir.", href: "/support" },
  { title: "Priest Services Request", desc: "Request a priest for a home ceremony or off-site puja.", href: "/religious/puja-worship" },
];

export default function AllOtherFormsPage() {
  const structuredData = generateWebPageSchema({
    name: "Other Requests",
    description: "Additional forms and requests for Vishnu Mandir, Tampa",
    url: "/forms/all-other-forms",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Additional Requests"
        title="Other Forms & Requests"
        subtitle="Can't find what you need? Contact us directly or browse our additional service options below."
        patternId="other-forms-pat"
      />

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 mb-14">
            {otherForms.map((f, i) => (
              <div key={i} data-gsap="card" className="opacity-0">
                {f.href ? (
                  <Link href={f.href} className="group flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:border-temple-red/20 hover:shadow-md transition-all duration-300">
                    <div>
                      <h3 className="font-serif font-bold text-stone-800 group-hover:text-temple-red transition-colors">{f.title}</h3>
                      <p className="text-stone-500 text-sm mt-1">{f.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-stone-300 group-hover:text-temple-red group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100">
                    <div>
                      <h3 className="font-serif font-bold text-stone-800">{f.title}</h3>
                      <p className="text-stone-500 text-sm mt-1">{f.desc}</p>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-500 px-3 py-1 rounded-full">Contact Us</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div data-gsap="cta-block" className="bg-gradient-to-br from-temple-red to-red-900 rounded-3xl p-10 text-white text-center opacity-0">
            <h3 className="font-display text-2xl font-bold mb-3">Need Something Else?</h3>
            <p className="text-stone-200 mb-7">Reach out directly and we&apos;ll be happy to assist you.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+18132697262" className="bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-stone-100 transition-all shadow-md inline-flex items-center gap-2">
                <Phone size={16} /> (813) 269-7262
              </a>
              <a href="mailto:info@vishnumandirtampa.com" className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/20 transition-all inline-flex items-center gap-2">
                <Mail size={16} /> Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
