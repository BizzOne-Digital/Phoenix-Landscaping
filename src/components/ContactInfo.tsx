import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { site } from '@/lib/site';

const items = [
  {
    label: 'Phone',
    value: site.phone,
    href: site.phoneHref,
    icon: Phone,
    note: 'Call or text to talk through your property.',
  },
  {
    label: 'Email',
    value: site.email,
    href: site.emailHref,
    icon: Mail,
    note: 'Send details and photos of your property.',
  },
  {
    label: 'Service Area',
    value: site.serviceArea,
    href: null,
    icon: MapPin,
    note: 'Residential, condominium, commercial and managed properties.',
  },
  {
    label: 'Year-Round Service',
    value: 'Spring, summer, fall and winter',
    href: null,
    icon: Clock,
    note: 'Landscaping, maintenance, cleanup and snow removal.',
  },
];

export default function ContactInfo({ className = '' }: { className?: string }) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${className}`.trim()}>
      {items.map((item) => {
        const ItemIcon = item.icon;
        return (
          <li key={item.label} className="card p-6">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-sm border border-gold/40 bg-cream text-burgundy"
            >
              <ItemIcon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
              {item.label}
            </p>
            {item.href ? (
              <a
                href={item.href}
                className="mt-1.5 block break-words text-[1.02rem] font-semibold text-burgundy-700 transition-colors hover:text-burgundy"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-1.5 text-[1.02rem] font-semibold text-burgundy-700">{item.value}</p>
            )}
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{item.note}</p>
          </li>
        );
      })}
    </ul>
  );
}
