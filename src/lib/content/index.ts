import { unstable_cache } from 'next/cache';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/db/mongoose';
import {
  Audience as AudienceModel,
  GalleryItem as GalleryItemModel,
  HeroShowcaseItem as HeroShowcaseItemModel,
  PageImage as PageImageModel,
  Season as SeasonModel,
  Service as ServiceModel,
  SiteSettings as SiteSettingsModel,
  SITE_SETTINGS_KEY,
  Testimonial as TestimonialModel,
  TrustPoint as TrustPointModel,
  WhyChooseItem as WhyChooseItemModel,
} from '@/lib/db/models';
import { CMS_CACHE_TAG } from '@/lib/api/guard';
import { resolveImageSrc } from '@/lib/uploads';
import { iconMap, type IconName } from '@/components/Icon';
import {
  audiences as staticAudiences,
  seasons as staticSeasons,
  services as staticServices,
  type Audience,
  type Season,
  type Service,
} from '@/lib/services';
import {
  heroShowcase as staticHeroShowcase,
  images as staticImages,
  type ShowcaseImage,
  type SiteImage,
} from '@/lib/images';
import {
  heroBadges as staticHeroBadges,
  site as staticSite,
  trustPoints as staticTrustPoints,
  whyChoose as staticWhyChoose,
} from '@/lib/site';
import { testimonials as staticTestimonials, type Testimonial } from '@/lib/testimonials';

/**
 * Read layer between MongoDB and the public site.
 *
 * Every getter returns exactly the shape the existing components already
 * consume, and falls back to the bundled data in `src/lib/*.ts` when the
 * database is unconfigured, unreachable or empty. That keeps `next build`
 * working without a database and stops a transient outage from taking the
 * public site down.
 */

const CACHE_REVALIDATE_SECONDS = 300;

function cached<T>(key: string, loader: () => Promise<T>) {
  return unstable_cache(loader, ['phoenix-cms', key], {
    tags: [CMS_CACHE_TAG],
    revalidate: CACHE_REVALIDATE_SECONDS,
  });
}

/** Guards against an icon name that no longer exists in the icon set. */
function toIconName(value: unknown, fallback: IconName): IconName {
  return typeof value === 'string' && value in iconMap ? (value as IconName) : fallback;
}

function toImage(value: unknown, fallback: SiteImage): SiteImage {
  const input = (value ?? {}) as { src?: unknown; alt?: unknown };
  const src = typeof input.src === 'string' ? input.src.trim() : '';
  const alt = typeof input.alt === 'string' && input.alt.trim() ? input.alt : fallback.alt;

  // Nothing stored at all: fall back to the photo the site shipped with.
  if (!src) return { src: fallback.src, alt };

  // Something is stored but cannot resolve — a legacy `/uploads/...` path
  // whose file is long gone — so show the placeholder rather than silently
  // substituting a different photograph.
  return { src: resolveImageSrc(src), alt };
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

/* -------------------------------------------------------------------------- */
/* Site settings                                                              */
/* -------------------------------------------------------------------------- */

export type SiteSettingsView = {
  name: string;
  legalName: string;
  contactPerson: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  city: string;
  region: string;
  regionName: string;
  country: string;
  countryName: string;
  serviceArea: string;
  tagline: string;
  description: string;
  shortDescription: string;
  yearsExperience: string;
  scopeNote: { title: string; description: string };
  heroBadges: readonly string[];
  url: string;
};

/** `tel:` / `mailto:` hrefs are derived, never stored separately. */
function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : staticSite.phoneHref;
}

export const staticSettings: SiteSettingsView = {
  name: staticSite.name,
  legalName: staticSite.legalName,
  contactPerson: staticSite.contactPerson,
  phone: staticSite.phone,
  phoneHref: staticSite.phoneHref,
  email: staticSite.email,
  emailHref: staticSite.emailHref,
  city: staticSite.city,
  region: staticSite.region,
  regionName: staticSite.regionName,
  country: staticSite.country,
  countryName: staticSite.countryName,
  serviceArea: staticSite.serviceArea,
  tagline: staticSite.tagline,
  description: staticSite.description,
  shortDescription: staticSite.shortDescription,
  yearsExperience: staticSite.yearsExperience,
  scopeNote: { ...staticSite.scopeNote },
  heroBadges: staticHeroBadges,
  url: staticSite.url,
};

