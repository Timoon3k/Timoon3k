import { CMS_ENABLED, CMS_REVALIDATE_SECONDS, WP_API, type CmsTag } from './config';

/**
 * Cienki klient REST API WordPressa.
 *
 * Świadomie bez biblioteki: WP REST zwraca zwykły JSON, a `fetch` Next.js
 * daje nam cache i tagi za darmo. Zero zależności = zero kilobajtów w bundlu
 * i zero łatania cudzych breaking changes.
 *
 * Zasada nadrzędna: **CMS nigdy nie może położyć strony**. Każdy błąd
 * (brak konfiguracji, timeout, 500 po stronie WP, zepsuty JSON) kończy się
 * zwróceniem `null`, a warstwa wyżej sięga po treść startową z `src/content`.
 */

const TIMEOUT_MS = 8000;

export async function wpFetch<T>(
  path: string,
  { tag, params }: { tag: CmsTag; params?: Record<string, string | number> } = {
    tag: 'wp:settings' as CmsTag,
  },
): Promise<T | null> {
  if (!CMS_ENABLED) return null;

  const url = new URL(`${WP_API}${path.startsWith('/') ? path : `/${path}`}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, String(value));
  }

  // WP domyślnie zwraca 10 pozycji. Dla treści wizytówkowej chcemy wszystko.
  if (!url.searchParams.has('per_page')) url.searchParams.set('per_page', '100');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: CMS_REVALIDATE_SECONDS, tags: [tag] },
    });

    if (!res.ok) {
      console.warn(`[cms] ${url.pathname} → HTTP ${res.status}; używam treści startowej`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'nieznany błąd';
    console.warn(`[cms] ${url.pathname} nieosiągalne (${reason}); używam treści startowej`);
    return null;
  } finally {
    clearTimeout(timer);
  }
}
