import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BookeroWidget } from '@/components/booking/BookeroWidget';
import { FaqSection } from '@/components/sections/FaqSection';
import { getFaqByTopic, getTuftingServices } from '@/cms/content';
import { formatDuration, formatPrice } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Rezerwacja warsztatów tuftingu — wybierz termin',
  description:
    'Zarezerwuj warsztaty tuftingu w Łomiankach: indywidualne, mama z dzieckiem, grupowe lub urodziny. Wybierz termin w kalendarzu online.',
  path: '/rezerwacja-tuftingu',
});

export default async function TuftingBookingPage() {
  const [services, faq] = await Promise.all([
    getTuftingServices(),
    getFaqByTopic('tufting', 'rezerwacja'),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Rezerwacja tuftingu', href: '/rezerwacja-tuftingu' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-4">
              <h1 style={{ fontSize: 'var(--text-title)' }}>Rezerwacja warsztatów</h1>
              <p
                className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
              >
                Wybierz wariant warsztatu i termin. Przy warsztatach grupowych
                i urodzinach terminy ustalamy indywidualnie — napisz do nas,
                jeśli nie widzisz pasującej godziny.
              </p>

              <div className="mt-9">
                <p className="eyebrow mb-5" style={{ color: 'var(--color-wool-700)' }}>
                  Warianty
                </p>
                <ul className="border-t" style={{ borderColor: 'var(--color-line)' }}>
                  {services.map((service) => {
                    const price = formatPrice(service.price);
                    const duration = formatDuration(service.durationMin);

                    return (
                      <li
                        key={service.slug}
                        className="flex items-baseline justify-between gap-4 border-b py-3.5"
                        style={{ borderColor: 'var(--color-line)' }}
                      >
                        <Link href={`/oferta/${service.slug}`} className="rein-link text-[0.9375rem]">
                          {service.name}
                          {duration && (
                            <span className="ml-2 text-xs" style={{ color: 'var(--color-graphite-500)' }}>
                              {duration}
                            </span>
                          )}
                        </Link>
                        <span
                          className="shrink-0 text-[0.9375rem]"
                          style={{ color: price ? 'var(--color-graphite-900)' : 'var(--color-wool-700)' }}
                        >
                          {price ?? 'do uzgodnienia'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div
                className="mt-9 border-l-2 pl-5 text-[0.875rem] leading-relaxed"
                style={{ borderColor: 'var(--color-wool-500)', color: 'var(--color-graphite-500)' }}
              >
                <p>
                  Ubierz się w coś, czego nie szkoda — wełna zostawia włókna.
                  Wszystkie materiały i narzędzia są po naszej stronie.
                </p>
              </div>
            </div>

            <div className="col-span-8 lg:col-start-6">
              {/* Osobny kalendarz Bookero dla tuftingu — jeśli warsztaty mają
                  własną wtyczkę, ustaw NEXT_PUBLIC_BOOKERO_PLUGIN_ID_TUFTING. */}
              <BookeroWidget context="tufting" />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={faq} title="Pytania o warsztaty" index="—" tone="alt" />
    </>
  );
}
