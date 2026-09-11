import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Photo } from '@/components/ui/Photo';
import { Values } from '@/components/home/Values';
import { InstructorList } from '@/components/sections/InstructorList';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { MapSection } from '@/components/sections/LazyMap';
import { buildMetadata } from '@/lib/seo';
import { photoRequired } from '@/lib/types';
import { CITY_LOCATIVE } from '@/lib/site';
import { getInstructors } from '@/cms/content';
import { getSiteData } from '@/lib/site-data';

export const metadata: Metadata = buildMetadata({
  title: 'O nas — stajnia i szkoła jazdy konnej w Łomiankach',
  description:
    'Kim jesteśmy, jak uczymy i dlaczego zaczynamy od pracy z ziemi. Szkoła jazdy konnej MSdream w Łomiankach pod Warszawą.',
  path: '/o-nas',
});

export default async function AboutPage() {
  const [instructors, siteData] = await Promise.all([getInstructors(), getSiteData()]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'O nas', href: '/o-nas' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Stajnia, w której
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> nikt się nie spieszy</span>
              </h1>
              <div
                className="mt-9 max-w-[54ch] space-y-5 text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                <p>
                  MSdream to szkoła jazdy konnej w {CITY_LOCATIVE}, dwadzieścia minut od
                  północnych granic Warszawy. Uczymy dzieci i dorosłych — od osób,
                  które konia widziały tylko na zdjęciach, po jeźdźców pracujących
                  nad galopem i skokami.
                </p>
                <p>
                  Prowadzimy zajęcia indywidualnie i w bardzo małych grupach.
                  To nie jest decyzja marketingowa: przy koniach liczba osób
                  przypadających na instruktora przekłada się wprost na
                  bezpieczeństwo i na to, ile kursant faktycznie przejeździ.
                </p>
                <p>
                  Poza stajnią prowadzimy warsztaty tuftingu — inna dziedzina,
                  ta sama zasada: małe grupy, spokojne tempo i coś konkretnego
                  do zabrania do domu.
                </p>
              </div>
            </div>

            <div className="col-span-5 lg:col-start-8" data-reveal data-reveal-delay="0.12">
              <Photo
                photo={photoRequired(
                  'Szeroki kadr stajni od zewnątrz o poranku, konie w oknach boksów — pion 3:4',
                  `Stajnia MSdream w ${CITY_LOCATIVE}`,
                  '3/4',
                )}
                sizes="(max-width: 899px) 100vw, 38vw"
                quality={82}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filozofia pracy */}
      <section className="section" style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}>
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-5">
              <p className="eyebrow eyebrow--light mb-7" data-reveal>Jak uczymy</p>
              <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
                Zaczynamy na ziemi,
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-300)' }}> nie w siodle</span>
              </h2>
            </div>
            <div className="col-span-6 lg:col-start-7">
              <div className="space-y-6 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-sand-400)' }} data-reveal data-reveal-delay="0.08">
                <p>
                  Pierwsze minuty każdego kursu spędzamy obok konia, a nie na nim.
                  Kursant uczy się, z której strony podejść, gdzie stanąć, żeby zwierzę
                  go widziało, i jak go dotknąć, żeby nie było to zaskoczenie.
                </p>
                <p>
                  Brzmi jak formalność, ale to jest właśnie ta część, która decyduje
                  o reszcie. Osoba, która rozumie, jak koń reaguje, siedzi w siodle
                  spokojniej — a spokojny jeździec to spokojny koń.
                </p>
                <p>
                  Dlatego nie skracamy tego etapu nawet wtedy, kiedy ktoś przychodzi
                  z nastawieniem „chcę już jechać”. Po pierwszych zajęciach prawie
                  nikt nie ma o to pretensji.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Values />
      <InstructorList instructors={instructors} />
      <MapSection data={siteData} tone="alt" />
      <ClosingCta />
    </>
  );
}
