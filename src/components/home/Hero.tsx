import HeroCanvas from '@/components/three/HeroCanvas';
import { CtaLink } from '@/components/ui/Cta';

/**
 * Kompetencje rozmieszczone radialnie wokół rdzenia — czytane jako satelity
 * obiektu, nie jako lista. Warstwa dekoracyjna: te same informacje występują
 * w treści niżej, więc dla czytnika ekranu są pominięte.
 */
const orbitLabels = [
  { text: 'Interfejs', className: 'top-[16%] left-[52%]' },
  { text: 'Kod', className: 'top-[30%] right-[8%]' },
  { text: 'Wydajność', className: 'bottom-[34%] right-[11%]' },
  { text: 'SEO', className: 'bottom-[20%] left-[58%]' },
];

const meta = [
  { label: 'Wycena', value: 'w 24 h' },
  { label: 'Realizacja', value: 'od 7 dni' },
  { label: 'Obszar', value: 'Wołomin · Warszawa' },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[calc(var(--header-h)+2rem)] pb-8">
      {/* Warstwa 0 — scena. Doładowywana po pierwszym renderze, poza drzewem dostępności. */}
      <div className="absolute inset-x-0 top-[34%] bottom-0 opacity-50 md:inset-y-0 md:left-0 md:opacity-100">
        <HeroCanvas />
      </div>

      {/* Scrim: czyta się jak głębia sceny, a jednocześnie ratuje kontrast typografii */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_20%,rgba(4,6,11,0.62)_58%,var(--color-void)_88%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-void)_2%,transparent_22%,transparent_72%,var(--color-void)_97%)]"
      />

      {/* Satelity kompetencji — tylko tam, gdzie jest na nie miejsce */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {orbitLabels.map((label, index) => (
          <span
            key={label.text}
            data-reveal
            data-delay={0.9 + index * 0.12}
            className={`absolute font-mono text-[0.625rem] tracking-[0.22em] text-star/35 uppercase ${label.className}`}
          >
            <span className="mr-2 inline-block h-1 w-1 translate-y-[-2px] rounded-full bg-signal/60" />
            {label.text}
          </span>
        ))}
      </div>

      {/* Warstwa 1 — treść. Typografia świadomie przecina rdzeń. */}
      <div className="relative container-page">
        <p data-reveal data-delay="0.05" className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-signal" />
          Freelance web development — Wołomin, Warszawa
        </p>

        {/* Element LCP: czysty tekst renderowany po stronie serwera */}
        <h1
          data-split="immediate"
          data-delay="0.1"
          className="mt-7 max-w-[13ch] text-mega font-semibold text-gradient-star"
        >
          Projektuję strony, które trudno zignorować
        </h1>
      </div>

      <div className="relative container-page">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <p data-reveal data-delay="0.18" className="max-w-md text-lead text-dim">
              Tomasz Majewski. Projektuję i koduję strony dla firm — od wizytówek lokalnego
              biznesu po sklepy i systemy rezerwacji.
            </p>

            <div data-reveal data-delay="0.24" className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <CtaLink href="/kontakt#formularz" data-magnetic className="justify-between sm:justify-center">
                Rozpocznij projekt
              </CtaLink>
              <CtaLink
                href="/portfolio"
                variant="secondary"
                data-magnetic
                className="justify-between sm:justify-center"
              >
                Zobacz realizacje
              </CtaLink>
            </div>
          </div>

          <dl
            data-reveal-group
            data-stagger="0.08"
            data-delay="0.3"
            className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-hairline pt-6 sm:grid-cols-3 lg:col-span-6 lg:col-start-7 lg:border-t-0 lg:pt-0"
          >
            {meta.map((item) => (
              <div key={item.label} data-reveal className="lg:text-right">
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-1.5 font-display text-[1.0625rem] font-medium tracking-tight text-star">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
