import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LandingHero } from '@/components/sections/LandingHero';
import { ServiceRows } from '@/components/home/ServiceRows';
import { Process } from '@/components/home/Process';
import { FaqSection } from '@/components/sections/FaqSection';
import { MapSection } from '@/components/sections/LazyMap';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getFaqByTopic, getServices } from '@/cms/content';
import { getSiteData } from '@/lib/site-data';
import { buildMetadata } from '@/lib/seo';
import { photoRequired } from '@/lib/types';

export const metadata: Metadata = buildMetadata({
  title: 'Nauka jazdy konnej — Łomianki i okolice Warszawy',
  description:
    'Nauka jazdy konnej dla dorosłych i młodzieży w Łomiankach pod Warszawą. Zajęcia indywidualne, praca na lonży dla początkujących i pakiety jazd.',
  path: '/nauka-jazdy-konnej-lomianki',
});

/**
 * Lokalna strona docelowa pod frazy „nauka jazdy konnej Łomianki",
 * „lekcje jazdy konnej Łomianki", „jazda konna okolice Warszawy".
 * Intencja: dorosły, który rozważa rozpoczęcie nauki.
 */
export default async function AdultsLandingPage() {
  const [services, faq, siteData] = await Promise.all([
    getServices(),
    getFaqByTopic('jazda-konna', 'rezerwacja'),
    getSiteData(),
  ]);

  const adultServices = services.filter((s) =>
    ['jazda-indywidualna', 'jazda-konna-dla-doroslych', 'pakiety-jazd'].includes(s.slug),
  );

  return (
    <>
      <Breadcrumbs items={[{ name: 'Nauka jazdy konnej', href: '/nauka-jazdy-konnej-lomianki' }]} />

      <LandingHero
        eyebrow="Łomianki · pod Warszawą"
        title="Nauka jazdy konnej"
        highlight="od pierwszej lekcji"
        lead="Większość naszych dorosłych kursantów zaczyna od zera — często po latach odkładania tego „na kiedyś”. Pierwsze zajęcia prowadzimy na lonży, żebyś mógł skupić się na dosiadzie zamiast na sterowaniu koniem."
        photo={photoRequired(
          'Dorosły jeździec na koniu podczas zajęć na lonży, instruktorka na środku ujeżdżalni — pion 3:4',
          'Nauka jazdy konnej dla dorosłych w Łomiankach',
          '3/4',
        )}
      />

      <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-5">
              <h2 style={{ fontSize: 'var(--text-title)' }} data-reveal>
                Trzy rzeczy, które warto
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> wiedzieć na starcie</span>
              </h2>
            </div>
            <div className="col-span-6 lg:col-start-7">
              <dl className="border-t" style={{ borderColor: 'var(--color-line)' }} data-reveal data-reveal-delay="0.08">
                <div className="border-b py-6" style={{ borderColor: 'var(--color-line)' }}>
                  <dt style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                    Nie ma górnej granicy wieku
                  </dt>
                  <dd className="mt-2.5 max-w-[52ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                    Zaczynają u nas zarówno dwudziestolatkowie, jak i osoby po sześćdziesiątce.
                    Znaczenie ma stan zdrowia i to, czy powiesz instruktorowi o kontuzjach —
                    a nie data w dowodzie.
                  </dd>
                </div>
                <div className="border-b py-6" style={{ borderColor: 'var(--color-line)' }}>
                  <dt style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                    To jest sport, i to odczujesz
                  </dt>
                  <dd className="mt-2.5 max-w-[52ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                    Po pierwszej jeździe dają o sobie znać wewnętrzne strony ud i mięśnie brzucha.
                    To dobry znak — oznacza, że siedziałeś aktywnie, a nie byłeś wożony.
                  </dd>
                </div>
                <div className="border-b py-6" style={{ borderColor: 'var(--color-line)' }}>
                  <dt style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                    Regularność bije talent
                  </dt>
                  <dd className="mt-2.5 max-w-[52ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                    Jedna jazda co tydzień daje więcej niż cztery w jednym miesiącu i przerwa.
                    Dlatego proponujemy pakiety — nie po to, żeby sprzedać więcej, tylko żeby
                    łatwiej było utrzymać rytm.
                  </dd>
                </div>
              </dl>

              <p className="mt-7 text-[0.9375rem]" style={{ color: 'var(--color-graphite-500)' }} data-reveal>
                Zobacz też:{' '}
                <Link href="/poradnik/jak-przygotowac-sie-do-pierwszej-lekcji" className="rein-link">
                  jak przygotować się do pierwszej lekcji
                </Link>{' '}
                oraz{' '}
                <Link href="/poradnik/pierwsza-jazda-konna-czego-sie-spodziewac" className="rein-link">
                  czego spodziewać się na pierwszej jeździe
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow mb-8" data-reveal>Zajęcia dla dorosłych</p>
          <ServiceRows services={adultServices} basePath="/oferta" />
        </div>
      </section>

      <Process />
      <FaqSection items={faq} title="Częste pytania" index="—" tone="alt" />
      <MapSection data={siteData} />
      <ClosingCta />
    </>
  );
}
