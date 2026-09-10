'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  coreFragmentShader,
  coreVertexShader,
  nodesFragmentShader,
  nodesVertexShader,
  shellFragmentShader,
  shellVertexShader,
} from '@/components/three/shaders';

export type Quality = 'high' | 'medium' | 'low';

export type SceneSignals = {
  /** 0–1, postęp przewijania sterowany przez ScrollTrigger */
  scroll: React.RefObject<number>;
  /** Znormalizowana pozycja kursora, −1…1 */
  pointer: React.RefObject<{ x: number; y: number }>;
};

type LayerProps = SceneSignals & { quality: Quality; accent: string };

/**
 * Budżet sceny na poziom jakości. Wartości dobrane tak, żeby wariant `low`
 * mieścił się w kilku tysiącach wierzchołków — telefon rysuje go bez wysiłku.
 */
const BUDGET = {
  high: { coreDetail: 22, shell: 900, nodes: 120, links: 150, amplitude: 0.2 },
  medium: { coreDetail: 14, shell: 520, nodes: 80, links: 90, amplitude: 0.18 },
  low: { coreDetail: 8, shell: 240, nodes: 44, links: 0, amplitude: 0.15 },
} as const;

/** Deterministyczny generator (mulberry32) — scena wygląda tak samo przy każdym renderze. */
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

/** Punkty rozłożone równomiernie na sferze (spirala Fibonacciego). */
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(1 - y * y, 0));
    const theta = golden * i;
    points.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return points;
}

/* -------------------------------------------------------------------------- */
/* Warstwa 1 — rdzeń                                                          */
/* -------------------------------------------------------------------------- */

function Core({ quality, accent, scroll }: Omit<LayerProps, 'pointer'>) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmplitude: { value: BUDGET[quality].amplitude },
      uFrequency: { value: 1.3 },
      uScroll: { value: 0 },
      uOpacity: { value: 1 },
      uColorDeep: { value: new THREE.Color('#060a13') },
      uColorRim: { value: new THREE.Color(accent) },
    }),
    [quality, accent],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime!.value += delta;
      material.uniforms.uScroll!.value = THREE.MathUtils.lerp(
        material.uniforms.uScroll!.value,
        scroll.current,
        0.05,
      );
      (material.uniforms.uColorRim!.value as THREE.Color).lerp(new THREE.Color(accent), 0.04);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.055;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.07) * 0.12;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.25, BUDGET[quality].coreDetail]} />
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
/* Warstwa 2 — powłoka punktowa                                               */
/* -------------------------------------------------------------------------- */

