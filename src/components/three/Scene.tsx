'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Observatory, { type Quality } from '@/components/three/Observatory';

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

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const onScroll = () => {
      const height = window.innerHeight || 1;
      scrollRef.current = Math.min(window.scrollY / height, 1);
    };

    onScroll();
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={quality === 'high' ? [1, 1.75] : [1, 1.4]}
      gl={{
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.25, 6.4], fov: 42, near: 0.1, far: 60 }}
      style={{ pointerEvents: 'none' }}
    >
      <Observatory
        quality={quality}
        accent={accent}
        scrollRef={scrollRef}
        pointerRef={pointerRef}
      />
    </Canvas>
  );
}
