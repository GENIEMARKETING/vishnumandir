import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { ChangeOfAddressForm } from "@/components/forms/ChangeOfAddressForm";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Change of Address | Vishnu Mandir, Tampa",
  description: "Keep your contact information up to date so you continue to receive temple communications and event notifications.",
  openGraph: { title: "Change of Address | Vishnu Mandir, Tampa", type: "website" },
};

export default function FormPage() {
  const structuredData = generateWebPageSchema({ name: "Change of Address", description: "Keep your contact information up to date so you continue to receive temple communications and event notifications.", url: "/forms/change-of-address" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />
      <PageHero tagline="Update Contact" title="Change of Address" subtitle="Keep your contact information up to date so you continue to receive temple communications and event notifications." patternId="addr-pat" />
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="fade-up" className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10 opacity-0">
            <ChangeOfAddressForm />
          </div>
        </div>
      </section>
    </>
  );
}
