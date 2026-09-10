'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';

/**
 * Jedyne miejsce w projekcie, które zarządza pozycją przewijania przy zmianie trasy.
 *
 * Dokument przewija okno — nie ma własnego kontenera scrollującego, więc resetujemy
 * `window`. Projekt nie używa Lenis ani innej biblioteki smooth scroll.
 *
 * Sedno problemu: `html { scroll-behavior: smooth }` sprawia, że każde programowe
 * przewinięcie jest animacją. Animacja wejścia nowej strony zmienia wysokość
 * dokumentu w trakcie jej trwania i przerywa ją w losowym miejscu — stąd nowa
 * trasa otwierała się w połowie poprzedniej pozycji. Dlatego na czas resetu
 * wyłączamy płynność punktowo, zamiast usuwać ją globalnie: kotwice w obrębie
 * strony mają nadal przewijać się miękko.
 */
function resetScroll() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

export default function ScrollManager() {
  const pathname = usePathname();

  /* Przeglądarka nie może przywracać pozycji sama — kolidowałaby z resetem. */
  useEffect(() => {
    if ('scrollRestoration' in history) {
      const previous = history.scrollRestoration;
      history.scrollRestoration = 'manual';
      return () => {
        history.scrollRestoration = previous;
      };
    }
  }, []);

  useEffect(() => {
    // Przejście do kotwicy jest świadomym wyborem użytkownika — nie nadpisujemy go.
    if (window.location.hash) return;

    resetScroll();

    // Dwie klatki: pierwsza domyka commit Reacta, druga łapie układ już po nim.
    // Bez tego wysokość dokumentu potrafi jeszcze urosnąć i cofnąć reset.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        resetScroll();

        void loadGsap().then(({ ScrollTrigger }) => {
          /*
           * Kolejność jest tu istotna. ScrollTrigger zapamiętuje pozycję
           * przewijania i przy `refresh()` sam ją przywraca — wołany po
           * resecie potrafił cofnąć stronę w miejsce, w którym użytkownik
           * był przed zmianą trasy (obserwowane: 329 px zamiast 0).
           * Dlatego najpierw czyścimy tę pamięć, potem przeliczamy pozycje,
           * a reset powtarzamy na końcu — już nic go nie nadpisze.
           */
          ScrollTrigger.clearScrollMemory();
          ScrollTrigger.refresh();
          resetScroll();
        });
      });
    });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [pathname]);

  return null;
}
