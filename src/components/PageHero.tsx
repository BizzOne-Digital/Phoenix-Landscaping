import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { SiteImage } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  image: SiteImage;
  breadcrumb: string;
};

export default function PageHero({ eyebrow, title, intro, image, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-burgundy-800">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-burgundy-900/95 via-burgundy-900/80 to-burgundy-900/45"
      />

      <div className="container relative py-16 sm:py-20 lg:py-24">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-[0.78rem] text-cream/70">
            <li>
              <Link href="/" className="transition-colors hover:text-gold-light">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            </li>
            <li className="font-medium text-gold-light" aria-current="page">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[2rem] font-semibold leading-[1.12] text-white sm:text-[2.5rem] lg:text-[3rem]">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-cream/85">{intro}</p>
          <div className="mt-8">
            <ButtonLink href="/contact#quote" size="lg" className="w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
