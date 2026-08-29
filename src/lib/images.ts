/**
 * Every photograph used on the site is declared here.
 *
 * The images currently point at Unsplash (free to use commercially, no
 * attribution required). To swap in Phoenix Landscaping's own photography:
 *   1. Drop the file into /public/images (e.g. /public/images/hero.jpg)
 *   2. Change the `src` below to '/images/hero.jpg'
 * Nothing else in the codebase needs to change.
 */

export type SiteImage = {
  src: string;
  alt: string;
};

const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  hero: {
    src: unsplash('photo-1738193830098-2d92352a1856', 2000),
    alt: 'A well-maintained residential property with a trimmed lawn, mulched garden beds and a stone retaining wall',
  },
  aboutPortrait: {
    src: unsplash('photo-1605117882932-f9e32b03fea9', 1200),
    alt: 'A landscaping crew member working on garden beds in front of a residential home',
  },
  servicesHero: {
    src: unsplash('photo-1668120089662-42642838cfef', 2000),
    alt: 'A wide, freshly maintained lawn framed by shaped shrubs and mature trees',
  },
  contactHero: {
    src: unsplash('photo-1617850687395-620757feb1f3', 2000),
    alt: 'An aerial view of a landscaped outdoor living area with planters and seating',
  },
  testimonialsHero: {
    src: unsplash('photo-1663185777390-d44a6f4724b9', 2000),
    alt: 'A tidy garden pathway bordered by maintained planting beds',
  },
  aboutHero: {
    src: unsplash('photo-1700689807667-82630348b301', 2000),
    alt: 'A brick walkway running past maintained hedges and flower beds',
  },
  services: {
    landscaping: {
      src: unsplash('photo-1700689807667-82630348b301'),
      alt: 'A brick pathway bordered by shaped hedges and planted garden beds',
    },
    maintenance: {
      src: unsplash('photo-1689728318937-17d24bc0a65c'),
      alt: 'A property maintenance worker trimming grass edges beside a planting bed',
    },
    snow: {
      src: unsplash('photo-1517430784299-86c141b421df'),
      alt: 'A heavy loader clearing snow from a parking area during a snowfall',
    },
    cleanup: {
      src: unsplash('photo-1636750121381-9245cd137f32'),
      alt: 'A thick layer of fallen autumn leaves covering a property',
    },
  },
  seasons: {
    spring: {
      src: unsplash('photo-1734079692079-aae7e24a7035', 1200),
      alt: 'Hands pressing fresh sod into prepared ground during spring property work',
    },
    summer: {
      src: unsplash('photo-1734303023491-db8037a21f09', 1200),
      alt: 'A two-person crew mowing a large striped lawn on a summer day',
    },
    fall: {
      src: unsplash('photo-1543775562-fb5294aafcf7', 1200),
      alt: 'Patio chairs surrounded by fallen leaves before a seasonal cleanup',
    },
    winter: {
      src: unsplash('photo-1579278350462-e88ef330c943', 1200),
      alt: 'A plow truck clearing snow from a road during a winter storm',
    },
  },
  audiences: {
    residential: {
      src: unsplash('photo-1663185777390-d44a6f4724b9', 1200),
      alt: 'A neatly maintained residential garden with a gravel pathway',
    },
    condominium: {
      src: unsplash('photo-1673843916246-06c46ea3a72a', 1200),
      alt: 'A condominium tower surrounded by mature trees and maintained grounds',
    },
    commercial: {
      src: unsplash('photo-1643391448949-735f48c6ef66', 1200),
      alt: 'A commercial building fronted by landscaped beds and trimmed lawn',
    },
    propertyManagement: {
      src: unsplash('photo-1758501395624-de0bce47d124', 1200),
      alt: 'An office property courtyard with maintained planters and walkways',
    },
  },
} satisfies Record<string, SiteImage | Record<string, SiteImage>>;
