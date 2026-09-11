import type { OwnerRequired } from './site';

/** Cena w PLN. `null` = do ustalenia indywidualnie. */
export type Price = number | OwnerRequired<number>;

export type ServiceCategory = 'jazda-konna' | 'tufting';

export interface Service {
  slug: string;
  category: ServiceCategory;
  /** Nazwa handlowa, np. „Jazda indywidualna". */
  name: string;
  /** Jedno zdanie, które trafia na kafel i do meta description. */
  tagline: string;
  /** 2–4 zdania opisu — język korzyści, nie lista cech. */
  description: string;
  price: Price;
  /** Sufiks przy cenie, np. „/ 60 min", „/ os.", „od". */
  priceNote?: string;
  /** Czas trwania w minutach. */
  durationMin: number | OwnerRequired<number>;
  /** Dla kogo — wiek, poziom. */
  audience: string;
  /** Co wchodzi w skład zajęć. */
  includes: readonly string[];
  /** Ograniczenia, wymagania, o czym trzeba wiedzieć przed rezerwacją. */
  requirements: readonly string[];
  /** Brief zdjęciowy albo ścieżka do gotowego pliku. */
  photo: PhotoRef;
  /** ID usługi w Bookero — pozwala otworzyć kalendarz na właściwej usłudze. */
  bookeroServiceId?: string | null;
  featured?: boolean;
}

/**
 * Referencja do zdjęcia.
 *
 * Nie wstawiamy zdjęć stockowych w miejsce prawdziwych materiałów MSdream.
 * Dopóki właściciel nie wgra pliku, komponent renderuje opisany brief
 * fotograficzny (`PHOTO_REQUIRED`) zamiast przypadkowego obrazka.
 */
export type PhotoRef =
  | { kind: 'file'; src: string; alt: string; width: number; height: number }
  | { kind: 'required'; brief: string; alt: string; ratio: '4/5' | '3/4' | '1/1' | '16/9' | '3/2' };

export function photoRequired(
  brief: string,
  alt: string,
  ratio: Extract<PhotoRef, { kind: 'required' }>['ratio'] = '4/5',
): PhotoRef {
  return { kind: 'required', brief, alt, ratio };
}

export interface Instructor {
  slug: string;
  name: string | OwnerRequired;
  role: string;
  bio: string;
  experience: string;
  specialization: readonly string[];
  portrait: PhotoRef;
  socials?: ReadonlyArray<{ label: string; href: string }>;
  sortOrder: number;
}

export interface Testimonial {
  /** Autor tak, jak podpisał się w Google. */
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** Data wystawienia (ISO). */
  date?: string;
  source: 'google';
}

export interface FaqItem {
  question: string;
  answer: string;
  /** Grupa tematyczna — pozwala pokazać właściwe FAQ na właściwej podstronie. */
  topic: 'ogolne' | 'jazda-konna' | 'dzieci' | 'tufting' | 'rezerwacja';
}

export interface GalleryImage {
  photo: PhotoRef;
  caption?: string;
  /** Sterowanie kompozycją masonry — celowo nieregularną. */
  span: 'tall' | 'wide' | 'square' | 'hero';
}

export interface Horse {
  name: string;
  breed: string;
  character: string;
  photo: PhotoRef;
}

export interface GuidePost {
  slug: string;
  title: string;
  excerpt: string;
  /** Data publikacji (ISO). */
  date: string;
  body: string;
  /** Skąd pochodzi treść: seed jest w Markdownie, WordPress zwraca HTML. */
  format: 'markdown' | 'html';
  keywords: readonly string[];
}
