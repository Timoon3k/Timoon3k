import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JsonLd } from '@/components/ui/JsonLd';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Markdown } from '@/lib/markdown';
import { getGuide, getGuides } from '@/cms/content';
import { formatDate } from '@/lib/format';
import { articleJsonLd, buildMetadata } from '@/lib/seo';

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(props: PageProps<'/poradnik/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = await getGuide(slug);
  if (!guide) return {};

  return buildMetadata({
    title: guide.title,
    description: guide.excerpt.slice(0, 158),
    path: `/poradnik/${guide.slug}`,
    type: 'article',
    publishedTime: guide.date,
  });
}

export default async function GuidePage(props: PageProps<'/poradnik/[slug]'>) {
  const { slug } = await props.params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const guides = await getGuides();
  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={articleJsonLd(guide)} />
      <Breadcrumbs
        items={[
          { name: 'Poradnik', href: '/poradnik' },
          { name: guide.title, href: `/poradnik/${guide.slug}` },
        ]}
      />

      <article className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-8">
            <header className="col-span-8">
              <time
                dateTime={guide.date}
                className="text-xs uppercase tracking-[0.12em]"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                {formatDate(guide.date)}
              </time>
              <h1 className="mt-5" style={{ fontSize: 'var(--text-display)' }}>
                {guide.title}
              </h1>
              <p className="mt-6 max-w-[52ch]" style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}>
                {guide.excerpt}
              </p>
            </header>
          </div>

          <div className="grid-editorial mt-12">
            <div className="col-span-8 lg:col-start-3">
              {/* Treść z CMS-u jest już HTML-em z edytora WordPressa; treść
                  startowa jest w Markdownie. Renderujemy właściwym torem. */}
              <div className="prose" style={{ color: 'var(--color-graphite-700)' }}>
                {guide.format === 'html' ? (
                  <div dangerouslySetInnerHTML={{ __html: guide.body }} />
                ) : (
                  <Markdown content={guide.body} />
                )}
              </div>
            </div>
          </div>

          {others.length > 0 && (
            <div className="grid-editorial mt-16">
              <div className="col-span-8 lg:col-start-3">
                <p className="eyebrow mb-6">Czytaj dalej</p>
                <ul className="border-t" style={{ borderColor: 'var(--color-line)' }}>
                  {others.map((other) => (
                    <li key={other.slug} className="border-b py-5" style={{ borderColor: 'var(--color-line)' }}>
                      <Link href={`/poradnik/${other.slug}`} className="rein-link" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                        {other.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </article>

      <ClosingCta />
    </>
  );
}
