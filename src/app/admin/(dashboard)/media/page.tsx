import type { Metadata } from 'next';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { getVerifiedAdminSession } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Media library' };
export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const session = await getVerifiedAdminSession();

  // The API enforces this too; the UI just avoids offering a 403.
  return <MediaLibrary canDelete={session?.role === 'admin'} />;
}
