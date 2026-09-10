'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { loadGsap } from '@/lib/animation/gsap';
import BrowserFrame from '@/components/portfolio/BrowserFrame';
import HeroCanvas from '@/components/three/HeroCanvas';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';
import type { Project } from '@/lib/types';

const DEFAULT_ACCENT = '#5ce1ff';

/**
 * Lista realizacji w układzie indeksu.
 *
 * Na dużych ekranach podgląd projektu podąża za kursorem, a scena 3D w tle
 * przejmuje kolor akcentu wskazywanej realizacji. Na urządzeniach dotykowych
 * i przy `prefers-reduced-motion` całość degraduje się do zwykłej listy kart.
 */
export default function PortfolioShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const moveTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  useEffect(() => {
    const node = previewRef.current;
    if (!node || prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (min-width: 1024px)').matches) return;

    let cleanup: (() => void) | undefined;

    void loadGsap().then(({ gsap }) => {
      moveTo.current = {
        x: gsap.quickTo(node, 'x', { duration: 0.85, ease: 'power3.out' }),
        y: gsap.quickTo(node, 'y', { duration: 0.85, ease: 'power3.out' }),
      };

      const onMove = (event: PointerEvent) => {
        moveTo.current?.x(event.clientX);
        moveTo.current?.y(event.clientY);
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      cleanup = () => {
        window.removeEventListener('pointermove', onMove);
        moveTo.current = null;
        gsap.set(node, { clearProps: 'all' });
      };
    });

    return () => cleanup?.();
  }, []);

  const accent = active !== null ? (projects[active]?.accent ?? DEFAULT_ACCENT) : DEFAULT_ACCENT;

  return (
    <div className="relative">
      {/* Scena 3D reaguje na wskazywaną realizację */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 h-[70vh] opacity-30">
        <HeroCanvas accent={accent} />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,var(--color-void),transparent)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,var(--color-void),transparent)]" />
      </div>

      <ul
        className="relative border-t border-hairline"
        onPointerLeave={() => setActive(null)}
      >
        {projects.map((project, index) => (
          <li key={project.slug} className="border-b border-hairline">
            <Link
              href={`/portfolio/${project.slug}`}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group relative flex flex-col gap-6 py-8 transition-colors duration-500 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 lg:py-10"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 inset-y-0 origin-left scale-x-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035),transparent)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />

              <span className="relative font-mono text-[0.6875rem] tracking-[0.16em] text-faint lg:col-span-1">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h2 className="relative font-display text-[clamp(1.75rem,4.2vw,3.25rem)] leading-[1.02] font-semibold tracking-tight text-star transition-colors duration-500 lg:col-span-5 lg:group-hover:translate-x-2 lg:transition-transform">
                {project.client}
              </h2>

              <p className="relative text-sm text-dim lg:col-span-3">{project.category}</p>

              <p className="relative font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase lg:col-span-2">
                {project.domain}
              </p>

              <span
                aria-hidden
                className="relative hidden justify-self-end text-dim transition-colors duration-500 group-hover:text-signal lg:col-span-1 lg:block"
              >
                →
              </span>

              {/* Podgląd w układzie mobilnym — zawsze widoczny */}
              <div className="relative lg:hidden">
                <BrowserFrame image={project.cover} domain={project.domain} />
                <p className="mt-4 text-sm leading-relaxed text-dim">{project.summary}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Podgląd podążający za kursorem — wyłącznie dekoracyjny */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden w-[26rem] -translate-x-1/2 -translate-y-1/2 lg:block"
        style={{ opacity: active !== null ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >
        {projects.map((project, index) => (
          <div
            key={project.slug}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: active === index ? 1 : 0 }}
          >
            <BrowserFrame image={project.cover} domain={project.domain} />
          </div>
        ))}
        {/* Rezerwacja wysokości, żeby kontener nie miał zerowych wymiarów */}
        <div style={{ aspectRatio: '1600 / 1000' }} />
      </div>
    </div>
  );
}
