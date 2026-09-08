'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  CalendarRange,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import { AdminButton, AdminSpinner } from '@/components/admin/ui';
import { useToast } from '@/components/admin/ToastProvider';

const navSections = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/services', label: 'Services', icon: Wrench },
      { href: '/admin/audiences', label: 'Who we serve', icon: Users },
      { href: '/admin/seasons', label: 'Four seasons', icon: CalendarRange },
      { href: '/admin/trust-points', label: 'Trust points', icon: ShieldCheck },
      { href: '/admin/why-choose', label: 'Why choose us', icon: Sparkles },
      { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    ],
  },
  {
    label: 'Media',
    items: [
      { href: '/admin/photography', label: 'Page photography', icon: ImageIcon },
      { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
      { href: '/admin/media', label: 'Media library', icon: ImageIcon },
    ],
  },
  {
    label: 'Business',
    items: [{ href: '/admin/settings', label: 'Site settings', icon: Settings }],
  },
] as const;

type AdminShellProps = {
  children: ReactNode;
  user: { name: string; email: string; role: string };
};

export default function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.replace('/admin/login');
      router.refresh();
    } catch {
      toast('Could not sign out. Please try again.', 'error');
      setSigningOut(false);
    }
  }

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col">
      <div className="px-5 py-5">
        <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Phoenix Landscaping
        </p>
        <p className="mt-1 font-sans text-sm font-semibold text-white">Content dashboard</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-3 pb-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {section.label}
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                const ItemIcon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[0.85rem] transition ${
                        active
                          ? 'bg-slate-800 font-medium text-white'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-800 px-4 py-4">
        <p className="truncate font-sans text-[0.82rem] font-medium text-white">{user.name}</p>
        <p className="truncate text-[0.75rem] text-slate-400">{user.email}</p>
        <p className="mt-0.5 text-[0.7rem] uppercase tracking-wide text-slate-500">{user.role}</p>

        <button
          type="button"
          onClick={() => void signOut()}
          disabled={signingOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-[0.82rem] text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
        >
          {signingOut ? <AdminSpinner /> : <LogOut className="h-3.5 w-3.5" aria-hidden="true" />}
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 bg-slate-900 lg:block">{sidebar}</aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-900/50"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <AdminButton variant="secondary" size="sm" onClick={() => setMenuOpen(true)}>
            <Menu className="h-4 w-4" aria-hidden="true" />
            Menu
          </AdminButton>
          <span className="font-sans text-sm font-semibold text-slate-900">Dashboard</span>
          <Link
            href="/"
            className="ml-auto text-[0.8rem] font-medium text-slate-500 underline-offset-2 hover:underline"
          >
            View site
          </Link>
        </header>

        <div className="hidden items-center justify-end gap-3 border-b border-slate-200 bg-white px-6 py-3 lg:flex">
          <Link
            href="/"
            className="text-[0.82rem] font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            View public site
          </Link>
        </div>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>

    </div>
  );
}
