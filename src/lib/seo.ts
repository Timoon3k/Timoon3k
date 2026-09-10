import type { Metadata } from 'next';
import { site, siteUrl } from '@/lib/site';

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Ścieżka względna z wiodącym ukośnikiem, np. `/portfolio` */
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  const image = ogImage ?? `${siteUrl}/og/default.png`;

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
      siteName: site.name,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

const personId = `${siteUrl}/#osoba`;
const businessId = `${siteUrl}/#firma`;
const websiteId = `${siteUrl}/#witryna`;

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': personId,
  name: site.name,
  jobTitle: site.role,
  url: siteUrl,
  email: `mailto:${site.email}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  sameAs: site.socials.map((s) => s.href),
  knowsAbout: [
    'Projektowanie stron internetowych',
    'Web development',
    'WordPress',
    'WooCommerce',
    'Next.js',
    'SEO techniczne',
    'Optymalizacja wydajności stron',
  ],
  worksFor: { '@id': businessId },
};

export const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': businessId,
  name: `${site.name} — ${site.role}`,
  description: site.shortDescription,
  url: siteUrl,
  email: `mailto:${site.email}`,
  founder: { '@id': personId },
  image: `${siteUrl}/og/default.png`,
  priceRange: 'od 1500 PLN',
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressRegion: site.region,
    addressCountry: site.country,
  },
  areaServed: site.serviceArea.map((name) => ({ '@type': 'Place', name })),
  knowsLanguage: ['pl', 'en'],
  sameAs: site.socials.map((s) => s.href),
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': websiteId,
  url: siteUrl,
  name: site.name,
  inLanguage: 'pl-PL',
  publisher: { '@id': personId },
};

export type Crumb = { name: string; href: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.href === '/' ? '' : crumb.href}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    inLanguage: 'pl-PL',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}${input.path}` },
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: { '@id': personId },
    publisher: { '@id': personId },
    image: input.image ?? `${siteUrl}/og/default.png`,
  };
}

export function creativeWorkSchema(input: {
  name: string;
  description: string;
  path: string;
  image: string;
  keywords: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: input.name,
    description: input.description,
    url: `${siteUrl}${input.path}`,
    image: `${siteUrl}${input.image}`,
    keywords: input.keywords.join(', '),
    creator: { '@id': personId },
    inLanguage: 'pl-PL',
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  areaServed: string[];
  priceFrom?: number | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.name,
    url: `${siteUrl}${input.path}`,
    provider: { '@id': businessId },
    areaServed: input.areaServed.map((name) => ({ '@type': 'Place', name })),
    ...(input.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PLN',
            price: input.priceFrom,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}
