"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GeneralAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const els = (selector: string) =>
        gsap.utils.toArray<HTMLElement>(selector);

      // ── PRE-SET ALL INITIAL STATES (eliminates jerk) ─────────────────
      // Use element arrays (not selector strings) to avoid "GSAP target not found" warnings on pages
      // that don't include every possible data-gsap marker.
      gsap.set(els("[data-gsap='page-hero-tag']"), { y: -12, opacity: 0 });
      gsap.set(els("[data-gsap='page-hero-title']"), { y: 24, opacity: 0 });
      gsap.set(els("[data-gsap='page-hero-sub']"), { y: 16, opacity: 0 });
      gsap.set(els("[data-gsap='gold-line']"), { width: 0, opacity: 0 });
      gsap.set(els("[data-gsap='section-heading']"), { y: 22, opacity: 0 });
      gsap.set(els("[data-gsap='card']"), { y: 28, opacity: 0 });
      gsap.set(els("[data-gsap='fade-up']"), { y: 22, opacity: 0 });
      gsap.set(els("[data-gsap='fade-left']"), { x: -28, opacity: 0 });
      gsap.set(els("[data-gsap='fade-right']"), { x: 28, opacity: 0 });
      gsap.set(els("[data-gsap='cta-block']"), { scale: 0.97, y: 16, opacity: 0 });

      // ── PAGE HERO ────────────────────────────────────────────────────
      const heroTag = els("[data-gsap='page-hero-tag']");
      const heroTitle = els("[data-gsap='page-hero-title']");
      const heroSub = els("[data-gsap='page-hero-sub']");

      if (heroTag.length || heroTitle.length || heroSub.length) {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          delay: 0.1,
        });
        if (heroTag.length) {
          tl.to(heroTag, { opacity: 1, y: 0, duration: 0.45 });
        }
        if (heroTitle.length) {
          tl.to(heroTitle, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
        }
        if (heroSub.length) {
          tl.to(heroSub, { opacity: 1, y: 0, duration: 0.4 }, "-=0.25");
        }
      }

      // ── GOLD LINES ───────────────────────────────────────────────────
      els("[data-gsap='gold-line']").forEach((el) => {
        gsap.to(el, {
          width: el.dataset.width ?? "48px", opacity: 1,
          duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── SECTION HEADINGS ─────────────────────────────────────────────
      els("[data-gsap='section-heading']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── CARDS ────────────────────────────────────────────────────────
      els("[data-gsap='card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.45, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── FADE VARIANTS ────────────────────────────────────────────────
      els("[data-gsap='fade-up']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      els("[data-gsap='fade-left']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      els("[data-gsap='fade-right']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // ── CTA BLOCKS ───────────────────────────────────────────────────
      els("[data-gsap='cta-block']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

    });

    return () => ctx.revert();
  }, []);

  return null;
}
