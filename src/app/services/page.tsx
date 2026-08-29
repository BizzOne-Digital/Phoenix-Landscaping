import type { Metadata } from 'next';
import Image from 'next/image';
import { Check } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import AudienceSection from '@/components/AudienceSection';
import FourSeasonSection from '@/components/FourSeasonSection';
import QuoteCTA from '@/components/QuoteCTA';
import { ButtonLink } from '@/components/ui/Button';
import { services } from '@/lib/services';
import { images } from '@/lib/images';

export const metadata: Metadata = {
  title: 'Landscaping, Property Maintenance & Snow Removal Services in Edmonton',
  description:
    'Explore Phoenix Landscaping services in Edmonton and area: landscaping, ongoing property maintenance, snow removal and seasonal cleanup for residential, condominium, commercial and managed properties.',
  alternates: { canonical: '/services' },
  openGraph: {
    url: '/services',
    title: 'Landscaping, Property Maintenance & Snow Removal Services in Edmonton',
    description:
      'Four-season property care from a locally owned, family-operated Edmonton company with 30+ years of industry experience.',
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="Our Services"
        title="Professional Property Care, Year Round"
        intro="Landscaping, property maintenance, snow removal and seasonal cleanup — delivered by one local, family-operated team across Edmonton and surrounding communities."
        image={images.servicesHero}
      />

      <nav aria-label="Services" className="border-b border-line bg-cream">
        <div className="container flex gap-2 overflow-x-auto py-4">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`#${service.slug}`}
              className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-md border border-line bg-warmwhite px-4 text-[0.85rem] font-medium text-ink transition hover:border-burgundy/40 hover:text-burgundy"
            >
              <Icon name={service.icon} className="h-4 w-4 text-gold-dark" />
              {service.title}
            </a>
          ))}
        </div>
      </nav>

      {services.map((service, index) => {
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`section scroll-mt-24 ${index % 2 === 1 ? 'bg-cream' : 'bg-warmwhite'}`}
          >
            <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={flipped ? 'lg:order-2' : ''}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-card shadow-lift">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={110} className={flipped ? 'lg:order-1' : ''}>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-sm bg-burgundy text-cream"
                >
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>

                <h2 className="mt-5 text-[1.6rem] font-semibold leading-[1.18] sm:text-[2rem]">
                  {service.title}
                </h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-muted">
                  {service.longDescription}
                </p>

                <h3 className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-burgundy">
                  What You Get
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-[0.93rem] text-ink">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-7 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-burgundy">
                  Suitable For
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {service.suitableFor.map((type) => (
                    <li
                      key={type}
                      className="rounded-full border border-line bg-warmwhite px-3.5 py-1.5 text-[0.8rem] font-medium text-muted"
                    >
                      {type}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ButtonLink href="/contact#quote" size="lg" className="w-full sm:w-auto">
                    Request a Free Quote
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      <FourSeasonSection />
      <AudienceSection />
      <QuoteCTA
        title="Not Sure Which Services You Need?"
        description="Tell us about the property and we will help you work out what makes sense — for a single visit or a full year of care."
      />
    </>
  );
}
