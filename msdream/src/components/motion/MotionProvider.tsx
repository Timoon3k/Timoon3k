'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Globalna warstwa animacji.
 *
 * Zasady, których pilnuje ten komponent:
 *
 *  1. **Treść jest widoczna domyślnie.** Klasa `motion-ready` trafia na <html>
 *     dopiero po potwierdzeniu, że animacje są dozwolone. Bez JS albo przy
 *     `prefers-reduced-motion` strona po prostu wyświetla treść — nic nie
 *     zostaje ukryte na stałe.
 *  2. **Zero CLS.** Animujemy wyłącznie `opacity`, `translate` i `clip-path` —
 *     właściwości kompozytowane, które nie wywołują reflow.
 *  3. **Budżet.** GSAP ładuje się dynamicznie i tylko wtedy, gdy jest sens go
 *     ładować. Na wolnych łączach i słabych urządzeniach rezygnujemy
 *     z animacji zamiast dokładać janku.
 */
export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Urządzenia o małej mocy / oszczędzanie danych — pomijamy animacje.
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const lowPower =
      nav.connection?.saveData === true ||
      /^(slow-2g|2g)$/.test(nav.connection?.effectiveType ?? '') ||
      (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2);

    if (reduced.matches || lowPower) {
      root.classList.remove('motion-ready');
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      root.classList.add('motion-ready');

      const ctx = gsap.context(() => {
        // --- Odsłanianie elementów ---------------------------------------
        const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');

        reveals.forEach((el) => {
          const delay = Number(el.dataset.revealDelay ?? 0);
          gsap.to(el, {
            opacity: 1,
            translate: '0px 0px',
            duration: 0.9,
            delay,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              // Start nieco przed wejściem w viewport — element jest już
              // widoczny, gdy użytkownik do niego dociera.
              start: 'top 88%',
              once: true,
            },
          });
        });

        // --- Odsłanianie maską (nagłówki, fotografie) --------------------
        gsap.utils.toArray<HTMLElement>('[data-reveal-mask]').forEach((el) => {
          gsap.to(el.children, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.1,
            stagger: 0.08,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
        });

        // --- Subtelny parallax -------------------------------------------
        // Tylko na desktopie: na telefonie parallax powiązany ze scrollem
        // powoduje janky repainty i walczy z paskiem adresu.
        ScrollTrigger.matchMedia({
          '(min-width: 900px)': () => {
            gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
              const strength = Number(el.dataset.parallax || 12);
              gsap.fromTo(
                el,
                { yPercent: -strength / 2 },
                {
                  yPercent: strength / 2,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: el.parentElement ?? el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                  },
                },
              );
            });
          },
        });
      });

      // Po dociągnięciu fontów metryki tekstu się zmieniają — przeliczamy
      // pozycje wyzwalaczy, żeby animacje nie startowały w złym miejscu.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      cleanup = () => {
        ctx.revert();
        ScrollTrigger.getAll().forEach((t) => t.kill());
        root.classList.remove('motion-ready');
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  // Reset scrolla przy nawigacji — inaczej użytkownik ląduje w połowie
  // nowej strony.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
