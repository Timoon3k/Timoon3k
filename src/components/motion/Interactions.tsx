'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

/**
 * Mikrointerakcje wskaźnika: precyzyjny kursor i magnetyczne przyciski.
 *
 * Całość dotyczy wyłącznie urządzeń z realnym kursorem. Na dotyku nie ma
 * czego ulepszać, a doklejanie tam obu efektów kosztowałoby tylko wydajność.
 * Systemowy kursor nie jest ukrywany, dopóki własny faktycznie nie działa.
 */
export default function Interactions() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;

      const dot = document.createElement('div');
      dot.className = 'cursor-dot';
      dot.setAttribute('aria-hidden', 'true');
      document.body.append(dot);
      document.documentElement.classList.add('has-cursor');

      const moveX = gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'power3.out' });
      const moveY = gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'power3.out' });

      const onMove = (event: PointerEvent) => {
        moveX(event.clientX);
        moveY(event.clientY);
      };

      // Stan kursora zmienia tylko klasa — żadnych pomiarów w trakcie ruchu.
      const interactive = 'a, button, summary, input, textarea, select, [data-cursor]';
      const onOver = (event: PointerEvent) => {
        const target = (event.target as Element | null)?.closest(interactive);
        dot.classList.toggle('is-active', Boolean(target));
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerover', onOver, { passive: true });

      /* Magnetyzm — bardzo krótki zasięg, żeby przycisk nie „uciekał” spod palca. */
      const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
      const detachers = magnets.map((magnet) => {
        const toX = gsap.quickTo(magnet, 'x', { duration: 0.45, ease: 'power3.out' });
        const toY = gsap.quickTo(magnet, 'y', { duration: 0.45, ease: 'power3.out' });

        const onMagnetMove = (event: PointerEvent) => {
          const rect = magnet.getBoundingClientRect();
          const relativeX = event.clientX - (rect.left + rect.width / 2);
          const relativeY = event.clientY - (rect.top + rect.height / 2);
          toX(relativeX * 0.16);
          toY(relativeY * 0.22);
        };
        const onLeave = () => {
          toX(0);
          toY(0);
        };

        magnet.addEventListener('pointermove', onMagnetMove);
        magnet.addEventListener('pointerleave', onLeave);
        return () => {
          magnet.removeEventListener('pointermove', onMagnetMove);
          magnet.removeEventListener('pointerleave', onLeave);
          gsap.set(magnet, { clearProps: 'transform' });
        };
      });

      cleanup = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerover', onOver);
        detachers.forEach((detach) => detach());
        document.documentElement.classList.remove('has-cursor');
        dot.remove();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return null;
}
