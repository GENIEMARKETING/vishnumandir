"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { AudioToggle } from "@/components/audio/AudioToggle";
import { handleZeffyClick } from "@/lib/zeffy";

/**
 * Header component for the public site, displaying logo, tagline, and navigation.
 * Features dropdown menus aligned with SSVT reference website structure.
 * @returns {JSX.Element} The rendered header element
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Zeffy buttons when script loads
  useEffect(() => {
    const initializeZeffy = () => {
      if (typeof window !== 'undefined' && (window as any).Zeffy) {
        (window as any).Zeffy.bind?.();
      }
    };

    // Try to initialize immediately in case script is already loaded
    initializeZeffy();

    // Also listen for the script load event
    window.addEventListener('zeffy-script-loaded', initializeZeffy);
    
    // Fallback: check after a delay in case event doesn't fire
    const timer = setTimeout(initializeZeffy, 1000);

    return () => {
      window.removeEventListener('zeffy-script-loaded', initializeZeffy);
      clearTimeout(timer);
    };
  }, []);

  const menuItems = {
    about: [
      { href: "/about/board-of-trustees", label: "Board of Trustees" },
      { href: "/about/contact", label: "Contact" },
      { href: "/about/location", label: "Location" },
      { href: "/about/volunteer", label: "Volunteer" },
      { href: "/about/virtual-visit", label: "Virtual Visit" },
      { href: "/about/feedback", label: "Feedback" },
      { href: "/about/faq", label: "FAQ" },
      { href: "/about/about", label: "About" },
    ],
    religious: [
      { href: "/deities", label: "Deities" },
      { href: "/religious/puja-schedule", label: "Puja Schedule" },
      { href: "/religious/puja-services", label: "Puja Services" },
      { href: "/religious/prayer-books", label: "Prayer Books" },
      { href: "/religious/festivals", label: "Festivals" },
      { href: "/religious/priests", label: "Priests" },
    ],
    cultural: [{ href: "/cultural/media", label: "Media" }],
    education: [
      { href: "/education/classes", label: "Classes" },
      { href: "/education/events", label: "Events" },
      { href: "/education/resources", label: "Resources" },
    ],
    calendar: [
      { href: "/calendar/current-events", label: "Current Events" },
      { href: "/calendar/announcements", label: "Announcements" },
      { href: "/calendar/newsletter", label: "Newsletter" },
      { href: "/calendar/annual-calendar", label: "Annual Calendar" },
    ],
    forms: [
      { href: "/forms/puja-sponsorships", label: "Puja Sponsorships" },
      { href: "/forms/request-facility", label: "Request Facility" },
      { href: "/forms/donation-statement", label: "Donation Statement" },
      { href: "/forms/change-of-address", label: "Change of Address" },
      { href: "/forms/email-subscription", label: "Email Subscription" },
      { href: "/forms/all-other-forms", label: "All Other Forms" },
    ],
    support: [
      { href: "/recurring-donation", label: "Recurring Donation" },
      { href: "/online-puja", label: "Online Puja", isButton: true, zeffyLink: "https://www.zeffy.com/embed/donation-form/online-puja?modal=true" },
      { href: "/membership", label: "Become a Member", isButton: true, zeffyLink: "https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true" },
    ],
  };

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="relative h-20 md:h-24 w-56 md:w-64 shrink-0">
            <Link href="/" className="block relative h-full w-full">
              <Image
                src="/images/vishnumandir logo.svg"
                alt="Vishnu Mandir, Tampa - Hindu Temple & Community Center"
                fill
                priority
                sizes="(max-width: 768px) 224px, 256px"
                className="object-contain object-left"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 flex-wrap justify-end">
            <DropdownMenu
              label="About"
              items={menuItems.about}
              href="/about"
            />
            <DropdownMenu
              label="Religious"
              items={menuItems.religious}
              href="/religious"
            />
            <DropdownMenu
              label="Cultural"
              items={menuItems.cultural}
              href="/cultural"
            />
            <DropdownMenu
              label="Education"
              items={menuItems.education}
              href="/education"
            />
            <DropdownMenu
              label="Calendar"
              items={menuItems.calendar}
              href="/calendar"
            />
            <DropdownMenu
              label="Forms"
              items={menuItems.forms}
              href="/forms"
            />
            <Link
              href="/shop"
              className="text-text-primary hover:text-primary font-medium transition-colors px-3 py-2 rounded-lg hover:bg-primary/5"
            >
              Shop
            </Link>
            <DropdownMenu
              label="Support"
              items={menuItems.support}
              href="/support"
            />
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
              <AudioToggle />
              <button
                type="button"
                data-zeffy-form-link="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                onClick={handleZeffyClick}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Donate
              </button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="md:hidden text-text-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-4">
              <div>
                <Link
                  href="/about"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.about.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/religious"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Religious
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.religious.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/cultural"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cultural
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.cultural.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/education"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Education
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.education.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/calendar"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.calendar.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/forms"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forms
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.forms.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-text-secondary hover:text-primary text-sm transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <Link
                  href="/shop"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
              </div>
              <div>
                <Link
                  href="/support"
                  className="text-text-primary hover:text-primary font-medium transition-colors block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <div className="pl-4 flex flex-col gap-2">
                  {menuItems.support.map((item) => (
                    item.isButton ? (
                      <button
                        key={item.href}
                        type="button"
                        data-zeffy-form-link={item.zeffyLink}
                        onClick={(e) => {
                          handleZeffyClick(e as React.MouseEvent<HTMLButtonElement>);
                          setMobileMenuOpen(false);
                        }}
                        className="text-text-secondary hover:text-primary text-sm transition-colors text-left"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-text-secondary hover:text-primary text-sm transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <AudioToggle />
                <button
                  type="button"
                  data-zeffy-form-link="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                  onClick={(e) => {
                    handleZeffyClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center"
                >
                  Donate
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
