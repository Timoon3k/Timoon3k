import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export interface Crumb {
  name: string;
  href: string;
}

/** Okruszki + odpowiadający im BreadcrumbList. Jedno źródło, zero rozjazdu. */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const trail: Crumb[] = [{ name: 'Strona główna', href: '/' }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Ścieżka nawigacji" className="shell pt-28 pb-2 sm:pt-32">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--color-graphite-500)' }}>
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" style={{ color: 'var(--color-graphite-700)' }}>
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.href} className="rein-link">
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
