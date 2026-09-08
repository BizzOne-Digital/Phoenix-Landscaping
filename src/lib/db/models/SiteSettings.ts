import { Schema, model, models, type Model, type InferSchemaType } from 'mongoose';

/**
 * Singleton document mirroring `src/lib/site.ts`.
 * `key` is fixed to 'default' so the document can never be duplicated.
 */
const siteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    name: { type: String, default: '' },
    legalName: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    city: { type: String, default: '' },
    region: { type: String, default: '' },
    regionName: { type: String, default: '' },
    country: { type: String, default: '' },
    countryName: { type: String, default: '' },
    serviceArea: { type: String, default: '' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    yearsExperience: { type: String, default: '' },
    scopeNoteTitle: { type: String, default: '' },
    scopeNoteDescription: { type: String, default: '' },
    heroBadges: { type: [String], default: [] },
    url: { type: String, default: '' },
  },
  { timestamps: true, collection: 'site_settings' },
);

export type SiteSettingsDoc = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettings: Model<SiteSettingsDoc> =
  (models.SiteSettings as Model<SiteSettingsDoc>) ??
  model<SiteSettingsDoc>('SiteSettings', siteSettingsSchema);

export const SITE_SETTINGS_KEY = 'default';
