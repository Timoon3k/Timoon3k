import type { MetadataRoute } from 'next';
import { getGuides, getInstructors, getServices } from '@/cms/content';
import { SITE_URL, isOwnerRequired } from '@/lib/site';

/**
 * Mapa witryny.
 *
 * Generowana z tych samych źródeł, co strony — nie ma szans, żeby wskazała
 * adres, którego nie ma, albo pominęła nowy wpis dodany w CMS.
 *
 * Świadomie POMIJAMY: statusy płatności (`/platnosc/*`), endpointy API
 * i profile instruktorów bez uzupełnionych danych.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, instructors, guides] = await Promise.all([
    getServices(),
    getInstructors(),
    getGuides(),
  ]);

  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry('/', 1, 'weekly'),
    entry('/oferta', 0.9, 'weekly'),
    entry('/oferta/jazda-konna', 0.9, 'weekly'),
    entry('/oferta/warsztaty-tuftingu', 0.9, 'weekly'),
    entry('/rezerwacja', 0.9, 'weekly'),
    entry('/rezerwacja-tuftingu', 0.8, 'weekly'),

    // Lokalne strony docelowe — najważniejsze wejścia z wyszukiwarki.
    entry('/jazda-konna-dla-dzieci-lomianki', 0.9, 'monthly'),
    entry('/nauka-jazdy-konnej-lomianki', 0.9, 'monthly'),

    entry('/o-nas', 0.7),
    entry('/instruktorzy', 0.7),
    entry('/galeria', 0.6),
    entry('/opinie', 0.6),
    entry('/mapa', 0.6),
    entry('/kontakt', 0.8),
    entry('/poradnik', 0.7, 'weekly'),

    ...services.map((service) => entry(`/oferta/${service.slug}`, 0.8)),

    ...instructors
      .filter((instructor) => !isOwnerRequired(instructor.name))
      .map((instructor) => entry(`/instruktorzy/${instructor.slug}`, 0.5)),

    ...guides.map((guide) => ({
      url: `${SITE_URL}/poradnik/${guide.slug}`,
      lastModified: new Date(guide.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),

    entry('/polityka-prywatnosci', 0.2, 'yearly'),
    entry('/cookies', 0.2, 'yearly'),
    entry('/regulamin', 0.2, 'yearly'),
    entry('/regulamin-rezerwacji', 0.3, 'yearly'),
  ];
}
