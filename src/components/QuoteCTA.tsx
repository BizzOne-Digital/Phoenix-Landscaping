import { Phone } from 'lucide-react';
import { site } from '@/lib/site';
import { ButtonLink } from '@/components/ui/Button';
import Reveal from '@/components/Reveal';

type QuoteCTAProps = {
  title?: string;
  description?: string;
  className?: string;
};

export default function QuoteCTA({
  title = 'Ready for Reliable Property Care?',
  description = 'Whether you need residential landscaping, commercial property maintenance, seasonal cleanup, or snow removal, Phoenix Landscaping is ready to help.',
  className = '',
}: QuoteCTAProps) {
  return (
    <section className={`relative isolate overflow-hidden bg-burgundy ${className}`.trim()}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,169,107,0.18),transparent_55%)]"
      />
      <div className="container relative py-16 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mx-auto block h-px w-12 bg-gold" aria-hidden="true" />
          <h2 className="mt-6 text-[1.8rem] font-semibold leading-[1.15] text-white sm:text-[2.25rem]">
            {title}
          </h2>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-cream/85">{description}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/contact#quote" variant="inverse" size="lg" className="w-full sm:w-auto">
              Request a Free Quote
            </ButtonLink>
            <ButtonLink href={site.phoneHref} variant="ghost" size="lg" className="w-full sm:w-auto">
              <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Call {site.phone}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
