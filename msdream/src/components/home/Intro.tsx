import { CITY_LOCATIVE } from '@/lib/site';

/**
 * Krótkie przedstawienie MSdream tuż pod hero.
 *
 * Jeden duży akapit typograficzny zamiast bloku „o nas" — użytkownik, który
 * właśnie wszedł z Google, dostaje w trzech zdaniach odpowiedź na pytanie
 * „gdzie jestem i czy to jest dla mnie".
 */
export function Intro() {
  return (
    <section className="section--tight section" style={{ background: 'var(--color-ivory-100)' }}>
      <div className="shell">
        <div className="grid-editorial gap-y-8">
          <div className="col-span-3">
            <p className="eyebrow" data-reveal>
              <span aria-hidden="true">02</span> MSdream
            </p>
          </div>
          <div className="col-span-8 lg:col-start-5">
            <p
              className="max-w-[30ch] sm:max-w-[26ch] lg:max-w-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-title)',
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
              }}
              data-reveal
            >
              Jesteśmy szkołą jazdy konnej w {CITY_LOCATIVE} — dwadzieścia minut od
              północnej Warszawy, ale po drugiej stronie hałasu.
            </p>
            <div
              className="mt-7 grid max-w-[64ch] gap-5 text-[0.9375rem] leading-relaxed sm:grid-cols-2"
              style={{ color: 'var(--color-graphite-500)' }}
              data-reveal
              data-reveal-delay="0.1"
            >
              <p>
                Uczymy dzieci i dorosłych — od pierwszego kontaktu z koniem po
                samodzielną jazdę. Zajęcia prowadzimy indywidualnie albo w małych
                grupach, bo przy koniach liczba osób na instruktora przekłada się
                wprost na bezpieczeństwo.
              </p>
              <p>
                Poza stajnią prowadzimy też warsztaty tuftingu — te same zasady,
                inne narzędzie: małe grupy, dużo miejsca i coś konkretnego
                do zabrania do domu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
