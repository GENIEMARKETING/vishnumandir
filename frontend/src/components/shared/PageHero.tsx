/**
 * Shared PageHero component used across all section pages.
 * Provides consistent temple-red hero with diamond pattern, GSAP targets,
 * tagline, title, and subtitle.
 */
interface PageHeroProps {
  tagline: string;
  title: string;
  subtitle: string;
  patternId?: string;
}

export function PageHero({ tagline, title, subtitle, patternId = "hero-pat" }: PageHeroProps) {
  return (
    <section className="relative py-28 overflow-hidden bg-temple-red">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <span
          data-gsap="page-hero-tag"
          className="inline-block text-temple-gold font-serif italic text-lg mb-4 opacity-0"
        >
          {tagline}
        </span>
        <h1
          data-gsap="page-hero-title"
          className="font-display text-5xl md:text-6xl font-bold mb-6 opacity-0"
        >
          {title}
        </h1>
        <p
          data-gsap="page-hero-sub"
          className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed opacity-0"
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
