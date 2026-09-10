'use client';

import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

const THRESHOLD = 600;

/**
 * Powrót na górę strony.
 *
 * Nasłuchiwanie jest pasywne i ustawia wyłącznie wartość logiczną — próg
 * porównujemy poza Reactem, więc stan zmienia się tylko przy faktycznym
 * przekroczeniu granicy, a nie na każdej klatce przewijania.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shown = false;

    const onScroll = () => {
      const next = window.scrollY > THRESHOLD;
      if (next === shown) return;
      shown = next;
      setVisible(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Wróć na górę strony"
      // Ukryty przed czytnikiem i klawiaturą, dopóki nie ma sensu — inaczej
      // byłby pustym przystankiem w kolejności tabulacji na szczycie strony.
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-magnetic
      className={`group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 grid h-12 w-12 place-items-center border border-hairline-strong bg-void/70 text-dim backdrop-blur-md transition-[opacity,transform,color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-signal/60 hover:text-signal sm:right-6 sm:bottom-6 ${
        visible
          ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-2.5 scale-90 opacity-0'
      }`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, color-mix(in oklab, var(--color-signal) 16%, transparent), transparent 70%)',
        }}
      />
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="relative h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M8 13V3M4 7l4-4 4 4" strokeLinecap="square" />
      </svg>
    </button>
  );
}
