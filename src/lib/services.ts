import { images, type SiteImage } from '@/lib/images';
import type { IconName } from '@/components/Icon';

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  benefits: string[];
  suitableFor: string[];
  icon: IconName;
  image: SiteImage;
};

export const services: Service[] = [
  {
    slug: 'landscaping',
    title: 'Landscaping',
    shortDescription:
      'Professional landscaping and property improvement services that make a property look cared for from the curb in.',
    longDescription:
      'Phoenix Landscaping handles landscaping and property improvement work for homeowners, condominium properties, businesses and managed portfolios across Edmonton and surrounding communities. With more than 30 years of industry experience behind the work, the focus is on results that suit the property, hold up to Alberta conditions, and stay manageable over the long term.',
    benefits: [
      'Improves curb appeal and first impressions',
      'Work planned around how the property is actually used',
      'Experienced crews with three decades of industry background',
      'One local team for landscaping and ongoing care',
    ],
    suitableFor: ['Residential', 'Condominium', 'Commercial', 'Property Management'],
    icon: 'Sprout',
    image: images.services.landscaping,
  },
  {
    slug: 'property-maintenance',
    title: 'Property Maintenance',
    shortDescription:
      'Reliable ongoing maintenance for residential, condominium, commercial and managed properties.',
    longDescription:
      'Ongoing maintenance is where consistency matters most. Phoenix Landscaping provides dependable, scheduled property maintenance so grounds stay presentable without anyone having to chase the work. It is a practical fit for condominium boards, property managers and business owners who need the same standard applied visit after visit.',
    benefits: [
      'Consistent standards on every visit',
      'Straightforward scheduling and communication',
      'Suited to single properties or multi-property portfolios',
      'Active insurance and WCB coverage',
    ],
    suitableFor: ['Residential', 'Condominium', 'Commercial', 'Property Management'],
    icon: 'ClipboardCheck',
    image: images.services.maintenance,
  },
  {
    slug: 'snow-removal',
    title: 'Snow Removal',
    shortDescription:
      'Dependable winter property care and snow removal through the Edmonton winter.',
    longDescription:
      'Winter is not an afterthought at Phoenix Landscaping. Snow removal and winter property care are part of the same four-season relationship, which means the crew clearing your property already knows its layout, access points and problem areas from the rest of the year.',
    benefits: [
      'Keeps access ways usable through the winter months',
      'Handled by a crew already familiar with your property',
      'Residential, condominium and commercial sites',
      'Part of a continuous year-round service relationship',
    ],
    suitableFor: ['Residential', 'Condominium', 'Commercial', 'Property Management'],
    icon: 'Snowflake',
    image: images.services.snow,
  },
  {
    slug: 'seasonal-cleanup',
    title: 'Seasonal Cleanup',
    shortDescription:
      'Property cleanup that keeps grounds looking maintained through every seasonal transition.',
    longDescription:
      'Spring and fall are the turning points for any Alberta property. Seasonal cleanup clears away what the previous season left behind and prepares the grounds for what is coming next, so the property looks maintained year-round rather than only in mid-summer.',
    benefits: [
      'Properties look cared for between seasons, not just during them',
      'Prepares grounds for the season ahead',
      'Available as a one-time service or part of ongoing care',
      'Suited to homes, condominium grounds and commercial sites',
    ],
    suitableFor: ['Residential', 'Condominium', 'Commercial', 'Property Management'],
    icon: 'Leaf',
    image: images.services.cleanup,
  },
];

export type Audience = {
  title: string;
  description: string;
  icon: IconName;
  image: SiteImage;
};

export const audiences: Audience[] = [
  {
    title: 'Residential',
    description: 'Dependable property care for homeowners who want the work done properly the first time.',
    icon: 'Home',
    image: images.audiences.residential,
  },
  {
    title: 'Condominiums',
    description: 'Reliable maintenance solutions for condominium properties and the boards that oversee them.',
    icon: 'Building2',
    image: images.audiences.condominium,
  },
  {
    title: 'Commercial',
    description: 'Professional property care for commercial properties and businesses that need to look the part.',
    icon: 'Briefcase',
    image: images.audiences.commercial,
  },
  {
    title: 'Property Management',
    description: 'Dependable ongoing support for property managers and multi-property portfolios.',
    icon: 'KeyRound',
    image: images.audiences.propertyManagement,
  },
];

export type Season = {
  name: string;
  headline: string;
  description: string;
  icon: IconName;
  image: SiteImage;
};

export const seasons: Season[] = [
  {
    name: 'Spring',
    headline: 'Seasonal cleanup and property preparation',
    description: 'Clearing away winter and getting the property ready for the growing season ahead.',
    icon: 'Sprout',
    image: images.seasons.spring,
  },
  {
    name: 'Summer',
    headline: 'Landscaping and ongoing property maintenance',
    description: 'Consistent maintenance and landscaping work through the busiest months of the year.',
    icon: 'Sun',
    image: images.seasons.summer,
  },
  {
    name: 'Fall',
    headline: 'Seasonal property cleanup and preparation',
    description: 'Cleanup and preparation so the property heads into winter in good shape.',
    icon: 'Leaf',
    image: images.seasons.fall,
  },
  {
    name: 'Winter',
    headline: 'Snow removal and winter property care',
    description: 'Dependable snow removal and winter property care right through the Edmonton season.',
    icon: 'Snowflake',
    image: images.seasons.winter,
  },
];

export const propertyTypes = [
  'Residential',
  'Condominium',
  'Commercial',
  'Property Management',
  'Other',
] as const;

export const serviceOptions = [
  'Landscaping',
  'Property Maintenance',
  'Snow Removal',
  'Seasonal Cleanup',
  'Multiple Services',
  'Other',
] as const;
