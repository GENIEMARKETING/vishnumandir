import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { FacilityRequestForm } from "@/components/forms/FacilityRequestForm";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Request Our Facilities | Vishnu Mandir, Tampa",
  description: "Need space for a community event, gathering, or celebration? Submit your request and we will follow up with availability.",
  openGraph: { title: "Request Our Facilities | Vishnu Mandir, Tampa", type: "website" },
};

export default function FormPage() {
  const structuredData = generateWebPageSchema({ name: "Request Our Facilities", description: "Need space for a community event, gathering, or celebration? Submit your request and we will follow up with availability.", url: "/forms/request-facility" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />
      <PageHero tagline="Facility Rental" title="Request Our Facilities" subtitle="Need space for a community event, gathering, or celebration? Submit your request and we will follow up with availability." patternId="facility-pat" />
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="fade-up" className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10 opacity-0">
            <FacilityRequestForm />
          </div>
        </div>
      </section>
    </>
  );
}
