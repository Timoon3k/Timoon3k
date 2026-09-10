'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

/**
 * Wejście zawartości po zmianie ścieżki.
 *
 * Animowane są wyłącznie `clip-path`, `opacity` i `transform`, więc przejście
 * nie przelicza układu i nie generuje przesunięć. Nawigacja nigdy nie czeka na
 * animację — Next renderuje nową trasę od razu, a to jest tylko jej wejście.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (first.current) {
      first.current = false;
      return;
    }
    if (prefersReducedMotion()) return;

    // Pozycją przewijania zarządza wyłącznie ScrollManager — dwa niezależne
    // resety ścigałyby się ze sobą przy każdej zmianie trasy.
    let cleanup: (() => void) | undefined;

    void loadGsap().then(({ gsap }) => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          node,
          { clipPath: 'inset(0% 0% 12% 0%)', opacity: 0, y: 22 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: 'power3.out',
            clearProps: 'clipPath,transform',
          },
        )
        // Cienki promień przebiegający w poprzek — akcent, nie kurtyna.
        .fromTo(
          '[data-transition-beam]',
          { scaleX: 0, opacity: 1, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.42, ease: 'power2.inOut' },
          0,
        )
        .to('[data-transition-beam]', { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0.42);

      cleanup = () => {
        timeline.kill();
        gsap.set(node, { clearProps: 'all' });
      };
    });

    return () => cleanup?.();
  }, [pathname]);

  return (
    <>
      <span
        aria-hidden
        data-transition-beam
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left scale-x-0 bg-signal/70 opacity-0"
      />
      <div ref={ref}>{children}</div>
    </>
  );
}
