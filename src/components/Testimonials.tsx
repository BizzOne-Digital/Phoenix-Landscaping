import { Quote } from 'lucide-react';
import { testimonials } from '@/lib/testimonials';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/lib/site';

type TestimonialsProps = {
  /** `preview` renders the shorter homepage version. */
  variant?: 'preview' | 'full';
};

export default function Testimonials({ variant = 'preview' }: TestimonialsProps) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section className={variant === 'preview' ? 'section bg-cream' : 'section bg-warmwhite'}>
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Client Feedback"
            title="What Our Clients Say"
            intro={
              hasTestimonials
                ? 'Feedback from property owners, boards and managers across Edmonton and surrounding communities.'
                : 'Phoenix Landscaping is gathering feedback from clients across Edmonton and surrounding communities. Reviews will be published here as they are received.'
            }
          />
        </Reveal>

        {hasTestimonials ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal key={`${testimonial.author}-${index}`} delay={index * 90} className="h-full">
                <figure className="card flex h-full flex-col p-7">
                  <Quote className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <p className="text-[0.92rem] font-semibold text-burgundy-700">
                      {testimonial.author}
                    </p>
                    <p className="mt-0.5 text-[0.8rem] text-muted">
                      {[testimonial.role, testimonial.location, testimonial.service]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mx-auto mt-12 max-w-2xl">
            <div className="card flex flex-col items-center p-9 text-center sm:p-12">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-sm border border-gold/40 bg-cream text-burgundy"
              >
                <Quote className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 text-xl font-semibold">Reviews Coming Soon</h3>
              <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-muted">
                We publish real feedback from real clients only. If Phoenix Landscaping has looked
                after your property, we would be glad to hear how it went.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={site.emailHref} variant="secondary">
                  Share Your Experience
                </ButtonLink>
                <ButtonLink href="/contact#quote">Request a Free Quote</ButtonLink>
              </div>
            </div>
          </Reveal>
        )}

        {variant === 'preview' && hasTestimonials ? (
          <Reveal className="mt-12 flex justify-center">
            <ButtonLink href="/testimonials" variant="secondary" size="lg">
              Read More Reviews
            </ButtonLink>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
