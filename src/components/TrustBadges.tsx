import { Check } from 'lucide-react';
import { heroBadges } from '@/lib/site';

type TrustBadgesProps = {
  tone?: 'light' | 'dark';
  className?: string;
};

export default function TrustBadges({ tone = 'light', className = '' }: TrustBadgesProps) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2.5 ${className}`.trim()}>
      {heroBadges.map((badge) => (
        <li
          key={badge}
          className={`flex items-center gap-2 text-[0.82rem] font-medium ${
            tone === 'light' ? 'text-cream/90' : 'text-muted'
          }`}
        >
          <Check
            className={`h-4 w-4 shrink-0 ${tone === 'light' ? 'text-gold' : 'text-gold-dark'}`}
            strokeWidth={2.2}
            aria-hidden="true"
          />
          {badge}
        </li>
      ))}
    </ul>
  );
}
