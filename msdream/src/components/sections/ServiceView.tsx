import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { PriceTag } from '@/components/ui/PriceTag';
import type { Service } from '@/lib/types';

/**
 * Karta pojedynczej usługi.
 *
 * Układ: duża fotografia po lewej (sticky na desktopie), po prawej treść
 * i „bilet" z ceną, czasem i przyciskiem rezerwacji. Tufting dostaje inny
 * kolor akcentu — ta sama konstrukcja, inna osobowość.
 */
export function ServiceView({ service }: { service: Service }) {
  const tufting = service.category === 'tufting';
  const accent = tufting ? 'var(--color-wool-700)' : 'var(--color-brass-600)';
  const bookingHref = tufting ? '/rezerwacja-tuftingu' : '/rezerwacja';

  return (
    <section className="section section--tight">
      <div className="shell">
        <div className="grid-editorial gap-y-12">
          {/* --- Fotografia --- */}
          <div className="col-span-5">
            <div className="lg:sticky lg:top-28">
              <Photo
                photo={service.photo}
                sizes="(max-width: 899px) 100vw, 40vw"
                quality={82}
                priority
              />
            </div>
          </div>

          {/* --- Treść --- */}
          <div className="col-span-6 lg:col-start-7">
            <p className="eyebrow" style={{ color: accent }}>
              {tufting ? 'Warsztaty tuftingu' : 'Jazda konna'}
            </p>

            <h1 className="mt-6" style={{ fontSize: 'var(--text-display)' }}>
              {service.name}
            </h1>

            <p
              className="mt-6 max-w-[46ch]"
              style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
            >
              {service.tagline}
            </p>

            <p
              className="mt-5 max-w-[54ch] text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--color-graphite-500)' }}
            >
              {service.description}
            </p>

            {/* --- „Bilet": cena, czas, rezerwacja --- */}
            <div
              className="mt-10 p-6 sm:p-8"
              style={{
                background: tufting ? 'var(--color-ivory-50)' : 'var(--color-forest-900)',
                color: tufting ? 'var(--color-graphite-900)' : 'var(--color-ivory-100)',
                border: tufting ? '1px solid var(--color-line)' : 'none',
              }}
            >
              <PriceTag service={service} tone={tufting ? 'dark' : 'light'} />

              {service.audience && (
                <p
                  className="mt-4 text-[0.875rem]"
                  style={{ color: tufting ? 'var(--color-graphite-500)' : 'var(--color-sand-400)' }}
                >
                  <span className="uppercase tracking-[0.12em]" style={{ fontSize: '0.6875rem' }}>
                    Dla kogo:
                  </span>{' '}
                  {service.audience}
                </p>
              )}

              <Link
                href={bookingHref}
                className={`btn mt-6 w-full ${tufting ? '' : 'btn--brass'}`}
              >
                Zarezerwuj termin
              </Link>
            </div>

            {/* --- Szczegóły --- */}
            <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
              {service.includes.length > 0 && (
                <div>
                  <h2
                    className="border-t pt-5"
                    style={{ borderColor: 'var(--color-line)', fontSize: 'var(--text-heading)' }}
                  >
                    Co obejmują zajęcia
                  </h2>
                  <ul className="mt-5 space-y-3 text-[0.9375rem]" style={{ color: 'var(--color-graphite-700)' }}>
                    {service.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" style={{ color: accent }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.requirements.length > 0 && (
                <div>
                  <h2
                    className="border-t pt-5"
                    style={{ borderColor: 'var(--color-line)', fontSize: 'var(--text-heading)' }}
                  >
                    O czym warto wiedzieć
                  </h2>
                  <ul className="mt-5 space-y-3 text-[0.9375rem]" style={{ color: 'var(--color-graphite-700)' }}>
                    {service.requirements.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" style={{ color: accent }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
