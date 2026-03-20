"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ReligiousAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── PRE-SET ALL INITIAL STATES ────────────────────────────────────
      gsap.set("[data-gsap='page-hero-tag']",    { y: -12, opacity: 0 });
      gsap.set("[data-gsap='page-hero-title']",   { y: 24, opacity: 0 });
      gsap.set("[data-gsap='page-hero-sub']",     { y: 16, opacity: 0 });
      gsap.set("[data-gsap='gold-line']",         { width: 0, opacity: 0 });
      gsap.set("[data-gsap='section-heading']",   { y: 22, opacity: 0 });
      gsap.set("[data-gsap='deity-card']",        { y: 36, scale: 0.96, opacity: 0 });
      gsap.set("[data-gsap='festival-card']",     { y: 30, opacity: 0 });
      gsap.set("[data-gsap='schedule-row']",      { x: -18, opacity: 0 });
      gsap.set("[data-gsap='service-card']",      { y: 22, opacity: 0 });
      gsap.set("[data-gsap='priest-card']",       { scale: 0.92, opacity: 0 });
      gsap.set("[data-gsap='cta-block']",         { scale: 0.97, y: 16, opacity: 0 });

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

      // ── DEITY CARDS ──────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='deity-card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.08, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      // ── FESTIVAL CARDS ────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='festival-card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.45, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── SCHEDULE ROWS ────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='schedule-row']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, x: 0, duration: 0.4, delay: i * 0.06, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── SERVICE / RESOURCE CARDS ──────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='service-card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.4, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── PRIEST CARDS ─────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='priest-card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, scale: 1, duration: 0.5, delay: i * 0.1, ease: "back.out(1.2)",
          scrollTrigger: { trigger: el, start: "top 90%" },
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
