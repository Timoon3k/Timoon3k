import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { BookeroWidget } from '@/components/booking/BookeroWidget';
import { FaqSection } from '@/components/sections/FaqSection';
import { getFaqByTopic, getRidingServices } from '@/cms/content';
import { formatDuration, formatPrice } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Rezerwacja jazdy konnej — wybierz termin online',
  description:
    'Zarezerwuj jazdę konną w Łomiankach. Kalendarz pokazuje wyłącznie wolne terminy — wybierz zajęcia, godzinę i potwierdź rezerwację online.',
  path: '/rezerwacja',
});

export default async function BookingPage() {
  const [services, faq] = await Promise.all([
    getRidingServices(),
    getFaqByTopic('rezerwacja'),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Rezerwacja', href: '/rezerwacja' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            {/* --- Kolumna informacyjna --- */}
            <div className="col-span-4">
              <h1 style={{ fontSize: 'var(--text-title)' }}>Rezerwacja jazdy</h1>
              <p
                className="mt-6 max-w-[38ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
              >
                Wybierz zajęcia i termin w kalendarzu obok. Widoczne są wyłącznie
                godziny faktycznie wolne — nie musisz dzwonić, żeby to sprawdzić.
              </p>

              {/* Skrót cennika — żeby wybór w kalendarzu nie odbywał się w ciemno. */}
              <div className="mt-9">
                <p className="eyebrow mb-5">Zajęcia i ceny</p>
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
                          style={{ color: price ? 'var(--color-graphite-900)' : 'var(--color-brass-600)' }}
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
                style={{ borderColor: 'var(--color-brass-500)', color: 'var(--color-graphite-500)' }}
              >
                <p>
                  Płatność realizujesz podczas rezerwacji. Potwierdzenie i dokument
                  sprzedaży otrzymasz e-mailem. Zasady odwoływania terminów opisuje{' '}
                  <Link href="/regulamin-rezerwacji" className="rein-link">
                    regulamin rezerwacji
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* --- Kalendarz --- */}
            <div className="col-span-8 lg:col-start-6">
              <BookeroWidget context="jazda-konna" />
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={faq} title="Pytania o rezerwację" index="—" tone="alt" />
    </>
  );
}
