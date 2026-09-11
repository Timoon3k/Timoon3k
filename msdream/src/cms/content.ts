import { cache } from 'react';

import { CMS_TAGS } from './config';
import { wpFetch } from './client';
import {
  mapFaq,
  mapGalleryImage,
  mapGuide,
  mapHorse,
  mapInstructor,
  mapService,
  mapTestimonial,
} from './map';
import type {
  FaqMeta,
  GalleryMeta,
  HorseMeta,
  InstructorMeta,
  ServiceMeta,
  SettingsPayload,
  TestimonialMeta,
  WpPost,
} from './types';

import { RIDING_SERVICES, TUFTING_SERVICES } from '@/content/services';
import { INSTRUCTORS } from '@/content/instructors';
import { GALLERY } from '@/content/gallery';
import { TESTIMONIALS } from '@/content/testimonials';
import { FAQ } from '@/content/faq';
import { HORSES } from '@/content/horses';
import { GUIDES } from '@/content/guides';

import type {
  FaqItem,
  GalleryImage,
  GuidePost,
  Horse,
  Instructor,
  Service,
  Testimonial,
} from '@/lib/types';

/**
 * Jedyne API treści dla całej aplikacji.
 *
 * Każda funkcja próbuje najpierw pobrać dane z WordPressa, a gdy CMS nie jest
 * podpięty albo nie odpowiada — zwraca treść startową z `src/content`.
 * Dzięki temu:
 *  • projekt uruchamia się `npm run dev` bez żadnej konfiguracji,
 *  • awaria WordPressa nie zdejmuje strony z internetu,
 *  • wdrożenie CMS-u nie wymaga zmiany ani jednej linii w komponentach.
 *
 * `cache()` deduplikuje wywołania w obrębie jednego renderu — strona główna
 * pyta o usługi raz, nawet jeśli używa ich w trzech sekcjach.
 */

const EMBED = { _embed: 'wp:featuredmedia', orderby: 'menu_order', order: 'asc' } as const;

export const getServices = cache(async (): Promise<readonly Service[]> => {
  const posts = await wpFetch<WpPost<ServiceMeta>[]>('/wp/v2/msd_usluga', {
    tag: CMS_TAGS.services,
    params: EMBED,
  });

  if (!posts || posts.length === 0) return [...RIDING_SERVICES, ...TUFTING_SERVICES];
  return posts.map(mapService);
});

export const getRidingServices = cache(async (): Promise<readonly Service[]> => {
  const all = await getServices();
  return all.filter((s) => s.category === 'jazda-konna');
});

export const getTuftingServices = cache(async (): Promise<readonly Service[]> => {
  const all = await getServices();
  return all.filter((s) => s.category === 'tufting');
});

export const getService = cache(async (slug: string): Promise<Service | undefined> => {
  const all = await getServices();
  return all.find((s) => s.slug === slug);
});

export const getInstructors = cache(async (): Promise<readonly Instructor[]> => {
  const posts = await wpFetch<WpPost<InstructorMeta>[]>('/wp/v2/msd_instruktor', {
    tag: CMS_TAGS.instructors,
    params: EMBED,
  });

  if (!posts || posts.length === 0) return INSTRUCTORS;
  return posts.map(mapInstructor).sort((a, b) => a.sortOrder - b.sortOrder);
});

export const getInstructor = cache(async (slug: string): Promise<Instructor | undefined> => {
  const all = await getInstructors();
  return all.find((i) => i.slug === slug);
});

export const getGallery = cache(async (): Promise<readonly GalleryImage[]> => {
  const posts = await wpFetch<WpPost<GalleryMeta>[]>('/wp/v2/msd_galeria', {
    tag: CMS_TAGS.gallery,
    params: EMBED,
  });

  if (!posts || posts.length === 0) return GALLERY;
  return posts.map(mapGalleryImage);
});

export const getTestimonials = cache(async (): Promise<readonly Testimonial[]> => {
  const posts = await wpFetch<WpPost<TestimonialMeta>[]>('/wp/v2/msd_opinia', {
    tag: CMS_TAGS.testimonials,
  });

  // Uwaga: pusty wynik z CMS-u jest tu poprawnym stanem, a nie awarią —
  // seed opinii też jest pusty, bo nie wymyślamy recenzji.
  if (!posts) return TESTIMONIALS;
  return posts.map(mapTestimonial);
});

export const getFaq = cache(async (): Promise<readonly FaqItem[]> => {
  const posts = await wpFetch<WpPost<FaqMeta>[]>('/wp/v2/msd_faq', {
    tag: CMS_TAGS.faq,
    params: { orderby: 'menu_order', order: 'asc' },
  });

  if (!posts || posts.length === 0) return FAQ;
  return posts.map(mapFaq);
});

export async function getFaqByTopic(
  ...topics: readonly FaqItem['topic'][]
): Promise<readonly FaqItem[]> {
  const all = await getFaq();
  return all.filter((f) => topics.includes(f.topic));
}

export const getHorses = cache(async (): Promise<readonly Horse[]> => {
  const posts = await wpFetch<WpPost<HorseMeta>[]>('/wp/v2/msd_kon', {
    tag: CMS_TAGS.horses,
    params: EMBED,
  });

  const source = !posts || posts.length === 0 ? HORSES : posts.map(mapHorse);
  // Sekcja „nasze konie" pojawia się tylko dla realnie opisanych zwierząt.
  return source.filter((h) => h.name.trim().length > 0);
});

export const getGuides = cache(async (): Promise<readonly GuidePost[]> => {
  const posts = await wpFetch<WpPost<Record<string, never>>[]>('/wp/v2/msd_poradnik', {
    tag: CMS_TAGS.guides,
    params: { orderby: 'date', order: 'desc' },
  });

  if (!posts || posts.length === 0) return GUIDES;
  return posts.map(mapGuide);
});

export const getGuide = cache(async (slug: string): Promise<GuidePost | undefined> => {
  const all = await getGuides();
  return all.find((g) => g.slug === slug);
});

/**
 * Dokument prawny po slugu (`polityka-prywatnosci`, `regulamin`, …).
 * Zwraca `null`, gdy w CMS nie ma dokumentu — strona pokazuje wtedy
 * jawną informację, że treść czeka na uzupełnienie, zamiast pustej strony.
 */
export const getLegalDocument = cache(
  async (slug: string): Promise<{ title: string; body: string } | null> => {
    const posts = await wpFetch<WpPost<Record<string, never>>[]>('/wp/v2/msd_dokument', {
      tag: CMS_TAGS.legal,
      params: { slug },
    });

    const post = posts?.[0];
    if (!post) return null;

    return {
      title: post.title.rendered.replace(/<[^>]+>/g, '').trim(),
      body: post.content?.rendered ?? '',
    };
  },
);

/** Dane firmowe nadpisujące wartości z `lib/site.ts`. */
export const getSettings = cache(async (): Promise<SettingsPayload | null> => {
  return wpFetch<SettingsPayload>('/msdream/v1/settings', { tag: CMS_TAGS.settings });
});
