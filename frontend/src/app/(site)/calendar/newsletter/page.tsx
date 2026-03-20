import type { Metadata } from "next";
import { Mail, FileText, Download, ArrowRight } from "lucide-react";
import { generateWebPageSchema } from "@/lib/seo";
import { fetchNewsletters } from "@/lib/strapi";
import { PageHero } from "@/components/shared/PageHero";
import { GeneralAnimations } from "@/components/animations/GeneralAnimations";
import { EmailSubscriptionForm } from "@/components/forms/EmailSubscriptionForm";

export const metadata: Metadata = {
  title: "Newsletter | Vishnu Mandir, Tampa - Archive & Subscription",
  description:
    "Subscribe to the Vishnu Mandir, Tampa newsletter and browse our archive of past issues. Stay connected with temple news and events.",
  openGraph: {
    title: "Newsletter | Vishnu Mandir, Tampa",
    description: "Subscribe and browse our newsletter archive.",
    type: "website",
  },
};

export const revalidate = 3600;

export default async function NewsletterPage() {
  const structuredData = generateWebPageSchema({
    name: "Newsletter",
    description: "Newsletter archive and subscription for Vishnu Mandir, Tampa",
    url: "/calendar/newsletter",
  });

  const newsletters = await fetchNewsletters();
  const validNewsletters = newsletters.filter((n) => n?.attributes);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <GeneralAnimations />

      <PageHero
        tagline="Stay Informed"
        title="Newsletter"
        subtitle="Subscribe to receive temple updates, event announcements, and community news directly in your inbox."
        patternId="newsletter-pat"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Subscribe form — sticky sidebar */}
          <div className="lg:col-span-2">
            <div data-gsap="fade-left" className="sticky top-28 opacity-0">
              <div className="bg-temple-red rounded-3xl p-8 text-white shadow-xl">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                  <Mail size={24} />
                </div>
                <h2 className="font-display text-2xl font-bold mb-3">Subscribe</h2>
                <p className="text-stone-200 text-sm mb-7 leading-relaxed">
                  Get temple updates, event announcements, and community news delivered to your inbox.
                </p>
                <div className="bg-white rounded-2xl p-5">
                  <EmailSubscriptionForm />
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter archive */}
          <div className="lg:col-span-3">
            <div data-gsap="section-heading" className="mb-10 opacity-0">
              <div className="flex items-center gap-4 mb-2">
                <div data-gsap="gold-line" data-width="48px" className="h-px bg-temple-gold opacity-0" style={{ width: 0 }} />
                <h2 className="font-display text-3xl text-temple-red uppercase tracking-widest">Archive</h2>
              </div>
              <p className="text-stone-500 italic mt-2">Browse past issues of our community newsletter</p>
            </div>

            {validNewsletters.length > 0 ? (
              <div className="space-y-4">
                {validNewsletters.map((newsletter, i) => {
                  const { title, publicationDate, file } = newsletter.attributes;
                  const fileUrl = file?.data?.attributes?.url;
                  const date = publicationDate ? new Date(publicationDate).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";
                  return (
                    <div key={newsletter.id} data-gsap="card" className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center gap-5 group opacity-0">
                      <div className="w-12 h-12 bg-temple-red/10 rounded-xl flex items-center justify-center text-temple-red flex-shrink-0 group-hover:bg-temple-red group-hover:text-white transition-all">
                        <FileText size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-stone-800 group-hover:text-temple-red transition-colors truncate">{title}</h3>
                        {date && <p className="text-stone-400 text-sm mt-0.5">{date}</p>}
                      </div>
                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-stone-100 hover:bg-temple-red hover:text-white text-stone-600 px-4 py-2 rounded-full text-sm font-semibold transition-all flex-shrink-0"
                        >
                          <Download size={14} /> Download
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div data-gsap="fade-up" className="text-center py-12 bg-stone-50 rounded-3xl border border-stone-100 opacity-0">
                <FileText size={40} className="text-stone-300 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-bold text-stone-600 mb-2">Archive Coming Soon</h3>
                <p className="text-stone-400 text-sm">Past newsletters will appear here once added to the CMS.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
