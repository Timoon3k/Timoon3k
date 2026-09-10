'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

declare global {
  interface Window {
    __motionReady?: boolean;
  }
}

/**
 * Globalna warstwa animacji.
 *
 * Zamiast opakowywać każdy element w komponent kliencki, provider skanuje DOM
 * w poszukiwaniu atrybutów `data-reveal`, `data-reveal-group`, `data-split`
 * i `data-parallax`. Dzięki temu sekcje strony pozostają komponentami
 * serwerowymi i nie trafiają do paczki klienckiej.
 *
 * Wszystkie animacje żyją w `gsap.context`, więc `ctx.revert()` przy zmianie
 * ścieżki czyści również powiązane instancje ScrollTriggera.
 */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    if (prefersReducedMotion()) {
      root.classList.remove('js-ready');
      window.__motionReady = true;
      return;
    }

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    const run = async () => {
      const { gsap, ScrollTrigger, SplitText } = await loadGsap();

      // Rozbicie na linie musi poczekać na finalne metryki fontów,
      // inaczej linie łamią się w innych miejscach niż docelowo.
      if (document.fonts?.status !== 'loaded') {
        await document.fonts?.ready.catch(() => undefined);
      }
      if (cancelled) return;

      root.classList.add('js-ready');
      window.__motionReady = true;

      /**
       * Elementy widoczne już w pierwszym ekranie animujemy od razu.
       * Podpinanie ich pod ScrollTrigger oznaczałoby, że przy braku
       * przewijania nigdy się nie pokażą.
       */
      /*
       * Progi celowo zachodzą na siebie: wszystko, co mieści się w pierwszym
       * ekranie, animujemy od razu, a ScrollTrigger zaczyna wcześniej (92%).
       * Przy rozłącznych progach element tuż nad krawędzią ekranu wpadał
       * w martwą strefę — nie kwalifikował się do animacji natychmiastowej
       * i nigdy nie osiągał progu przewijania, więc bez scrolla zostawał
       * niewidoczny. Dotyczyło to m.in. przycisków CTA w hero.
       */
      const inFirstViewport = (el: Element) =>
        el.getBoundingClientRect().top < window.innerHeight;

      /**
       * Na wolnym łączu warstwa animacji bywa gotowa dopiero po kilku sekundach.
       * Odtwarzanie wejścia treści, którą użytkownik zdążył już przeczytać,
       * wygląda jak błąd — dlatego pierwszy ekran pokazujemy wtedy bez animacji.
       * Ustawienie zachodzi w tym samym zadaniu co dodanie klasy `js-ready`,
       * więc nie ma między nimi przemalowania i nic nie mruga.
       */
      const LATE_START_MS = 1200;
      const lateStart = performance.now() > LATE_START_MS;

      ctx = gsap.context(() => {
        /* ---------- Nagłówki rozbijane na linie ---------- */
        document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          const immediate = el.dataset.split === 'immediate' || inFirstViewport(el);
          gsap.set(el, { opacity: 1 });

          if (immediate && lateStart) return;
          const split = new SplitText(el, {
            type: 'lines',
            linesClass: 'split-line',
            mask: 'lines',
          });

          gsap.from(split.lines, {
            yPercent: 108,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.075,
            ...(immediate ? {} : { scrollTrigger: { trigger: el, start: 'top 92%', once: true } }),
            delay: immediate ? Number(el.dataset.delay ?? 0.15) : 0,
          });
        });

        /* ---------- Pojedyncze elementy ---------- */
        document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          if (el.closest('[data-reveal-group]')) return;
          const immediate = inFirstViewport(el);

          if (immediate && lateStart) {
            gsap.set(el, { opacity: 1, y: 0 });
            return;
          }

          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.95,
            delay: Number(el.dataset.delay ?? 0),
            ...(immediate ? {} : { scrollTrigger: { trigger: el, start: 'top 92%', once: true } }),
          });
        });

        /* ---------- Grupy z opóźnieniem kaskadowym ---------- */
        document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
          const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
          if (!items.length) return;
          const immediate = inFirstViewport(group);

          if (immediate && lateStart) {
            gsap.set(items, { opacity: 1, y: 0 });
            return;
          }

          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: immediate ? Number(group.dataset.delay ?? 0.25) : 0,
            stagger: Number(group.dataset.stagger ?? 0.08),
            ...(immediate
              ? {}
              : { scrollTrigger: { trigger: group, start: 'top 92%', once: true } }),
          });
        });

        /* ---------- Parallax (tylko transform, zero layout shiftu) ---------- */
        if (window.matchMedia('(min-width: 768px)').matches) {
          document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
            const distance = Number(el.dataset.parallax ?? 60);
            gsap.fromTo(
              el,
              { yPercent: -distance / 20 },
              {
                yPercent: distance / 20,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          });
        }

        /* ---------- Poziome „linijki” rysowane przy wejściu ---------- */
        document.querySelectorAll<HTMLElement>('[data-draw-line]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            },
          );
        });
      });

      ScrollTrigger.refresh();
    };

    void run();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
