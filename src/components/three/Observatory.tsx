'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  coreFragmentShader,
  coreVertexShader,
  particlesFragmentShader,
  particlesVertexShader,
} from '@/components/three/shaders';

export type Quality = 'high' | 'low';

type SceneProps = {
  quality: Quality;
  accent: string;
  /** 0–1, postęp przewijania pierwszego ekranu */
  scrollRef: React.RefObject<number>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
};

/**
 * Deterministyczny generator pseudolosowy (mulberry32).
 *
 * Scena wygląda tak samo przy każdym renderze i na każdym urządzeniu, co
 * ułatwia porównywanie zrzutów, a przy okazji utrzymuje `useMemo` czystym.
 */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFIG = {
  high: { detail: 32, particles: 1300, stars: 900, amplitude: 0.19 },
  low: { detail: 14, particles: 380, stars: 260, amplitude: 0.15 },
} as const;

/* -------------------------------------------------------------------------- */

function Core({ quality, accent, scrollRef }: Pick<SceneProps, 'quality' | 'accent' | 'scrollRef'>) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: CONFIG[quality].amplitude },
      uFrequency: { value: 1.35 },
      uScroll: { value: 0 },
      uColorCore: { value: new THREE.Color('#070c16') },
      uColorRim: { value: new THREE.Color(accent) },
      uColorFlare: { value: new THREE.Color('#ff8a5c') },
    }),
    [quality, accent],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime!.value += delta;
      material.uniforms.uScroll!.value = THREE.MathUtils.lerp(
        material.uniforms.uScroll!.value,
        scrollRef.current,
        0.06,
      );
      (material.uniforms.uColorRim!.value as THREE.Color).lerp(new THREE.Color(accent), 0.05);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.075;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.14;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.32, CONFIG[quality].detail]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={coreVertexShader}
        fragmentShader={coreFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */

function OrbitRings({ accent }: { accent: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2, false, 0);
    return new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(180).map((p) => new THREE.Vector3(p.x, 0, p.y)),
    );
  }, []);

  const rings = useMemo(
    () => [
      { radius: 2.05, tilt: [0.42, 0, 0.18], opacity: 0.42 },
      { radius: 2.62, tilt: [-0.28, 0.4, -0.34], opacity: 0.26 },
      { radius: 3.25, tilt: [0.66, 0.2, 0.52], opacity: 0.16 },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.028;
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, index) => (
        <lineLoop
          key={index}
          geometry={geometry}
          scale={ring.radius}
          rotation={ring.tilt as [number, number, number]}
        >
          <lineBasicMaterial color={accent} transparent opacity={ring.opacity} />
        </lineLoop>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */

function OrbitParticles({ quality, accent }: { quality: Quality; accent: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const count = CONFIG[quality].particles;

  const geometry = useMemo(() => {
    const random = createRandom(0x5ce1ff);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Trzy skupiska na orbitach + delikatny rozrzut, żeby uniknąć
      // regularności czytelnej jako „siatka”.
      const band = i % 3;
      const radius = [2.05, 2.62, 3.25][band]! + (random() - 0.5) * 0.42;
      const angle = random() * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (random() - 0.5) * (0.35 + band * 0.25);
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      scales[i] = 0.25 + random() * 0.75;
      speeds[i] = (0.045 + random() * 0.07) * (band === 1 ? -1 : 1);
      phases[i] = random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 26 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(accent) },
    }),
    [accent],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime!.value += delta;
    material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
    (material.uniforms.uColor!.value as THREE.Color).lerp(new THREE.Color(accent), 0.05);
  });

  return (
    <points geometry={geometry} scale={viewport.width < 6 ? 0.85 : 1}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */

function Starfield({ quality }: { quality: Quality }) {
  const count = CONFIG[quality].stars;
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const random = createRandom(0x51a45);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 9 + random() * 13;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.65;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.006;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#c9d6e8"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* -------------------------------------------------------------------------- */

export default function Observatory({ quality, accent, scrollRef, pointerRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    const pointer = pointerRef.current;
    const scroll = scrollRef.current;

    // Parallax kamery — celowo mocno wygładzony, żeby ruch był „ciężki”.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.85, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.25 + pointer.y * 0.55, 0.035);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 6.4 + scroll * 2.6, 0.04);
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        pointer.x * 0.08,
        0.03,
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Core quality={quality} accent={accent} scrollRef={scrollRef} />
      <OrbitRings accent={accent} />
      <OrbitParticles quality={quality} accent={accent} />
      <Starfield quality={quality} />
    </group>
  );
}
