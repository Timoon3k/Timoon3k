import { Photo } from '@/components/ui/Photo';
import { photoRequired } from '@/lib/types';

/**
 * Proces warsztatu tuftingu — cztery etapy.
 *
 * Odróżnia się od procesu rezerwacji jazdy: numery są wpisane w pętlę wełny
 * (SVG), a etapy układają się schodkowo, nie w równym rzędzie. To ten sam
 * design system — inne tempo i inny kolor.
 */
const STEPS = [
  {
    n: '01',
    title: 'Projekt',
    body: 'Przynosisz własny pomysł, wybierasz szablon albo rysujesz na miejscu. Prowadząca pomaga przenieść projekt na napiętą ramę.',
    photo: photoRequired('Rysowanie projektu markerem na napiętym płótnie ramy tuftingowej — kwadrat 1:1', 'Projektowanie wzoru na warsztatach tuftingu', '1/1'),
  },
  {
    n: '02',
    title: 'Nauka narzędzia',
    body: 'Krótki instruktaż obsługi pistoletu tuftingowego i próba na kawałku płótna. Pierwsze linie robisz zwykle kilka minut po instruktażu.',
    photo: photoRequired('Instruktorka pokazująca uczestnikowi, jak trzymać pistolet tuftingowy — kwadrat 1:1', 'Nauka obsługi pistoletu tuftingowego', '1/1'),
  },
  {
    n: '03',
    title: 'Tuftowanie',
    body: 'Najdłuższy i najprzyjemniejszy etap. Wypełniasz wzór kolorami — wełna wchodzi w płótno szybciej, niż się spodziewasz.',
    photo: photoRequired('Kadr z góry na ramę w połowie wypełnioną kolorową wełną — kwadrat 1:1', 'Tuftowanie dywanika na warsztatach', '1/1'),
  },
  {
    n: '04',
    title: 'Wykończenie',
    body: 'Klejenie spodu, przycięcie runa i obszycie krawędzi. Z warsztatu wychodzisz z dywanikiem gotowym do położenia na podłodze.',
    photo: photoRequired('Przycinanie runa nożyczkami, detal wykończonej krawędzi dywanika — kwadrat 1:1', 'Wykończenie dywanika tuftingowego', '1/1'),
  },
];

export function TuftingProcess() {
  return (
    <section className="section" style={{ background: 'var(--color-olive-700)', color: 'var(--color-ivory-100)' }}>
      <div className="shell">
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-7">
            <p className="eyebrow eyebrow--light mb-7" style={{ color: 'var(--color-wool-300)' }} data-reveal>
              Jak to wygląda
            </p>
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Cztery etapy,
              <span style={{ fontStyle: 'italic', color: 'var(--color-wool-300)' }}> jedno popołudnie</span>
            </h2>
          </div>
        </div>

        <ol className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              // Schodkowe przesunięcie — rytm zamiast równego rzędu.
              className={i % 2 === 1 ? 'lg:mt-14' : ''}
              data-reveal
              data-reveal-delay={i * 0.08}
            >
              <Photo photo={step.photo} sizes="(max-width: 639px) 100vw, 24vw" quality={70} />

              <div className="mt-6 flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    lineHeight: 1,
                    color: 'var(--color-wool-300)',
                  }}
                >
                  {step.n}
                </span>
                <h3 style={{ fontSize: 'var(--text-heading)' }}>{step.title}</h3>
              </div>

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
