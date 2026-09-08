import Image from 'next/image';
import { getHeroShowcase, getPageImages, getSiteSettings } from '@/lib/content';
import { ButtonLink } from '@/components/ui/Button';
import TrustBadges from '@/components/TrustBadges';

export default async function HeroSection() {
  const [site, images, heroShowcase] = await Promise.all([
    getSiteSettings(),
    getPageImages(),
    getHeroShowcase(),
  ]);

  return (
    <section className="relative isolate overflow-hidden bg-burgundy-800">
      <Image
        src={images.hero.src}
        alt={images.hero.alt}
        fill
        priority
        sizes="100vw"
        className="animate-slow-zoom object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-burgundy-900/95 via-burgundy-900/85 to-burgundy-900/60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-burgundy-900/20"
      />

      <div className="container relative py-20 sm:py-24 lg:py-32">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-16">
          <div className="max-w-2xl animate-fade-up">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-burgundy-900/50 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-light backdrop-blur-sm">
              Locally Owned &middot; Family Operated
            </p>

            <h1 className="mt-6 text-[2.1rem] font-semibold leading-[1.1] text-white sm:text-[2.75rem] lg:text-[3.35rem]">
              {site.tagline}
            </h1>

            <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-cream/90 sm:text-[1.1rem]">
              {site.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact#quote" size="lg" className="w-full sm:w-auto">
                Request a Free Quote
              </ButtonLink>
              <ButtonLink href="/services" variant="ghost" size="lg" className="w-full sm:w-auto">
                Explore Our Services
              </ButtonLink>
            </div>

            <TrustBadges className="mt-9 border-t border-white/15 pt-6" />
          </div>

          {/* Work collage — one photo per service pillar. Large screens only, so
              the mobile hero keeps its original single-column proportions. */}
          <ul
            className="hidden animate-fade-up grid-cols-2 gap-4 lg:grid"
            aria-label="Recent Phoenix Landscaping work"
          >
            {heroShowcase.map((item, index) => (
              <li
                key={item.src}
                className={`group relative isolate overflow-hidden rounded-card border border-gold/25 shadow-lift ${
                  index % 2 === 1 ? 'lg:translate-y-8' : ''
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1280px) 20vw, 24vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-burgundy-900/90 via-burgundy-900/15 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-gold-light">
                    {item.label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
