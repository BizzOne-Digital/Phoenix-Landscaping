import { iconMap } from '@/components/Icon';
import { PAGE_IMAGE_KEYS } from '@/lib/content';
import {
  bool,
  imageRef,
  imageUrl,
  num,
  oneOf,
  slug,
  str,
  strArray,
  type Schema,
} from '@/lib/api/validate';

/** Only icons the public `<Icon>` component can actually render. */
export const ICON_NAMES = Object.keys(iconMap) as [string, ...string[]];

const order = num({ min: 0, max: 9999 });
const published = bool(true);

export const serviceSchema: Schema = {
  slug: slug({ required: true }),
  title: str({ required: true, max: 120 }),
  shortDescription: str({ max: 600 }),
  longDescription: str({ max: 4000 }),
  benefits: strArray({ max: 20, itemMax: 300 }),
  suitableFor: strArray({ max: 20, itemMax: 120 }),
  icon: oneOf(ICON_NAMES),
  image: imageRef(),
  order,
  published,
};

export const audienceSchema: Schema = {
  title: str({ required: true, max: 120 }),
  description: str({ max: 600 }),
  icon: oneOf(ICON_NAMES),
  image: imageRef(),
  order,
  published,
};

export const seasonSchema: Schema = {
  name: str({ required: true, max: 60 }),
  headline: str({ max: 200 }),
  description: str({ max: 600 }),
  icon: oneOf(ICON_NAMES),
  image: imageRef(),
  order,
  published,
};

export const pointSchema: Schema = {
  title: str({ required: true, max: 120 }),
  description: str({ max: 600 }),
  icon: oneOf(ICON_NAMES),
  order,
  published,
};

export const heroShowcaseSchema: Schema = {
  label: str({ required: true, max: 60 }),
  image: imageRef(),
  order,
  published,
};

export const pageImageSchema: Schema = {
  key: oneOf(PAGE_IMAGE_KEYS, { required: true }),
  label: str({ max: 120 }),
  image: imageRef(),
};

export const testimonialSchema: Schema = {
  quote: str({ required: true, max: 2000 }),
  author: str({ required: true, max: 120 }),
  role: str({ max: 120 }),
  location: str({ max: 120 }),
  service: str({ max: 120 }),
  order,
  published,
};

export const galleryItemSchema: Schema = {
  title: str({ max: 160 }),
  image: imageUrl(),
  alt: str({ max: 300 }),
  order,
  published,
};

export const siteSettingsSchema: Schema = {
  name: str({ required: true, max: 120 }),
  legalName: str({ max: 160 }),
  contactPerson: str({ max: 120 }),
  phone: str({ required: true, max: 40 }),
  email: str({ required: true, max: 160 }),
  city: str({ max: 80 }),
  region: str({ max: 20 }),
  regionName: str({ max: 80 }),
  country: str({ max: 20 }),
  countryName: str({ max: 80 }),
  serviceArea: str({ max: 200 }),
  tagline: str({ max: 300 }),
  description: str({ max: 2000 }),
  shortDescription: str({ max: 600 }),
  yearsExperience: str({ max: 20 }),
  scopeNoteTitle: str({ max: 200 }),
  scopeNoteDescription: str({ max: 2000 }),
  heroBadges: strArray({ max: 10, itemMax: 120 }),
  url: str({ max: 300 }),
};
