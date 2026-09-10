'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import SceneFallback from '@/components/three/SceneFallback';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';
import { detectQuality, shouldRenderScene, type Quality } from '@/lib/animation/quality';

/** Cała paczka WebGL ładuje się dopiero po pierwszym renderze — nigdy nie jest LCP. */
const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

export default function HeroCanvas({ accent = '#5ce1ff' }: { accent?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [quality, setQuality] = useState<Quality>('high');
  const [active, setActive] = useState(true);

  /*
   * Decyzja o włączeniu sceny. Kolejność ma znaczenie dla wydajności:
   * najpierw odrzucamy urządzenia i łącza, na których paczka WebGL się nie
   * zwraca, a dopiero potem czekamy na `load` i bezczynność. Dzięki temu
   * pobieranie i kompilacja Three.js nigdy nie nakładają się na hydratację —
   * to właśnie ta nakładka windowała Total Blocking Time na telefonach.
   */
  useEffect(() => {
    if (prefersReducedMotion() || !shouldRenderScene() || !supportsWebGL()) return;

    let idleHandle: number | undefined;
    let cancelled = false;

    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 260));

    const start = () => {
      if (cancelled) return;
      idleHandle = schedule(() => {
        if (cancelled) return;
        setQuality(detectQuality());
        setEnabled(true);
      }, { timeout: 2500 }) as number;
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      if (idleHandle === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
    };
  }, []);

  /* Renderowanie wstrzymane poza widokiem i przy nieaktywnej karcie przeglądarki. */
  useEffect(() => {
    if (!enabled) return;
    const node = wrapperRef.current;
    if (!node) return;

    let visible = true;
    let inView = true;

    const update = () => setActive(visible && inView);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        update();
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);

    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      update();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  return (
    <div ref={wrapperRef} className="absolute inset-0">
      <SceneFallback accent={accent} />
      {enabled ? (
        <div className="absolute inset-0 opacity-0 [animation:scene-in_1.4s_var(--ease-out-expo)_forwards]">
          <Scene accent={accent} quality={quality} active={active} />
        </div>
      ) : null}
    </div>
  );
}
