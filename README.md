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
npm run seed       # load the CMS content and the first admin account
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

> **Since the admin dashboard was added, these three files are the *starting*
> content, not the live content.** `npm run seed` copies them into MongoDB, and
> from then on the site reads from the database — so day-to-day edits happen at
> `/admin` (see section 14). These files remain the seed source and the fallback
> used when the database is unreachable, so keep them in step if you change
> them by hand.

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
  IntroSplash.tsx       Brand intro shown on a full page load
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
3. Add the environment variables from `.env.example` (sections 7 and 14)
4. Point the domain at the deployment and update `site.url`
5. Run `npm run seed` once against the production database

---

## 12. Content rules followed

No pricing, no invented testimonials, awards, certifications, statistics, client names,
guarantees, response times or service areas. Every claim on the site traces back to information
supplied by Phoenix Landscaping: 30+ years of industry experience, locally owned, family
operated, insured, WCB covered, serving Edmonton and surrounding communities.

---

## 13. Intro splash

`src/components/IntroSplash.tsx`, mounted once in `src/app/layout.tsx`. It is a purely
decorative brand intro: logo fades up, business name, tagline, then a thin gold progress line,
and the whole overlay cross-fades out to reveal the page.

- Total run time is about **2 seconds** (1.4s hold + 0.6s fade). Adjust `HOLD_MS` and `EXIT_MS`
  at the top of the file.
- It never waits on images, fonts or network requests — the timing is fixed, so a slow
  connection cannot leave a visitor stuck behind it.
- It shows on a **full page load only**. Moving between pages with the site navigation is a
  client-side transition, so the splash does not replay.
- Under `prefers-reduced-motion` it drops all movement, uses plain fades, and runs shorter.
- With JavaScript disabled it never renders at all.
- It removes itself from the DOM when finished, restores body scrolling, and leaves no wrapper
  behind — page layout after it disappears is byte-for-byte what it was before.

**To show it on the homepage only**, wrap the render in a pathname check:

```tsx
'use client';
import { usePathname } from 'next/navigation';
// ...inside the component, before the timers run:
const pathname = usePathname();
if (pathname !== '/') return null;
```

**To show it once per browser session** instead of on every load, guard the effect with
`sessionStorage.getItem('phx-splash-seen')` and set that key when the splash finishes.

---

## 14. Admin dashboard and CMS

The site content lives in MongoDB and is edited at **`/admin`**. The public
pages are unchanged — they simply read their copy, lists and photography from
the database instead of from `src/lib/*.ts`.

### First-time setup

1. Copy `.env.example` to `.env.local` and fill in `MONGODB_URI`,
   `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Use that output as `ADMIN_SESSION_SECRET`.

2. Load the content and create the admin account:

   ```bash
   npm run seed
   ```

   The seed is idempotent — running it again never duplicates content and never
   resets an existing password. Pass `--force-content` to reset the seeded
   documents back to the values in `src/lib/*.ts`.

3. Sign in at `/admin/login`. Remove `ADMIN_PASSWORD` from the environment once
   the account exists.

### What can be edited

| Screen | Controls |
| --- | --- |
| Site settings | Business name, phone, email, service area, tagline, descriptions, years of experience, hero badges, the job-scope notice |
| Services | The service pillars on the home page, services page and footer |
| Who we serve | The client-type cards |
| Four seasons | The four-season section |
| Trust points | The "Why Clients Stay" cards |
| Why choose us | The "Why Phoenix" grid |
| Testimonials | Real client feedback (empty by default, so the "reviews coming soon" panel stays) |
| Page photography | Each page's hero and feature photo, plus the home-page hero collage |
| Gallery | Job photography, published at `/api/gallery` |
| Media library | Every uploaded image, with folder filters and delete |

Saving an edit revalidates the affected public pages immediately; no redeploy
is needed. If the database is unreachable, the public site quietly falls back
to the bundled content in `src/lib/*.ts` rather than erroring.

Two things stay in code on purpose: `site.url` (it drives canonical URLs, the
sitemap and Open Graph tags, which are resolved at build time) and the quote
form's dropdown options in `src/lib/services.ts` (they are form logic, not
copy).

### Image uploads

Uploaded images are stored **as binary data in MongoDB**, not on disk, and are
served from `/api/uploads/{folder}/{filename}`. That is what makes them survive
Vercel redeployments, cold starts and multiple serverless instances — a
`public/uploads` folder would be wiped on every deploy.

- JPEG, PNG, WebP and GIF, up to 8 MB.
- The filename is generated on the server; the uploaded one is never trusted.
- Replacing or removing an image deletes the old binary once the new value is
  saved, so a failed upload never destroys the image that is still live.
- Legacy `/uploads/...` paths from any earlier filesystem-based scheme resolve
  to `/images/placeholder.png` instead of a broken image.

### Roles

`admin` can do everything. `editor` can manage content and upload images but
cannot change site settings or delete from the media library. Every admin API
route checks the session on the server and answers `401` when unauthenticated
and `403` when the role is not permitted — hiding a button in the dashboard is
never the only protection.
