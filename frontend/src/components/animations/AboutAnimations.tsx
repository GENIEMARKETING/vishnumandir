"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {

      // ── PRE-SET ALL INITIAL STATES ────────────────────────────────────
      gsap.set("[data-gsap='page-hero-tag']",     { y: -12, opacity: 0 });
      gsap.set("[data-gsap='page-hero-title']",    { y: 24, opacity: 0 });
      gsap.set("[data-gsap='page-hero-sub']",      { y: 16, opacity: 0 });
      gsap.set("[data-gsap='gold-line']",          { width: 0, opacity: 0 });
      gsap.set("[data-gsap='section-heading']",    { y: 22, opacity: 0 });
      gsap.set("[data-gsap='about-image']",        { scale: 0.93, x: -24, opacity: 0 });
      gsap.set("[data-gsap='about-text']",         { x: 24, opacity: 0 });
      gsap.set("[data-gsap='commit-card']",        { y: 28, opacity: 0 });
      gsap.set("[data-gsap='board-president']",    { scale: 0.88, opacity: 0 });
      gsap.set("[data-gsap='board-executive']",    { y: 20, opacity: 0 });
      gsap.set("[data-gsap='board-director']",     { y: 16, opacity: 0 });
      gsap.set("[data-gsap='tree-line']",          { scaleY: 0, transformOrigin: "top center" });
      gsap.set("[data-gsap='tree-hline']",         { scaleX: 0, transformOrigin: "center center" });
      gsap.set("[data-gsap='facility-cta']",       { scale: 0.97, y: 16, opacity: 0 });

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

      // ── ABOUT IMAGE + TEXT ────────────────────────────────────────────
      gsap.to("[data-gsap='about-image']", {
        opacity: 1, scale: 1, x: 0, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='about-image']", start: "top 85%" },
      });
      gsap.to("[data-gsap='about-text']", {
        opacity: 1, x: 0, duration: 0.65, ease: "power2.out",
        scrollTrigger: { trigger: "[data-gsap='about-text']", start: "top 85%" },
      });

      // ── COMMITMENT CARDS ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='commit-card']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.45, delay: i * 0.07, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── BOARD TREE ───────────────────────────────────────────────────
      gsap.to("[data-gsap='board-president']", {
        opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.3)",
        scrollTrigger: { trigger: "[data-gsap='board-president']", start: "top 88%" },
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='tree-line']").forEach((el) => {
        gsap.to(el, {
          scaleY: 1, duration: 0.4, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='tree-hline']").forEach((el) => {
        gsap.to(el, {
          scaleX: 1, duration: 0.4, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='board-executive']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.45, delay: i * 0.1, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-gsap='board-director']").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.35, delay: i * 0.05, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      // ── CTA ──────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-gsap='facility-cta']").forEach((el) => {
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
