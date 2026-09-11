import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MapSection } from '@/components/sections/LazyMap';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getSiteData } from '@/lib/site-data';
import { buildMetadata } from '@/lib/seo';
import { CITY_LOCATIVE } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Dojazd i mapa — stajnia MSdream w Łomiankach',
  description:
    'Jak dojechać do stajni MSdream w Łomiankach: mapa, adres, wskazówki dojazdu samochodem i komunikacją oraz kontakt.',
  path: '/mapa',
});

export default async function MapPage() {
  const data = await getSiteData();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Mapa', href: '/mapa' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-8">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Jak do nas
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> trafić</span>
              </h1>
              <p
                className="mt-7 max-w-[48ch]"
                style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                Jesteśmy w {CITY_LOCATIVE}, dwadzieścia minut od północnych granic Warszawy.
                Na miejscu jest parking — nie trzeba szukać miejsca wzdłuż drogi.
              </p>
            </div>
          </div>
        </div>
      </section>

      <MapSection data={data} tone="alt" />
      <ClosingCta />
    </>
  );
}
