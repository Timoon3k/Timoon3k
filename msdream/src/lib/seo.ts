import type { Metadata } from 'next';
import { CITY, CITY_LOCATIVE, SITE_NAME, SITE_URL, resolved } from './site';
import type { SiteData } from './site-data';
import type { Service, Testimonial } from './types';

export const DEFAULT_OG = '/og/msdream.svg';

interface PageSeo {
  title: string;
  description: string;
  /** Ścieżka bez domeny, np. `/oferta/jazda-konna`. */
  path: string;
  ogImage?: string;
  /** Ustaw dla stron technicznych (statusy płatności, podziękowania). */
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export function buildMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG,
  noIndex = false,
  type = 'website',
  publishedTime,
}: PageSeo): Metadata {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: 'pl_PL',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

/**
 * Buduje adres pocztowy — ale tylko z pól, które właściciel faktycznie podał.
 * Niekompletny `PostalAddress` w danych strukturalnych jest gorszy niż jego
 * brak, więc zwracamy `undefined`, dopóki nie ma ulicy i kodu pocztowego.
 */
function postalAddress(data: SiteData) {
  if (!data.street || !data.postalCode) return undefined;

  return {
    '@type': 'PostalAddress',
    streetAddress: data.street,
    postalCode: data.postalCode,
    addressLocality: data.city,
    addressRegion: data.region,
    addressCountry: 'PL',
  };
}

function geo(data: SiteData) {
  if (data.latitude == null || data.longitude == null) return undefined;
  return { '@type': 'GeoCoordinates', latitude: data.latitude, longitude: data.longitude };
}

function openingHours(data: SiteData) {
  if (data.openingHours.length === 0) return undefined;
  return data.openingHours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));
}

/** Ocena zbiorcza liczona WYŁĄCZNIE z realnych opinii. Nigdy podawana ręcznie. */
function aggregateRating(testimonials: readonly Testimonial[]) {
  if (testimonials.length === 0) return undefined;
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0);

  return {
    '@type': 'AggregateRating',
    ratingValue: Math.round((sum / testimonials.length) * 10) / 10,
    reviewCount: testimonials.length,
  };
}

/** Usuwa klucze o wartości `undefined` — żeby nie emitować pustych pól. */
function compact<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/**
 * LocalBusiness — główny obiekt lokalnego SEO.
 *
 * `SportsActivityLocation` jest właściwszym typem niż samo `LocalBusiness`
 * dla szkoły jazdy konnej i jest jego podtypem, więc dziedziczy wszystkie pola.
 */
export function localBusinessJsonLd(data: SiteData, testimonials: readonly Testimonial[] = []) {
  return compact({
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organizacja`,
    name: SITE_NAME,
    legalName: data.legalName ?? undefined,
    description: `Szkoła jazdy konnej w ${CITY_LOCATIVE} pod Warszawą. Nauka jazdy konnej dla dzieci i dorosłych oraz warsztaty tuftingu.`,
    url: SITE_URL,
    telephone: data.phone ?? undefined,
    email: data.email ?? undefined,
    vatID: data.taxId ?? undefined,
    address: postalAddress(data),
    geo: geo(data),
    areaServed: [
      { '@type': 'City', name: 'Łomianki' },
      { '@type': 'City', name: 'Warszawa' },
      { '@type': 'AdministrativeArea', name: 'powiat warszawski zachodni' },
    ],
    openingHoursSpecification: openingHours(data),
    sameAs: data.socials.length > 0 ? data.socials.map((s) => s.href) : undefined,
    priceRange: undefined, // uzupełnij dopiero, gdy cennik będzie potwierdzony
    // Brak realnych opinii = brak pola. Nigdy nie podajemy wymyślonej oceny.
    aggregateRating: aggregateRating(testimonials),
  });
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#witryna`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: 'pl-PL',
    publisher: { '@id': `${SITE_URL}/#organizacja` },
  };
}

export function breadcrumbJsonLd(items: ReadonlyArray<{ name: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.href === '/' ? '' : item.href}`,
    })),
  };
}

export function faqJsonLd(items: ReadonlyArray<{ question: string; answer: string }>) {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * Service — z ofertą tylko wtedy, gdy cena jest potwierdzona.
 * Zmyślona cena w danych strukturalnych to wprowadzanie użytkownika w błąd.
 */
export function serviceJsonLd(service: Service, path: string) {
  const price = resolved(service.price);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE_URL}${path}#usluga`,
    name: service.name,
    description: service.description,
    serviceType:
      service.category === 'jazda-konna' ? 'Nauka jazdy konnej' : 'Warsztaty rękodzieła (tufting)',
    provider: { '@id': `${SITE_URL}/#organizacja` },
    areaServed: { '@type': 'City', name: CITY },
    audience: { '@type': 'Audience', audienceType: service.audience },
    offers:
      price != null
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'PLN',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}${path}`,
          }
        : undefined,
  });
}

export function personJsonLd(name: string, role: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: role,
    worksFor: { '@id': `${SITE_URL}/#organizacja` },
    url: `${SITE_URL}${path}`,
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'pl-PL',
    mainEntityOfPage: `${SITE_URL}/poradnik/${post.slug}`,
    publisher: { '@id': `${SITE_URL}/#organizacja` },
    author: { '@id': `${SITE_URL}/#organizacja` },
  };
}
