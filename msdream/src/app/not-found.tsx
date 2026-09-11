import Link from 'next/link';
import { NAV } from '@/lib/site';

/**
 * Strona 404.
 *
 * Nie ślepy zaułek: podajemy najczęstsze cele nawigacji i CTA rezerwacji,
 * bo najczęstszy powód trafienia tutaj to nieaktualny link z Google
 * albo literówka w adresie.
 */
export default function NotFound() {
  return (
    <section className="section" style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}>
      <div className="shell pt-20">
        <div className="grid-editorial gap-y-10">
          <div className="col-span-6">
            <p
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(5rem, 16vw, 12rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                color: 'var(--color-brass-400)',
                fontVariationSettings: "'SOFT' 40, 'WONK' 1, 'opsz' 144",
              }}
            >
              404
            </p>

            <h1 className="mt-6" style={{ fontSize: 'var(--text-title)' }}>
              Ta strona pojechała w teren
            </h1>

            <p className="mt-6 max-w-[44ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-sand-400)' }}>
              Pod tym adresem nic nie ma. Zwykle znaczy to, że link jest
              nieaktualny albo w adresie wkradła się literówka.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/" className="btn btn--brass">Strona główna</Link>
              <Link href="/rezerwacja" className="btn btn--ghost-light">Zarezerwuj jazdę</Link>
            </div>
          </div>

          <div className="col-span-5 lg:col-start-8">
            <p className="eyebrow eyebrow--light">Może szukasz</p>
            <ul className="mt-6 border-t" style={{ borderColor: 'color-mix(in oklab, var(--color-ivory-100) 18%, transparent)' }}>
              {NAV.filter((n) => n.href !== '/').map((item) => (
                <li key={item.href} className="border-b" style={{ borderColor: 'color-mix(in oklab, var(--color-ivory-100) 18%, transparent)' }}>
                  <Link
                    href={item.href}
                    className="block py-4"
                    style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