function Shell({ quality, accent, scroll }: Omit<LayerProps, 'pointer'>) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const count = BUDGET[quality].shell;

  const geometry = useMemo(() => {
    const points = fibonacciSphere(count, 1.62);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const random = createRandom(0x5ce1ff);

    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      seeds[i] = random();
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 5.5 },
      uPixelRatio: { value: 1 },
      uScroll: { value: 0 },
      uOpacity: { value: 0.55 },
      uColor: { value: new THREE.Color(accent) },
    }),
    [accent],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (material) {
      material.uniforms.uTime!.value += delta;
      material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
      material.uniforms.uScroll!.value = THREE.MathUtils.lerp(
        material.uniforms.uScroll!.value,
        scroll.current,
        0.05,
      );
      (material.uniforms.uColor!.value as THREE.Color).lerp(new THREE.Color(accent), 0.04);
    }
    // Powłoka obraca się przeciwnie do rdzenia — warstwy czytają się osobno.
    if (groupRef.current) groupRef.current.rotation.y -= delta * 0.035;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={shellVertexShader}
          fragmentShader={shellFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Warstwa 3 — konstelacja węzłów i połączeń                                  */
/* -------------------------------------------------------------------------- */

function Constellation({ quality, accent }: Omit<LayerProps, 'pointer' | 'scroll'>) {
  const nodesMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { nodes: nodeCount, links: linkBudget } = BUDGET[quality];

  const { nodeGeometry, linkGeometry } = useMemo(() => {
    const random = createRandom(0xda7a);
    const positions = new Float32Array(nodeCount * 3);
    const scales = new Float32Array(nodeCount);
    const speeds = new Float32Array(nodeCount);
    const phases = new Float32Array(nodeCount);
    const placed: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i += 1) {
      // Rozkład w powłoce sferycznej, nie w płaskich pasmach — inaczej sieć
      // zbiega się w jedną taflę i czyta się jak artefakt siatki, nie jak chmura danych.
      const radius = 2.1 + random() * 1.35;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      const point = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi) * 0.72,
        radius * Math.sin(phi) * Math.sin(theta),
      );
      placed.push(point);

      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      scales[i] = 0.35 + random() * 0.65;
      speeds[i] = (0.04 + random() * 0.05) * (i % 2 === 0 ? -1 : 1);
      phases[i] = random() * Math.PI * 2;
    }

    const nodes = new THREE.BufferGeometry();
    nodes.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodes.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    nodes.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    nodes.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    /*
     * Każdy węzeł łączymy z dwoma najbliższymi sąsiadami. Naiwne przechodzenie
     * par wyczerpywało budżet na pierwszych węzłach i sieć zbijała się w jedno
     * skupisko z długimi trójkątami po jednej stronie.
     */
    let links: THREE.BufferGeometry | null = null;
    if (linkBudget > 0) {
      const segments: number[] = [];
      const seen = new Set<string>();
      const neighboursPerNode = 2;

      for (let i = 0; i < placed.length; i += 1) {
        const distances = placed
          .map((point, index) => ({ index, distance: placed[i]!.distanceTo(point) }))
          .filter((entry) => entry.index !== i)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, neighboursPerNode);

        for (const { index } of distances) {
          const key = i < index ? `${i}:${index}` : `${index}:${i}`;
          if (seen.has(key) || segments.length / 6 >= linkBudget) continue;
          seen.add(key);
          segments.push(placed[i]!.x, placed[i]!.y, placed[i]!.z);
          segments.push(placed[index]!.x, placed[index]!.y, placed[index]!.z);
        }
      }

      links = new THREE.BufferGeometry();
      links.setAttribute('position', new THREE.Float32BufferAttribute(segments, 3));
    }

    return { nodeGeometry: nodes, linkGeometry: links };
  }, [nodeCount, linkBudget]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 34 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(accent) },
    }),
    [accent],
  );

  useFrame((state, delta) => {
    const material = nodesMaterialRef.current;
    if (material) {
      material.uniforms.uTime!.value += delta;
      material.uniforms.uPixelRatio!.value = state.gl.getPixelRatio();
      (material.uniforms.uColor!.value as THREE.Color).lerp(new THREE.Color(accent), 0.04);
    }
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={groupRef} rotation={[0.32, 0, 0.14]}>
      {linkGeometry ? (
        <lineSegments geometry={linkGeometry}>
          <lineBasicMaterial
            color={accent}
            transparent
            opacity={0.085}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      ) : null}
      <points geometry={nodeGeometry}>
        <shaderMaterial
          ref={nodesMaterialRef}
          uniforms={uniforms}
          vertexShader={nodesVertexShader}
          fragmentShader={nodesFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Kompozycja i ruch kamery                                                   */
/* -------------------------------------------------------------------------- */

export default function DigitalCore({ quality, accent, scroll, pointer }: LayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    const { x, y } = pointer.current;
    const progress = scroll.current;

    // Parallax kamery mocno wygładzony — ruch ma być „ciężki”, nie nerwowy.
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x * 0.7, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.2 + y * 0.45, 0.03);
    // Storytelling scrolla: kamera najpierw podjeżdża bliżej, potem się cofa.
    const target = 6.2 - Math.sin(progress * Math.PI) * 0.9 + progress * 1.4;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, target, 0.035);
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, x * 0.06, 0.025);
    }
  });

  return (
    <group ref={groupRef}>
      <Core quality={quality} accent={accent} scroll={scroll} />
      <Shell quality={quality} accent={accent} scroll={scroll} />
      <Constellation quality={quality} accent={accent} />
    </group>
  );
}
