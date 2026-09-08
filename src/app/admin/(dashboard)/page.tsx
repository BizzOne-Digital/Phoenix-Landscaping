import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, DatabaseZap } from 'lucide-react';
import { AdminCard, AdminHeading } from '@/components/admin/ui';
import { connectToDatabase, isDatabaseConfigured } from '@/lib/db/mongoose';
import {
  Audience,
  GalleryItem,
  HeroShowcaseItem,
  Season,
  Service,
  StoredUpload,
  Testimonial,
  TrustPoint,
  WhyChooseItem,
} from '@/lib/db/models';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

type Stat = { label: string; count: number | null; href: string };

async function loadStats(): Promise<{ stats: Stat[]; connected: boolean }> {
  const blank: Stat[] = [
    { label: 'Services', count: null, href: '/admin/services' },
    { label: 'Audiences', count: null, href: '/admin/audiences' },
    { label: 'Seasons', count: null, href: '/admin/seasons' },
    { label: 'Trust points', count: null, href: '/admin/trust-points' },
    { label: 'Why choose us', count: null, href: '/admin/why-choose' },
    { label: 'Testimonials', count: null, href: '/admin/testimonials' },
    { label: 'Hero collage', count: null, href: '/admin/photography' },
    { label: 'Gallery images', count: null, href: '/admin/gallery' },
    { label: 'Stored uploads', count: null, href: '/admin/media' },
  ];

  if (!isDatabaseConfigured()) return { stats: blank, connected: false };

  try {
    await connectToDatabase();

    const [
      services,
      audiences,
      seasons,
      trustPoints,
      whyChoose,
      testimonials,
      heroShowcase,
      gallery,
      uploads,
    ] = await Promise.all([
      Service.countDocuments({}),
      Audience.countDocuments({}),
      Season.countDocuments({}),
      TrustPoint.countDocuments({}),
      WhyChooseItem.countDocuments({}),
      Testimonial.countDocuments({}),
      HeroShowcaseItem.countDocuments({}),
      GalleryItem.countDocuments({}),
      StoredUpload.countDocuments({}),
    ]);

    const counts = [
      services,
      audiences,
      seasons,
      trustPoints,
      whyChoose,
      testimonials,
      heroShowcase,
      gallery,
      uploads,
    ];

    return {
      stats: blank.map((stat, index) => ({ ...stat, count: counts[index] })),
      connected: true,
    };
  } catch (error) {
    console.error('[admin] Could not load dashboard counts:', error);
    return { stats: blank, connected: false };
  }
}

export default async function AdminDashboardPage() {
  const { stats, connected } = await loadStats();

  return (
    <div className="space-y-6">
      <div>
        <AdminHeading>Dashboard</AdminHeading>
        <p className="mt-1 max-w-2xl text-[0.85rem] text-slate-500">
          Everything the public website reads from the database. Edits go live as soon as they are
          saved.
        </p>
      </div>

      <AdminCard className="flex flex-wrap items-center gap-3 p-4">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-md ${
            connected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
          aria-hidden="true"
        >
          {connected ? (
            <DatabaseZap className="h-4 w-4" strokeWidth={1.7} />
          ) : (
            <Database className="h-4 w-4" strokeWidth={1.7} />
          )}
        </span>
        <div>
          <p className="font-sans text-[0.88rem] font-medium text-slate-900">
            {connected ? 'Connected to MongoDB' : 'MongoDB is not reachable'}
          </p>
          <p className="text-[0.8rem] text-slate-500">
            {connected
              ? 'Content is being served from the database.'
              : 'The public site is falling back to its bundled content. Check MONGODB_URI, then run npm run seed.'}
          </p>
        </div>
      </AdminCard>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label}>
            <Link
              href={stat.href}
              className="flex h-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              <span>
                <span className="block text-[0.78rem] font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </span>
                <span className="mt-1 block font-sans text-2xl font-semibold text-slate-900">
                  {stat.count ?? '—'}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
