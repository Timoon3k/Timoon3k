import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EditorialGallery } from '@/components/gallery/EditorialGallery';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getGallery } from '@/cms/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Galeria — stajnia, konie i zajęcia w Łomiankach',
  description:
    'Zdjęcia ze stajni MSdream w Łomiankach: konie, zajęcia jeździeckie dla dzieci i dorosłych oraz warsztaty tuftingu.',
  path: '/galeria',
});

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Galeria', href: '/galeria' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial items-end gap-y-6 pb-[clamp(2.5rem,5vw,4rem)]">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>Galeria</h1>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <p
                className="max-w-[34ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
                data-reveal
              >
                Zdjęcia z codziennych zajęć — bez pozowania i bez stocku.
                Kliknij kadr, żeby zobaczyć go w pełnym rozmiarze.
              </p>
            </div>
          </div>

          <EditorialGallery images={images} />
        </div>
      </section>

      <ClosingCta
        title="Przyjedź zobaczyć na żywo"
        body="Zdjęcia oddają mniej więcej połowę. Reszta to zapach stajni i to, jak koń oddycha, kiedy się przy nim stoi."
      />
    </>
  );
}
