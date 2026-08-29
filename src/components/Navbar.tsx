'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, MapPin, Menu, Phone } from 'lucide-react';
import { nav, site } from '@/lib/site';
import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';
import { buttonClasses } from '@/components/ui/Button';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="hidden bg-burgundy-700 text-cream lg:block">
        <div className="container flex items-center justify-between py-2 text-[0.78rem]">
          <p className="flex items-center gap-2 text-cream/85">
            <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} aria-hidden="true" />
            Serving {site.serviceArea}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={site.phoneHref}
              className="flex items-center gap-2 font-semibold transition-colors hover:text-gold-light"
            >
              <Phone className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} aria-hidden="true" />
              {site.phone}
            </a>
            <a
              href={site.emailHref}
              className="flex items-center gap-2 transition-colors hover:text-gold-light"
            >
              <Mail className="h-3.5 w-3.5 text-gold" strokeWidth={1.8} aria-hidden="true" />
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
          ? 'border-line bg-warmwhite/95 shadow-card backdrop-blur-md'
          : 'border-transparent bg-warmwhite'
          }`}
      >
        <div className="container flex items-center justify-between gap-4 py-3 lg:py-4">
          <Logo href="/" priority sizeClassName="h-14 w-auto sm:h-[88px]" />

          <nav className="hidden lg:block" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active =
                  item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative flex min-h-[44px] items-center px-3.5 text-[0.9rem] font-medium transition-colors ${active ? 'text-burgundy' : 'text-ink hover:text-burgundy'
                        }`}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3.5 bottom-1.5 h-px origin-left bg-gold transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'
                          }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/contact#quote" className={buttonClasses('primary', 'md', 'hidden sm:inline-flex')}>
              Request a Free Quote
            </Link>

            <a
              href={site.phoneHref}
              aria-label={`Call Phoenix Landscaping at ${site.phone}`}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-burgundy transition hover:border-burgundy/40 hover:bg-cream sm:hidden"
            >
              <Phone className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-burgundy transition hover:border-burgundy/40 hover:bg-cream lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}
