import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { images } from '@/lib/images';
import { site } from '@/lib/site';
import Reveal from '@/components/Reveal';

const points = [
  'Honest service and straight answers',
  'Quality workmanship on every visit',
  'Reliable communication you do not have to chase',
  'Long-term relationships, not one-off jobs',
  'Residential and commercial property care',
];

export default function AboutPreview() {
  return (
    <section className="section bg-warmwhite">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-lift">
            <Image
              src={images.aboutPortrait.src}
              alt={images.aboutPortrait.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-2 hidden rounded-card border border-gold/40 bg-burgundy px-7 py-5 text-cream shadow-lift sm:block lg:-right-6">
            <p className="font-serif text-3xl font-semibold text-white">{site.yearsExperience}</p>
            <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-light">
              Years of Experience
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-burgundy">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            About Phoenix Landscaping
          </p>
          <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] sm:text-[2.1rem] lg:text-[2.4rem]">
            Local Experience. Reliable Service.
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
            Phoenix Landscaping is a locally owned and family-operated Edmonton business with more
            than 30 years of industry experience. That experience shows up in the small things —
            work that is planned properly, done carefully, and finished when it was promised.
          </p>

          <ul className="mt-7 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[0.94rem] text-ink">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" strokeWidth={2.2} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>

          <Link href="/about" className="link-underline mt-8 text-[0.95rem]">
            Learn About Phoenix Landscaping
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
