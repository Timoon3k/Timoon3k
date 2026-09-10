import Link from 'next/link';
import BrowserFrame from '@/components/portfolio/BrowserFrame';
import type { Project } from '@/lib/types';
import type { CSSProperties } from 'react';

/**
 * Wiersz realizacji. Kolor akcentu przekazywany jest zmienną CSS, dzięki czemu
 * cała interakcja hover działa bez JavaScriptu i bez komponentu klienckiego.
 */
export default function ProjectRow({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const flipped = index % 2 === 1;

  return (
    <article
      style={{ '--project-accent': project.accent } as CSSProperties}
      className="group relative border-t border-hairline"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(70% 120% at 50% 0%, color-mix(in oklab, var(--project-accent) 12%, transparent), transparent 65%)',
        }}
      />

      <Link
        href={`/portfolio/${project.slug}`}
        className="relative grid items-center gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20"
        aria-label={`Case study: ${project.client} — ${project.title}`}
      >
        <div
          className={`md:col-span-5 ${flipped ? 'md:order-2 md:col-start-8' : 'md:col-start-1'}`}
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-faint">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              aria-hidden
              className="h-px flex-1 origin-left bg-hairline-strong transition-colors duration-500 group-hover:bg-[var(--project-accent)]"
            />
          </div>

          <h3 className="mt-6 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-star">
            {project.client}
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-snug text-dim">{project.title}</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-faint">{project.summary}</p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border border-hairline px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.1em] text-dim uppercase transition-colors duration-500 group-hover:border-[var(--project-accent)]/40"
              >
                {tag}
              </li>
            ))}
          </ul>

          <span className="mt-8 inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-star uppercase">
            Zobacz case study
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
            </svg>
          </span>
        </div>

        <div
          className={`md:col-span-6 ${flipped ? 'md:order-1 md:col-start-1' : 'md:col-start-7'}`}
          data-parallax="34"
        >
          <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 md:[perspective:1400px]">
            <BrowserFrame
              image={project.cover}
              domain={project.domain}
              priority={priority}
              className={
                flipped
                  ? 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:[transform:rotateY(4deg)_rotateX(2deg)] md:group-hover:[transform:rotateY(0deg)_rotateX(0deg)]'
                  : 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:[transform:rotateY(-4deg)_rotateX(2deg)] md:group-hover:[transform:rotateY(0deg)_rotateX(0deg)]'
              }
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
