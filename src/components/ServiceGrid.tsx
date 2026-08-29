import { services } from '@/lib/services';
import ServiceCard from '@/components/ServiceCard';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import { ButtonLink } from '@/components/ui/Button';

export default function ServiceGrid() {
  return (
    <section className="section bg-cream" id="services">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Our Services"
            title="Complete Property Care, All Year Round"
            intro="Phoenix Landscaping is a full-service property-care provider. One local, family-operated team looks after the grounds through every season, so nothing falls between contractors."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 90}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center">
          <ButtonLink href="/services" variant="secondary" size="lg">
            View All Services
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
