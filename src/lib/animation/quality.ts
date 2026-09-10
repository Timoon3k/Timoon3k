export type Quality = 'high' | 'medium' | 'low';

/**
 * Prosta heurystyka jakości grafiki — bez benchmarku GPU, bo ten sam kosztowałby
 * więcej niż oszczędza. Opieramy się na sygnałach dostępnych natychmiast.
 */
export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'low';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const width = window.innerWidth;

  // Telefon albo urządzenie dotykowe o wąskim ekranie — zawsze najniższy próg.
  if (coarsePointer && width < 900) return 'low';
  if (cores <= 4 || memory <= 4) return 'medium';
  if (width < 1280) return 'medium';
  return 'high';
}

/** Górny limit DPR dla danego progu — renderowanie w 3× nie daje nic widocznego. */
export function pixelRatioFor(quality: Quality): [number, number] {
  if (quality === 'low') return [1, 1.3];
  if (quality === 'medium') return [1, 1.6];
  return [1, 1.85];
}
