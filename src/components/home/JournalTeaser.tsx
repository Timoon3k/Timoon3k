import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Section';
import { formatDate } from '@/lib/format';
import type { Post } from '@/lib/types';

export default function JournalTeaser({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-hairline py-section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>Blog</Eyebrow>
            <h2 data-split className="mt-6 max-w-[18ch] text-major text-gradient-star">
              Wiedza, którą przydałoby się mieć przed zamówieniem strony
            </h2>
          </div>
          <Link
            href="/blog"
            className="link-underline font-mono text-[0.6875rem] tracking-[0.14em] text-dim uppercase transition-colors hover:text-signal"
          >
            Wszystkie wpisy
          </Link>
        </div>

        <div data-reveal-group className="mt-14 grid gap-px md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} data-reveal className="border-t border-hairline pt-7 md:pr-8">
              <p className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                <span>{post.category}</span>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
              <h3 className="mt-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-display text-[1.25rem] leading-snug font-semibold tracking-tight text-star transition-colors hover:text-signal"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-dim">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
