import Image from 'next/image';
import { images } from '@/lib/images';
import { site } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import TrustBadges from '@/components/TrustBadges';

export default function HeroSection() {
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
        className="absolute inset-0 bg-gradient-to-r from-burgundy-900/95 via-burgundy-900/80 to-burgundy-900/40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-burgundy-900/20"
      />

      <div className="container relative py-20 sm:py-24 lg:py-32">
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
      </div>
    </section>
  );
}
