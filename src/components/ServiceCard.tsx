import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Icon from '@/components/Icon';
import type { Service } from '@/lib/services';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-cream">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-sm bg-burgundy/95 text-cream shadow-card"
        >
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold">{service.title}</h3>
        <p className="mt-2.5 flex-1 text-[0.92rem] leading-relaxed text-muted">
          {service.shortDescription}
        </p>
        <Link
          href={`/services#${service.slug}`}
          className="link-underline mt-5 text-[0.88rem]"
          aria-label={`Learn more about ${service.title}`}
        >
          Learn More
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
