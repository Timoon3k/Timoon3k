import { FaqList } from '@/components/ui/FaqList';
import { JsonLd } from '@/components/ui/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import type { FaqItem } from '@/lib/types';

/**
 * FAQ + odpowiadające mu dane strukturalne FAQPage.
 * Jedno źródło treści dla obu — nie ma szans na rozjazd między tym,
 * co widzi użytkownik, a tym, co widzi Google.
 */
export function FaqSection({
  items,
  title = 'Częste pytania',
  index = '14',
  tone = 'page',
  emitJsonLd = true,
}: {
  items: readonly FaqItem[];
  title?: string;
  index?: string;
  tone?: 'page' | 'alt';
  emitJsonLd?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section className="section" style={{ background: tone === 'alt' ? 'var(--color-ivory-200)' : 'var(--color-ivory-100)' }}>
      {emitJsonLd && <JsonLd data={faqJsonLd(items)} />}
      <div className="shell">
        <div className="grid-editorial gap-y-10">
          <div className="col-span-4">
            <p className="eyebrow mb-7" data-reveal>
              <span aria-hidden="true">{index}</span> FAQ
            </p>
            <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
              {title}
            </h2>
          </div>
          <div className="col-span-7 lg:col-start-6" data-reveal data-reveal-delay="0.08">
            <FaqList items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
