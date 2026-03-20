import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Terms of Service | Vishnu Mandir, Tampa",
  description: "Terms of Service for Vishnu Mandir, Tampa. Read our terms and conditions for using our website and services.",
};

export default function TermsOfServicePage() {
  const structuredData = generateWebPageSchema({
    name: "Terms of Service",
    description: "Terms of Service for Vishnu Mandir, Tampa",
    url: "/terms-of-service",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Legal Information"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our website and services."
        patternId="tos-pat"
      />

      <div className="bg-temple-cream min-h-screen">
        <div data-gsap="fade-up" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 opacity-0">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
            <p className="text-stone-500 mb-10 pb-6 border-b border-stone-100">
              <strong>Last Updated:</strong> January 2026
            </p>

            <div className="prose prose-lg max-w-none text-stone-600 space-y-8
              prose-headings:font-serif prose-headings:text-stone-800
              prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-base prose-h3:font-semibold prose-h3:mt-5 prose-h3:mb-2
              prose-li:text-stone-600 prose-strong:text-stone-800">

              <section><h2>1. Acceptance of Terms</h2><p>By accessing and using the Vishnu Mandir, Tampa website (the &ldquo;Website&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use the Website. We reserve the right to modify these Terms at any time.</p></section>

              <section><h2>2. Use of Website</h2><p>You agree to use this Website only for lawful purposes and in a way that does not:</p><ul><li>Infringe upon anyone&apos;s intellectual property rights</li><li>Harass or cause distress to any person</li><li>Transmit viruses, malware, or destructive code</li><li>Attempt to gain unauthorized access to the Website&apos;s systems</li><li>Engage in any form of deceptive or fraudulent activity</li></ul></section>

              <section><h2>3. Intellectual Property Rights</h2><p>All content on this Website, including text, graphics, logos, images, videos, and software, is the property of Vishnu Mandir, Tampa or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or modify any content without our prior written permission.</p></section>

              <section>
                <h2>4. Donations and Payments</h2>
                <h3>4.1 Donation Terms</h3>
                <ul><li>All donations are voluntary and intended to support Vishnu Mandir, Tampa&apos;s programs and operations</li><li>Donations are generally non-refundable</li><li>All donations are tax-deductible (consult a tax professional for specifics)</li></ul>
                <h3>4.2 Payment Processing</h3>
                <ul><li>Donations are processed securely through Stripe, a PCI DSS Level 1 certified payment processor</li><li>We do not store your credit card information on our servers</li></ul>
                <h3>4.3 Recurring Donations</h3>
                <ul><li>If you set up a recurring donation, you authorize Vishnu Mandir to charge your payment method on the specified schedule</li><li>You can cancel a recurring donation at any time by notifying us in writing</li></ul>
              </section>

              <section><h2>5. Puja Sponsorship</h2><ul><li>Puja sponsorship requests are subject to availability and the temple&apos;s schedule</li><li>Payment must be received before the sponsorship request is confirmed</li><li>Specific requests may not always be accommodable; the temple reserves the right to suggest alternatives</li><li>Sponsorship fees are non-refundable once the puja has been performed</li></ul></section>

              <section><h2>6. Facility Rentals</h2><ul><li>All facility rental requests are subject to availability and temple policies</li><li>The temple reserves the right to decline any rental request at its sole discretion</li><li>Users are responsible for any damage to facilities during their use</li><li>A security deposit may be required</li></ul></section>

              <section><h2>7. Third-Party Links and Services</h2><p>Our Website may contain links to third-party websites and services. We are not responsible for the content or practices of these external sites. Your use of third-party websites is governed by their own terms of service.</p></section>

              <section><h2>8. Disclaimer of Warranties</h2><p>This Website is provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis without any warranties of any kind. We disclaim all warranties, including warranties of merchantability, fitness for a particular purpose, or that the Website will be uninterrupted or error-free.</p></section>

              <section><h2>9. Limitation of Liability</h2><p>In no event shall Vishnu Mandir, Tampa, its directors, officers, employees, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use of the Website or services, including loss of data, lost profits, or personal injury.</p></section>

              <section><h2>10. Governing Law</h2><p>These Terms are governed by the laws of the State of Florida, United States. Any legal action shall be brought exclusively in the state or federal courts located in Hillsborough County, Florida.</p></section>

              <section><h2>11. Indemnification</h2><p>You agree to indemnify and hold harmless Vishnu Mandir, Tampa, its directors, officers, employees, and agents from any claims, damages, or expenses arising out of your use of the Website, your violation of these Terms, or your infringement of any third-party rights.</p></section>

              <section><h2>12. Severability</h2><p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p></section>

              <section><h2>13. Entire Agreement</h2><p>These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and Vishnu Mandir, Tampa regarding your use of the Website.</p></section>

              <section>
                <h2>14. Contact Information</h2>
                <p>If you have questions regarding these Terms, please contact us:</p>
                <div className="bg-temple-red/5 border border-temple-red/10 rounded-2xl p-6 mt-4 not-prose">
                  <p className="font-bold text-stone-800 mb-2">Vishnu Mandir, Tampa</p>
                  <p className="text-stone-600 text-sm">Email: info@vishnumandirtampa.com</p>
                  <p className="text-stone-600 text-sm">Phone: (813) 269-7262</p>
                </div>
              </section>

              <section><h2>15. Updates to Terms</h2><p>We reserve the right to update these Terms at any time. Continued use of the Website after changes are posted constitutes acceptance of the updated Terms.</p></section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
