export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Heurystyka „słabego urządzenia” — sterują nią jakość sceny 3D i liczba efektów. */
export function isLowPowerDevice(): boolean {
  if (typeof window === 'undefined') return true;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return cores <= 4 || memory <= 4 || (coarse && window.innerWidth < 900);
}
