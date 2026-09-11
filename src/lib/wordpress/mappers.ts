import type { Faq, ImageRef, Post, Project, Service, Testimonial } from '@/lib/types';
// Import względny (nie przez alias `@/`), żeby moduł dał się uruchomić
// w testach `node --test` bez konfigurowania rozwiązywania ścieżek.
import { htmlToMarkdown, readingTimeFrom } from './html-to-markdown.ts';

/**
 * Mapowanie odpowiedzi WordPressa na typy domenowe.
 *
 * Każde pole jest sprawdzane, bo dane przychodzą z zewnętrznego API, które
 * może zwrócić braki (nieuzupełnione pole w panelu) albo inny typ niż
 * oczekiwany (wtyczka do pól zapisała liczbę jako string). Zamiast wywracać
 * render, pojedyncze pole dostaje wartość zastępczą, a rekord bez wymaganego
 * minimum jest pomijany — listę widać wtedy krótszą, ale strona stoi.
 */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value.trim() : typeof value === 'number' ? String(value) : fallback;

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => str(item)).filter(Boolean) : [];

const bool = (value: unknown): boolean =>
  value === true || value === 1 || value === '1' || value === 'true';

const num = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

function image(value: unknown): ImageRef | null {
  if (!isObject(value)) return null;
  const src = str(value.src);
  if (!src) return null;

  return {
    src,
    alt: str(value.alt),
    width: num(value.width) ?? 0,
    height: num(value.height) ?? 0,
  };
}

const imageList = (value: unknown): ImageRef[] =>
  Array.isArray(value) ? value.map(image).filter((item): item is ImageRef => item !== null) : [];

function section(value: unknown): { heading: string; body: string[] } {
  if (!isObject(value)) return { heading: '', body: [] };
  return { heading: str(value.heading), body: strList(value.body) };
}

function seo(value: unknown, fallbackTitle: string, fallbackDescription: string) {
  const raw = isObject(value) ? value : {};
  return {
    title: str(raw.title, fallbackTitle) || fallbackTitle,
    description: str(raw.description, fallbackDescription) || fallbackDescription,
  };
}

/** Data w formacie ISO. WordPress podaje czas UTC bez strefy — dopisujemy `Z`. */
function isoDate(value: unknown, fallback: string): string {
  const raw = str(value);
  if (!raw) return fallback;
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/.test(raw) ? raw : `${raw}Z`;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
}

export function mapProject(value: unknown): Project | null {
  if (!isObject(value)) return null;

  const slug = str(value.slug);
  const title = str(value.title);
  if (!slug || !title) return null;

  const summary = str(value.summary);
  const cover = image(value.cover);

  return {
    slug,
    title,
    client: str(value.client, title) || title,
    domain: str(value.domain),
    url: str(value.url) || null,
    summary,
    role: str(value.role),
    category: str(value.category),
    tags: strList(value.tags),
    stack: strList(value.stack),
    accent: /^#[0-9a-f]{6}$/i.test(str(value.accent)) ? str(value.accent) : '#5ce1ff',
    // `cover` jest wymagany przez typ; pusty adres zniknąłby jako zepsuty
    // obrazek, więc realizacja bez okładki nie trafia na listę.
    cover: cover ?? { src: '', alt: '', width: 0, height: 0 },
    gallery: imageList(value.gallery),
    context: str(value.context),
    challenge: section(value.challenge),
    solution: section(value.solution),
    features: Array.isArray(value.features)
      ? value.features
          .filter(isObject)
          .map((row) => ({ title: str(row.title), body: str(row.body) }))
          .filter((row) => row.title || row.body)
      : [],
    outcome: strList(value.outcome),
    featured: bool(value.featured),
    seo: seo(value.seo, title, summary),
  };
}

export function mapService(value: unknown): Service | null {
  if (!isObject(value)) return null;

  const slug = str(value.slug);
  const title = str(value.title);
  if (!slug || !title) return null;

  return {
    slug,
    title,
    tagline: str(value.tagline),
    description: str(value.description),
    deliverables: strList(value.deliverables),
    priceFrom: num(value.priceFrom),
    duration: str(value.duration),
    index: str(value.index, '01') || '01',
  };
}

export function mapPost(value: unknown): Post | null {
  if (!isObject(value)) return null;

  const slug = str(value.slug);
  const title = str(value.title);
  if (!slug || !title) return null;

  const body = htmlToMarkdown(str(value.contentHtml));
  const excerpt = str(value.excerpt);
  const publishedAt = isoDate(value.publishedAt, new Date(0).toISOString());
  const updatedAt = isoDate(value.updatedAt, publishedAt);

  return {
    slug,
    title,
    excerpt,
    publishedAt,
    ...(updatedAt !== publishedAt ? { updatedAt } : {}),
    readingTime: num(value.readingTime) ?? readingTimeFrom(body),
    category: str(value.category, 'Artykuł') || 'Artykuł',
    ...(image(value.cover) ? { cover: image(value.cover) as ImageRef } : {}),
    body,
    seo: seo(value.seo, title, excerpt),
  };
}

export function mapFaq(value: unknown): Faq | null {
  if (!isObject(value)) return null;
  const question = str(value.question);
  const answer = str(value.answer);
  return question && answer ? { question, answer } : null;
}

export function mapTestimonial(value: unknown): Testimonial | null {
  if (!isObject(value)) return null;
  const quote = str(value.quote);
  const author = str(value.author);
  if (!quote || !author) return null;

  return { quote, author, role: str(value.role), source: str(value.source) };
}

/** Mapuje listę, pomijając rekordy, których nie da się sensownie odczytać. */
export function mapList<T>(value: unknown, map: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(map).filter((item): item is T => item !== null);
}
