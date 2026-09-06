import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import JobSiteVideo from '@/components/JobSiteVideo';

export default function CrewAtWorkSection() {
  return (
    <section className="section bg-burgundy-800">
      <div className="container">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow="On The Job"
            title="See the Crew at Work"
            intro="Real footage from a Phoenix Landscaping commercial project — the same crew, the same standard of work you get on your own property."
          />
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-12 max-w-4xl">
          <JobSiteVideo />
        </Reveal>
      </div>
    </section>
  );
}
