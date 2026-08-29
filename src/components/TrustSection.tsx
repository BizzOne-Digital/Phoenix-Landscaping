import { trustPoints } from '@/lib/site';
import Icon from '@/components/Icon';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function TrustSection() {
  return (
    <section className="section bg-warmwhite">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Why Clients Stay"
            title="Dependable Property Care, Season After Season"
            intro="The reasons Edmonton homeowners, boards and property managers keep Phoenix Landscaping on the schedule."
          />
        </Reveal>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {trustPoints.map((point, index) => (
            <Reveal as="li" key={point.title} delay={index * 80} className="h-full">
              <div className="card card-hover flex h-full flex-col p-6">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-sm border border-gold/40 bg-cream text-burgundy"
                >
                  <Icon name={point.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[1.02rem] font-semibold">{point.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{point.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
