import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapFaq, mapList, mapPost, mapProject, mapService, mapTestimonial } from './mappers.ts';

/**
 * Mapery dostają dane z cudzego API. Te testy opisują, co ma się stać,
 * gdy dane są niepełne albo mają inny typ, niż powinny — bo tak właśnie
 * wygląda odpowiedź WordPressa z nieuzupełnionym polem w panelu.
 */

const fullProject = {
  slug: 'realizacja', title: 'Tytuł', client: 'Klient', domain: 'klient.pl',
  url: 'https://klient.pl', summary: 'Streszczenie', role: 'Rola', category: 'Kategoria',
  tags: ['a', 'b'], stack: ['TS'], accent: '#ff0000',
  cover: { src: 'https://x/1.jpg', alt: 'alt', width: 800, height: 600 },
  gallery: [{ src: 'https://x/2.jpg', alt: '', width: 100, height: 100 }],
  context: 'Kontekst', challenge: { heading: 'W', body: ['a'] },
  solution: { heading: 'R', body: ['b'] },
  features: [{ title: 'F', body: 'B' }], outcome: ['E'], featured: true,
  seo: { title: 'S', description: 'D' },
};

test('realizacja — komplet pól przechodzi bez zmian', () => {
  const result = mapProject(fullProject);
  assert.equal(result?.slug, 'realizacja');
  assert.equal(result?.accent, '#ff0000');
  assert.equal(result?.featured, true);
  assert.equal(result?.gallery.length, 1);
});

test('realizacja bez slug-a albo tytułu jest pomijana', () => {
  assert.equal(mapProject({ ...fullProject, slug: '' }), null);
  assert.equal(mapProject({ ...fullProject, title: '' }), null);
  assert.equal(mapProject(null), null);
  assert.equal(mapProject('tekst'), null);
});

test('kolor akcentu spoza formatu #rrggbb wraca do domyślnego', () => {
  assert.equal(mapProject({ ...fullProject, accent: 'czerwony' })?.accent, '#5ce1ff');
  assert.equal(mapProject({ ...fullProject, accent: '#GGG' })?.accent, '#5ce1ff');
  assert.equal(mapProject({ ...fullProject, accent: '#AABBCC' })?.accent, '#AABBCC');
});

test('„featured" przyjmuje kształty, w których zapisują je wtyczki', () => {
  for (const value of [true, 1, '1', 'true']) {
    assert.equal(mapProject({ ...fullProject, featured: value })?.featured, true, String(value));
  }
  for (const value of [false, 0, '0', '', null, undefined]) {
    assert.equal(mapProject({ ...fullProject, featured: value })?.featured, false, String(value));
  }
});

test('puste wiersze pól powtarzalnych są odrzucane', () => {
  const result = mapProject({
    ...fullProject,
    features: [{ title: 'F', body: 'B' }, { title: '', body: '' }, null, 'tekst'],
  });
  assert.deepEqual(result?.features, [{ title: 'F', body: 'B' }]);
});

test('obrazek bez adresu nie przechodzi', () => {
  assert.deepEqual(mapProject({ ...fullProject, cover: { alt: 'x' } })?.cover,
    { src: '', alt: '', width: 0, height: 0 });
  assert.deepEqual(mapProject({ ...fullProject, gallery: [{ alt: 'x' }, null] })?.gallery, []);
});

test('wymiary obrazka podane tekstem są zamieniane na liczby', () => {
  const result = mapProject({ ...fullProject, cover: { src: 'https://x/1.jpg', width: '1600', height: '900' } });
  assert.equal(result?.cover.width, 1600);
  assert.equal(result?.cover.height, 900);
});

test('pusty adres realizacji staje się null, nie pustym stringiem', () => {
  assert.equal(mapProject({ ...fullProject, url: '' })?.url, null);
  assert.equal(mapProject({ ...fullProject, url: 'https://a.pl' })?.url, 'https://a.pl');
});

test('usługa — cena podana tekstem jest liczbą, a nieliczba to null', () => {
  const base = { slug: 'u', title: 'U' };
  assert.equal(mapService({ ...base, priceFrom: '3500' })?.priceFrom, 3500);
  assert.equal(mapService({ ...base, priceFrom: 3500 })?.priceFrom, 3500);
  assert.equal(mapService({ ...base, priceFrom: 'do uzgodnienia' })?.priceFrom, null);
  assert.equal(mapService({ ...base, priceFrom: null })?.priceFrom, null);
});

test('wpis — data bez strefy jest traktowana jako UTC', () => {
  const post = mapPost({ slug: 'w', title: 'W', publishedAt: '2026-03-01T10:00:00', contentHtml: '<p>a</p>' });
  assert.equal(post?.publishedAt, '2026-03-01T10:00:00.000Z');
});

test('wpis — data z jawną strefą nie jest przesuwana', () => {
  const post = mapPost({ slug: 'w', title: 'W', publishedAt: '2026-03-01T10:00:00+02:00', contentHtml: '' });
  assert.equal(post?.publishedAt, '2026-03-01T08:00:00.000Z');
});

test('wpis — brak daty modyfikacji nie dodaje pola', () => {
  const post = mapPost({ slug: 'w', title: 'W', publishedAt: '2026-03-01T10:00:00Z', contentHtml: '' });
  assert.ok(!('updatedAt' in post!));
});

test('wpis — czas czytania liczony z treści, gdy CMS go nie poda', () => {
  const html = `<p>${Array(400).fill('słowo').join(' ')}</p>`;
  assert.equal(mapPost({ slug: 'w', title: 'W', contentHtml: html })?.readingTime, 2);
});

test('wpis — puste SEO wraca do tytułu i zajawki', () => {
  const post = mapPost({ slug: 'w', title: 'Tytuł', excerpt: 'Zajawka', contentHtml: '', seo: { title: '', description: '' } });
  assert.equal(post?.seo.title, 'Tytuł');
  assert.equal(post?.seo.description, 'Zajawka');
});

test('FAQ i opinie wymagają obu pól', () => {
  assert.deepEqual(mapFaq({ question: 'P', answer: 'O' }), { question: 'P', answer: 'O' });
  assert.equal(mapFaq({ question: 'P', answer: '' }), null);
  assert.equal(mapTestimonial({ quote: 'C', author: '' }), null);
  assert.equal(mapTestimonial({ quote: '', author: 'A' }), null);
});

test('mapList pomija rekordy nie do odczytania i nie wywraca się na nie-tablicy', () => {
  assert.deepEqual(mapList([{ question: 'P', answer: 'O' }, null, {}, 'x'], mapFaq), [{ question: 'P', answer: 'O' }]);
  assert.deepEqual(mapList(null, mapFaq), []);
  assert.deepEqual(mapList({ nie: 'tablica' }, mapFaq), []);
});
