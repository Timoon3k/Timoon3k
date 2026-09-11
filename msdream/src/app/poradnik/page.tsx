import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getGuides } from '@/cms/content';
import { formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Poradnik — pierwsze kroki w jeździectwie',
  description:
    'Praktyczne odpowiedzi na pytania przed pierwszą jazdą konną: od jakiego wieku dziecko może jeździć, jak się przygotować i czego się spodziewać.',
  path: '/poradnik',
});

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Poradnik', href: '/poradnik' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial items-end gap-y-6 pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>Poradnik</h1>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }} data-reveal>
                Odpowiedzi na pytania, które najczęściej padają przy pierwszym telefonie
                do stajni — spisane, żeby nie trzeba było dzwonić.
              </p>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--color-line)' }}>
            {guides.map((guide, i) => (
              <article
                key={guide.slug}
                className="grid-editorial items-baseline gap-y-3 border-b py-8"
                style={{ borderColor: 'var(--color-line)' }}
                data-reveal
                data-reveal-delay={i * 0.05}
              >
                <div className="col-span-2">
                  <time
                    dateTime={guide.date}
                    className="text-xs uppercase tracking-[0.12em]"
                    style={{ color: 'var(--color-graphite-500)' }}
                  >
                    {formatDate(guide.date)}
                  </time>
                </div>
                <div className="col-span-9 lg:col-start-4">
                  <h2 style={{ fontSize: 'var(--text-heading)' }}>
                    <Link href={`/poradnik/${guide.slug}`} className="rein-link">
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                    {guide.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
