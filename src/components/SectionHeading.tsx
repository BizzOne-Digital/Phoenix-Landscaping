import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'default' | 'light';
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'center',
  tone = 'default',
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={`${centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`.trim()}
    >
      {eyebrow ? (
        <p
          className={`inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${
            tone === 'light' ? 'text-gold-light' : 'text-burgundy'
          }`}
        >
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}

      <Tag
        className={`mt-4 text-[1.75rem] font-semibold leading-[1.15] sm:text-[2.1rem] lg:text-[2.4rem] ${
          tone === 'light' ? 'text-white' : ''
        }`}
      >
        {title}
      </Tag>

      {intro ? (
        <div
          className={`mt-4 text-[1.02rem] leading-relaxed ${
            tone === 'light' ? 'text-cream/85' : 'text-muted'
          }`}
        >
          {intro}
        </div>
      ) : null}
    </div>
  );
}
