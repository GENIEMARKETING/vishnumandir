import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { DonationStatementForm } from "@/components/forms/DonationStatementForm";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Donation Statement | Vishnu Mandir, Tampa",
  description: "Request an official tax-deductible donation statement for your charitable contributions to Vishnu Mandir, Tampa.",
  openGraph: { title: "Donation Statement | Vishnu Mandir, Tampa", type: "website" },
};

export default function FormPage() {
  const structuredData = generateWebPageSchema({ name: "Donation Statement", description: "Request an official tax-deductible donation statement for your charitable contributions to Vishnu Mandir, Tampa.", url: "/forms/donation-statement" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />
      <PageHero tagline="Tax Receipt" title="Donation Statement" subtitle="Request an official tax-deductible donation statement for your charitable contributions to Vishnu Mandir, Tampa." patternId="donation-s-pat" />
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="fade-up" className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10 opacity-0">
            <DonationStatementForm />
          </div>
        </div>
      </section>
    </>
  );
}
