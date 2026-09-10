export type Quality = 'high' | 'medium' | 'low';

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

const connection = (): NetworkInformation | undefined =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection;

/** `deviceMemory` w GB. Chrome/Edge/Android je podają, Safari i Firefox nie. */
const deviceMemory = (): number | undefined =>
  (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

const SLOW_NETWORKS = new Set(['slow-2g', '2g', '3g']);

/**
 * Czy w ogóle warto pobierać paczkę WebGL (~880 kB) i uruchamiać scenę.
 *
 * To nie jest to samo co próg jakości: tu decydujemy, czy koszt ma sens,
 * a nie ile trójkątów narysować. Gdy odpowiedź brzmi „nie", zostaje statyczny
 * `SceneFallback`, który wygląda celowo, a nie jak brakujący element.
 *
 * Świadomie NIE odcinamy wszystkich telefonów. Kryterium jest pamięć i łącze,
 * bo to one realnie bolą; `deviceMemory` bywa niedostępne (Safari) i wtedy
 * urządzenia nie karzemy — iPhone rysuje tę scenę bez problemu.
 */
export function shouldRenderScene(): boolean {
  if (typeof window === 'undefined') return false;

  const net = connection();
  if (net?.saveData) return false;
  if (net?.effectiveType && SLOW_NETWORKS.has(net.effectiveType)) return false;

  const memory = deviceMemory();
  if (memory !== undefined && memory <= 4) return false;

  if ((navigator.hardwareConcurrency ?? 8) <= 2) return false;

  return true;
}

/**
 * Prosta heurystyka jakości grafiki — bez benchmarku GPU, bo ten sam kosztowałby
 * więcej niż oszczędza. Opieramy się na sygnałach dostępnych natychmiast.
 */
export function detectQuality(): Quality {
  if (typeof window === 'undefined') return 'low';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = deviceMemory() ?? 4;
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
  if (quality === 'medium') return [1, 1.5];
  return [1, 1.75];
}
