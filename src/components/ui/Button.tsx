import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary:
    'bg-burgundy text-white shadow-card hover:bg-burgundy-700 hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'border border-burgundy/25 bg-transparent text-burgundy hover:border-burgundy hover:bg-burgundy/5',
  ghost:
    'border border-white/40 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20',
  inverse:
    'bg-cream text-burgundy-700 shadow-card hover:bg-white hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0',
};

const sizes: Record<Size, string> = {
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[52px] px-7 py-3 text-[0.95rem]',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(' ');
}

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>;

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonLinkProps) {
  const isExternal =
    href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http');
  const classes = buttonClasses(variant, size, className);

  if (isExternal) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

export function PrimaryButton(props: Omit<ButtonLinkProps, 'variant'>) {
  return <ButtonLink {...props} variant="primary" />;
}

export function SecondaryButton(props: Omit<ButtonLinkProps, 'variant'>) {
  return <ButtonLink {...props} variant="secondary" />;
}

type SubmitButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>;

export function SubmitButton({
  children,
  variant = 'primary',
  size = 'lg',
  className,
  ...rest
}: SubmitButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
