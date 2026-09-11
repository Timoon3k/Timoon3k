/**
 * Kształt odpowiedzi WP REST API dla naszych typów treści.
 *
 * Opisujemy tylko te pola, których realnie używamy — WordPress zwraca
 * ich znacznie więcej, a przepisywanie całości byłoby utrzymaniowym długiem.
 */

export interface WpRendered {
  rendered: string;
}

export interface WpMedia {
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
}

export interface WpPost<M = Record<string, unknown>> {
  id: number;
  slug: string;
  date?: string;
  title: WpRendered;
  content?: WpRendered;
  excerpt?: WpRendered;
  menu_order?: number;
  meta: M;
  _embedded?: {
    'wp:featuredmedia'?: WpMedia[];
  };
}

/** Meta rejestrowane przez wtyczkę `wordpress/msdream-cms.php`. */
export interface ServiceMeta {
  msd_category: 'jazda-konna' | 'tufting' | '';
  msd_tagline: string;
  msd_price: string;
  msd_price_note: string;
  msd_duration: string;
  msd_audience: string;
  /** Pozycje rozdzielone znakiem nowej linii. */
  msd_includes: string;
  msd_requirements: string;
  msd_bookero_service_id: string;
  msd_featured: boolean;
}

export interface InstructorMeta {
  msd_role: string;
  msd_experience: string;
  msd_specialization: string;
  msd_socials: string;
}

export interface TestimonialMeta {
  msd_author: string;
  msd_rating: string;
  msd_date: string;
}

export interface FaqMeta {
  msd_topic: string;
}

export interface HorseMeta {
  msd_breed: string;
  msd_character: string;
}

export interface GalleryMeta {
  msd_span: string;
  msd_caption: string;
}

export interface SettingsPayload {
  legal_name?: string;
  street?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  tax_id?: string;
  latitude?: string;
  longitude?: string;
  google_place_id?: string;
  opening_hours?: Array<{ days: string[]; opens: string; closes: string }>;
  socials?: Array<{ label: string; href: string }>;
}
