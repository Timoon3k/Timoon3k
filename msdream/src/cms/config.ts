/**
 * Konfiguracja połączenia z headless WordPressem.
 *
 * Strona działa BEZ WordPressa — korzysta wtedy z treści startowej
 * z `src/content`. Podpięcie CMS-u polega wyłącznie na ustawieniu
 * `WORDPRESS_API_URL`; od tego momentu treść pochodzi z WP, a seed służy
 * już tylko jako zapasowe źródło, gdy API nie odpowie.
 */

const raw = process.env.WORDPRESS_API_URL?.trim().replace(/\/$/, '') ?? '';

/** Bazowy adres REST API, np. `https://cms.msdream.pl/wp-json`. */
export const WP_API = raw;

/** Czy CMS jest podpięty. */
export const CMS_ENABLED = raw.length > 0;

/** Host multimediów WordPressa — używany przy walidacji adresów obrazków. */
export const WP_MEDIA_HOST = (() => {
  if (!raw) return null;
  try {
    return new URL(raw).host;
  } catch {
    return null;
  }
})();

/**
 * Czas życia cache'u treści z CMS-u.
 *
 * Treść strony wizytówkowej zmienia się rzadko, więc trzymamy ją długo
 * i odświeżamy natychmiast webhookiem z WordPressa (`/api/revalidate`).
 * Godzinny fallback zabezpiecza przed sytuacją, w której webhook nie dojdzie.
 */
export const CMS_REVALIDATE_SECONDS = 3600;

/** Tag cache'u — jeden na typ treści, żeby webhook mógł odświeżyć punktowo. */
export const CMS_TAGS = {
  settings: 'wp:settings',
  services: 'wp:services',
  instructors: 'wp:instructors',
  gallery: 'wp:gallery',
  testimonials: 'wp:testimonials',
  faq: 'wp:faq',
  horses: 'wp:horses',
  guides: 'wp:guides',
  legal: 'wp:legal',
} as const;

export type CmsTag = (typeof CMS_TAGS)[keyof typeof CMS_TAGS];
