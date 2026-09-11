/**
 * Źródło treści wybierane zmienną środowiskową.
 *
 * `auto` (domyślne) bierze pierwsze skonfigurowane źródło: WordPress, potem
 * Sanity, a gdy nie ma żadnego — treść startową z `src/content`. Dzięki temu
 * repozytorium klonuje się i uruchamia bez ustawiania czegokolwiek.
 */
export type ContentSource = 'wordpress' | 'sanity' | 'seed';

/** Adres REST API WordPressa, np. `https://cms.majewskitomasz.pl/wp-json`. */
export const wordpressApiUrl = (process.env.WORDPRESS_API_URL ?? '').replace(/\/+$/, '');

export const isWordPressConfigured = wordpressApiUrl.length > 0;

function readSource(): ContentSource | 'auto' {
  const raw = (process.env.CONTENT_SOURCE ?? 'auto').trim().toLowerCase();
  if (raw === 'wordpress' || raw === 'sanity' || raw === 'seed') return raw;
  return 'auto';
}

/**
 * Rozstrzygnięte źródło treści. Wybór wprost (`CONTENT_SOURCE=wordpress`)
 * ma pierwszeństwo — także wtedy, gdy źródło nie jest skonfigurowane,
 * bo cichy powrót do innego CMS-u ukrywałby błąd konfiguracji.
 */
export function resolveContentSource(): ContentSource {
  const explicit = readSource();
  if (explicit !== 'auto') return explicit;

  if (isWordPressConfigured) return 'wordpress';
  if ((process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '').length > 0) return 'sanity';
  return 'seed';
}
