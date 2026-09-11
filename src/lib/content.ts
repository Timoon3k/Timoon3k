import { cache } from 'react';
import { getSanityClient } from '@/sanity/client';
import { resolveContentSource } from '@/lib/wordpress/env';
import {
  getWordPressFaq,
  getWordPressPosts,
  getWordPressProjects,
  getWordPressServices,
  getWordPressTestimonials,
} from '@/lib/wordpress';
import {
  faqQuery,
  pageQuery,
  postsQuery,
  projectsQuery,
  servicesQuery,
  testimonialsQuery,
} from '@/sanity/queries';
import { projects as seedProjects } from '@/content/projects';
import { services as seedServices, processSteps } from '@/content/services';
import { posts as seedPosts } from '@/content/posts';
import { generalFaq, warszawaFaq, wolominFaq } from '@/content/faq';
import type { Faq, Post, Project, Service, Testimonial } from '@/lib/types';

/**
 * Jedno źródło treści dla całej aplikacji.
 *
 * Obsługiwane są dwa CMS-y — WordPress (headless, przez REST) i Sanity —
 * wybierane zmienną `CONTENT_SOURCE`. Gdy CMS nie odpowie albo zwróci pustą
 * kolekcję, używana jest treść startowa z `src/content`. Dzięki temu projekt
 * uruchamia się bez żadnych kluczy, awaria hostingu CMS-a nie kładzie strony,
 * a zmiana CMS-a nie dotyka ani jednego komponentu.
 */

const REVALIDATE = 300;

async function fetchFromSanity<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  const client = getSanityClient();
  if (!client) return null;

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE, tags: ['content'] },
    });
  } catch (error) {
    console.error('[content] Zapytanie do Sanity nie powiodło się — używam treści startowej.', error);
    return null;
  }
}

const nonEmpty = <T>(value: T[] | null | undefined): value is T[] =>
  Array.isArray(value) && value.length > 0;

/**
 * Pobiera kolekcję z aktywnego CMS-a albo zwraca treść startową.
 * Jedno miejsce z tą decyzją — funkcje niżej nie znają już źródła danych.
 */
async function fromCms<T>(
  seed: T[],
  loaders: { wordpress: () => Promise<T[] | null>; sanity: () => Promise<T[] | null> },
): Promise<T[]> {
  const source = resolveContentSource();
  if (source === 'seed') return seed;

  const data = await loaders[source]();
  return nonEmpty(data) ? data : seed;
}

export const getProjects = cache(async (): Promise<Project[]> =>
  fromCms(seedProjects, {
    wordpress: getWordPressProjects,
    sanity: () => fetchFromSanity<Project[]>(projectsQuery),
  }));

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const all = await getProjects();
  const featured = all.filter((project) => project.featured);
  return featured.length ? featured : all.slice(0, 4);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> => {
  const all = await getProjects();
  return all.find((project) => project.slug === slug);
});

export const getServices = cache(async (): Promise<Service[]> =>
  fromCms(seedServices, {
    wordpress: getWordPressServices,
    sanity: () => fetchFromSanity<Service[]>(servicesQuery),
  }));

export const getPosts = cache(async (): Promise<Post[]> => {
  const posts = await fromCms(seedPosts, {
    wordpress: getWordPressPosts,
    sanity: () => fetchFromSanity<Post[]>(postsQuery),
  });
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | undefined> => {
  const all = await getPosts();
  return all.find((post) => post.slug === slug);
});

const seedFaq: Record<string, Faq[]> = {
  general: generalFaq,
  wolomin: wolominFaq,
  warszawa: warszawaFaq,
};

export const getFaq = cache(async (key: 'general' | 'wolomin' | 'warszawa'): Promise<Faq[]> =>
  fromCms(seedFaq[key] ?? [], {
    wordpress: () => getWordPressFaq(key),
    sanity: () => fetchFromSanity<Faq[]>(faqQuery, { key }),
  }));

export const getTestimonials = cache(async (): Promise<Testimonial[]> =>
  fromCms<Testimonial>([], {
    wordpress: getWordPressTestimonials,
    sanity: () => fetchFromSanity<Testimonial[]>(testimonialsQuery),
  }));

export type PageContent = {
  eyebrow?: string;
  heading?: string;
  lead?: string;
  faq?: Faq[];
  cta?: { title?: string; lead?: string; label?: string; href?: string };
  seo?: { title?: string; description?: string; ogImage?: string; noIndex?: boolean };
};

/** Nadpisania treści strony z CMS-u. Brak dokumentu = wartości z kodu. */
export const getPageContent = cache(async (slug: string): Promise<PageContent | null> => {
  // Nadpisania stron istnieją tylko w Sanity. Przy WordPressie obowiązują
  // wartości z kodu — nagłówki i CTA landingów są częścią projektu, nie treści.
  if (resolveContentSource() !== 'sanity') return null;
  return fetchFromSanity<PageContent>(pageQuery, { slug });
});

export const getProcessSteps = () => processSteps;
