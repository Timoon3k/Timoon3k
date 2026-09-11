import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ServiceRows } from '@/components/home/ServiceRows';
import { Process } from '@/components/home/Process';
import { FaqSection } from '@/components/sections/FaqSection';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { InstructorList } from '@/components/sections/InstructorList';
import { getFaqByTopic, getInstructors, getRidingServices } from '@/cms/content';
import { buildMetadata } from '@/lib/seo';
import { CITY_LOCATIVE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Jazda konna Łomianki — zajęcia dla dzieci i dorosłych',
  description:
    'Nauka jazdy konnej w Łomiankach: zajęcia ABC dla najmłodszych, jazdy indywidualne, zajęcia dla dzieci i dorosłych oraz pakiety. Sprawdź, co obejmują poszczególne zajęcia.',
  path: '/oferta/jazda-konna',
});

export default async function RidingPage() {
  const [services, instructors, faq] = await Promise.all([
    getRidingServices(),
    getInstructors(),
    getFaqByTopic('jazda-konna', 'dzieci', 'rezerwacja'),
  ]);

  return (
    <>
      <Breadcrumbs
        items={[
          { name: 'Oferta', href: '/oferta' },
          { name: 'Jazda konna', href: '/oferta/jazda-konna' },
        ]}
      />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-8">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Jazda konna
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> w {CITY_LOCATIVE}</span>
              </h1>
              <p
                className="mt-7 max-w-[50ch]"
                style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                Uczymy od pierwszego kontaktu z koniem po samodzielną jazdę. Poziom
                i tempo dobieramy do jeźdźca, nie odwrotnie — dlatego początkujący
                zaczynają indywidualnie albo na lonży.
              </p>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <div
                className="border-t pt-6 text-[0.875rem] leading-relaxed"
                style={{ borderColor: 'var(--color-line)', color: 'var(--color-graphite-500)' }}
                data-reveal
                data-reveal-delay="0.12"
              >
                <p>
                  Kask i sprzęt jeździecki są na miejscu i wliczone w zajęcia.
                  Nie musisz niczego kupować przed pierwszą jazdą.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight section">
        <div className="shell">
          <ServiceRows services={services} basePath="/oferta" />
        </div>
      </section>

      <Process />
      <InstructorList instructors={instructors} />
      <FaqSection items={faq} title="Pytania o naukę jazdy konnej" index="—" tone="alt" />
      <ClosingCta />
    </>
  );
}
