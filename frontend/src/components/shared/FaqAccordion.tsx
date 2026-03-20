"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

interface FaqItem { question: string; answer: string; }
interface FaqCategory { category: string; items: FaqItem[]; }

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  const toggle = () => {
    const body = bodyRef.current;
    if (!body) return;

    if (!open) {
      gsap.set(body, { display: "block" });
      gsap.fromTo(body,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.to(arrowRef.current, { rotation: 180, duration: 0.35, ease: "power2.inOut" });
    } else {
      gsap.to(body, {
        height: 0, opacity: 0, duration: 0.3, ease: "power3.in",
        onComplete: () => { gsap.set(body, { display: "none" }); },
      });
      gsap.to(arrowRef.current, { rotation: 0, duration: 0.35, ease: "power2.inOut" });
    }
    setOpen(!open);
  };

  return (
    <div
      data-gsap="commit-card"
      className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm opacity-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-stone-50 transition-colors group"
        aria-expanded={open}
      >
        <span className="font-serif text-stone-800 font-semibold text-base pr-4 group-hover:text-temple-red transition-colors">
          {item.question}
        </span>
        <ChevronDown
          ref={arrowRef}
          size={20}
          className="text-temple-gold flex-shrink-0"
        />
      </button>
      <div ref={bodyRef} style={{ display: "none", overflow: "hidden" }}>
        <div className="px-6 pb-6 pt-0 bg-white border-t border-stone-100">
          <p className="text-stone-600 leading-relaxed pt-4">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap='commit-card']").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, delay: i * 0.06, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" } }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-10">
      {categories.map((cat, ci) => (
        <div key={ci}>
          {/* Category heading */}
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px flex-1 bg-temple-gold/30" />
            <h3 className="font-display text-lg text-temple-red uppercase tracking-widest whitespace-nowrap">
              {cat.category}
            </h3>
            <div className="h-px flex-1 bg-temple-gold/30" />
          </div>
          <div className="space-y-3">
            {cat.items.map((item, ii) => (
              <AccordionItem key={ii} item={item} index={ci * 10 + ii} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
