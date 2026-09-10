import { cache } from 'react';
import { getSanityClient } from '@/sanity/client';
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
 * Gdy Sanity jest skonfigurowane, dane pochodzą z CMS-u. W przeciwnym razie
 * — albo gdy zapytanie zwróci pustą kolekcję — używana jest treść startowa
 * z `src/content`. Dzięki temu projekt uruchamia się bez żadnych kluczy,
 * a wdrożenie z CMS-em nie wymaga zmian w komponentach.
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

export const getProjects = cache(async (): Promise<Project[]> => {
  const data = await fetchFromSanity<Project[]>(projectsQuery);
  return nonEmpty(data) ? data : seedProjects;
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const all = await getProjects();
  const featured = all.filter((project) => project.featured);
  return featured.length ? featured : all.slice(0, 4);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | undefined> => {
  const all = await getProjects();
  return all.find((project) => project.slug === slug);
});

export const getServices = cache(async (): Promise<Service[]> => {
  const data = await fetchFromSanity<Service[]>(servicesQuery);
  return nonEmpty(data) ? data : seedServices;
});

export const getPosts = cache(async (): Promise<Post[]> => {
  const data = await fetchFromSanity<Post[]>(postsQuery);
  const posts = nonEmpty(data) ? data : seedPosts;
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

export const getFaq = cache(async (key: 'general' | 'wolomin' | 'warszawa'): Promise<Faq[]> => {
  const data = await fetchFromSanity<Faq[]>(faqQuery, { key });
  return nonEmpty(data) ? data : (seedFaq[key] ?? []);
});

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const data = await fetchFromSanity<Testimonial[]>(testimonialsQuery);
  return nonEmpty(data) ? data : [];
});

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
  return fetchFromSanity<PageContent>(pageQuery, { slug });
});

export const getProcessSteps = () => processSteps;
