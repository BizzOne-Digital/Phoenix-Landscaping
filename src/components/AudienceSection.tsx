import { audiences } from '@/lib/services';
import AudienceCard from '@/components/AudienceCard';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { ButtonLink } from '@/components/ui/Button';

export default function AudienceSection() {
  return (
    <section className="section bg-warmwhite">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Who We Serve"
            title="Property Care for Every Type of Client"
            intro="From a single home to a managed portfolio, the same standard of work and the same people behind it."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 90} className="h-full">
              <AudienceCard audience={audience} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <ButtonLink href="/contact#quote" size="lg">
            Request a Free Quote
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
