import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ServiceRows } from '@/components/home/ServiceRows';
import { FaqSection } from '@/components/sections/FaqSection';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { TuftingProcess } from '@/components/sections/TuftingProcess';
import { Photo } from '@/components/ui/Photo';
import { getFaqByTopic, getTuftingServices } from '@/cms/content';
import { buildMetadata } from '@/lib/seo';
import { photoRequired } from '@/lib/types';
import { CITY_LOCATIVE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Warsztaty tuftingu — Łomianki pod Warszawą',
  description:
    'Warsztaty tuftingu w Łomiankach: indywidualne, mama z dzieckiem, grupowe oraz urodziny. Projektujesz własny dywanik i zabierasz go gotowego do domu.',
  path: '/oferta/warsztaty-tuftingu',
});

export default async function TuftingPage() {
  const [services, faq] = await Promise.all([
    getTuftingServices(),
    getFaqByTopic('tufting', 'rezerwacja'),
  ]);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Oferta', href: '/oferta' },
          { name: 'Warsztaty tuftingu', href: '/oferta/warsztaty-tuftingu' },
        ]}
      />

      {/* --- Hero tuftingu ---
          Ten sam system, inna osobowość: cieplejsza paleta (wełna, glina),
          bardziej fakturowe tło. Wciąż bez gradientów i bez infantylizacji. */}
      <section
        className="relative overflow-hidden pt-[clamp(1rem,3vw,2rem)]"
        style={{ background: 'var(--color-ivory-50)' }}
      >
        <div className="shell pb-[clamp(3rem,6vw,5rem)]">
          <div className="grid-editorial items-end gap-y-10">
            <div className="col-span-7">
              <p className="eyebrow" style={{ color: 'var(--color-wool-700)' }} data-reveal>
                Warsztaty
              </p>
              <h1 className="mt-7" style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Wychodzisz stąd
                <span style={{ fontStyle: 'italic', color: 'var(--color-wool-500)' }}> z gotowym dywanikiem</span>
              </h1>
              <p
                className="mt-7 max-w-[48ch]"
                style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                Nie z półproduktem do dokończenia w domu i nie z zestawem do samodzielnego
                złożenia. Projektujesz, tuftujesz, wykańczasz — i zabierasz gotową rzecz.
              </p>
              <p
                className="mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
                data-reveal
                data-reveal-delay="0.12"
              >
                Warsztaty prowadzimy w {CITY_LOCATIVE}, w tym samym miejscu co zajęcia jeździeckie.
                Nie trzeba umieć rysować ani mieć wcześniejszego doświadczenia z wełną.
              </p>
            </div>

            <div className="col-span-5 lg:col-start-8" data-reveal data-reveal-delay="0.1">
              <Photo
                photo={photoRequired(
                  'Gotowy dywanik tuftingowy trzymany w dłoniach na tle warsztatu, nasycone kolory wełny — pion 3:4',
                  `Gotowy dywanik z warsztatów tuftingu w ${CITY_LOCATIVE}`,
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

      <TuftingProcess />

      <section className="section" style={{ background: 'var(--color-ivory-100)' }}>
        <div className="shell">
          <p className="eyebrow mb-8" style={{ color: 'var(--color-wool-700)' }} data-reveal>
            Warianty warsztatów
          </p>
          <ServiceRows services={services} basePath="/oferta" />
        </div>
      </section>

      <FaqSection items={faq} title="Pytania o warsztaty" index="—" tone="alt" />

      <ClosingCta
        title="Zarezerwuj warsztat"
        body="Terminy weekendowe schodzą pierwsze — szczególnie przy urodzinach i warsztatach grupowych."
        primaryHref="/rezerwacja-tuftingu"
        primaryLabel="Wybierz termin"
      />
    </>
  );
}
