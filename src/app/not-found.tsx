import Link from 'next/link';
import { CtaLink } from '@/components/ui/Cta';
import SceneFallback from '@/components/three/SceneFallback';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden py-section">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
        <SceneFallback />
      </div>
      <div className="relative container-page">
        <p className="eyebrow">Błąd 404</p>
        <h1 className="mt-7 max-w-[14ch] text-giant text-gradient-star">
          Ta strona zgubiła się w przestrzeni
        </h1>
        <p className="mt-7 max-w-xl text-lead text-dim">
          Adres, pod który trafiłeś, nie istnieje albo został zmieniony. Poniżej najkrótsza droga
          powrotna.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <CtaLink href="/">Wróć na stronę główną</CtaLink>
          <CtaLink href="/portfolio" variant="secondary">
            Zobacz portfolio
          </CtaLink>
        </div>
        <nav aria-label="Skróty" className="mt-14 flex flex-wrap gap-x-7 gap-y-3">
          {[
            { href: '/oferta', label: 'Oferta' },
            { href: '/o-mnie', label: 'O mnie' },
            { href: '/blog', label: 'Blog' },
            { href: '/kontakt', label: 'Kontakt' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline font-mono text-[0.6875rem] tracking-[0.14em] text-dim uppercase transition-colors hover:text-signal"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
