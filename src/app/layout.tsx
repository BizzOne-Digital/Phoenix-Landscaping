import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileQuoteBar from '@/components/MobileQuoteBar';
import StructuredData from '@/components/StructuredData';
import { site } from '@/lib/site';

const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Phoenix Landscaping | Landscaping & Property Maintenance in Edmonton',
    template: '%s | Phoenix Landscaping',
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'landscaping Edmonton',
    'landscaping services Edmonton',
    'property maintenance Edmonton',
    'snow removal Edmonton',
    'commercial landscaping Edmonton',
    'residential landscaping Edmonton',
    'seasonal cleanup Edmonton',
    'property care Edmonton',
    'landscaping company Edmonton',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: site.name,
    url: site.url,
    title: 'Phoenix Landscaping | Landscaping & Property Maintenance in Edmonton',
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phoenix Landscaping | Landscaping & Property Maintenance in Edmonton',
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable}`}>
      <body>
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

        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileQuoteBar />
        <StructuredData />
      </body>
    </html>
  );
}
