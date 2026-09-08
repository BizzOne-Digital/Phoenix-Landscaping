import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getVerifiedAdminSession } from '@/lib/auth/session';

/**
 * Server-side gate for every dashboard page.
 *
 * Hiding UI is never the only protection — each admin API route re-checks the
 * session independently and answers 401/403 on its own.
 */
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getVerifiedAdminSession();
  if (!session) redirect('/admin/login');

  return (
    <AdminShell user={{ name: session.name, email: session.email, role: session.role }}>
      {children}
    </AdminShell>
  );
}
