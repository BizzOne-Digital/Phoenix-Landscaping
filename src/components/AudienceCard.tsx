import Image from 'next/image';
import Icon from '@/components/Icon';
import type { Audience } from '@/lib/services';

export default function AudienceCard({ audience }: { audience: Audience }) {
  return (
    <article className="group relative isolate flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-card border border-line shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-lift">
      <Image
        src={audience.image.src}
        alt={audience.image.alt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-burgundy-900/95 via-burgundy-900/55 to-burgundy-900/10 transition-opacity duration-500 group-hover:from-burgundy-900/95"
      />

      <div className="p-6">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/50 bg-white/10 text-gold-light backdrop-blur-sm"
        >
          <Icon name={audience.icon} className="h-5 w-5" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-white">{audience.title}</h3>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-cream/85">{audience.description}</p>
      </div>
    </article>
  );
}
