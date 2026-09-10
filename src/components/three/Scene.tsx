'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import DigitalCore from '@/components/three/DigitalCore';
import { pixelRatioFor, type Quality } from '@/lib/animation/quality';
import { loadGsap } from '@/lib/animation/gsap';

export default function Scene({
  accent,
  quality,
  active,
}: {
  accent: string;
  quality: Quality;
  active: boolean;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  /* Wskaźnik — jedno pasywne nasłuchiwanie, wygładzenie robi pętla renderująca. */
  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  /*
   * Postęp przewijania czytamy przez ScrollTrigger, nie przez własny listener —
   * dzięki temu scena dzieli jedno źródło pozycji z resztą animacji i nie
   * dokłada kolejnego handlera na każdą klatkę scrolla.
   */
  useEffect(() => {
    let trigger: ScrollTrigger | undefined;
    let cancelled = false;

    void loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      trigger = ScrollTrigger.create({
        start: 0,
        end: () => window.innerHeight * 2.2,
        scrub: true,
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={pixelRatioFor(quality)}
      gl={{
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.2, 6.2], fov: 42, near: 0.1, far: 40 }}
      style={{ pointerEvents: 'none' }}
    >
      <DigitalCore quality={quality} accent={accent} scroll={scrollRef} pointer={pointerRef} />
    </Canvas>
  );
}
