import Link from 'next/link';
import { footerNav, site } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-abyss">
      <div className="container-page pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-display text-headline font-semibold tracking-tight text-star">
              Masz projekt do zrobienia?
            </p>
            <p className="mt-4 max-w-sm text-dim">
              Napisz kilka zdań o tym, co chcesz osiągnąć. Wycenę i termin odsyłam zwykle w ciągu 24
              godzin.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-7 inline-block font-display text-[1.125rem] font-medium tracking-tight text-signal"
            >
              {site.email}
            </a>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline font-mono text-[0.6875rem] tracking-[0.14em] text-faint uppercase transition-colors hover:text-star"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerNav.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="md:col-span-4 lg:col-span-2 lg:col-start-auto"
            >
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-dim transition-colors hover:text-star"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-4 lg:col-span-2">
            <h2 className="eyebrow">Obsługiwany obszar</h2>
            <p className="mt-5 text-sm leading-relaxed text-dim">
              Wołomin, powiat wołomiński, Warszawa i okolice. Projekty zdalne — cała Polska.
            </p>
          </div>
        </div>

        {/* Wielki znak typograficzny — element kompozycyjny stopki */}
        <div aria-hidden className="pointer-events-none mt-20 select-none">
          <p className="font-display leading-[0.78] font-semibold tracking-[-0.04em] text-star/[0.055] text-[clamp(3.5rem,15.5vw,15rem)]">
            MAJEWSKI
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-hairline pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">
            © {year} {site.name} — {site.city}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">
            <Link href="/polityka-prywatnosci" className="transition-colors hover:text-star">
              Polityka prywatności
            </Link>
            <Link href="/oferta" className="transition-colors hover:text-star">
              Oferta
            </Link>
            <Link href="/kontakt" className="transition-colors hover:text-star">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
