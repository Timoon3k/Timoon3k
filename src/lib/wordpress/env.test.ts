import assert from 'node:assert/strict';
import { test } from 'node:test';

/**
 * Wybór źródła treści czyta zmienne środowiskowe przy każdym wywołaniu,
 * ale `isWordPressConfigured` liczone jest przy imporcie — dlatego każdy
 * przypadek importuje moduł na nowo, z unikalnym zapytaniem omijającym
 * pamięć podręczną modułów.
 */
async function resolveWith(env: Record<string, string>) {
  for (const key of ['CONTENT_SOURCE', 'WORDPRESS_API_URL', 'NEXT_PUBLIC_SANITY_PROJECT_ID']) {
    delete process.env[key];
  }
  Object.assign(process.env, env);
  const fresh = await import(`./env.ts?case=${Math.random()}`);
  return fresh.resolveContentSource();
}

const WP = { WORDPRESS_API_URL: 'https://cms.example.com/wp-json' };
const SANITY = { NEXT_PUBLIC_SANITY_PROJECT_ID: 'abc123' };

test('bez konfiguracji strona stoi na treści startowej', async () => {
  assert.equal(await resolveWith({}), 'seed');
});

test('sam adres WordPressa włącza WordPressa', async () => {
  assert.equal(await resolveWith(WP), 'wordpress');
});

test('sam identyfikator Sanity włącza Sanity', async () => {
  assert.equal(await resolveWith(SANITY), 'sanity');
});

test('gdy skonfigurowane są oba, wygrywa WordPress', async () => {
  assert.equal(await resolveWith({ ...WP, ...SANITY }), 'wordpress');
});

test('wybór wprost ma pierwszeństwo nad wykrywaniem', async () => {
  assert.equal(await resolveWith({ CONTENT_SOURCE: 'sanity', ...WP }), 'sanity');
  assert.equal(await resolveWith({ CONTENT_SOURCE: 'seed', ...WP, ...SANITY }), 'seed');
});

test('literówka w CONTENT_SOURCE nie blokuje strony — wraca wykrywanie', async () => {
  assert.equal(await resolveWith({ CONTENT_SOURCE: 'wordpres', ...SANITY }), 'sanity');
});

test('wielkość liter i spacje nie mają znaczenia', async () => {
  assert.equal(await resolveWith({ CONTENT_SOURCE: ' WordPress ' }), 'wordpress');
});
