/**
 * Every photograph used on the site is declared here.
 *
 * All images are Phoenix Landscaping's own job photography, stored in
 * /public/images/phoenix and referenced by their public path. To swap one out,
 * drop the new file into that folder and change the `src` below — nothing else
 * in the codebase needs to change.
 *
 * Source files are 1125px wide (1125x1500 portrait, 1125x844 landscape), so
 * `sizes` is kept honest at each call site and next/image handles the rest.
 */

export type SiteImage = {
  src: string;
  alt: string;
};

/** Job photography lives in one folder; keep the path in a single place. */
const photo = (file: string) => `/images/phoenix/${file}`;

export const images = {
  hero: {
    src: photo('39.jpg'),
    alt: 'A completed courtyard with new shrub beds, decorative rock and fresh concrete walkways',
  },
  aboutPortrait: {
    src: photo('31.jpg'),
    alt: 'Two Phoenix Landscaping crew members walking a property with backpack blowers during a cleanup',
  },
  servicesHero: {
    src: photo('34.jpg'),
    alt: 'A crew member rolling freshly laid sod across a newly installed commercial lawn',
  },
  contactHero: {
    src: photo('12.jpg'),
    alt: 'Tidy condominium grounds with a mown lawn, swept walkway and mature spruce trees',
  },
  testimonialsHero: {
    src: photo('54.jpg'),
    alt: 'A finished commercial walkway bordered by fresh mulch beds and autumn planting',
  },
  aboutHero: {
    src: photo('55.jpg'),
    alt: 'Three Phoenix Landscaping crew members in high-visibility vests working together on a commercial site',
  },
  services: {
    landscaping: {
      src: photo('41.jpg'),
      alt: 'Two crew members unrolling fresh sod across prepared soil on a bright autumn day',
    },
    maintenance: {
      src: photo('47.jpg'),
      alt: 'A neatly striped lawn beside a residential deck, freshly cut on a maintenance visit',
    },
    treeTrimming: {
      src: photo('30.jpg'),
      alt: 'A crew member trimming back overgrown shrubs in a front yard, cut branches piled on the lawn',
    },
    snow: {
      src: photo('5.jpg'),
      alt: 'A residential driveway cleared down to the pavement between deep snowbanks after a snowfall',
    },
    cleanup: {
      src: photo('13.jpg'),
      alt: 'A dump trailer loaded with leaves and yard debris during a fall cleanup at a townhouse complex',
    },
  },
  seasons: {
    spring: {
      src: photo('8.jpg'),
      alt: 'A crew member bagging winter debris from a property during an early spring cleanup',
    },
    summer: {
      src: photo('42.jpg'),
      alt: 'A sunlit, freshly cut lawn shaded by mature trees at a townhouse complex in midsummer',
    },
    fall: {
      src: photo('14.jpg'),
      alt: 'A crew member clearing fallen leaves from a residential street with a blower in autumn',
    },
    winter: {
      src: photo('6.jpg'),
      alt: 'A commercial storefront sidewalk cleared and sanded on a winter morning',
    },
  },
  audiences: {
    residential: {
      src: photo('45.jpg'),
      alt: 'A residential street of well-kept homes with mown boulevards and maintained street trees',
    },
    condominium: {
      src: photo('44.jpg'),
      alt: 'A townhouse condominium walkway framed by cut lawns and young maintained trees',
    },
    commercial: {
      src: photo('51.jpg'),
      alt: 'A commercial clinic entrance fronted by a freshly mulched bed with new shrub planting',
    },
    propertyManagement: {
      src: photo('9.jpg'),
      alt: 'Crew and equipment working a managed apartment property during a seasonal cleanup',
    },
  },
} satisfies Record<string, SiteImage | Record<string, SiteImage>>;

export type ShowcaseImage = SiteImage & { label: string };

/**
 * Hero collage — one photo per service pillar, shown beside the headline on
 * large screens so the hero reflects the full range of work rather than one job.
 */
export const heroShowcase: readonly ShowcaseImage[] = [
  {
    src: photo('52.jpg'),
    alt: 'A newly planted tree in a fresh mulch bed edged with river rock at a commercial property',
    label: 'Landscaping',
  },
  {
    src: photo('49.jpg'),
    alt: 'A freshly mown, striped lawn running between condominium decks and mature evergreens',
    label: 'Property Maintenance',
  },
  {
    src: photo('30.jpg'),
    alt: 'A crew member cutting back overgrown shrubs, with trimmed branches stacked on the lawn behind',
    label: 'Tree & Bush Trimming',
  },
  {
    src: photo('23.jpg'),
    alt: 'A machine and crew member clearing and sanding a sidewalk on a winter night',
    label: 'Snow Removal',
  },
];

/**
 * Job-site footage used by the crew-at-work section on the home page.
 * The poster is a still from the same commercial project, so the section has
 * something to show before the file is requested (the video uses preload="none").
 */
export const siteVideo = {
  src: photo('vid.mp4'),
  type: 'video/mp4',
  poster: {
    src: photo('53.jpg'),
    alt: 'A curved commercial walkway beside a freshly prepared pathway on a Phoenix Landscaping job site',
  },
  /** Describes the footage for anyone who cannot see it. */
  description:
    'Phoenix Landscaping crew members preparing and compacting a new pathway at a commercial property, working with a wheelbarrow, hose and roller.',
} as const;
