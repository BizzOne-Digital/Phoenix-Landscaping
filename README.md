# Phoenix Landscaping — Website

Production-ready lead-generation website for **Phoenix Landscaping**, a locally owned and
family-operated landscaping and property-maintenance company serving Edmonton and surrounding
communities.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Lucide React**.

---

## 1. Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # run the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

Requires Node.js 18.17 or newer.

---

## 2. Pages

| Route           | Page         |
| --------------- | ------------ |
| `/`             | Home         |
| `/about`        | About Us     |
| `/services`     | Services     |
| `/testimonials` | Testimonials |
| `/contact`      | Contact + quote form (`/contact#quote`) |

Plus `sitemap.xml`, `robots.txt`, a 404 page, and the `POST /api/quote` form endpoint.

---

## 3. Where to change things

Almost everything the client will ever want to edit lives in three files.

### `src/lib/site.ts`
Business name, phone, email, service area, years of experience, live domain, navigation,
trust points and the "why choose us" list. **Set `site.url` to the real domain before launch** —
it drives canonical URLs, Open Graph tags and the sitemap.

### `src/lib/services.ts`
The four services (title, descriptions, benefits, suitable client types), the four client
audiences, the four seasons, and the dropdown options used by the quote form.

### `src/lib/images.ts`
Every photograph on the site, in one place.

---

## 4. The logo

Two files live in `public/images/`:

| File                | Used for |
| ------------------- | -------- |
| `logo.png`          | The original supplied artwork (kept as the master copy) |
| `logo-trimmed.png`  | The same logo with its transparent padding cropped off — this is what the site renders |

`src/components/Logo.tsx` is the single place the logo is rendered. It is used in two ways:

- **Header** — `<Logo href="/" priority />`, so clicking the logo returns to the homepage.
- **Footer** — `<Logo plate />`, which sits the logo on a small white plate. The logo artwork is
  burgundy, so on the burgundy footer it needs a light background to be visible. The plate hugs
  the logo because the trimmed file has no transparent padding.

To change the logo, replace both files (keeping the same names) or point `LOGO_SRC` at the top of
`Logo.tsx` at whichever file you want to use, and update `LOGO_WIDTH` / `LOGO_HEIGHT` to the new
image's pixel dimensions.

Sizes are controlled per usage with the `sizeClassName` prop, e.g. `sizeClassName="h-20 w-auto"`.

---

## 5. Swapping in real photography

The site currently uses free Unsplash photography (commercial use permitted, no attribution
required) so the design can be reviewed with real imagery. Replace it with Phoenix Landscaping's
own photos:

1. Put the file in `public/images/`, e.g. `public/images/hero.jpg`
2. In `src/lib/images.ts`, change that entry's `src` to `'/images/hero.jpg'`
3. Update the `alt` text to describe the new photo (this matters for SEO and accessibility)

Nothing else needs to change. Recommended sizes: hero and page headers about 2000px wide,
service and season images about 1200–1600px wide.

If you remove **all** Unsplash images you can also delete the `remotePatterns` block from
`next.config.mjs`.

---

## 6. Testimonials

`src/lib/testimonials.ts` is intentionally **empty**. No reviews were supplied, and publishing
invented testimonials would be dishonest and a legal risk.

While the array is empty, the homepage section and the Testimonials page show a tasteful
"Reviews Coming Soon" state. Add real entries to the array and both switch to the review layout
automatically — no other changes required.

```ts
export const testimonials: Testimonial[] = [
  {
    quote: 'Exactly what the client wrote, unedited.',
    author: 'Jane D.',
    role: 'Homeowner',        // optional
    location: 'Sherwood Park', // optional
    service: 'Snow Removal',   // optional
  },
];
```

---

## 7. Making the quote form send email

**Important: the form does not email anyone until this is configured.**

