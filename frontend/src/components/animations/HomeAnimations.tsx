"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * HomeAnimations — GSAP animation layer for the home page.
 *
 * FIX: All animated elements are pre-set to their "from" state via gsap.set()
 * immediately on mount. This prevents the "jerk" caused by ScrollTrigger
 * snapping elements to their start position right before animating.
 */
export function HomeAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── PRE-SET ALL INITIAL STATES (eliminates the jerk) ─────────────
      // Hero — these have opacity:0 in HTML already, just set transforms
      gsap.set("[data-gsap='hero-tagline']",        { x: -30 });
      gsap.set("[data-gsap='hero-title']",           { x: -40 });
      gsap.set("[data-gsap='hero-desc']",            { y: 16 });
      gsap.set("[data-gsap='hero-buttons'] > *",     { y: 18, opacity: 0 });

      // Scroll sections — set transform + opacity together
      gsap.set("[data-gsap='gold-line']",            { width: 0, opacity: 0 });
      gsap.set("[data-gsap='section-heading']",      { y: 24, opacity: 0 });
      gsap.set("[data-gsap='vision-image']",         { scale: 0.92, x: -28, opacity: 0 });
      gsap.set("[data-gsap='vision-text']",          { x: 28, opacity: 0 });
      gsap.set("[data-gsap='vision-feature']",       { y: 16, opacity: 0 });
      gsap.set("[data-gsap='facility-heading']",     { y: 24, opacity: 0 });
      gsap.set("[data-gsap='facility-left']",        { x: -24, opacity: 0 });
      gsap.set("[data-gsap='facility-feature']",     { y: 18, opacity: 0 });
      gsap.set("[data-gsap='facility-cta']",         { scale: 0.97, y: 16, opacity: 0 });
      gsap.set("[data-gsap='announce-card']",        { y: 28, opacity: 0 });
      gsap.set("[data-gsap='event-card']",           { y: 28, opacity: 0 });
      gsap.set("[data-gsap='quick-card']",           { y: 28, opacity: 0 });
      gsap.set("[data-gsap='about-para']",           { y: 20, opacity: 0 });
      gsap.set("[data-gsap='about-address']",        { scale: 0.97, opacity: 0 });

      // ── HERO (runs on load, no ScrollTrigger) ─────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.1 });
      heroTl
        .to("[data-gsap='hero-tagline']",        { opacity: 1, x: 0, duration: 0.5 })
        .to("[data-gsap='hero-title']",           { opacity: 1, x: 0, duration: 0.55 }, "-=0.25")
        .to("[data-gsap='hero-desc']",            { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .to("[data-gsap='hero-buttons'] > *",     { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, "-=0.2");

      // ── GOLD LINES ───────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='gold-line']").forEach((el) => {
        gsap.to(el, {
          width: el.dataset.width ?? "48px", opacity: 1,
          duration: 0.6, ease: "power2.out",
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

      // ── VISION ───────────────────────────────────────────────────────
      gsap.to("[data-gsap='vision-image']", {
        opacity: 1, scale: 1, x: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='vision-image']", start: "top 85%" },
      });
      gsap.to("[data-gsap='vision-text']", {
        opacity: 1, x: 0, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='vision-text']", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='vision-feature']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.4, delay: i * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── FACILITY ─────────────────────────────────────────────────────
      gsap.to("[data-gsap='facility-heading']", {
        opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='facility-heading']", start: "top 88%" },
      });
      gsap.to("[data-gsap='facility-left']", {
        opacity: 1, x: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='facility-left']", start: "top 88%" },
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='facility-feature']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.4, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.to("[data-gsap='facility-cta']", {
        opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.3)",
        scrollTrigger: { trigger: "[data-gsap='facility-cta']", start: "top 90%" },
      });

      // ── CARDS (announce / event / quick) ─────────────────────────────
      ["[data-gsap='announce-card']", "[data-gsap='event-card']", "[data-gsap='quick-card']"].forEach((sel) => {
        gsap.utils.toArray<HTMLElement>(sel).forEach((el, i) => {
          gsap.to(el, {
            opacity: 1, y: 0, duration: 0.45, delay: i * 0.08, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });
      });

      // ── ABOUT ────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='about-para']").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });
      gsap.to("[data-gsap='about-address']", {
        opacity: 1, scale: 1, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='about-address']", start: "top 92%" },
      });

    });

    return () => ctx.revert();
  }, []);

  return null;
}
