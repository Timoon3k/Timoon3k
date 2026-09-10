import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import { Eyebrow } from '@/components/ui/Section';
import { getPosts } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Blog — strony internetowe, wydajność i SEO w praktyce',
  description:
    'Praktyczne teksty o tworzeniu stron: ile kosztuje strona internetowa, Core Web Vitals krok po kroku, lokalne SEO i wybór między WordPressem a Next.js.',
  path: '/blog',
  ogImage: '/og/blog.png',
});

export default async function BlogPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      <section className="container-page pt-14 pb-16 md:pt-20">
        <Eyebrow>Blog</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[16ch] text-giant text-gradient-star">
          Konkrety zamiast marketingowych ogólników
        </h1>
        <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
          Piszę o rzeczach, które realnie wpływają na to, czy strona zarabia: wycenach, wydajności,
          widoczności w wyszukiwarce i wyborze technologii. Bez sprzedażowej papki.
        </p>
      </section>

      {/* Wpis wyróżniony */}
      {lead ? (
        <section className="container-page pb-16">
          <article data-reveal className="border-t border-hairline pt-10">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
              <span className="text-signal">Najnowszy</span>
              <span aria-hidden>·</span>
              <span>{lead.category}</span>
              <span aria-hidden>·</span>
              <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{lead.readingTime} min czytania</span>
            </p>
            <h2 className="mt-6 max-w-4xl">
              <Link
                href={`/blog/${lead.slug}`}
                className="font-display text-[clamp(1.875rem,4.6vw,3.5rem)] leading-[1.02] font-semibold tracking-tight text-star transition-colors duration-500 hover:text-signal"
              >
                {lead.title}
              </Link>
            </h2>
            <p className="mt-6 max-w-2xl text-lead text-dim">{lead.excerpt}</p>
            <Link
              href={`/blog/${lead.slug}`}
              className="link-underline mt-8 inline-block font-mono text-[0.6875rem] tracking-[0.14em] text-signal uppercase"
            >
              Czytaj wpis →
            </Link>
          </article>
        </section>
      ) : null}

      {/* Pozostałe wpisy */}
      {rest.length ? (
        <section className="container-page pb-section">
          <ul data-reveal-group className="border-t border-hairline">
            {rest.map((post) => (
              <li key={post.slug} className="border-b border-hairline">
                <Link
                  href={`/blog/${post.slug}`}
                  data-reveal
                  className="group grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase md:col-span-2">
                    {post.category}
                  </p>
                  <h2 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug font-semibold tracking-tight text-star transition-colors duration-500 group-hover:text-signal md:col-span-6">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-dim md:col-span-3">{post.excerpt}</p>
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase md:col-span-1 md:text-right">
                    {post.readingTime} min
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ContactCta
        title="Masz pytanie, na które nie ma tu odpowiedzi?"
        lead="Napisz — jeśli temat wraca częściej, prawdopodobnie powstanie z tego kolejny wpis."
        variant="compact"
      />
    </>
  );
}
