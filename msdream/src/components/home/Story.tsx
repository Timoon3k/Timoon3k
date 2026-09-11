import { Photo } from '@/components/ui/Photo';
import { photoRequired } from '@/lib/types';

/**
 * Sekcja storytellingowa.
 *
 * Duża typografia na ciemnym tle + dwie fotografie w różnych proporcjach
 * i na różnych wysokościach. Parallax działa tylko na desktopie
 * (patrz MotionProvider) — na telefonie byłby źródłem janku.
 */
export function Story() {
  return (
    <section
      className="section relative overflow-hidden"
      style={{ background: 'var(--color-olive-700)', color: 'var(--color-ivory-100)' }}
    >
      <div className="shell">
        <div className="grid-editorial gap-y-12">
          <div className="col-span-6">
            <p className="eyebrow eyebrow--light mb-8" data-reveal>
              <span aria-hidden="true">03</span> Dlaczego konie
            </p>

            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Jazda konna to nie jest
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-300)' }}> tylko sport</span>
            </h2>

            <div
              className="mt-8 max-w-[48ch] space-y-5 text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--color-sand-400)' }}
              data-reveal
              data-reveal-delay="0.1"
            >
              <p>
                Koń waży pół tony i nie wykonuje poleceń dlatego, że ktoś mu każe.
                Robi to wtedy, kiedy uzna, że człowiek obok wie, co robi. Tego nie da
                się przyspieszyć ani obejść — trzeba to zbudować.
              </p>
              <p>
                Dlatego u nas pierwsze zajęcia zaczynają się na ziemi, a nie w siodle.
                Dziecko, które samo wyczyści konia i poda mu marchewkę z płaskiej dłoni,
                wsiada potem spokojniejsze niż takie, które od razu posadzono w siodle.
              </p>
              <p>
                Efekt uboczny jest taki, że przy koniach trudno się spieszyć i trudno
                patrzeć w telefon. Sporo osób przyjeżdża do nas głównie po to.
              </p>
            </div>
          </div>

          {/* --- Fotografie w dwóch planach --- */}
          <div className="col-span-6 lg:col-start-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div data-parallax="10">
                <Photo
                  photo={photoRequired(
                    'Detal: dłoń człowieka na chrapach konia, miękkie światło — pion 4:5',
                    'Kontakt człowieka z koniem — dłoń na pysku',
                  )}
                  sizes="(max-width: 899px) 45vw, 20vw"
                  quality={70}
                />
              </div>
              <div className="mt-[18%]" data-parallax="-8">
                <Photo
                  photo={photoRequired(
                    'Oko konia w zbliżeniu, odbicie stajni w źrenicy — pion 4:5',
                    'Oko konia w zbliżeniu',
                  )}
                  sizes="(max-width: 899px) 45vw, 20vw"
                  quality={70}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
