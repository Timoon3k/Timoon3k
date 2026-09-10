'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import BrowserFrame from '@/components/portfolio/BrowserFrame';
import { loadGsap } from '@/lib/animation/gsap';
import type { Project } from '@/lib/types';

/**
 * Kinowy pokaz realizacji.
 *
 * Na dużych ekranach wizual jest przyklejony, a przewijanie opisów przełącza
 * aktywny projekt — zmienia się mockup, akcent i poświata tła. Na wąskich
 * ekranach sticky nie ma sensu (nie ma obok czego przykleić), więc układ
 * degraduje się do listy kart, w której każdy projekt niesie własny obraz.
 *
 * Każda pozycja pozostaje zwykłym odnośnikiem — przełączanie jest warstwą
 * prezentacji, nie sposobem nawigacji.
 */
export default function CinematicWork({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const rowsRef = useRef<(HTMLElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    // Sticky włącza się dopiero od układu dwukolumnowego.
    if (!window.matchMedia('(min-width: 1024px)').matches) return;

    let triggers: ScrollTrigger[] = [];
    let cancelled = false;

    void loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      triggers = rowsRef.current.flatMap((row, index) =>
        row
          ? [
              ScrollTrigger.create({
                trigger: row,
                start: 'top 62%',
                end: 'bottom 42%',
                onEnter: () => setActive(index),
                onEnterBack: () => setActive(index),
              }),
            ]
          : [],
      );
    });

    return () => {
      cancelled = true;
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  const accent = projects[active]?.accent ?? '#5ce1ff';

  return (
    <div
      ref={sectionRef}
      style={{ '--stage-accent': accent } as CSSProperties}
      className="relative"
    >
      {/* Poświata przejmująca kolor aktywnej realizacji */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] h-[70%] opacity-70 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(48% 42% at 30% 40%, color-mix(in oklab, var(--stage-accent) 13%, transparent), transparent 70%)',
        }}
      />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Kolumna wizualna — przyklejona, wymienia mockupy przenikaniem */}
        <div className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[18vh]">
            <div className="relative" style={{ aspectRatio: '1600 / 1000' }}>
              {projects.map((project, index) => (
                <div
                  key={project.slug}
                  aria-hidden={index !== active}
                  className="absolute inset-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    opacity: index === active ? 1 : 0,
                    transform: index === active ? 'scale(1)' : 'scale(0.97)',
                  }}
                >
                  <BrowserFrame image={project.cover} domain={project.domain} />
                </div>
              ))}
            </div>

            <p className="mt-6 flex items-center gap-4 font-mono text-[0.6875rem] tracking-[0.14em] text-faint uppercase">
              <span className="text-star">{String(active + 1).padStart(2, '0')}</span>
              <span aria-hidden className="h-px flex-1 bg-hairline-strong" />
              <span>{String(projects.length).padStart(2, '0')}</span>
            </p>
          </div>
        </div>

        {/* Kolumna opisowa */}
        <div className="lg:col-span-5 lg:col-start-8">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              ref={(node) => {
                rowsRef.current[index] = node;
              }}
              className="border-t border-hairline py-12 first:border-t-0 first:pt-0 lg:min-h-[62vh] lg:py-24"
            >
              <div
                className="transition-opacity duration-500 lg:opacity-40"
                style={{ opacity: index === active ? 1 : undefined }}
              >
                <p className="flex items-center gap-4 font-mono text-[0.6875rem] tracking-[0.16em] text-faint">
                  {String(index + 1).padStart(2, '0')}
                  <span
                    aria-hidden
                    className="h-px w-10 transition-colors duration-500"
                    style={{ background: index === active ? accent : 'var(--color-hairline-strong)' }}
                  />
                  <span className="uppercase">{project.category}</span>
                </p>

                <h3 className="mt-6 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] font-semibold tracking-tight text-star">
                  <Link href={`/portfolio/${project.slug}`} className="transition-colors hover:text-signal">
                    {project.client}
                  </Link>
                </h3>

                <p className="mt-4 text-lead leading-snug text-dim">{project.title}</p>
                <p className="mt-5 max-w-md leading-relaxed text-faint">{project.summary}</p>

                {/* Obraz towarzyszy opisowi tylko tam, gdzie nie ma kolumny sticky */}
                <div className="mt-8 lg:hidden">
                  <BrowserFrame image={project.cover} domain={project.domain} />
                </div>

                <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="font-mono text-[0.625rem] tracking-[0.12em] text-dim uppercase">
                      {tag}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/portfolio/${project.slug}`}
                  data-magnetic
                  className="group mt-9 inline-flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.14em] text-star uppercase"
                >
                  Zobacz case study
                  <span
                    aria-hidden
                    className="inline-block h-px w-8 transition-all duration-500 group-hover:w-12"
                    style={{ background: accent }}
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
