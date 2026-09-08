import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/admin/LoginForm';
import { getVerifiedAdminSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // Already signed in? Skip the form.
  const session = await getVerifiedAdminSession();
  if (session) redirect('/admin');

  return <LoginForm />;
}
