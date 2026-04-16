import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";

export const metadata: Metadata = {
  title: "Privacy Policy | Vishnu Mandir, Tampa",
  description: "Privacy policy for Vishnu Mandir, Tampa. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  const structuredData = generateWebPageSchema({
    name: "Privacy Policy",
    description: "Privacy policy for Vishnu Mandir, Tampa",
    url: "/privacy-policy",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Legal Information"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
        patternId="privacy-pat"
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

              <section>
                <h2>1. Introduction</h2>
                <p>Vishnu Mandir, Tampa (referred to as &quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;the Temple&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
              </section>

              <section>
                <h2>2. Information We Collect</h2>
                <h3>2.1 Information You Provide</h3>
                <ul>
                  <li><strong>Contact Information:</strong> Name, email address, phone number, and mailing address</li>
                  <li><strong>Donation & Payment Information:</strong> Donation amounts, frequency, payment method details (processed securely through Stripe)</li>
                  <li><strong>Sponsorship & Form Data:</strong> Information provided through puja sponsorship forms, facility requests, and other temple forms</li>
                  <li><strong>Volunteer Information:</strong> Details submitted through volunteer registration forms</li>
                  <li><strong>Communications:</strong> Feedback, comments, and messages you send us</li>
                </ul>
                <h3>2.2 Information Automatically Collected</h3>
                <ul>
                  <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and referral sources</li>
                  <li><strong>Cookies & Tracking:</strong> We use cookies and similar technologies to enhance your browsing experience and analyze site performance</li>
                </ul>
              </section>

              <section>
                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect for the following purposes:</p>
                <ul>
                  <li>Processing donations and payments</li>
                  <li>Fulfilling sponsorship requests and temple services</li>
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Sending newsletters, updates, and important temple announcements</li>
                  <li>Improving our website, services, and user experience</li>
                  <li>Complying with legal obligations and tax requirements</li>
                  <li>Preventing fraud and enhancing security</li>
                  <li>Conducting surveys and gathering feedback</li>
                </ul>
              </section>

              <section>
                <h2>4. Data Security</h2>
                <p>We implement comprehensive security measures to protect your personal information:</p>
                <ul>
                  <li>All data transmission is encrypted using HTTPS (TLS 1.2 or higher)</li>
                  <li>Payment processing is handled by Stripe, a PCI DSS Level 1 certified service</li>
                  <li>We do not store credit card information on our servers</li>
                  <li>Access to personal data is restricted to authorized personnel only</li>
                  <li>Regular security audits and updates are performed</li>
                </ul>
              </section>

              <section>
                <h2>5. Third-Party Services</h2>
                <p>We use third-party services to deliver our website and services. These services include:</p>
                <ul>
                  <li><strong>Stripe:</strong> For secure payment processing</li>
                  <li><strong>Zeffy:</strong> For donation forms and ticketing</li>
                  <li><strong>AWS Services:</strong> For hosting, email services, and data storage</li>
                  <li><strong>Strapi CMS:</strong> For content management</li>
                  <li><strong>Google Fonts & Analytics:</strong> For website performance and analytics</li>
                </ul>
              </section>

              <section>
                <h2>6. Cookies</h2>
                <p>We use cookies and similar tracking technologies to improve your user experience:</p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Marketing Cookies:</strong> Track conversion and engagement metrics</li>
                </ul>
              </section>

              <section>
                <h2>7. User Rights</h2>
                <p>Depending on your location, you may have the following rights:</p>
                <ul>
                  <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Right to Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Right to Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Right to Opt-Out:</strong> Unsubscribe from marketing communications and newsletters</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                </ul>
                <p>To exercise any of these rights, please contact us at info@vishnumandirtampa.com.</p>
              </section>

              <section>
                <h2>8. Email Communications</h2>
                <p>When you provide your email address, you may receive communications from Vishnu Mandir, including donation confirmations, temple news, event notifications, and newsletter updates. Each email includes an unsubscribe link.</p>
              </section>

              <section>
                <h2>9. Retention of Information</h2>
                <p>We retain your personal information for as long as necessary to provide our services. Donation records are retained for tax purposes (typically 7 years). Newsletter subscribers are retained until you unsubscribe or request deletion.</p>
              </section>

              <section>
                <h2>10. Children&apos;s Privacy</h2>
                <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. Parents or guardians who believe a child has provided information should contact us immediately.</p>
              </section>

              <section>
                <h2>11. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by updating the &ldquo;Last Updated&rdquo; date at the top of this page.</p>
              </section>

              <section>
                <h2>12. Contact Information</h2>
                <p>If you have questions regarding this Privacy Policy, please contact us:</p>
                <div className="bg-temple-red/5 border border-temple-red/10 rounded-2xl p-6 mt-4 not-prose">
                  <p className="font-bold text-stone-800 mb-2">Vishnu Mandir, Tampa</p>
                  <p className="text-stone-600 text-sm">Email: info@vishnumandirtampa.com</p>
                  <p className="text-stone-600 text-sm">Phone: (813) 269-7262</p>
                  <p className="text-stone-600 text-sm mt-2">We will respond to your inquiry within 30 days or as required by applicable law.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
