import { whyChoose } from '@/lib/site';
import Icon from '@/components/Icon';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';

export default function WhyChooseUs() {
  return (
    <section className="section bg-cream">
      <div className="container">
        <Reveal>
          <SectionHeading
            eyebrow="Why Phoenix"
            title="Why Edmonton Chooses Phoenix Landscaping"
            intro="No gimmicks and no overpromising — just the things that actually matter when you are trusting someone with your property."
          />
        </Reveal>

        <ul className="mt-12 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {whyChoose.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 70}>
              <div className="flex flex-col">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-sm bg-burgundy text-cream"
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[1rem] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
