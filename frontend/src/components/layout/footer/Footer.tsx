import Link from "next/link";
import Image from "next/image";

/**
 * Footer component with new 4-column design using temple color theme.
 * Preserves all existing navigation links and legal pages.
 * @returns {JSX.Element} The rendered footer element
 */
export function Footer() {
  return (
    <footer className="bg-temple-red text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Branding */}
          <div className="space-y-5">
            <div className="relative h-14 w-40">
              <Image
                src="/images/vishnumandir logo.svg"
                alt="Vishnu Mandir, Tampa"
                fill
                sizes="160px"
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="text-stone-300 text-sm leading-relaxed">
              Preserving our rich traditions and fostering unity through worship,
              education, and cultural programs in Tampa Bay since 2003.
            </p>
            <div className="text-stone-300 text-sm space-y-1">
              <p>5803 Lynn Road, Tampa, FL 33624</p>
              <p className="font-semibold text-white">(813) 269-7262</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-5 text-temple-gold uppercase tracking-wider text-sm">
              Quick Links
            </h3>
            <ul className="space-y-3 text-stone-300 text-sm">
              <li>
                <Link
                  href="/religious/puja-schedule"
                  className="hover:text-white transition-colors"
                >
                  Puja Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="/religious/puja-services"
                  className="hover:text-white transition-colors"
                >
                  Puja Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="hover:text-white transition-colors"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/forms/puja-sponsorships"
                  className="hover:text-white transition-colors"
                >
                  Sponsor a Puja
                </Link>
              </li>
              <li>
                <Link
                  href="/forms/request-facility"
                  className="hover:text-white transition-colors"
                >
                  Facility Rental
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold mb-5 text-temple-gold uppercase tracking-wider text-sm">
              Connect
            </h3>
            <ul className="space-y-3 text-stone-300 text-sm">
              <li>
                <Link
                  href="/about/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/about/volunteer"
                  className="hover:text-white transition-colors"
                >
                  Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar/newsletter"
                  className="hover:text-white transition-colors"
                >
                  Newsletter Archive
                </Link>
              </li>
              <li>
                <Link
                  href="/recurring-donation"
                  className="hover:text-white transition-colors"
                >
                  Recurring Donation
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-5 text-temple-gold uppercase tracking-wider text-sm">
              Legal
            </h3>
            <ul className="space-y-3 text-stone-300 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-stone-400 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Vishnu Mandir, Tampa. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
