/**
 * Single source of truth for all Phoenix Landscaping business information.
 * Update values here and they change everywhere on the site.
 */

export const site = {
  name: 'Phoenix Landscaping',
  legalName: 'Phoenix Landscaping',
  contactPerson: 'Jeff',
  phone: '+1 780-399-5222',
  phoneHref: 'tel:+17803995222',
  email: 'jeff.bil@outlook.com',
  emailHref: 'mailto:jeff.bil@outlook.com',
  city: 'Edmonton',
  region: 'AB',
  regionName: 'Alberta',
  country: 'CA',
  countryName: 'Canada',
  serviceArea: 'Edmonton and surrounding communities',
  tagline: 'Reliable Four-Season Property Care in Edmonton and Area',
  description:
    'Locally owned and family-operated, Phoenix Landscaping provides dependable landscaping, property maintenance, snow removal, and seasonal cleanup services throughout Edmonton and surrounding communities.',
  shortDescription:
    'Locally owned and family-operated property care serving Edmonton and surrounding communities.',
  yearsExperience: '30+',
  /** Replace with the live domain before launch — used for canonicals, OG tags and the sitemap. */
  url: 'https://www.phoenixlandscaping.ca',
} as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
] as const;

export const trustPoints = [
  {
    title: '30+ Years of Experience',
    description: 'More than three decades of industry experience behind every property we care for.',
    icon: 'Award',
  },
  {
    title: 'Family Operated',
    description: 'A locally owned Edmonton business committed to personal, hands-on service.',
    icon: 'Users',
  },
  {
    title: 'Insured',
    description: 'Active insurance coverage for added client confidence on every property.',
    icon: 'ShieldCheck',
  },
  {
    title: 'WCB Covered',
    description: 'Active WCB coverage, so your property is in properly protected hands.',
    icon: 'BadgeCheck',
  },
  {
    title: 'Local Edmonton Business',
    description: 'Serving Edmonton and surrounding communities through every season.',
    icon: 'MapPin',
  },
] as const;

export const heroBadges = [
  '30+ Years of Industry Experience',
  'Family Operated',
  'Insured',
  'WCB Covered',
] as const;

export const whyChoose = [
  {
    title: 'Three Decades of Experience',
    description:
      'More than 30 years in the industry means fewer surprises, better planning, and work that holds up season after season.',
    icon: 'Award',
  },
  {
    title: 'Locally Owned and Family Operated',
    description:
      'You deal directly with the people responsible for the work — not a call centre or a rotating roster of subcontractors.',
    icon: 'Home',
  },
  {
    title: 'Reliable Communication',
    description:
      'Clear answers, straightforward scheduling, and updates you do not have to chase.',
    icon: 'MessageSquare',
  },
  {
    title: 'Quality Workmanship',
    description:
      'Careful, consistent work on every visit, whether it is a single residence or a managed portfolio.',
    icon: 'Sparkles',
  },
  {
    title: 'Year-Round Property Care',
    description:
      'Landscaping, maintenance, seasonal cleanup and snow removal from one dependable local team.',
    icon: 'CalendarRange',
  },
  {
    title: 'Residential and Commercial Experience',
    description:
      'Comfortable with homeowners, condominium boards, businesses and property managers alike.',
    icon: 'Building2',
  },
  {
    title: 'Insured and WCB Covered',
    description:
      'Active insurance and WCB coverage — the documentation property managers and boards expect.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Edmonton and Surrounding Communities',
    description:
      'A local crew that knows Alberta conditions and plans property care around them.',
    icon: 'MapPin',
  },
] as const;
