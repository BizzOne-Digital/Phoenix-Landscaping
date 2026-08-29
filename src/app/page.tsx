import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import TrustSection from '@/components/TrustSection';
import ServiceGrid from '@/components/ServiceGrid';
import AudienceSection from '@/components/AudienceSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import FourSeasonSection from '@/components/FourSeasonSection';
import AboutPreview from '@/components/AboutPreview';
import Testimonials from '@/components/Testimonials';
import QuoteCTA from '@/components/QuoteCTA';

export const metadata: Metadata = {
  title: 'Landscaping & Property Maintenance in Edmonton | Phoenix Landscaping',
  description:
    'Phoenix Landscaping is a locally owned, family-operated Edmonton company offering landscaping, property maintenance, snow removal and seasonal cleanup for residential, condominium, commercial and managed properties. Request a free quote.',
  alternates: { canonical: '/' },
  openGraph: {
    url: '/',
    title: 'Landscaping & Property Maintenance in Edmonton | Phoenix Landscaping',
    description:
      'Dependable four-season property care for Edmonton and surrounding communities. 30+ years of industry experience, family operated, insured and WCB covered.',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <ServiceGrid />
      <AudienceSection />
      <WhyChooseUs />
      <FourSeasonSection />
      <AboutPreview />
      <Testimonials variant="preview" />
      <QuoteCTA />
    </>
  );
}
