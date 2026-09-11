/**
 * „Jak wygląda pierwsza jazda" — cztery kroki.
 *
 * Zamiast czterech identycznych kafelków: jeden ciąg z numerami w dużym
 * kroju display i cienką linią prowadzącą wzrok. Na mobile linia jest
 * pionowa, na desktopie pozioma — to inny układ, nie ten sam w skali.
 */
const STEPS = [
  {
    n: '01',
    title: 'Wybierz zajęcia',
    body: 'Jazda indywidualna, zajęcia dla dziecka albo ABC dla najmłodszych. Jeśli nie wiesz, co wybrać — zadzwoń, doradzimy w minutę.',
  },
  {
    n: '02',
    title: 'Zarezerwuj termin',
    body: 'Kalendarz na stronie pokazuje wyłącznie terminy faktycznie wolne. Wybierasz godzinę i potwierdzasz.',
  },
  {
    n: '03',
    title: 'Zapłać online',
    body: 'Płatność realizujesz od razu przy rezerwacji. Potwierdzenie i dokument sprzedaży dostajesz e-mailem.',
  },
  {
    n: '04',
    title: 'Przyjedź do nas',
    body: 'Bądź 15 minut wcześniej. Kask i sprzęt czekają na miejscu — wystarczy, że przyjedziesz w długich spodniach i butach z obcasem.',
  },
];

export function Process() {
  return (
    <section
      className="section"
      style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}
    >
      <div className="shell">
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-7">
            <p className="eyebrow eyebrow--light mb-7" data-reveal>
              <span aria-hidden="true">13</span> Jak zacząć
            </p>
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Jak wygląda
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-300)' }}> pierwsza jazda?</span>
            </h2>
          </div>
          <div className="col-span-4 lg:col-start-9">
            <p
              className="max-w-[36ch] text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--color-sand-400)' }}
              data-reveal
            >
              Cztery kroki od decyzji do siodła. Bez telefonów w godzinach pracy
              i bez czekania na oddzwonienie.
            </p>
          </div>
        </div>

        <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="relative pt-8"
              style={{
                borderTop: '1px solid color-mix(in oklab, var(--color-ivory-100) 20%, transparent)',
              }}
              data-reveal
              data-reveal-delay={i * 0.08}
            >
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 block h-px"
                style={{ width: '2.5rem', background: 'var(--color-brass-400)' }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem,6vw,4rem)',
                  lineHeight: 1,
                  color: 'color-mix(in oklab, var(--color-brass-300) 55%, transparent)',
                  fontVariationSettings: "'SOFT' 40, 'WONK' 1, 'opsz' 96",
                }}
              >
                {step.n}
              </p>
              <h3 className="mt-4" style={{ fontSize: 'var(--text-heading)' }}>
                {step.title}
              </h3>
              <p
                className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed"
                style={{ color: 'var(--color-sand-400)' }}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
