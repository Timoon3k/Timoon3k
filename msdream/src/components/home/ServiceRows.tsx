import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { PriceTag } from '@/components/ui/PriceTag';
import type { Service } from '@/lib/types';

/**
 * Prezentacja oferty.
 *
 * Świadomie NIE jest to siatka identycznych kart ani tabela cennika.
 * Każda usługa dostaje pełnowymiarowy wiersz editorialowy: duża fotografia
 * po jednej stronie, treść po drugiej, strony zamieniają się co wiersz.
 * Numeracja i cienkie linie spinają to w spis treści oferty, a nie w cennik.
 */
export function ServiceRows({
  services,
  basePath,
}: {
  services: readonly Service[];
  basePath: string;
}) {
  return (
    <div>
      {services.map((service, i) => {
        const flipped = i % 2 === 1;
        const href = `${basePath}/${service.slug}`;

        return (
          <article
            key={service.slug}
            className="grid-editorial items-center gap-y-8 border-t py-[clamp(2.5rem,5vw,4.5rem)]"
            style={{ borderColor: 'var(--color-line)' }}
            data-reveal
          >
            {/* --- Fotografia --- */}
            <div
              className={`col-span-5 ${flipped ? 'lg:order-2 lg:col-start-8' : 'lg:col-start-1'}`}
            >
              <Link href={href} aria-label={`${service.name} — szczegóły`} tabIndex={-1}>
                <Photo
                  photo={service.photo}
                  sizes="(max-width: 899px) 100vw, 38vw"
                  quality={75}
                />
              </Link>
            </div>

            {/* --- Treść --- */}
            <div
              className={`col-span-6 ${flipped ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'}`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  aria-hidden="true"
                  className="text-xs tracking-[0.2em]"
                  style={{ color: 'var(--color-brass-600)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: 'var(--text-title)' }}>
                  <Link href={href} className="rein-link">
                    {service.name}
                  </Link>
                </h3>
              </div>

              <p
                className="mt-4 max-w-[46ch]"
                style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
              >
                {service.tagline}
              </p>

              <p
                className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                {service.description}
              </p>

              <div className="mt-7 flex flex-wrap items-end justify-between gap-5">
                <PriceTag service={service} />
                <div className="flex flex-wrap gap-2.5">
                  <Link href={href} className="btn btn--ghost" style={{ minHeight: '2.75rem' }}>
                    Szczegóły
                  </Link>
                  <Link
                    href={
                      service.category === 'tufting' ? '/rezerwacja-tuftingu' : '/rezerwacja'
                    }
                    className="btn"
                    style={{ minHeight: '2.75rem' }}
                  >
                    Zarezerwuj
                  </Link>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
