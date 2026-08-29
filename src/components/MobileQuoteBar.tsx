'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { site } from '@/lib/site';
import { buttonClasses } from '@/components/ui/Button';

/**
 * Slim mobile action bar. Appears once the visitor has scrolled past the hero
 * so the quote CTA and phone number are never more than one tap away.
 */
export default function MobileQuoteBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-warmwhite/95 px-4 py-3 shadow-[0_-6px_20px_-12px_rgba(41,37,38,0.4)] backdrop-blur-md transition-transform duration-300 lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2.5">
        <Link
          href="/contact#quote"
          tabIndex={show ? 0 : -1}
          className={buttonClasses('primary', 'md', 'flex-1')}
        >
          Request a Free Quote
        </Link>
        <a
          href={site.phoneHref}
          tabIndex={show ? 0 : -1}
          aria-label={`Call Phoenix Landscaping at ${site.phone}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-burgundy/25 text-burgundy transition hover:bg-cream"
        >
          <Phone className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