`src/app/api/quote/route.ts` validates each submission and is pre-wired for
[Resend](https://resend.com). Create a `.env.local` file:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
QUOTE_TO_EMAIL=jeff.bil@outlook.com
QUOTE_FROM_EMAIL=quotes@yourdomain.ca   # must be a verified sender on your domain
```

Set the same variables in your hosting dashboard (e.g. Vercel → Project → Settings →
Environment Variables) and redeploy.

Until they are set, submissions are validated and written to the server log with a warning, and
the visitor still sees the confirmation message — so **configure this before you start sending
traffic to the site**, or leads will not reach an inbox.

To use a different provider or push leads into a CRM instead, replace the single `fetch` call
inside that file. The rest of the form does not change.

The form also includes a hidden honeypot field that silently discards basic spam bots.

---

## 8. Brand colours

Defined as CSS variables in `src/app/globals.css` and as Tailwind tokens in `tailwind.config.ts`:

| Token           | Value     | Used for |
| --------------- | --------- | -------- |
| `burgundy`      | `#6E1F2A` | Buttons, headings, accents |
| `burgundy-700`  | `#4A141C` | Dark burgundy, footer, headings |
| `cream`         | `#F7F3EA` | Alternating section backgrounds |
| `warmwhite`     | `#FCFBF7` | Main background, cards |
| `gold`          | `#C8A96B` | Small accents, dividers, icons |
| `ink`           | `#292526` | Body text |
| `muted`         | `#6B6561` | Secondary text |

If the final logo differs, sample its colours and update both files — every component reads
from these tokens, so the whole site follows.

Typography: **Playfair Display** for headings, **Inter** for body and UI, both self-hosted
automatically by `next/font`.

---

## 9. Component map

```
src/components/
  Navbar.tsx            Sticky header + contact strip
  MobileMenu.tsx        Slide-in mobile navigation
  MobileQuoteBar.tsx    Sticky mobile quote / call bar
  Logo.tsx              Logo with typographic fallback
  Footer.tsx            Four-column footer
  ui/Button.tsx         PrimaryButton / SecondaryButton / SubmitButton
  Reveal.tsx            Scroll fade-up wrapper (respects reduced motion)
  Icon.tsx              Typed Lucide icon map
  SectionHeading.tsx    Eyebrow + heading + intro
  HeroSection.tsx       Homepage hero
  PageHero.tsx          Inner-page hero with breadcrumb
  TrustBadges.tsx       Experience / family / insured / WCB row
  TrustSection.tsx      Credibility section
  ServiceCard.tsx       Single service card
  ServiceGrid.tsx       Services overview section
  AudienceCard.tsx      Client-type card
  AudienceSection.tsx   "Who we serve" section
  WhyChooseUs.tsx       Differentiators
  FourSeasonSection.tsx Spring / summer / fall / winter
  AboutPreview.tsx      Homepage about block
  Testimonials.tsx      Reviews (with honest empty state)
  QuoteCTA.tsx          Full-width conversion band
  QuoteForm.tsx         Validated quote form
  ContactInfo.tsx       Phone / email / service area cards
  StructuredData.tsx    LocalBusiness JSON-LD
```

---

## 10. SEO, accessibility and performance

- Unique title and meta description per page, Open Graph and Twitter cards, canonical URLs
- `LocalBusiness` structured data containing only facts supplied by the business — no invented
  addresses, hours, ratings or prices
- Semantic HTML, one `H1` per page, logical heading order, skip-to-content link, visible focus
  states, labelled form fields with real error messages, 44px minimum tap targets
- `next/image` with AVIF/WebP, lazy loading below the fold, `priority` on hero images
- Animations respect `prefers-reduced-motion`; content is fully visible without JavaScript
- No pricing is published anywhere on the site, per the brief

**Before launch:** set `site.url`, add `public/favicon.ico`, and add an Open Graph image at
`public/og-image.jpg` (1200×630) referenced from `src/app/layout.tsx` if you want a custom
social preview.

---

## 11. Deploying

Any Next.js host works. The simplest path:

1. Push the folder to a Git repository
2. Import it into [Vercel](https://vercel.com) — the framework is detected automatically
3. Add the environment variables from section 7
4. Point the domain at the deployment and update `site.url`

---

## 12. Content rules followed

No pricing, no invented testimonials, awards, certifications, statistics, client names,
guarantees, response times or service areas. Every claim on the site traces back to information
supplied by Phoenix Landscaping: 30+ years of industry experience, locally owned, family
operated, insured, WCB covered, serving Edmonton and surrounding communities.
