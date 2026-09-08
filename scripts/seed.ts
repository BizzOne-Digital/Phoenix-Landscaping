/**
 * Idempotent database seed.
 *
 *   npm run seed
 *
 * Copies the content that currently ships in `src/lib/*.ts` into MongoDB so
 * the dashboard has something to manage, and creates the first admin account
 * from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Safe to run repeatedly: every write is an upsert keyed on a natural
 * identifier and uses `$setOnInsert`, so re-seeding never duplicates records
 * and never overwrites an edit made in the dashboard. Pass `--force-content`
 * to reset the seeded documents back to the bundled values.
 */

import { config as loadEnv } from 'dotenv';
import mongoose from 'mongoose';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { connectToDatabase } from '../src/lib/db/mongoose';
import {
  AdminUser,
  Audience,
  HeroShowcaseItem,
  PageImage,
  Season,
  Service,
  SiteSettings,
  SITE_SETTINGS_KEY,
  TrustPoint,
  WhyChooseItem,
  type AnyContentModel,
} from '../src/lib/db/models';
import { hashPassword } from '../src/lib/auth/password';
import { audiences, seasons, services } from '../src/lib/services';
import { heroShowcase, images } from '../src/lib/images';
import { heroBadges, site, trustPoints, whyChoose } from '../src/lib/site';

const forceContent = process.argv.includes('--force-content');

type Counts = { created: number; updated: number; skipped: number };

function newCounts(): Counts {
  return { created: 0, updated: 0, skipped: 0 };
}

/**
 * Upserts one document. New records get the full payload; existing records
 * are left alone unless `--force-content` was passed.
 */
async function upsert(
  model: AnyContentModel,
  filter: Record<string, unknown>,
  payload: Record<string, unknown>,
  counts: Counts,
): Promise<void> {
  const existing = await model.exists(filter);

  if (!existing) {
    await model.create({ ...filter, ...payload });
    counts.created += 1;
    return;
  }

  if (forceContent) {
    await model.updateOne(filter, { $set: payload });
    counts.updated += 1;
    return;
  }

  counts.skipped += 1;
}

function report(label: string, counts: Counts): void {
  console.log(
    `  ${label.padEnd(20)} created ${counts.created}, updated ${counts.updated}, unchanged ${counts.skipped}`,
  );
}

async function seedSiteSettings(): Promise<void> {
  const counts = newCounts();

  await upsert(
    SiteSettings,
    { key: SITE_SETTINGS_KEY },
    {
      name: site.name,
      legalName: site.legalName,
      contactPerson: site.contactPerson,
      phone: site.phone,
      email: site.email,
      city: site.city,
      region: site.region,
      regionName: site.regionName,
      country: site.country,
      countryName: site.countryName,
      serviceArea: site.serviceArea,
      tagline: site.tagline,
      description: site.description,
      shortDescription: site.shortDescription,
      yearsExperience: site.yearsExperience,
      scopeNoteTitle: site.scopeNote.title,
      scopeNoteDescription: site.scopeNote.description,
      heroBadges: [...heroBadges],
      url: site.url,
    },
    counts,
  );

  report('site settings', counts);
}

async function seedServices(): Promise<void> {
  const counts = newCounts();

  for (const [index, service] of services.entries()) {
    await upsert(
      Service,
      { slug: service.slug },
      {
        title: service.title,
        shortDescription: service.shortDescription,
        longDescription: service.longDescription,
        benefits: [...service.benefits],
        suitableFor: [...service.suitableFor],
        icon: service.icon,
        image: { src: service.image.src, alt: service.image.alt },
        order: index,
        published: true,
      },
      counts,
    );
  }

  report('services', counts);
}

async function seedAudiences(): Promise<void> {
  const counts = newCounts();

  for (const [index, audience] of audiences.entries()) {
    await upsert(
      Audience,
      { title: audience.title },
      {
        description: audience.description,
        icon: audience.icon,
        image: { src: audience.image.src, alt: audience.image.alt },
        order: index,
        published: true,
      },
      counts,
    );
  }

  report('audiences', counts);
}

async function seedSeasons(): Promise<void> {
  const counts = newCounts();

  for (const [index, season] of seasons.entries()) {
    await upsert(
      Season,
      { name: season.name },
      {
        headline: season.headline,
        description: season.description,
        icon: season.icon,
        image: { src: season.image.src, alt: season.image.alt },
        order: index,
        published: true,
      },
      counts,
    );
  }

  report('seasons', counts);
}

async function seedTrustPoints(): Promise<void> {
  const counts = newCounts();

  for (const [index, point] of trustPoints.entries()) {
    await upsert(
      TrustPoint,
      { title: point.title },
      { description: point.description, icon: point.icon, order: index, published: true },
      counts,
    );
  }

  report('trust points', counts);
}

async function seedWhyChoose(): Promise<void> {
  const counts = newCounts();

  for (const [index, item] of whyChoose.entries()) {
    await upsert(
      WhyChooseItem,
      { title: item.title },
      { description: item.description, icon: item.icon, order: index, published: true },
      counts,
    );
  }

  report('why choose us', counts);
}

async function seedHeroShowcase(): Promise<void> {
  const counts = newCounts();

  for (const [index, item] of heroShowcase.entries()) {
    await upsert(
      HeroShowcaseItem,
      { label: item.label },
      {
        image: { src: item.src, alt: item.alt },
        order: index,
        published: true,
      },
      counts,
    );
  }

  report('hero collage', counts);
}

async function seedPageImages(): Promise<void> {
  const counts = newCounts();

  const slots = [
    { key: 'hero', label: 'Home hero background', image: images.hero },
    { key: 'aboutPortrait', label: 'About feature photo', image: images.aboutPortrait },
    { key: 'servicesHero', label: 'Services page hero', image: images.servicesHero },
    { key: 'contactHero', label: 'Contact page hero', image: images.contactHero },
    { key: 'testimonialsHero', label: 'Testimonials page hero', image: images.testimonialsHero },
    { key: 'aboutHero', label: 'About page hero', image: images.aboutHero },
  ] as const;

  for (const slot of slots) {
    await upsert(
      PageImage,
      { key: slot.key },
      { label: slot.label, image: { src: slot.image.src, alt: slot.image.alt } },
      counts,
    );
  }

  report('page photography', counts);
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || 'Site Administrator';

  if (!email || !password) {
    console.log(
      '  admin account        skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)',
    );
    return;
  }

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters long.');
  }

  const existing = await AdminUser.findOne({ email }).select('_id');

  if (existing) {
    // Never silently reset a password that is already in use.
    console.log(`  admin account        unchanged (${email} already exists)`);
    return;
  }

  await AdminUser.create({
    email,
    name,
    passwordHash: await hashPassword(password),
    role: 'admin',
    active: true,
  });

  console.log(`  admin account        created (${email})`);
}

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.');
  }

  console.log(
    forceContent
      ? 'Seeding MongoDB (--force-content: bundled values will overwrite seeded documents)...'
      : 'Seeding MongoDB (existing records are left untouched)...',
  );

  await connectToDatabase();

  await seedSiteSettings();
  await seedServices();
  await seedAudiences();
  await seedSeasons();
  await seedTrustPoints();
  await seedWhyChoose();
  await seedHeroShowcase();
  await seedPageImages();
  await seedAdminUser();

  // Testimonials are intentionally not seeded: the site publishes real client
  // feedback only, and none has been supplied.

  console.log('Done.');
}

main()
  .catch((error: unknown) => {
    console.error('\nSeed failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    void mongoose.disconnect();
  });
