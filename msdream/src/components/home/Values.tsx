import { Photo } from '@/components/ui/Photo';
import { photoRequired } from '@/lib/types';

/**
 * „Dlaczego MSdream" + dobrostan koni w jednej sekcji.
 *
 * Rozdzielenie tych dwóch tematów byłoby sztuczne: dobrostan koni JEST
 * powodem, dla którego warto wybrać tę szkołę, a nie osobnym rozdziałem
 * o etyce. Układ: lista argumentów po lewej, jedna duża fotografia po prawej,
 * wychodząca poza siatkę.
 */
const REASONS = [
  {
    title: 'Konie pracują tyle, ile powinny',
    body: 'Grafik układamy pod konie, nie pod maksymalne obłożenie kalendarza. Koń, który ma dość, ma wolne — nawet jeśli oznacza to przesunięcie jazdy.',
  },
  {
    title: 'Instruktor patrzy na jedną osobę',
    body: 'Początkujący uczą się indywidualnie albo w bardzo małych grupach. Nie ma zajęć, na których połowa uczestników czeka pod ścianą.',
  },
  {
    title: 'Dobieramy konia, nie przydzielamy',
    body: 'Inny koń dla dziecka na drugich zajęciach, inny dla dorosłego wracającego po dziesięciu latach. To robi większą różnicę niż jakikolwiek program szkolenia.',
  },
  {
    title: 'Mówimy, kiedy coś nie ma sensu',
    body: 'Jeśli dziecko nie jest jeszcze gotowe albo ktoś chce kupić pakiet, którego nie wykorzysta, powiemy to wprost. Wolimy stracić jedną sprzedaż niż kursanta.',
  },
];

export function Values() {
  return (
    <section className="section" style={{ background: 'var(--color-ivory-100)' }}>
      <div className="shell">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-6">
            <p className="eyebrow mb-7" data-reveal>
              <span aria-hidden="true">08</span> Dlaczego MSdream
            </p>
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Cztery rzeczy,
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> które robimy inaczej</span>
            </h2>

            <dl className="mt-10">
              {REASONS.map((r, i) => (
                <div
                  key={r.title}
                  className="border-t py-6"
                  style={{ borderColor: 'var(--color-line)' }}
                  data-reveal
                  data-reveal-delay={i * 0.06}
                >
                  <dt style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', lineHeight: 1.25 }}>
                    {r.title}
                  </dt>
                  <dd
                    className="mt-2.5 max-w-[52ch] text-[0.9375rem] leading-relaxed"
                    style={{ color: 'var(--color-graphite-500)' }}
                  >
                    {r.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-5 lg:col-start-8" data-reveal data-reveal-delay="0.1">
            <div className="lg:sticky lg:top-28">
              <Photo
                photo={photoRequired(
                  'Koń na wybiegu o zmierzchu, spokojna scena, dużo nieba — pion 3:4',
                  'Konie na wybiegu w stajni MSdream — dobrostan zwierząt',
                  '3/4',
                )}
                sizes="(max-width: 899px) 100vw, 38vw"
                quality={75}
              />
              <p
                className="mt-5 max-w-[38ch] text-[0.8125rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                Konie mają codzienny dostęp do wybiegu, regularną opiekę weterynaryjną
                i kowala. Sprzęt dopasowujemy do konkretnego konia — źle dobrane siodło
                boli tak samo jak źle dobrany but.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
