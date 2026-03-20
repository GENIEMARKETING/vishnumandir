"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GeneralAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── PRE-SET ALL INITIAL STATES (eliminates jerk) ─────────────────
      gsap.set("[data-gsap='page-hero-tag']",   { y: -12, opacity: 0 });
      gsap.set("[data-gsap='page-hero-title']",  { y: 24, opacity: 0 });
      gsap.set("[data-gsap='page-hero-sub']",    { y: 16, opacity: 0 });
      gsap.set("[data-gsap='gold-line']",        { width: 0, opacity: 0 });
      gsap.set("[data-gsap='section-heading']",  { y: 22, opacity: 0 });
      gsap.set("[data-gsap='card']",             { y: 28, opacity: 0 });
      gsap.set("[data-gsap='fade-up']",          { y: 22, opacity: 0 });
      gsap.set("[data-gsap='fade-left']",        { x: -28, opacity: 0 });
      gsap.set("[data-gsap='fade-right']",       { x: 28, opacity: 0 });
      gsap.set("[data-gsap='cta-block']",        { scale: 0.97, y: 16, opacity: 0 });

      // ── PAGE HERO ────────────────────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.1 });
      tl.to("[data-gsap='page-hero-tag']",   { opacity: 1, y: 0, duration: 0.45 })
        .to("[data-gsap='page-hero-title']",  { opacity: 1, y: 0, duration: 0.5 },  "-=0.2")
        .to("[data-gsap='page-hero-sub']",    { opacity: 1, y: 0, duration: 0.4 },  "-=0.25");

      // ── GOLD LINES ───────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='gold-line']").forEach((el) => {
        gsap.to(el, {
          width: el.dataset.width ?? "48px", opacity: 1,
          duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── SECTION HEADINGS ─────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='section-heading']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── CARDS ────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.45, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── FADE VARIANTS ────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='fade-up']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='fade-left']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='fade-right']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.55, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // ── CTA BLOCKS ───────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='cta-block']").forEach((el) => {
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
