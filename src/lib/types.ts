export type ImageRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** base64 LQIP; opcjonalny — bez niego next/image użyje `empty` */
  blurDataURL?: string;
};

export type Seo = {
  title: string;
  description: string;
  /** Ścieżka względna, np. `/portfolio`. Kanoniczny URL składany jest z siteUrl. */
  path: string;
  ogImage?: string;
  noIndex?: boolean;
};

export type Service = {
  slug: string;
  title: string;
  /** Krótkie zdanie na kartę */
  tagline: string;
  description: string;
  /** Zakres prac — punkty */
  deliverables: string[];
  /** Orientacyjny przedział cenowy; null = wycena indywidualna */
  priceFrom: number | null;
  duration: string;
  /** Numer porządkowy w siatce */
  index: string;
};

export type CaseStudySection = {
  heading: string;
  body: string[];
};

export type Project = {
  slug: string;
  /** Nazwa marki klienta */
  client: string;
  /** Domena realizacji */
  domain: string;
  url: string | null;
  title: string;
  /** Jedno zdanie do listingu */
  summary: string;
  /** Rola w projekcie — co dokładnie było po mojej stronie */
  role: string;
  category: string;
  /** Dwa–cztery słowa kluczowe wyświetlane na karcie */
  tags: string[];
  stack: string[];
  /** Kolor akcentu przejmowany przez scenę 3D i tło przy hoverze */
  accent: string;
  cover: ImageRef;
  gallery: ImageRef[];
  /** Struktura case study */
  context: string;
  challenge: CaseStudySection;
  solution: CaseStudySection;
  features: { title: string; body: string }[];
  outcome: string[];
  /** Czy realizacja jest wyróżniona na stronie głównej */
  featured: boolean;
  seo: Pick<Seo, 'title' | 'description'>;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  category: string;
  cover?: ImageRef;
  /** Treść w uproszczonym markdown-ie (## nagłówki, - listy, akapity) */
  body: string;
  seo: Pick<Seo, 'title' | 'description'>;
};

export type Faq = {
  question: string;
  answer: string;
};

export type ProcessStep = {
  index: string;
  title: string;
  body: string;
  duration: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  /** Skąd pochodzi opinia (np. „Google”, „e-mail”) — dla przejrzystości */
  source: string;
};
