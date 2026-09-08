import type { Metadata } from 'next';
import SettingsForm from '@/components/admin/SettingsForm';
import { getVerifiedAdminSession } from '@/lib/auth/session';
import { getSiteSettings } from '@/lib/content';

export const metadata: Metadata = { title: 'Site settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [session, settings] = await Promise.all([getVerifiedAdminSession(), getSiteSettings()]);

  // Seeded from the live values so the form never renders empty, even before
  // the settings document exists.
  const initialValues = {
    name: settings.name,
    legalName: settings.legalName,
    contactPerson: settings.contactPerson,
    phone: settings.phone,
    email: settings.email,
    city: settings.city,
    region: settings.region,
    regionName: settings.regionName,
    country: settings.country,
    countryName: settings.countryName,
    serviceArea: settings.serviceArea,
    tagline: settings.tagline,
    description: settings.description,
    shortDescription: settings.shortDescription,
    yearsExperience: settings.yearsExperience,
    scopeNoteTitle: settings.scopeNote.title,
    scopeNoteDescription: settings.scopeNote.description,
    heroBadges: [...settings.heroBadges],
    url: settings.url,
  };

  return <SettingsForm initialValues={initialValues} canEdit={session?.role === 'admin'} />;
}
