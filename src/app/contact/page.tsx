import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ContactInfo from '@/components/ContactInfo';
import QuoteForm from '@/components/QuoteForm';
import Reveal from '@/components/Reveal';
import TrustBadges from '@/components/TrustBadges';
import { images } from '@/lib/images';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Phoenix Landscaping | Free Quotes in Edmonton & Area',
  description:
    'Contact Phoenix Landscaping in Edmonton for landscaping, property maintenance, snow removal and seasonal cleanup. Call +1 780-399-5222 or request a free quote online.',
  alternates: { canonical: '/contact' },
  openGraph: {
    url: '/contact',
    title: 'Contact Phoenix Landscaping | Free Quotes in Edmonton & Area',
    description:
      'Request a free quote for four-season property care in Edmonton and surrounding communities.',
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Get In Touch"
        title="Let's Talk About Your Property"
        intro="Tell us what your property needs and we will get back to you with a straightforward quote. No pressure, no obligation."
        image={images.contactHero}
      />

      <section id="quote" className="section scroll-mt-24 bg-warmwhite">
        <div className="container grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          <Reveal>
            <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-burgundy">
              <span className="h-px w-6 bg-gold" aria-hidden="true" />
              Contact Details
            </p>
            <h2 className="mt-4 text-[1.6rem] font-semibold leading-[1.18] sm:text-[1.9rem]">
              Reach {site.name}
            </h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-muted">
              Call, email, or send the form and we will follow up to discuss the property, the
              services you need, and the best way forward.
            </p>

            <ContactInfo className="mt-8" />

            <div className="mt-8 rounded-card border border-line bg-cream p-6">
              <h3 className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-burgundy">
                Why Clients Trust Us
              </h3>
              <TrustBadges tone="dark" className="mt-4" />
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
