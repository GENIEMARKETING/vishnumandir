import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { EmailSubscriptionForm } from "@/components/forms/EmailSubscriptionForm";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Email Subscription | Vishnu Mandir, Tampa",
  description: "Subscribe to our newsletter or manage your email preferences to receive temple news and event announcements.",
  openGraph: { title: "Email Subscription | Vishnu Mandir, Tampa", type: "website" },
};

export default function FormPage() {
  const structuredData = generateWebPageSchema({ name: "Email Subscription", description: "Subscribe to our newsletter or manage your email preferences to receive temple news and event announcements.", url: "/forms/email-subscription" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />
      <PageHero tagline="Newsletter" title="Email Subscription" subtitle="Subscribe to our newsletter or manage your email preferences to receive temple news and event announcements." patternId="email-sub-pat" />
      <section className="py-20 bg-stone-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-gsap="fade-up" className="bg-white rounded-3xl shadow-lg border border-stone-100 p-8 md:p-10 opacity-0">
            <EmailSubscriptionForm />
          </div>
        </div>
      </section>
    </>
  );
}
