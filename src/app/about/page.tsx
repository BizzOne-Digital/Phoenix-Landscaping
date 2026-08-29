import type { Metadata } from 'next';
import Image from 'next/image';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import QuoteCTA from '@/components/QuoteCTA';
import WhyChooseUs from '@/components/WhyChooseUs';
import { images } from '@/lib/images';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About Phoenix Landscaping | Family-Operated Edmonton Property Care',
  description:
    'Phoenix Landscaping is a locally owned, family-operated Edmonton business with more than 30 years of industry experience in landscaping, property maintenance, seasonal cleanup and snow removal. Insured and WCB covered.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: '/about',
    title: 'About Phoenix Landscaping | Family-Operated Edmonton Property Care',
    description:
      'Local roots and decades of experience. Learn how Phoenix Landscaping looks after residential, condominium, commercial and managed properties in Edmonton and area.',
  },
};

const approach = [
  {
    title: 'Honest Service',
    description:
      'Straight answers about what a property needs, what it does not, and what we can realistically take on.',
    icon: 'MessageSquare',
  },
  {
    title: 'Quality Workmanship',
    description:
      'Careful work that holds up — the standard stays the same whether anyone is watching or not.',
    icon: 'Sparkles',
  },
  {
    title: 'Reliable Communication',
    description:
      'You should never have to wonder whether the crew is coming. Scheduling and updates stay clear.',
    icon: 'CalendarRange',
  },
  {
    title: 'Dependable Property Care',
    description:
      'Four seasons of care from one team that already knows the property inside out.',
    icon: 'ShieldCheck',
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About Us"
        eyebrow="About Phoenix Landscaping"
        title="Local Roots. Decades of Experience."
        intro="A locally owned, family-operated Edmonton business built on more than 30 years of industry experience and long-term client relationships."
        image={images.aboutHero}
      />

      <section className="section bg-warmwhite">
        <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-burgundy">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Our Story
            </p>
            <h2 className="mt-4 text-[1.75rem] font-semibold leading-[1.15] sm:text-[2.1rem]">
              A Local Company, Accountable to Its Neighbours
            </h2>
            <div className="mt-5 space-y-4 text-[1rem] leading-relaxed text-muted">
              <p>
                Phoenix Landscaping is locally owned and family-operated, based in {site.city} and
                serving {site.serviceArea}. More than 30 years of industry experience sits behind the
                work, and that experience is the reason properties stay looking after themselves
                rather than lurching from one emergency to the next.
              </p>
              <p>
                Being family-operated means the people who answer the phone are the people
                responsible for the work. Clients deal with the same faces season after season, which
                is exactly why so much of the work comes from properties we have looked after for
                years.
              </p>
              <p>
                From single homes to condominium grounds, commercial sites and managed portfolios,
                the approach does not change: do it properly, communicate clearly, and show up when
                we said we would.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card shadow-lift">
              <Image
                src={images.aboutPortrait.src}
                alt={images.aboutPortrait.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-0 hidden rounded-card border border-gold/40 bg-burgundy px-7 py-5 text-cream shadow-lift sm:block lg:-left-6">
              <p className="font-serif text-3xl font-semibold text-white">{site.yearsExperience}</p>
              <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-gold-light">
                Years of Experience
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Our Approach"
              title="How We Work"
              intro="Four principles that decide how every property is handled, from a single visit to a full-season contract."
            />
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 80} className="h-full">
                <div className="card card-hover flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-sm bg-burgundy text-cream"
                  >
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[1.02rem] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-warmwhite">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Trust & Safety"
              title="Coverage You Can Ask About"
              intro="Property managers and condominium boards need documentation before they can award work. Phoenix Landscaping keeps it current."
            />
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="card flex h-full flex-col p-7">
                <ShieldCheck className="h-8 w-8 text-gold-dark" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold">Insured</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                  Phoenix Landscaping carries active insurance coverage for added client confidence.
                  Documentation can be provided on request.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card flex h-full flex-col p-7">
                <BadgeCheck className="h-8 w-8 text-gold-dark" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold">WCB Covered</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                  Active WCB coverage is maintained, so the crews working on your property are
                  properly covered.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <QuoteCTA
        title="Let's Look After Your Property"
        description="Tell us about the property and what it needs. We will get back to you with a straightforward quote — no pressure and no obligation."
      />
    </>
  );
}
