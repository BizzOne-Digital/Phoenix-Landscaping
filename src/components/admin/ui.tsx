'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Dashboard primitives.
 *
 * The public site's global base styles give every heading the burgundy serif
 * treatment, so admin headings set their own font and colour explicitly. None
 * of this touches the public theme.
 */

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

export function AdminButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
    className?: string;
  }) {
  const sizing = size === 'sm' ? 'px-2.5 py-1.5 text-[0.8rem]' : 'px-4 py-2';
  return (
    <button
      type="button"
      className={`${buttonBase} ${buttonVariants[variant]} ${sizing} ${className}`.trim()}
      {...rest}
    >
      {children}
    </button>
  );
}

export function AdminHeading({
  children,
  as: Tag = 'h1',
  className = '',
}: {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  const size = Tag === 'h1' ? 'text-xl sm:text-2xl' : Tag === 'h2' ? 'text-lg' : 'text-base';
  return (
    <Tag className={`font-sans font-semibold text-slate-900 ${size} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

export function AdminCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function AdminLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-[0.8rem] font-medium text-slate-700">
      {children}
      {hint ? <span className="ml-1.5 font-normal text-slate-400">{hint}</span> : null}
    </label>
  );
}

export const inputClasses =
  'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:bg-slate-50';

export function AdminFieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[0.78rem] text-red-600">{message}</p>;
}

export function AdminBadge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'success' | 'warning';
}) {
  const tones = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function AdminEmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="px-6 py-14 text-center">
      <p className="font-sans text-sm font-semibold text-slate-700">{title}</p>
      {description ? <p className="mt-1.5 text-[0.85rem] text-slate-500">{description}</p> : null}
    </div>
  );
}

export function AdminSpinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`.trim()}
    />
  );
}