const loadSettings = cached('settings', async (): Promise<SiteSettingsView> => {
  await connectToDatabase();
  const doc = await SiteSettingsModel.findOne({ key: SITE_SETTINGS_KEY }).lean();
  if (!doc) return staticSettings;

  const phone = text(doc.phone, staticSettings.phone);
  const email = text(doc.email, staticSettings.email);

  return {
    name: text(doc.name, staticSettings.name),
    legalName: text(doc.legalName, staticSettings.legalName),
    contactPerson: text(doc.contactPerson, staticSettings.contactPerson),
    phone,
    phoneHref: telHref(phone),
    email,
    emailHref: `mailto:${email}`,
    city: text(doc.city, staticSettings.city),
    region: text(doc.region, staticSettings.region),
    regionName: text(doc.regionName, staticSettings.regionName),
    country: text(doc.country, staticSettings.country),
    countryName: text(doc.countryName, staticSettings.countryName),
    serviceArea: text(doc.serviceArea, staticSettings.serviceArea),
    tagline: text(doc.tagline, staticSettings.tagline),
    description: text(doc.description, staticSettings.description),
    shortDescription: text(doc.shortDescription, staticSettings.shortDescription),
    yearsExperience: text(doc.yearsExperience, staticSettings.yearsExperience),
    scopeNote: {
      title: text(doc.scopeNoteTitle, staticSettings.scopeNote.title),
      description: text(doc.scopeNoteDescription, staticSettings.scopeNote.description),
    },
    heroBadges: doc.heroBadges?.length ? doc.heroBadges : staticSettings.heroBadges,
    url: text(doc.url, staticSettings.url),
  };
});

export async function getSiteSettings(): Promise<SiteSettingsView> {
  if (!isDatabaseConfigured()) return staticSettings;

  try {
    return await loadSettings();
  } catch (error) {
    console.error('[content] Falling back to bundled site settings:', error);
    return staticSettings;
  }
}

/* -------------------------------------------------------------------------- */
/* Services, audiences, seasons                                               */
/* -------------------------------------------------------------------------- */

const loadServices = cached('services', async (): Promise<Service[]> => {
  await connectToDatabase();
  const docs = await ServiceModel.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();

  return docs.map((doc, index) => {
    const fallback = staticServices[index] ?? staticServices[0];
    return {
      slug: text(doc.slug, fallback.slug),
      title: text(doc.title, fallback.title),
      shortDescription: text(doc.shortDescription),
      longDescription: text(doc.longDescription),
      benefits: doc.benefits ?? [],
      suitableFor: doc.suitableFor ?? [],
      icon: toIconName(doc.icon, fallback.icon),
      image: toImage(doc.image, fallback.image),
    };
  });
});

export async function getServices(): Promise<Service[]> {
  if (!isDatabaseConfigured()) return staticServices;

  try {
    const services = await loadServices();
    return services.length > 0 ? services : staticServices;
  } catch (error) {
    console.error('[content] Falling back to bundled services:', error);
    return staticServices;
  }
}

const loadAudiences = cached('audiences', async (): Promise<Audience[]> => {
  await connectToDatabase();
  const docs = await AudienceModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs.map((doc, index) => {
    const fallback = staticAudiences[index] ?? staticAudiences[0];
    return {
      title: text(doc.title, fallback.title),
      description: text(doc.description),
      icon: toIconName(doc.icon, fallback.icon),
      image: toImage(doc.image, fallback.image),
    };
  });
});

export async function getAudiences(): Promise<Audience[]> {
  if (!isDatabaseConfigured()) return staticAudiences;

  try {
    const audiences = await loadAudiences();
    return audiences.length > 0 ? audiences : staticAudiences;
  } catch (error) {
    console.error('[content] Falling back to bundled audiences:', error);
    return staticAudiences;
  }
}

const loadSeasons = cached('seasons', async (): Promise<Season[]> => {
  await connectToDatabase();
  const docs = await SeasonModel.find({ published: true }).sort({ order: 1, createdAt: 1 }).lean();

  return docs.map((doc, index) => {
    const fallback = staticSeasons[index] ?? staticSeasons[0];
    return {
      name: text(doc.name, fallback.name),
      headline: text(doc.headline),
      description: text(doc.description),
      icon: toIconName(doc.icon, fallback.icon),
      image: toImage(doc.image, fallback.image),
    };
  });
});

export async function getSeasons(): Promise<Season[]> {
  if (!isDatabaseConfigured()) return staticSeasons;

  try {
    const seasons = await loadSeasons();
    return seasons.length > 0 ? seasons : staticSeasons;
  } catch (error) {
    console.error('[content] Falling back to bundled seasons:', error);
    return staticSeasons;
  }
}

/* -------------------------------------------------------------------------- */
/* Trust points and "why choose"                                              */
/* -------------------------------------------------------------------------- */

export type ContentPoint = {
  title: string;
  description: string;
  icon: IconName;
};

const loadTrustPoints = cached('trust-points', async (): Promise<ContentPoint[]> => {
  await connectToDatabase();
  const docs = await TrustPointModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs.map((doc, index) => ({
    title: text(doc.title, staticTrustPoints[index]?.title ?? ''),
    description: text(doc.description),
    icon: toIconName(doc.icon, 'Award'),
  }));
});

export async function getTrustPoints(): Promise<readonly ContentPoint[]> {
  if (!isDatabaseConfigured()) return staticTrustPoints as readonly ContentPoint[];

  try {
    const points = await loadTrustPoints();
    return points.length > 0 ? points : (staticTrustPoints as readonly ContentPoint[]);
  } catch (error) {
    console.error('[content] Falling back to bundled trust points:', error);
    return staticTrustPoints as readonly ContentPoint[];
  }
}

