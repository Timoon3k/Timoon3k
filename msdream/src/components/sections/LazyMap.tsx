'use client';

import { useState } from 'react';
import { CITY_LOCATIVE } from '@/lib/site';
import type { SiteData } from '@/lib/site-data';
import { telHref } from '@/lib/format';
import { track } from '@/lib/analytics';

/**
 * Sekcja lokalizacji.
 *
 * Mapa NIE ładuje się razem ze stroną. Domyślnie renderujemy „fasadę" —
 * statyczny, stylizowany kadr z adresem i przyciskiem. Iframe Google Maps
 * powstaje dopiero po kliknięciu użytkownika. Powody:
 *
 *  • iframe mapy potrafi dociągnąć kilkaset kilobajtów JS i skutecznie
 *    zepsuć LCP oraz INP na telefonie,
 *  • zanim użytkownik nie poprosi o mapę, nie wysyłamy nic do Google —
 *    co jest też właściwe z punktu widzenia zgód na cookies.
 *
 * Oficjalny Maps Embed API wymaga klucza. Bez klucza pokazujemy fasadę
 * i link „Wyznacz trasę" — bez udawania, że mapa jest osadzona.
 */
export function MapSection({
  data,
  tone = 'page',
}: {
  data: SiteData;
  tone?: 'page' | 'alt';
}) {
  const [loaded, setLoaded] = useState(false);

  const { street, postalCode: postal, phone, latitude: lat, longitude: lon, city: CITY } = data;
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

  const query = street ? `${street}, ${postal ?? ''} ${CITY}`.trim() : `MSdream ${CITY}`;

  const directionsUrl =
    lat != null && lon != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;

  const embedUrl = embedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${embedKey}&q=${encodeURIComponent(query)}&zoom=15&language=pl&region=PL`
    : null;

  return (
    <section className="section" style={{ background: tone === 'alt' ? 'var(--color-ivory-200)' : 'var(--color-ivory-100)' }}>
      <div className="shell">
        <div className="grid-editorial gap-y-10">
          <div className="col-span-4">
            <p className="eyebrow mb-7" data-reveal>
              <span aria-hidden="true">15</span> Dojazd
            </p>
            <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
              Znajdziesz nas
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> w {CITY_LOCATIVE}</span>
            </h2>

            <address className="mt-7 space-y-4 text-[0.9375rem] not-italic" style={{ color: 'var(--color-graphite-700)' }} data-reveal>
              <p>
                {street ?? 'Adres — do uzupełnienia w panelu WordPress'}
                <br />
                {postal ?? ''} {CITY}
              </p>
              {phone && (
                <p>
                  <a href={telHref(phone)} className="rein-link" onClick={() => track('phone_click')}>
                    {phone}
                  </a>
                </p>
              )}
            </address>

            <div className="mt-7 space-y-3 text-[0.875rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }} data-reveal>
              <p>
                <strong style={{ color: 'var(--color-graphite-700)' }}>Samochodem:</strong>{' '}
                z Warszawy trasą S7 w kierunku Gdańska, zjazd na {CITY}. Parking
                bezpośrednio przy stajni.
              </p>
              <p>
                <strong style={{ color: 'var(--color-graphite-700)' }}>Komunikacją:</strong>{' '}
                autobusy podmiejskie z Młocin do {CITY}; ostatni odcinek najlepiej
                pokonać samochodem lub taksówką.
              </p>
            </div>

            <a
              href={directionsUrl}
              className="btn mt-8"
              rel="noopener noreferrer"
              target="_blank"
              onClick={() => track('directions_click')}
            >
              Wyznacz trasę
            </a>
          </div>

          {/* --- Mapa / fasada --- */}
          <div className="col-span-7 lg:col-start-6" data-reveal data-reveal-delay="0.1">
            <div
              className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]"
              style={{ background: 'var(--color-sand-300)', border: '1px solid var(--color-line)' }}
            >
              {loaded && embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`Mapa dojazdu do MSdream w ${CITY_LOCATIVE}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0 }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center">
                  {/* Dekoracyjny rysunek siatki dróg — zamiast szarego prostokąta. */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{ opacity: 0.35 }}
                    preserveAspectRatio="none"
                    viewBox="0 0 400 300"
                  >
                    <path d="M0 190 L400 150" stroke="var(--color-ivory-100)" strokeWidth="10" />
                    <path d="M120 0 L170 300" stroke="var(--color-ivory-100)" strokeWidth="6" />
                    <path d="M0 60 L400 95" stroke="var(--color-ivory-100)" strokeWidth="3" />
                    <path d="M280 0 L320 300" stroke="var(--color-ivory-100)" strokeWidth="3" />
                  </svg>
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--color-olive-700)' }}>
                      {CITY}
                    </p>
                    {embedUrl ? (
                      <button type="button" className="btn mt-4" onClick={() => setLoaded(true)}>
                        Pokaż mapę
                      </button>
                    ) : (
                      <a
                        href={directionsUrl}
                        className="btn mt-4"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() => track('directions_click')}
                      >
                        Otwórz w Google Maps
                      </a>
                    )}
                    {!embedUrl && (
                      <p className="mt-4 max-w-[36ch] text-xs" style={{ color: 'var(--color-olive-700)' }}>
                        Osadzona mapa włączy się po dodaniu klucza
                        <code className="mx-1">NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY</code>
                        (patrz SETUP.md).
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
