import HeroCanvas from '@/components/three/HeroCanvas';
import { CtaLink } from '@/components/ui/Cta';

const facts = [
  { label: 'Wycena', value: 'w 24 godziny' },
  { label: 'Realizacja', value: 'od 7 dni' },
  { label: 'Obszar', value: 'Wołomin · Warszawa · zdalnie' },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-10">
      {/*
        Warstwa dekoracyjna — poza drzewem dostępności, doładowywana po pierwszym
        renderze. Na telefonie scena schodzi do dolnej części ekranu, żeby nie
        wchodziła pod nagłówek; na desktopie przesuwa się w prawą kolumnę.
      */}
      <div className="absolute inset-x-0 top-[42%] bottom-0 opacity-45 md:inset-y-0 md:left-[26%] md:opacity-100">
        <HeroCanvas />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-void)_30%,rgba(4,6,11,0.82)_58%,rgba(4,6,11,0.55)_82%)] md:bg-[linear-gradient(100deg,var(--color-void)_16%,rgba(4,6,11,0.88)_44%,rgba(4,6,11,0.35)_66%,transparent_84%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(to_top,var(--color-void)_35%,transparent)]"
      />

      <div className="relative container-page">
        <p
          data-reveal
          data-delay="0.05"
          className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span aria-hidden className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal opacity-70" />
          </span>
          Freelance web development — Wołomin, Warszawa
        </p>

        {/* Element LCP: czysty tekst, renderowany po stronie serwera */}
        <h1
          data-split="immediate"
          data-delay="0.1"
          className="mt-7 max-w-[16ch] text-mega font-semibold text-gradient-star"
        >
          Projektuję strony, które trudno zignorować
        </h1>

        <div className="mt-10 max-w-xl md:mt-12">
          <p data-reveal data-delay="0.15" className="text-lead text-dim">
            Nazywam się Tomasz Majewski. Projektuję i koduję nowoczesne strony internetowe dla firm —
            od wizytówek lokalnego biznesu po sklepy i systemy rezerwacji. Szybkie, dopracowane
            wizualnie i zbudowane pod konkretny cel sprzedażowy.
          </p>

          <div
            data-reveal
            data-delay="0.2"
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <CtaLink href="/kontakt#formularz" className="justify-between sm:justify-center">
              Rozpocznij projekt
            </CtaLink>
            <CtaLink
              href="/portfolio"
              variant="secondary"
              className="justify-between sm:justify-center"
            >
              Zobacz realizacje
            </CtaLink>
          </div>
        </div>

        <dl
          data-reveal-group
          data-stagger="0.1"
          className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-t border-hairline sm:grid-cols-3 md:mt-14"
        >
          {facts.map((fact) => (
            <div key={fact.label} data-reveal className="py-5 sm:pr-8">
              <dt className="eyebrow">{fact.label}</dt>
              <dd className="mt-2 font-display text-[1.0625rem] font-medium tracking-tight text-star">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
