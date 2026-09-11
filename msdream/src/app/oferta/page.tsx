import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ServiceRows } from '@/components/home/ServiceRows';
import { FaqSection } from '@/components/sections/FaqSection';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getFaqByTopic, getRidingServices, getTuftingServices } from '@/cms/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Oferta — jazda konna i warsztaty tuftingu w Łomiankach',
  description:
    'Zajęcia jazdy konnej dla dzieci i dorosłych, jazdy indywidualne, pakiety oraz warsztaty tuftingu. Sprawdź, co obejmują poszczególne zajęcia i zarezerwuj termin online.',
  path: '/oferta',
});

export default async function OfferPage() {
  const [riding, tufting, faq] = await Promise.all([
    getRidingServices(),
    getTuftingServices(),
    getFaqByTopic('rezerwacja', 'jazda-konna'),
  ]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Oferta', href: '/oferta' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial items-end gap-y-8">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Oferta
              </h1>
              <p className="mt-6 max-w-[48ch]" style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }} data-reveal data-reveal-delay="0.08">
                Dwie gałęzie: nauka jazdy konnej i warsztaty tuftingu. Przy każdych
                zajęciach znajdziesz to, co obejmują, dla kogo są i o czym trzeba
                wiedzieć przed przyjazdem.
              </p>
            </div>
            <div className="col-span-4 flex flex-wrap gap-3 lg:col-start-9 lg:justify-end" data-reveal data-reveal-delay="0.12">
              <Link href="/oferta/jazda-konna" className="btn btn--ghost">Jazda konna</Link>
              <Link href="/oferta/warsztaty-tuftingu" className="btn btn--ghost">Tufting</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section--tight section" id="jazda-konna">
        <div className="shell">
          <p className="eyebrow mb-8" data-reveal><span aria-hidden="true">01</span> Jazda konna</p>
          <ServiceRows services={riding} basePath="/oferta" />
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-ivory-200)' }} id="tufting">
        <div className="shell">
          <p className="eyebrow mb-8" style={{ color: 'var(--color-wool-700)' }} data-reveal>
            <span aria-hidden="true">02</span> Warsztaty tuftingu
          </p>
          <ServiceRows services={tufting} basePath="/oferta" />
        </div>
      </section>

      <FaqSection items={faq} title="Pytania o zajęcia i rezerwację" index="—" />
      <ClosingCta />
    </>
  );
}
