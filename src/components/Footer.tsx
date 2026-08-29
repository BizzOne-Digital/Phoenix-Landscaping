import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { nav, site } from '@/lib/site';
import { services } from '@/lib/services';
import Logo from '@/components/Logo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-gold/70 bg-burgundy-700 text-cream/85">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div>
          <Logo plate sizeClassName="h-20 w-auto" />
          <span className="mt-5 block h-px w-12 bg-gold" aria-hidden="true" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.shortDescription}</p>
          <p className="mt-5 flex items-start gap-2.5 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.8} aria-hidden="true" />
            {site.serviceArea}
          </p>
        </div>

        <div>
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[40px] items-center text-sm transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">
            Services
          </h2>
          <ul className="mt-5 space-y-1">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services#${service.slug}`}
                  className="inline-flex min-h-[40px] items-center text-sm transition-colors hover:text-white"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold">
            Contact
          </h2>
          <ul className="mt-5 space-y-2">
            <li>
              <a
                href={site.phoneHref}
                className="inline-flex min-h-[40px] items-center gap-2.5 text-sm font-semibold text-cream transition-colors hover:text-gold-light"
              >
                <Phone className="h-4 w-4 text-gold" strokeWidth={1.8} aria-hidden="true" />
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={site.emailHref}
                className="inline-flex min-h-[40px] items-center gap-2.5 break-all text-sm transition-colors hover:text-gold-light"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.8} aria-hidden="true" />
                {site.email}
              </a>
            </li>
          </ul>
          <Link
            href="/contact#quote"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-md border border-gold/60 px-5 text-sm font-semibold text-cream transition hover:bg-gold hover:text-burgundy-800"
          >
            Request a Free Quote
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container flex flex-col gap-2 py-5 pb-24 text-xs lg:pb-5 text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.name} &copy; {year}. All rights reserved.
          </p>
          <p>
            {site.city}, {site.regionName}
          </p>
        </div>
      </div>
    </footer>
  );
}
