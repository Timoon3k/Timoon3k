import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, type Crumb } from '@/lib/seo';

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const last = crumbs[crumbs.length - 1];

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <nav aria-label="Ścieżka nawigacji" className="container-page pt-28 md:pt-32">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.14em] text-faint uppercase">
          {crumbs.map((crumb, index) => {
            const isLast = crumb === last;
            return (
              <li key={crumb.href} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden className="text-faint/50">
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span aria-current="page" className="text-dim">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="link-underline transition-colors hover:text-signal">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
