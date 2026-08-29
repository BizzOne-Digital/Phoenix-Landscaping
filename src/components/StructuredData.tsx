import { site } from '@/lib/site';
import { services } from '@/lib/services';

/**
 * LocalBusiness structured data.
 * Only facts supplied by the business are included — no invented addresses,
 * opening hours, ratings, prices or review counts.
 */
export default function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    description: site.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Edmonton' },
      { '@type': 'AdministrativeArea', name: 'Edmonton and surrounding communities, Alberta' },
    ],
    knowsAbout: services.map((service) => service.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Property Care Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.shortDescription,
          areaServed: site.serviceArea,
          provider: { '@id': `${site.url}/#business` },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
