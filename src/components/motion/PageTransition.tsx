'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

/**
 * Wejście zawartości po zmianie ścieżki. Animowane są wyłącznie `opacity`
 * i `transform`, więc przejście nie generuje przesunięć układu.
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

    window.scrollTo({ top: 0, behavior: 'auto' });

    let cleanup: (() => void) | undefined;

    void loadGsap().then(({ gsap }) => {
      const tween = gsap.fromTo(
        node,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'transform' },
      );
      cleanup = () => {
        tween.kill();
        gsap.set(node, { clearProps: 'all' });
      };
    });

    return () => cleanup?.();
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
