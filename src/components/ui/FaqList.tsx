import { Eyebrow } from '@/components/ui/Section';
import JsonLd from '@/components/seo/JsonLd';
import { faqSchema } from '@/lib/seo';
import type { Faq } from '@/lib/types';

/**
 * Lista FAQ oparta na natywnym `<details>` — pełna obsługa klawiatury
 * i czytników ekranu bez linijki JavaScriptu.
 */
export default function FaqList({
  items,
  eyebrow = 'Częste pytania',
  title = 'Zanim zapytasz',
  withSchema = true,
}: {
  items: Faq[];
  eyebrow?: string;
  title?: string;
  withSchema?: boolean;
}) {
  if (!items.length) return null;

  return (
    <section className="border-t border-hairline py-section">
      {withSchema ? <JsonLd data={faqSchema(items)} /> : null}
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 data-split className="mt-6 text-major text-gradient-star">
              {title}
            </h2>
          </div>
        </div>

        <div data-reveal-group className="md:col-span-8">
          {items.map((item) => (
            <details
              key={item.question}
              data-reveal
              className="group border-t border-hairline last:border-b"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-[1.125rem] font-semibold tracking-tight text-star transition-colors hover:text-signal [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45"
                >
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 1v12M1 7h12" strokeLinecap="square" />
                  </svg>
                </span>
              </summary>
              <div className="pb-7 -mt-1 max-w-2xl leading-relaxed text-dim">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
