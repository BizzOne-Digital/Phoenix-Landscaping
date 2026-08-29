import Image from 'next/image';
import { seasons } from '@/lib/services';
import Icon from '@/components/Icon';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function FourSeasonSection() {
  return (
    <section className="section bg-burgundy-800">
      <div className="container">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow="Four Seasons"
            title="Property Care Through Every Season"
            intro="Phoenix Landscaping is not a summer-only landscaping company. The same crew looks after the property in February that looks after it in July."
          />
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {seasons.map((season, index) => (
            <Reveal as="li" key={season.name} delay={index * 100} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-burgundy-900/40 transition duration-500 hover:-translate-y-1 hover:border-gold/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={season.image.src}
                    alt={season.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-burgundy-900/85 to-transparent"
                  />
                  <span className="absolute bottom-4 left-5 flex items-center gap-2.5 font-serif text-xl font-semibold text-white">
                    <Icon name={season.icon} className="h-5 w-5 text-gold" />
                    {season.name}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[0.95rem] font-semibold text-gold-light">{season.headline}</h3>
                  <p className="mt-2 text-[0.87rem] leading-relaxed text-cream/80">
                    {season.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
