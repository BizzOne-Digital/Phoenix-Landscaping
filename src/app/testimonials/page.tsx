import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import Testimonials from '@/components/Testimonials';
import QuoteCTA from '@/components/QuoteCTA';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import Icon from '@/components/Icon';
import { images } from '@/lib/images';
import { trustPoints } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Client Testimonials | Phoenix Landscaping Edmonton',
  description:
    'Client feedback for Phoenix Landscaping, a locally owned and family-operated landscaping, property maintenance and snow removal company serving Edmonton and surrounding communities.',
  alternates: { canonical: '/testimonials' },
  openGraph: {
    url: '/testimonials',
    title: 'Client Testimonials | Phoenix Landscaping Edmonton',
    description:
      'Real feedback from Edmonton-area property owners, condominium boards and property managers.',
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Testimonials"
        eyebrow="Client Feedback"
        title="What Our Clients Say"
        intro="Phoenix Landscaping publishes real feedback from real clients only. As reviews come in from Edmonton-area properties, they appear here."
        image={images.testimonialsHero}
      />

      <Testimonials variant="full" />

      <section className="section bg-cream">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="In the Meantime"
              title="What You Can Count On"
              intro="Until the reviews are in, here is what every Phoenix Landscaping client gets from day one."
            />
          </Reveal>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trustPoints.map((point, index) => (
              <Reveal as="li" key={point.title} delay={index * 80} className="h-full">
                <div className="card flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 bg-warmwhite text-burgundy"
                  >
                    <Icon name={point.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[1rem] font-semibold">{point.title}</h3>
                  <p className="mt-2 text-[0.87rem] leading-relaxed text-muted">
                    {point.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
