'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Mail, Phone, X } from 'lucide-react';
import { nav, site } from '@/lib/site';
import { buttonClasses } from '@/components/ui/Button';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  pathname: string;
};

export default function MobileMenu({ open, onClose, pathname }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={`absolute inset-0 h-full w-full bg-burgundy-900/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        role="dialog"
        aria-modal={open}
        aria-label="Site menu"
        className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-warmwhite shadow-lift transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-serif text-lg font-semibold text-burgundy-700">Menu</span>
          <button
            type="button"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            aria-label="Close menu"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-burgundy transition hover:bg-cream"
          >
            <X className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
          <ul className="flex flex-col">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[52px] items-center border-b border-line/70 text-[1.05rem] font-medium transition-colors ${
                      active ? 'text-burgundy' : 'text-ink hover:text-burgundy'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-3 border-t border-line bg-cream px-5 py-5">
          <Link
            href="/contact#quote"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className={buttonClasses('primary', 'lg', 'w-full')}
          >
            Request a Free Quote
          </Link>
          <a
            href={site.phoneHref}
            tabIndex={open ? 0 : -1}
            className="flex min-h-[44px] items-center gap-2.5 text-sm font-semibold text-burgundy-700"
          >
            <Phone className="h-4 w-4 text-gold-dark" strokeWidth={1.8} aria-hidden="true" />
            {site.phone}
          </a>
          <a
            href={site.emailHref}
            tabIndex={open ? 0 : -1}
            className="flex min-h-[44px] items-center gap-2.5 break-all text-sm text-muted"
          >
            <Mail className="h-4 w-4 text-gold-dark" strokeWidth={1.8} aria-hidden="true" />
            {site.email}
          </a>
        </div>
      </div>
    </div>
  );
}
