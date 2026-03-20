"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X } from "lucide-react";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { AudioToggle } from "@/components/audio/AudioToggle";
import { CartIcon } from "@/components/shared/CartIcon";
import { handleZeffyClick } from "@/lib/zeffy";

/**
 * Header component with new sticky navbar design.
 * Preserves all existing functionality: dropdown menus, cart, audio toggle,
 * Zeffy donate integration, and full mobile navigation.
 * @returns {JSX.Element} The rendered header element
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Zeffy buttons when script loads
  useEffect(() => {
    const initializeZeffy = () => {
      if (typeof window !== "undefined" && (window as any).Zeffy) {
        (window as any).Zeffy.bind?.();
      }
    };

    initializeZeffy();
    window.addEventListener("zeffy-script-loaded", initializeZeffy);
    const timer = setTimeout(initializeZeffy, 1000);

    return () => {
      window.removeEventListener("zeffy-script-loaded", initializeZeffy);
      clearTimeout(timer);
    };
  }, []);

  const menuItems = {
    about: [
      { href: "/about/about",     label: "About Us" },
      { href: "/about/contact",   label: "Visit Us" },
      { href: "/about/volunteer", label: "Get Involved" },
      { href: "/about/faq",       label: "FAQ" },
    ],
    religious: [
      { href: "/deities",                   label: "Deities" },
      { href: "/religious/puja-worship",    label: "Puja & Worship" },
      { href: "/religious/festivals",       label: "Festivals" },
      { href: "/religious/prayer-books",    label: "Prayer Books" },
    ],
    cultural: [],
    education: [
      { href: "/education/classes", label: "Learn With Us" },
      { href: "/education/events", label: "Events & Workshops" },
    ],
    calendar: [
      { href: "/calendar/current-events",  label: "What's On" },
      { href: "/calendar/newsletter",      label: "Newsletter" },
      { href: "/calendar/annual-calendar", label: "Annual Calendar" },
    ],
    forms: [
      { href: "/forms/puja-sponsorships",  label: "Puja Sponsorship" },
      { href: "/forms/request-facility",   label: "Request Facility" },
      { href: "/forms/donation-statement", label: "Donation Statement" },
      { href: "/forms/change-of-address",  label: "Change of Address" },
      { href: "/forms/email-subscription", label: "Email Subscription" },
      { href: "/forms/all-other-forms",    label: "Other Requests" },
    ],
    support: [
      {
        href: "/support",
        label: "Make a Donation",
        isButton: true,
        zeffyLink: "https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true",
      },
      {
        href: "/support",
        label: "Sponsor a Puja",
        isButton: true,
        zeffyLink: "https://www.zeffy.com/embed/donation-form/online-puja?modal=true",
      },
      {
        href: "/support",
        label: "Become a Member",
        isButton: true,
        zeffyLink: "https://www.zeffy.com/embed/ticketing/vishnu-mandir-memberships?modal=true",
      },
      { href: "/support", label: "Building Fund" },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative h-14 w-40">
              <Image
                src="/images/vishnumandir logo.svg"
                alt="Vishnu Mandir, Tampa - Hindu Temple & Community Center"
                fill
                priority
                sizes="160px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-wrap justify-end">
            <DropdownMenu
              label="About"
              items={menuItems.about}
              href="/about/about"
            />
            <DropdownMenu
              label="Religious"
              items={menuItems.religious}
              href="/deities"
            />
            <Link
              href="/cultural"
              className="text-stone-600 hover:text-temple-red font-medium transition-colors px-3 py-2 rounded-lg hover:bg-temple-red/5 text-sm"
            >
              Cultural
            </Link>
            <DropdownMenu
              label="Education"
              items={menuItems.education}
              href="/education/classes"
            />
            <DropdownMenu
              label="Calendar"
              items={menuItems.calendar}
              href="/calendar/current-events"
            />
            <DropdownMenu
              label="Forms"
              items={menuItems.forms}
              href="/forms"
            />
            <Link
              href="/shop"
              className="text-stone-600 hover:text-temple-red font-medium transition-colors px-3 py-2 rounded-lg hover:bg-temple-red/5 text-sm"
            >
              Shop
            </Link>
            <DropdownMenu
              label="Support"
              items={menuItems.support}
              href="/support"
            />


            {/* Action Icons */}
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-stone-200">
              <CartIcon />
              <AudioToggle />
              <button
                type="button"
                data-zeffy-form-link="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                onClick={handleZeffyClick}
                className="bg-temple-red text-white px-5 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-red-900 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <Heart size={15} fill="currentColor" />
                Donate
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <CartIcon />
            <AudioToggle />
            <button
              type="button"
              className="text-stone-600 hover:text-temple-red focus:outline-none focus:ring-2 focus:ring-temple-red focus:ring-offset-2 rounded p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <nav className="px-4 pt-2 pb-6 space-y-1">
              {/* About */}
              <div>
                <Link
                  href="/about/about"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.about.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Religious */}
              <div>
                <Link
                  href="/religious"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Religious
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.religious.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Cultural — direct link, no dropdown */}
              <Link
                href="/cultural"
                className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cultural
              </Link>

              {/* Education */}
              <div>
                <Link
                  href="/education"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Education
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.education.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <Link
                  href="/calendar"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.calendar.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Forms */}
              <div>
                <Link
                  href="/forms"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Forms
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.forms.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Shop */}
              <Link
                href="/shop"
                className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {/* Support */}
              <div>
                <Link
                  href="/support"
                  className="block px-3 py-3 text-base font-medium text-stone-700 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <div className="pl-6 flex flex-col gap-1">
                  {menuItems.support.map((item) =>
                    item.isButton ? (
                      <button
                        key={item.href}
                        type="button"
                        data-zeffy-form-link={item.zeffyLink}
                        onClick={(e) => {
                          handleZeffyClick(
                            e as React.MouseEvent<HTMLButtonElement>
                          );
                          setMobileMenuOpen(false);
                        }}
                        className="block text-left px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg w-full"
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-3 py-1.5 text-sm text-stone-500 hover:text-temple-red hover:bg-stone-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Donate Button */}
              <div className="pt-4 px-3">
                <button
                  type="button"
                  data-zeffy-form-link="https://www.zeffy.com/embed/donation-form/monthly-donor-4?modal=true"
                  onClick={(e) => {
                    handleZeffyClick(e);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-temple-red text-white px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-red-900 transition-all"
                >
                  <Heart size={18} fill="currentColor" />
                  Donate
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
