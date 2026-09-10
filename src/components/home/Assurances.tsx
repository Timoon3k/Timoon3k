import { Eyebrow } from '@/components/ui/Section';

const points = [
  {
    index: '01',
    title: 'Rozmawiasz z wykonawcą',
    body: 'Ta sama osoba przyjmuje zlecenie, projektuje, pisze kod i wdraża. Nie ma etapu, na którym Twoje ustalenia są komuś przekazywane i po drodze gubione.',
  },
  {
    index: '02',
    title: 'Wycena przed startem',
    body: 'Zakres, termin i cena ustalone są zanim zacznie się praca. Jeśli w trakcie pojawia się pomysł poza zakresem, wyceniam go osobno — zamiast dokładać go po cichu do faktury.',
  },
  {
    index: '03',
    title: 'Strona zostaje Twoja',
    body: 'Dostajesz komplet dostępów i panel, w którym samodzielnie zmienisz treść. Bez uzależnienia od jednego wykonawcy i bez opłat za każdą poprawioną literówkę.',
  },
  {
    index: '04',
    title: 'Wydajność w zakresie, nie w cenniku',
    body: 'Optymalizacja obrazów, kontrola tego, co ładuje się przed pierwszym ekranem, i stabilny układ strony to standard każdego projektu, a nie płatny dodatek.',
  },
];

export default function Assurances() {
  return (
    <section className="relative overflow-hidden border-t border-hairline py-section">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,var(--color-signal),transparent)] opacity-40"
      />
      <div className="container-page">
        <div className="max-w-3xl">
          <Eyebrow>Zasady współpracy</Eyebrow>
          <h2 data-split className="mt-6 text-major text-gradient-star">
            Cztery rzeczy, które ustalam na wejściu
          </h2>
        </div>

        <div data-reveal-group data-stagger="0.09" className="mt-16 grid gap-px md:grid-cols-2">
          {points.map((point) => (
            <article
              key={point.index}
              data-reveal
              className="group relative border-t border-hairline py-9 md:pr-10"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                {point.index}
              </span>
              <h3 className="mt-5 font-display text-headline font-semibold tracking-tight text-star">
                {point.title}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-dim">{point.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
