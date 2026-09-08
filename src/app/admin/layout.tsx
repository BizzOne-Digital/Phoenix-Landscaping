import type { Metadata } from 'next';
import { ToastProvider } from '@/components/admin/ToastProvider';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Admin area shell.
 *
 * Deliberately free of the public site's chrome — `SiteChrome` in the root
 * layout hides the navbar, footer and mobile quote bar for `/admin` routes.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
