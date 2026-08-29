import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section bg-warmwhite">
      <div className="container flex min-h-[46vh] flex-col items-center justify-center text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-burgundy">
          404
        </p>
        <h1 className="mt-4 text-[1.9rem] font-semibold sm:text-[2.4rem]">
          We could not find that page
        </h1>
        <p className="mt-4 max-w-md text-[0.98rem] leading-relaxed text-muted">
          The page may have moved. Head back to the homepage, or get in touch and we will point you
          in the right direction.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to Home
          </ButtonLink>
          <ButtonLink href={site.phoneHref} variant="secondary" size="lg">
            Call {site.phone}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
