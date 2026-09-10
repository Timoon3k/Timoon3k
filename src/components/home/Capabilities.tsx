import Link from 'next/link';
import { SectionHeader } from '@/components/ui/Section';
import type { Service } from '@/lib/types';

export default function Capabilities({ services }: { services: Service[] }) {
  return (
    <section className="border-t border-hairline py-section">
      <div className="container-page">
        <SectionHeader
          eyebrow="Zakres usług"
          title="Co dokładnie mogę dla Ciebie zrobić"
          lead="Od prostej wizytówki po rozwiązania dedykowane. Zakres dobieramy do celu, nie do cennika — jeśli wystarczy mniej, mówię o tym wprost."
        />

        <div data-reveal-group className="mt-16 border-t border-hairline">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/oferta#${service.slug}`}
              data-reveal
              className="group grid gap-4 border-b border-hairline py-8 transition-colors duration-500 hover:bg-graphite/40 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint md:col-span-1">
                {service.index}
              </span>
              <h3 className="font-display text-[clamp(1.375rem,2.2vw,1.875rem)] font-semibold tracking-tight text-star transition-colors duration-500 group-hover:text-signal md:col-span-4">
                {service.title}
              </h3>
              <p className="text-dim md:col-span-5">{service.tagline}</p>
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase md:col-span-2 md:text-right">
                {service.priceFrom ? `od ${service.priceFrom.toLocaleString('pl-PL')} zł` : 'wycena indywidualna'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
