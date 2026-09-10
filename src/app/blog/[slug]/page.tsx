import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import JsonLd from '@/components/seo/JsonLd';
import { Markdown } from '@/lib/markdown';
import { getPostBySlug, getPosts } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { articleSchema, buildMetadata } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({ title: 'Nie znaleziono', description: '', path: '/blog', noIndex: true });
  }

  return buildMetadata({
    title: post.seo.title,
    description: post.seo.description,
    path: `/blog/${post.slug}`,
    ogImage: '/og/blog.png',
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
  });
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPostBySlug(slug), getPosts()]);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.seo.description,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
        })}
      />

      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="container-page pt-14 pb-section md:pt-20">
        <header className="max-w-4xl">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
            <span className="text-signal">{post.category}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime} min czytania</span>
          </p>
          <h1 data-split="immediate" className="mt-7 text-giant text-gradient-star">
            {post.title}
          </h1>
          <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
            {post.excerpt}
          </p>
        </header>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8 lg:col-span-7">
            <Markdown content={post.body} />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-32 border-t border-hairline pt-7">
              <h2 className="eyebrow">Potrzebujesz konkretnej odpowiedzi?</h2>
              <p className="mt-5 text-sm leading-relaxed text-dim">
                Opisz swoją sytuację — odpiszę, co realnie ma sens w Twoim przypadku, nawet jeśli
                odpowiedź brzmi „na razie nic nie zmieniaj”.
              </p>
              <Link
                href="/kontakt#formularz"
                className="link-underline mt-6 inline-block font-mono text-[0.6875rem] tracking-[0.14em] text-signal uppercase"
              >
                Napisz do mnie →
              </Link>
            </div>
          </aside>
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-hairline py-section">
          <div className="container-page">
            <p className="eyebrow">Czytaj dalej</p>
            <div className="mt-10 grid gap-px md:grid-cols-2">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  data-reveal
                  className="group border-t border-hairline py-8 md:pr-10"
                >
                  <p className="font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                    {item.category}
                  </p>
                  <h3 className="mt-4 font-display text-headline leading-snug font-semibold tracking-tight text-star transition-colors duration-500 group-hover:text-signal">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-dim">{item.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <ContactCta variant="compact" />
    </>
  );
}
