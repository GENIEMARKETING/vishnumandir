import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { PujaSponsorshipForm } from "@/components/forms/PujaSponsorshipForm";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Sponsor a Puja | Vishnu Mandir, Tampa",
  description: "Support our daily worship by sponsoring a puja service for your family, a special occasion, or in memory of a loved one.",
  openGraph: { title: "Sponsor a Puja | Vishnu Mandir, Tampa", type: "website" },
};

export default function FormPage() {
  const structuredData = generateWebPageSchema({ name: "Sponsor a Puja", description: "Support our daily worship by sponsoring a puja service for your family, a special occasion, or in memory of a loved one.", url: "/forms/puja-sponsorships" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />
      <PageHero tagline="Puja Sponsorship" title="Sponsor a Puja" subtitle="Support our daily worship by sponsoring a puja service for your family, a special occasion, or in memory of a loved one." patternId="puja-s-pat" />
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="fade-up" className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10 opacity-0">
            <PujaSponsorshipForm />
          </div>
        </div>
      </section>
    </>
  );
}
