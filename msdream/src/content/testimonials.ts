import type { Testimonial } from '@/lib/types';

/**
 * Opinie klientów.
 *
 * ŚWIADOMIE PUSTE. Nie generujemy fikcyjnych opinii i nie tworzymy
 * `Review`/`AggregateRating` w danych strukturalnych bez realnych recenzji —
 * to naruszenie wytycznych Google dotyczących opinii i realne ryzyko kary.
 *
 * Sposoby uzupełnienia (opisane w INTEGRATIONS.md):
 *  1. Ręcznie w CMS (Sanity → Opinie) — przepisane opinie z wizytówki Google.
 *  2. Automatycznie — Google Places API (Place Details, pole `reviews`)
 *     po ustawieniu GOOGLE_PLACES_API_KEY i NEXT_PUBLIC_GOOGLE_PLACE_ID.
 *
 * Dopóki tablica jest pusta, sekcja opinii pokazuje uczciwy stan pusty
 * z linkiem do wizytówki Google zamiast udawanych cytatów.
 */
export const TESTIMONIALS: readonly Testimonial[] = [];

/** Wyliczana wyłącznie z realnych opinii. Nigdy nie podawana ręcznie. */
export function aggregateRating(): { value: number; count: number } | null {
  if (TESTIMONIALS.length === 0) return null;
  const sum = TESTIMONIALS.reduce((acc, t) => acc + t.rating, 0);
  return {
    value: Math.round((sum / TESTIMONIALS.length) * 10) / 10,
    count: TESTIMONIALS.length,
  };
}
