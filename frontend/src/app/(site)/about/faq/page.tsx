import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/seo";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { AboutAnimations } from "@/components/animations/AboutAnimations";

export const metadata: Metadata = {
  title: "FAQ | Vishnu Mandir, Tampa - Frequently Asked Questions",
  description:
    "Answers to common questions about Vishnu Mandir, Tampa — temple hours, puja services, festivals, donations, and more.",
  openGraph: {
    title: "FAQ | Vishnu Mandir, Tampa",
    description: "Frequently asked questions about our temple and services.",
    type: "website",
  },
};

const faqCategories = [
  {
    category: "Visiting the Temple",
    items: [
      { question: "What are the temple hours?", answer: "Regular hours: Monday–Friday 6:00 AM–12:00 PM and 6:00 PM–8:30 PM. Saturday–Sunday 6:00 AM–1:00 PM and 5:00 PM–8:30 PM. Hours are extended during festivals. Please call (813) 269-7262 to confirm." },
      { question: "Where is Vishnu Mandir located?", answer: "We are located at 5803 Lynn Road, Tampa, FL 33624, in the Carrollwood area near Gunn Highway. Free parking is available in the temple lot." },
      { question: "Is there a dress code?", answer: "We request modest, respectful attire. Traditional Indian clothing is welcome. Please remove shoes before entering the main shrine area." },
      { question: "Are non-Hindus welcome?", answer: "Absolutely. Vishnu Mandir welcomes all who come with respect and an open heart. We regularly host interfaith visitors and are happy to explain our traditions." },
    ],
  },
  {
    category: "Puja Services",
    items: [
      { question: "How can I sponsor a puja?", answer: "Fill out our Puja Sponsorship form under the Forms menu, or call (813) 269-7262. We offer various services both at the temple and off-site." },
      { question: "Can pujas be performed at my home?", answer: "Yes. Our priests perform off-site pujas for home ceremonies, naming ceremonies, thread ceremonies, weddings, and other events." },
      { question: "What ceremonies do you perform?", answer: "We perform Aarti, Havans, Bhoomi Pujan, Yagyopaveet (Thread Ceremony), Namakaran (Naming Ceremony), Vivah (Marriage), and many other Hindu rites and ceremonies." },
    ],
  },
  {
    category: "Donations & Membership",
    items: [
      { question: "How can I donate to the temple?", answer: "You can donate online via our Donate button (powered by Zeffy), set up a recurring monthly donation, or contribute to our Building Fund. All donations are tax-deductible." },
      { question: "How do I become a member?", answer: "Click the 'Become a Member' button in the navigation or Support menu. Membership helps fund temple operations." },
      { question: "Are donations tax-deductible?", answer: "Yes. Vishnu Mandir, Tampa is a registered 501(c)(3) non-profit organization. All donations are fully tax-deductible. Request a donation statement via our Forms section." },
    ],
  },
  {
    category: "Education & Events",
    items: [
      { question: "What educational programs do you offer?", answer: "We offer Sunday Pathshala, Sanskrit classes, scripture study, music, and cultural arts programs. Visit the Education section for current schedules." },
      { question: "How can I find out about upcoming festivals?", answer: "Check our Calendar section or subscribe to our newsletter for regular updates delivered to your inbox." },
      { question: "Can I rent the temple hall for my event?", answer: "Yes. Submit a Facility Request form under the Forms menu and our team will follow up with availability and details." },
    ],
  },
];

export default function FAQPage() {
  const structuredData = generateWebPageSchema({
    name: "FAQ",
    description: "Frequently asked questions about Vishnu Mandir, Tampa",
    url: "/about/faq",
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <AboutAnimations />

      {/* ── PAGE HERO ─────────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-temple-red">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="faq-pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#faq-pat)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span data-gsap="page-hero-tag" className="inline-block text-temple-gold font-serif italic text-lg mb-4 opacity-0">Questions & Answers</span>
          <h1 data-gsap="page-hero-title" className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0">Frequently Asked Questions</h1>
          <p data-gsap="page-hero-sub" className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0">
            Everything you need to know about visiting, puja services, donations, and our community programs.
          </p>
        </div>
      </section>

      {/* ── FAQ ACCORDION ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion categories={faqCategories} />
        </div>
      </section>

      {/* ── STILL HAVE QUESTIONS ──────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div data-gsap="facility-cta" className="max-w-2xl mx-auto px-4 text-center opacity-0">
          <h2 className="font-display text-3xl text-temple-red mb-4">Still Have Questions?</h2>
          <p className="text-stone-600 leading-relaxed mb-8">
            We&apos;re happy to help. Reach out and someone from our team will respond shortly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+18132697262" className="bg-temple-red text-white px-8 py-3 rounded-full font-semibold hover:bg-red-900 transition-all shadow-md">
              Call (813) 269-7262
            </a>
            <a href="mailto:info@vishnumandirtampa.com" className="border-2 border-temple-red text-temple-red px-8 py-3 rounded-full font-semibold hover:bg-temple-red hover:text-white transition-all">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
