import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LandingHero } from '@/components/sections/LandingHero';
import { ServiceRows } from '@/components/home/ServiceRows';
import { FaqSection } from '@/components/sections/FaqSection';
import { MapSection } from '@/components/sections/LazyMap';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getFaqByTopic, getServices } from '@/cms/content';
import { getSiteData } from '@/lib/site-data';
import { buildMetadata } from '@/lib/seo';
import { photoRequired } from '@/lib/types';

export const metadata: Metadata = buildMetadata({
  title: 'Jazda konna dla dzieci — Łomianki',
  description:
    'Nauka jazdy konnej dla dzieci w Łomiankach: od zajęć ABC dla najmłodszych po regularne treningi. Sprawdź, od jakiego wieku zacząć i jak wyglądają pierwsze zajęcia.',
  path: '/jazda-konna-dla-dzieci-lomianki',
});

/**
 * Lokalna strona docelowa pod frazę „jazda konna dla dzieci Łomianki".
 *
 * Celowo różni się intencją od strony usługi (`/oferta/jazda-konna-dla-dzieci`):
 * tam jest karta zajęć z ceną i przyciskiem rezerwacji, tutaj — odpowiedź na
 * pytania rodzica, który dopiero rozważa zapisanie dziecka. Dzięki temu obie
 * strony nie konkurują ze sobą o to samo zapytanie.
 */
export default async function KidsLandingPage() {
  const [services, faq, siteData] = await Promise.all([
    getServices(),
    getFaqByTopic('dzieci', 'jazda-konna'),
    getSiteData(),
  ]);

  const kidsServices = services.filter((s) =>
    ['abc-jazdy-konnej', 'jazda-konna-dla-dzieci', 'pakiety-jazd'].includes(s.slug),
  );

  return (
    <>
      <Breadcrumbs
        items={[{ name: 'Jazda konna dla dzieci', href: '/jazda-konna-dla-dzieci-lomianki' }]}
      />

      <LandingHero
        eyebrow="Łomianki · dla dzieci"
        title="Jazda konna dla dzieci"
        highlight="w Łomiankach"
        lead="Uczymy dzieci od pierwszego kontaktu z koniem. Zaczynamy na ziemi — od czyszczenia i głaskania — a w siodle sadzamy dopiero wtedy, gdy dziecko samo tego chce."
        photo={photoRequired(
          'Dziecko w kasku siedzące na koniu prowadzonym przez instruktorkę, rodzic obserwujący z boku — pion 3:4, złota godzina',
          'Jazda konna dla dzieci w Łomiankach — zajęcia w MSdream',
          '3/4',
        )}
      />

      <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-5">
              <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
                Od jakiego wieku?
              </h2>
            </div>
            <div className="col-span-6 lg:col-start-7">
              <div
                className="space-y-5 text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                <p>
                  Najmłodsi zaczynają u nas zwykle około czwartego roku życia. Wiek
                  z metryki jest jednak najsłabszym wskaźnikiem — dużo ważniejsze jest,
                  czy dziecko wytrzyma kilkanaście minut skupienia i czy samo chce
                  podejść do konia.
                </p>
                <p>
                  Dziecko przyprowadzone wbrew sobie nie nauczy się jeździć. Jeśli
                  po dziesięciu minutach woli zbierać patyki niż zbliżyć się do konia,
                  traktujemy to jako informację, a nie porażkę — można wrócić za pół roku.
                </p>
                <p>
                  Więcej piszemy o tym w poradniku:{' '}
                  <Link href="/poradnik/od-jakiego-wieku-dziecko-moze-jezdzic-konno" className="rein-link">
                    od jakiego wieku dziecko może zacząć jazdę konną
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow mb-8" data-reveal>Zajęcia dla dzieci</p>
          <ServiceRows services={kidsServices} basePath="/oferta" />
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}>
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-5">
              <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
                Bezpieczeństwo
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-300)' }}> nie jest opcją</span>
              </h2>
            </div>
            <div className="col-span-6 lg:col-start-7">
              <ul className="space-y-5 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-sand-400)' }} data-reveal data-reveal-delay="0.08">
                <li className="flex gap-4">
                  <span aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>—</span>
                  <span><strong style={{ color: 'var(--color-ivory-100)' }}>Kask obowiązkowy.</strong> Mamy je na miejscu w rozmiarach dziecięcych, wliczone w zajęcia.</span>
                </li>
                <li className="flex gap-4">
                  <span aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>—</span>
                  <span><strong style={{ color: 'var(--color-ivory-100)' }}>Konie dobierane do dziecka.</strong> Do najmłodszych pracują wyłącznie konie spokojne i przyzwyczajone do zamieszania.</span>
                </li>
                <li className="flex gap-4">
                  <span aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>—</span>
                  <span><strong style={{ color: 'var(--color-ivory-100)' }}>Instruktor przy koniu.</strong> Przy zajęciach ABC koń jest cały czas prowadzony — dziecko nie steruje nim samodzielnie.</span>
                </li>
                <li className="flex gap-4">
                  <span aria-hidden="true" style={{ color: 'var(--color-brass-400)' }}>—</span>
                  <span><strong style={{ color: 'var(--color-ivory-100)' }}>Rodzic obecny.</strong> Przy zajęciach dla najmłodszych obecność opiekuna jest wymagana.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FaqSection items={faq} title="Pytania rodziców" index="—" tone="alt" />
      <MapSection data={siteData} />
      <ClosingCta
        title="Zapisz dziecko na pierwsze zajęcia"
        body="Zacznijcie od jednych zajęć ABC. To wystarczy, żeby zobaczyć, czy dziecko złapie bakcyla — bez kupowania pakietu w ciemno."
      />
    </>
  );
}
