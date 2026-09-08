'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AdminHeading,
  AdminLabel,
  AdminSpinner,
  inputClasses,
} from '@/components/admin/ui';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.success) {
        setError(payload.message ?? 'Those details are not correct.');
        setSubmitting(false);
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-7 shadow-sm">
        <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Phoenix Landscaping
        </p>
        <AdminHeading className="mt-1.5">Sign in to the dashboard</AdminHeading>
        <p className="mt-2 text-[0.85rem] text-slate-500">
          Content management for the public website.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error ? (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[0.85rem] text-red-700"
            >
              {error}
            </p>
          ) : null}

          <div>
            <AdminLabel htmlFor="admin-email">Email address</AdminLabel>
            <input
              id="admin-email"
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              disabled={submitting}
              onChange={(event) => setEmail(event.target.value)}
              className={`mt-1.5 ${inputClasses}`}
            />
          </div>

          <div>
            <AdminLabel htmlFor="admin-password">Password</AdminLabel>
            <input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              disabled={submitting}
              onChange={(event) => setPassword(event.target.value)}
              className={`mt-1.5 ${inputClasses}`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? <AdminSpinner /> : null}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-[0.78rem] text-slate-400">
          Accounts are created with <code className="text-slate-500">npm run seed</code>.
        </p>
      </div>
    </div>
  );
}
