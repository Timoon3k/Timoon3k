import Link from 'next/link';
import { CITY_LOCATIVE, LEGAL_NAV, NAV } from '@/lib/site';
import type { SiteData } from '@/lib/site-data';
import { telHref } from '@/lib/format';
import { ContactLink } from './ContactLink';

/** Dana nieuzupełniona — pokazujemy czytelną podpowiedź, nie zmyśloną wartość. */
function Pending({ label }: { label: string }) {
  return (
    <span style={{ color: 'var(--color-brass-400)' }} title="Uzupełnij w panelu WordPress → Ustawienia witryny">
      {label} — do uzupełnienia
    </span>
  );
}

/**
 * Stopka.
 *
 * Nie cztery równe kolumny — dominantą jest ogromny znak typograficzny
 * MSDREAM, pod którym układa się reszta. Kontakt jest na pierwszym miejscu,
 * bo to najczęstszy powód, dla którego ktoś przewija stronę do końca.
 */
export function Footer({ data }: { data: SiteData }) {
  return (
    <footer style={{ background: 'var(--color-forest-950)', color: 'var(--color-ivory-200)' }}>
      <div className="shell pt-[clamp(3.5rem,8vw,7rem)] pb-10">
        {/* --- Domykające CTA --- */}
        <div className="grid-editorial items-end gap-y-8 pb-[clamp(3rem,7vw,6rem)]">
          <div className="col-span-7">
            <h2 style={{ fontSize: 'var(--text-display)', color: 'var(--color-ivory-100)' }}>
              Zarezerwuj pierwszą jazdę
            </h2>
            <p className="mt-5 max-w-[46ch] text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
              Wolne terminy widzisz w kalendarzu od razu — bez dzwonienia i czekania
              na oddzwonienie.
            </p>
          </div>
          <div className="col-span-5 flex flex-wrap gap-3 lg:justify-end">
            <Link href="/rezerwacja" className="btn btn--brass">Zarezerwuj jazdę</Link>
            <Link href="/rezerwacja-tuftingu" className="btn btn--ghost-light">Warsztaty tuftingu</Link>
          </div>
        </div>

        <hr className="rule" style={{ background: 'color-mix(in oklab, var(--color-ivory-100) 16%, transparent)' }} />

        {/* --- Kolumny --- */}
        <div className="grid-editorial gap-y-10 py-[clamp(2.5rem,5vw,4rem)]">
          <div className="col-span-4">
            <p className="eyebrow eyebrow--light">Kontakt</p>
            <address className="mt-5 space-y-2 text-[0.9375rem] not-italic" style={{ color: 'var(--color-sand-400)' }}>
              <p>
                {data.street ?? <Pending label="Adres" />}
                <br />
                {data.postalCode ?? <Pending label="Kod pocztowy" />} {data.city}
              </p>
              <p>
                {data.phone ? (
                  <ContactLink href={telHref(data.phone)} event="phone_click" className="rein-link">
                    {data.phone}
                  </ContactLink>
                ) : (
                  <Pending label="Telefon" />
                )}
              </p>
              <p>
                {data.email ? (
                  <ContactLink href={`mailto:${data.email}`} event="email_click" className="rein-link">
                    {data.email}
                  </ContactLink>
                ) : (
                  <Pending label="E-mail" />
                )}
              </p>
            </address>
          </div>

          <div className="col-span-3">
            <p className="eyebrow eyebrow--light">Nawigacja</p>
            <ul className="mt-5 space-y-2 text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
              {NAV.filter((n) => n.href !== '/').map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="rein-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-3">
            <p className="eyebrow eyebrow--light">Oferta</p>
            <ul className="mt-5 space-y-2 text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
              <li><Link href="/oferta/jazda-konna" className="rein-link">Jazda konna</Link></li>
              <li><Link href="/oferta/warsztaty-tuftingu" className="rein-link">Warsztaty tuftingu</Link></li>
              <li><Link href="/jazda-konna-dla-dzieci-lomianki" className="rein-link">Jazda konna dla dzieci</Link></li>
              <li><Link href="/nauka-jazdy-konnej-lomianki" className="rein-link">Nauka jazdy konnej</Link></li>
              <li><Link href="/poradnik" className="rein-link">Poradnik</Link></li>
            </ul>
          </div>

          <div className="col-span-2">
            <p className="eyebrow eyebrow--light">Dokumenty</p>
            <ul className="mt-5 space-y-2 text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="rein-link">{item.label}</Link>
                </li>
              ))}
            </ul>
            {data.socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4 text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
                {data.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} className="rein-link" rel="noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* --- Znak typograficzny ---
          Przycięty do dolnej krawędzi: podpis marki, nie dekoracja. */}
      <div className="overflow-hidden" aria-hidden="true">
        <p
          className="shell select-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 19vw, 21rem)',
            lineHeight: 0.78,
            letterSpacing: '-0.045em',
            color: 'color-mix(in oklab, var(--color-ivory-100) 9%, transparent)',
            marginBottom: '-0.14em',
            fontVariationSettings: "'SOFT' 40, 'WONK' 1, 'opsz' 144",
          }}
        >
          MSDREAM
        </p>
      </div>

      <div
        className="shell flex flex-wrap items-center justify-between gap-3 border-t py-6 text-xs"
        style={{
          borderColor: 'color-mix(in oklab, var(--color-ivory-100) 12%, transparent)',
          color: 'var(--color-graphite-300)',
        }}
      >
        <p>© {new Date().getFullYear()} MSdream · Szkoła jazdy konnej w {CITY_LOCATIVE}</p>
        {data.taxId && <p>NIP {data.taxId}</p>}
      </div>
    </footer>
  );
}
