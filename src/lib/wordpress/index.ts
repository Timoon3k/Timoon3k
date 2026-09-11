import { wordpressApiUrl } from '@/lib/wordpress/env';
import {
  mapFaq,
  mapList,
  mapPost,
  mapProject,
  mapService,
  mapTestimonial,
} from '@/lib/wordpress/mappers';
import type { Faq, Post, Project, Service, Testimonial } from '@/lib/types';

const REVALIDATE = 300;
const TIMEOUT_MS = 8000;

/**
 * Odczyt z WordPressa. Wszystkie ścieżki prowadzą przez własną przestrzeń
 * `majewski/v1` — to wtyczka mu w WordPressie sprowadza dane do jednego
 * kształtu, więc tutaj nie ma wiedzy o ACF, Meta Boxie ani Podsach.
 *
 * Każdy błąd — sieć, 500, przekroczony czas, niepoprawny JSON — kończy się
 * `null`, a warstwa wyżej sięga po treść startową. Strona nie może się
 * wywrócić dlatego, że hosting WordPressa akurat nie odpowiada.
 */
async function fetchFromWordPress(path: string, params: Record<string, string> = {}) {
  if (!wordpressApiUrl) return null;

  const url = new URL(`${wordpressApiUrl}/majewski/v1/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE, tags: ['content'] },
    });

    if (!response.ok) {
      console.error(`[content] WordPress ${path}: HTTP ${response.status} — używam treści startowej.`);
      return null;
    }

    return (await response.json()) as unknown;
  } catch (error) {
    const reason = error instanceof Error && error.name === 'AbortError'
      ? `brak odpowiedzi w ${TIMEOUT_MS} ms`
      : String(error);
    console.error(`[content] WordPress ${path}: ${reason} — używam treści startowej.`);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/** Pusta kolekcja znaczy „nic jeszcze nie wpisano" — wtedy też wracamy do seeda. */
const orNull = <T>(items: T[]): T[] | null => (items.length ? items : null);

export const getWordPressProjects = async (): Promise<Project[] | null> =>
  orNull(mapList(await fetchFromWordPress('projects'), mapProject));

export const getWordPressServices = async (): Promise<Service[] | null> =>
  orNull(mapList(await fetchFromWordPress('services'), mapService));

export const getWordPressPosts = async (): Promise<Post[] | null> =>
  orNull(mapList(await fetchFromWordPress('posts'), mapPost));

export const getWordPressTestimonials = async (): Promise<Testimonial[] | null> =>
  orNull(mapList(await fetchFromWordPress('testimonials'), mapTestimonial));

export const getWordPressFaq = async (key: string): Promise<Faq[] | null> =>
  orNull(mapList(await fetchFromWordPress('faq', { key }), mapFaq));
