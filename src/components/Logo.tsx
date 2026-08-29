import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';

/**
 * The Phoenix Landscaping logo.
 *
 * `logo-trimmed.png` is the client's `logo.png` with the transparent padding
 * removed, so it can sit snugly inside the white plate used on dark
 * backgrounds. If you replace the logo, replace both files (or point
 * LOGO_SRC at whichever file you want to use everywhere).
 */
const LOGO_SRC = '/images/logo-trimmed.png';
const LOGO_WIDTH = 564;
const LOGO_HEIGHT = 626;

type LogoProps = {
  /** Adds a white plate behind the logo, for dark or photographic backgrounds. */
  plate?: boolean;
  /** Wrap the logo in a link to the homepage. */
  href?: string | null;
  /** Tailwind height classes for the logo image itself. */
  sizeClassName?: string;
  className?: string;
  priority?: boolean;
};

export default function Logo({
  plate = false,
  href = null,
  sizeClassName = 'h-14 w-auto sm:h-[72px]',
  className = '',
  priority = false,
}: LogoProps) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt={`${site.name} logo`}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      className={`${sizeClassName} object-contain`}
    />
  );

  const content = plate ? (
    <span className="inline-flex items-center justify-center rounded-md bg-white p-2.5 shadow-card ring-1 ring-white/60">
      {image}
    </span>
  ) : (
    image
  );

  if (!href) {
    return <span className={`inline-flex ${className}`.trim()}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={`${site.name} — go to the homepage`}
      className={`inline-flex rounded-md transition-opacity duration-300 hover:opacity-90 ${className}`.trim()}
    >
      {content}
    </Link>
  );
}
