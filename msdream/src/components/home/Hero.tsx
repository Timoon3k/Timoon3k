import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { photoRequired } from '@/lib/types';
import { CITY, CITY_LOCATIVE } from '@/lib/site';

/**
 * Hero.
 *
 * Kompozycja: ciemna zieleń jako tło, ogromny nagłówek display przesunięty
 * w lewo, fotografia wchodząca z prawej i wychodząca poza siatkę, cienka
 * linia dzieląca. Zero gradientów, zero glassmorphism.
 *
 * Priorytet LCP nad efektem:
 *  • jest to komponent serwerowy — nagłówek jest w HTML-u pierwszej odpowiedzi,
 *  • nie ma tu wideo w tle (na mobile kosztowałoby megabajty transferu
 *    i zabiłoby LCP; sekcja wideo, gdy pojawi się materiał, powinna być
 *    ładowana leniwie niżej na stronie),
 *  • fotografia hero ma `priority` i `fetchPriority="high"`,
 *  • animacja wejścia to wyłącznie clip-path/opacity — nie przesuwa układu.
 */
export function Hero() {
  const heroPhoto = photoRequired(
    'Jeździec i koń w kontrze pod słońce, złota godzina, kurz w powietrzu — kadr pionowy 3:4, dużo przestrzeni na górze na typografię',
    `Jazda konna w szkole MSdream w ${CITY_LOCATIVE} pod Warszawą`,
    '3/4',
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}
    >
      <div className="shell relative pt-[clamp(7.5rem,16vw,11rem)] pb-[clamp(3rem,6vw,5rem)]">
        <div className="grid-editorial items-end gap-y-10">
          {/* --- Kolumna tekstowa --- */}
          <div className="col-span-7 relative z-10">
            <p className="eyebrow eyebrow--light mb-8" data-reveal>
              {CITY} · pod Warszawą
            </p>

            <h1 data-reveal-mask>
              {/* Każdy wiersz w osobnym elemencie — maska odsłania je kolejno. */}
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{ fontSize: 'var(--text-hero)', fontVariationSettings: "'SOFT' 30, 'WONK' 1, 'opsz' 144" }}
                >
                  Najpierw
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{
                    fontSize: 'var(--text-hero)',
                    fontStyle: 'italic',
                    color: 'var(--color-brass-300)',
                    fontVariationSettings: "'SOFT' 60, 'WONK' 1, 'opsz' 144",
                  }}
                >
                  zaufanie.
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block"
                  style={{ fontSize: 'var(--text-hero)', fontVariationSettings: "'SOFT' 30, 'WONK' 1, 'opsz' 144" }}
                >
                  Potem galop.
                </span>
              </span>
            </h1>

            <p
              className="mt-8 max-w-[44ch]"
              style={{ fontSize: 'var(--text-lead)', color: 'var(--color-sand-400)' }}
              data-reveal
              data-reveal-delay="0.15"
            >
              Szkoła jazdy konnej w {CITY_LOCATIVE} dla dzieci i dorosłych — od pierwszego
              kontaktu z koniem po samodzielną jazdę.
            </p>

            <div className="mt-10 flex flex-wrap gap-3" data-reveal data-reveal-delay="0.25">
              {/* Zwykły Link zamiast komponentu klienckiego: hero nie potrzebuje
                  JS, żeby zadziałać. Zdarzenie booking_click zbieramy z pozostałych
                  CTA — nie kosztem interaktywności pierwszego ekranu. */}
              <Link href="/rezerwacja" className="btn btn--brass">
                Zarezerwuj jazdę
              </Link>
              <Link href="/o-nas" className="btn btn--ghost-light">
                Poznaj MSdream
              </Link>
            </div>
          </div>

          {/* --- Fotografia ---
              Wychodzi poza prawą krawędź siatki na desktopie: kontrolowane
              złamanie kolumn, które odróżnia layout od typowego two-column hero. */}
          <div
            className="col-span-5 relative lg:-mr-[clamp(1rem,4vw,5rem)]"
            data-reveal
            data-reveal-delay="0.1"
          >
            <div className="relative">
              <Photo
                photo={heroPhoto}
                sizes="(max-width: 899px) 100vw, 42vw"
                priority
                quality={82}
                className="arch"
              />
              {/* Cienka mosiężna linia obrysowująca kadr — element brandingowy. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 hidden lg:block"
                style={{
                  border: '1px solid color-mix(in oklab, var(--color-brass-400) 45%, transparent)',
                  borderRadius: 'var(--radius-arch)',
                }}
              />
            </div>
          </div>
        </div>

        {/* --- Pasek zaufania --- */}
        <div
          className="mt-[clamp(3rem,6vw,5rem)] border-t pt-6"
          style={{ borderColor: 'color-mix(in oklab, var(--color-ivory-100) 16%, transparent)' }}
          data-reveal
          data-reveal-delay="0.3"
        >
          <ul
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-sand-400)' }}
          >
            <li>{CITY} pod Warszawą</li>
            <li aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>·</li>
            <li>Zajęcia dla dzieci i dorosłych</li>
            <li aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>·</li>
            <li>Rezerwacja online</li>
            <li aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>·</li>
            <li>Warsztaty tuftingu</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
