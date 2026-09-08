'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type SiteChromeProps = {
  intro: ReactNode;
  navbar: ReactNode;
  footer: ReactNode;
  quoteBar: ReactNode;
  structuredData: ReactNode;
  children: ReactNode;
};

/**
 * Wraps the public site's chrome so the admin dashboard can share the same
 * root layout without inheriting the navbar, footer, intro splash or mobile
 * quote bar. Public routes render exactly what they rendered before.
 */
export default function SiteChrome({
  intro,
  navbar,
  footer,
  quoteBar,
  structuredData,
  children,
}: SiteChromeProps) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      {intro}

      <noscript>
        {/* Content animates in with JavaScript; without it, show everything immediately. */}
        <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-burgundy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {navbar}
      <main id="main">{children}</main>
      {footer}
      {quoteBar}
      {structuredData}
    </>
  );
}
