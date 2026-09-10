import { Eyebrow } from '@/components/ui/Section';
import type { Testimonial } from '@/lib/types';

/**
 * Sekcja renderuje się wyłącznie wtedy, gdy w CMS istnieją prawdziwe opinie.
 * Świadomie nie zawiera treści zastępczych — wymyślone referencje byłyby
 * wprowadzaniem w błąd.
 */
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section className="border-t border-hairline py-section">
      <div className="container-page">
        <Eyebrow>Opinie klientów</Eyebrow>
        <div data-reveal-group className="mt-14 grid gap-12 md:grid-cols-2 lg:gap-16">
          {testimonials.map((item) => (
            <figure key={item.author} data-reveal className="border-t border-hairline pt-8">
              <blockquote className="font-display text-[clamp(1.25rem,1.9vw,1.625rem)] leading-snug font-medium tracking-tight text-star">
                „{item.quote}”
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-medium text-star">{item.author}</span>
                <span className="text-sm text-dim">{item.role}</span>
                <span className="font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                  źródło: {item.source}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