const loadWhyChoose = cached('why-choose', async (): Promise<ContentPoint[]> => {
  await connectToDatabase();
  const docs = await WhyChooseItemModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs.map((doc, index) => ({
    title: text(doc.title, staticWhyChoose[index]?.title ?? ''),
    description: text(doc.description),
    icon: toIconName(doc.icon, 'Award'),
  }));
});

export async function getWhyChoose(): Promise<readonly ContentPoint[]> {
  if (!isDatabaseConfigured()) return staticWhyChoose as readonly ContentPoint[];

  try {
    const items = await loadWhyChoose();
    return items.length > 0 ? items : (staticWhyChoose as readonly ContentPoint[]);
  } catch (error) {
    console.error('[content] Falling back to bundled why-choose items:', error);
    return staticWhyChoose as readonly ContentPoint[];
  }
}

/* -------------------------------------------------------------------------- */
/* Photography                                                                */
/* -------------------------------------------------------------------------- */

/** Page-level photo slots, keyed exactly as `images` in src/lib/images.ts. */
export const PAGE_IMAGE_KEYS = [
  'hero',
  'aboutPortrait',
  'servicesHero',
  'contactHero',
  'testimonialsHero',
  'aboutHero',
] as const;

export type PageImageKey = (typeof PAGE_IMAGE_KEYS)[number];
export type PageImages = Record<PageImageKey, SiteImage>;

export const staticPageImages: PageImages = {
  hero: staticImages.hero,
  aboutPortrait: staticImages.aboutPortrait,
  servicesHero: staticImages.servicesHero,
  contactHero: staticImages.contactHero,
  testimonialsHero: staticImages.testimonialsHero,
  aboutHero: staticImages.aboutHero,
};

const loadPageImages = cached('page-images', async (): Promise<PageImages> => {
  await connectToDatabase();
  const docs = await PageImageModel.find({ key: { $in: PAGE_IMAGE_KEYS } }).lean();
  const byKey = new Map(docs.map((doc) => [doc.key, doc]));

  const output = {} as PageImages;
  for (const key of PAGE_IMAGE_KEYS) {
    output[key] = toImage(byKey.get(key)?.image, staticPageImages[key]);
  }

  return output;
});

export async function getPageImages(): Promise<PageImages> {
  if (!isDatabaseConfigured()) return staticPageImages;

  try {
    return await loadPageImages();
  } catch (error) {
    console.error('[content] Falling back to bundled page images:', error);
    return staticPageImages;
  }
}

const loadHeroShowcase = cached('hero-showcase', async (): Promise<ShowcaseImage[]> => {
  await connectToDatabase();
  const docs = await HeroShowcaseItemModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs.map((doc, index) => {
    const fallback = staticHeroShowcase[index] ?? staticHeroShowcase[0];
    const image = toImage(doc.image, fallback);
    return {
      src: image.src,
      alt: image.alt,
      label: text(doc.label, fallback.label),
    };
  });
});

export async function getHeroShowcase(): Promise<readonly ShowcaseImage[]> {
  if (!isDatabaseConfigured()) return staticHeroShowcase;

  try {
    const items = await loadHeroShowcase();
    return items.length > 0 ? items : staticHeroShowcase;
  } catch (error) {
    console.error('[content] Falling back to bundled hero showcase:', error);
    return staticHeroShowcase;
  }
}

/* -------------------------------------------------------------------------- */
/* Testimonials                                                               */
/* -------------------------------------------------------------------------- */

const loadTestimonials = cached('testimonials', async (): Promise<Testimonial[]> => {
  await connectToDatabase();
  const docs = await TestimonialModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs.map((doc) => ({
    quote: text(doc.quote),
    author: text(doc.author),
    role: text(doc.role) || undefined,
    location: text(doc.location) || undefined,
    service: text(doc.service) || undefined,
  }));
});

/**
 * Real client testimonials only. An empty result is a legitimate state — the
 * public page renders its "reviews coming soon" panel — so nothing is
 * substituted in.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isDatabaseConfigured()) return staticTestimonials;

  try {
    return await loadTestimonials();
  } catch (error) {
    console.error('[content] Falling back to bundled testimonials:', error);
    return staticTestimonials;
  }
}

/* -------------------------------------------------------------------------- */
/* Gallery                                                                    */
/* -------------------------------------------------------------------------- */

export type GalleryItemView = {
  id: string;
  title: string;
  image: string;
  alt: string;
};

const loadGallery = cached('gallery', async (): Promise<GalleryItemView[]> => {
  await connectToDatabase();
  const docs = await GalleryItemModel.find({ published: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return docs
    .filter((doc) => text(doc.image))
    .map((doc) => ({
      id: String(doc._id),
      title: text(doc.title),
      image: resolveImageSrc(doc.image),
      alt: text(doc.alt, text(doc.title)),
    }));
});

export async function getGallery(): Promise<GalleryItemView[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    return await loadGallery();
  } catch (error) {
    console.error('[content] Could not load the gallery:', error);
    return [];
  }
}
