import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { ServiceRows } from '@/components/home/ServiceRows';
import { FaqSection } from '@/components/sections/FaqSection';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { ServiceView } from '@/components/sections/ServiceView';

import { getFaqByTopic, getService, getServices } from '@/cms/content';
import { buildMetadata, serviceJsonLd } from '@/lib/seo';

/** Wszystkie usługi generujemy statycznie — zero pracy serwera na żądanie. */
export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<'/oferta/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) return {};

  return buildMetadata({
    title: `${service.name} — ${service.category === 'tufting' ? 'warsztaty tuftingu' : 'jazda konna'} Łomianki`,
    description: `${service.tagline} ${service.description}`.slice(0, 158),
    path: `/oferta/${service.slug}`,
  });
}

export default async function ServicePage(props: PageProps<'/oferta/[slug]'>) {
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) notFound();

  const tufting = service.category === 'tufting';
  const [all, faq] = await Promise.all([
    getServices(),
    getFaqByTopic(tufting ? 'tufting' : 'jazda-konna', 'rezerwacja'),
  ]);

  const related = all
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={serviceJsonLd(service, `/oferta/${service.slug}`)} />
      <Breadcrumbs
        items={[
          { name: 'Oferta', href: '/oferta' },
          {
            name: tufting ? 'Warsztaty tuftingu' : 'Jazda konna',
            href: tufting ? '/oferta/warsztaty-tuftingu' : '/oferta/jazda-konna',
          },
          { name: service.name, href: `/oferta/${service.slug}` },
        ]}
      />

      <ServiceView service={service} />

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
          <div className="shell">
            <p className="eyebrow mb-8" data-reveal>Zobacz też</p>
            <ServiceRows services={related} basePath="/oferta" />
          </div>
        </section>
      )}

      <FaqSection items={faq} title="Zanim zarezerwujesz" index="—" />

      <ClosingCta
        title={tufting ? 'Zarezerwuj warsztat' : 'Zarezerwuj zajęcia'}
        primaryHref={tufting ? '/rezerwacja-tuftingu' : '/rezerwacja'}
        primaryLabel="Wybierz termin"
      />
    </>
  );
}
