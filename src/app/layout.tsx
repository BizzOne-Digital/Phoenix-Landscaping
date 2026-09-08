import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileQuoteBar from '@/components/MobileQuoteBar';
import IntroSplash from '@/components/IntroSplash';
import StructuredData from '@/components/StructuredData';
import SiteChrome from '@/components/SiteChrome';
import { site } from '@/lib/site';
import { getSiteSettings } from '@/lib/content';

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
    'tree trimming Edmonton',
    'bush trimming Edmonton',
    'tree and shrub trimming Edmonton',
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

/**
 * CMS content is cached, so public pages are regenerated at most every five
 * minutes. Saving in the dashboard revalidates them immediately.
 */
export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Business details for the header, footer and mobile bar. These are client
  // components, so the values are resolved here and passed down as props.
  const settings = await getSiteSettings();

  return (
    <html lang="en-CA" className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Chrome is skipped on /admin so the dashboard renders on its own. */}
        <SiteChrome
          intro={<IntroSplash />}
          navbar={<Navbar site={settings} />}
          footer={<Footer />}
          quoteBar={<MobileQuoteBar site={settings} />}
          structuredData={<StructuredData />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
