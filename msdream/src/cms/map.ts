import type {
  FaqItem,
  GalleryImage,
  GuidePost,
  Horse,
  Instructor,
  PhotoRef,
  Service,
  Testimonial,
} from '@/lib/types';
import { photoRequired } from '@/lib/types';
import { owner } from '@/lib/site';
import type {
  FaqMeta,
  GalleryMeta,
  HorseMeta,
  InstructorMeta,
  ServiceMeta,
  TestimonialMeta,
  WpPost,
} from './types';

/** Usuwa znaczniki HTML z pól `rendered`, które mają być czystym tekstem. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, '’')
    .replace(/&quot;/g, '"')
    .replace(/&#8222;|&#8221;/g, '„')
    .trim();
}

/** Zamienia pole wielolinijkowe z WP na tablicę pozycji. */
function lines(value: string | undefined): string[] {
  return (value ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function num(value: string | undefined): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Zdjęcie wyróżniające → `PhotoRef`.
 *
 * Gdy w WordPressie nie ustawiono zdjęcia, zwracamy brief fotograficzny
 * zamiast pustego kadru — ta sama zasada, co w treści startowej.
 */
export function mapPhoto(post: WpPost<unknown>, fallbackBrief: string, alt: string): PhotoRef {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media?.source_url) return photoRequired(fallbackBrief, alt);

  return {
    kind: 'file',
    src: media.source_url,
    alt: media.alt_text?.trim() || alt,
    width: media.media_details?.width ?? 1600,
    height: media.media_details?.height ?? 2000,
  };
}

export function mapService(post: WpPost<ServiceMeta>): Service {
  const name = stripHtml(post.title.rendered);
  const price = num(post.meta.msd_price);
  const duration = num(post.meta.msd_duration);

  return {
    slug: post.slug,
    category: post.meta.msd_category === 'tufting' ? 'tufting' : 'jazda-konna',
    name,
    tagline: post.meta.msd_tagline || '',
    description: stripHtml(post.content?.rendered ?? ''),
    // Brak ceny w CMS = cena wciąż do uzupełnienia. Nie podstawiamy zera.
    price: price ?? owner<number>(`cena usługi „${name}" (pole „Cena" w WordPressie)`),
    priceNote: post.meta.msd_price_note || undefined,
    durationMin: duration ?? owner<number>(`czas trwania usługi „${name}" w minutach`),
    audience: post.meta.msd_audience || '',
    includes: lines(post.meta.msd_includes),
    requirements: lines(post.meta.msd_requirements),
    photo: mapPhoto(post, `Zdjęcie ilustrujące zajęcia „${name}"`, name),
    bookeroServiceId: post.meta.msd_bookero_service_id || null,
    featured: Boolean(post.meta.msd_featured),
  };
}

export function mapInstructor(post: WpPost<InstructorMeta>, index: number): Instructor {
  const name = stripHtml(post.title.rendered);

  return {
    slug: post.slug,
    name,
    role: post.meta.msd_role || 'Instruktor jazdy konnej',
    bio: stripHtml(post.content?.rendered ?? ''),
    experience: post.meta.msd_experience || '',
    specialization: lines(post.meta.msd_specialization),
    portrait: mapPhoto(post, `Portret instruktora ${name} przy koniu — pion 4:5`, `${name} — instruktor jazdy konnej w MSdream`),
    socials: lines(post.meta.msd_socials)
      .map((line) => {
        // Format w CMS: „Instagram|https://instagram.com/..."
        const [label, href] = line.split('|').map((s) => s.trim());
        return label && href ? { label, href } : null;
      })
      .filter((s): s is { label: string; href: string } => s !== null),
    sortOrder: post.menu_order ?? index,
  };
}

export function mapTestimonial(post: WpPost<TestimonialMeta>): Testimonial {
  const rating = num(post.meta.msd_rating) ?? 5;

  return {
    author: post.meta.msd_author || stripHtml(post.title.rendered),
    rating: Math.min(5, Math.max(1, Math.round(rating))) as Testimonial['rating'],
    text: stripHtml(post.content?.rendered ?? ''),
    date: post.meta.msd_date || post.date,
    source: 'google',
  };
}

export function mapFaq(post: WpPost<FaqMeta>): FaqItem {
  const allowed: FaqItem['topic'][] = ['ogolne', 'jazda-konna', 'dzieci', 'tufting', 'rezerwacja'];
  const topic = post.meta.msd_topic as FaqItem['topic'];

  return {
    question: stripHtml(post.title.rendered),
    answer: stripHtml(post.content?.rendered ?? ''),
    topic: allowed.includes(topic) ? topic : 'ogolne',
  };
}

export function mapHorse(post: WpPost<HorseMeta>): Horse {
  const name = stripHtml(post.title.rendered);
  return {
    name,
    breed: post.meta.msd_breed || '',
    character: post.meta.msd_character || stripHtml(post.content?.rendered ?? ''),
    photo: mapPhoto(post, `Portret konia ${name} — pion 4:5`, `${name} — koń ze stajni MSdream`),
  };
}

export function mapGalleryImage(post: WpPost<GalleryMeta>): GalleryImage {
  const allowed: GalleryImage['span'][] = ['tall', 'wide', 'square', 'hero'];
  const span = post.meta.msd_span as GalleryImage['span'];
  const caption = post.meta.msd_caption || stripHtml(post.title.rendered);

  return {
    span: allowed.includes(span) ? span : 'square',
    caption: caption || undefined,
    photo: mapPhoto(post, `Zdjęcie do galerii: ${caption}`, caption || 'Galeria MSdream'),
  };
}

export function mapGuide(post: WpPost<Record<string, never>>): GuidePost {
  return {
    slug: post.slug,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt?.rendered ?? ''),
    date: post.date ?? new Date().toISOString(),
    // Treść z edytora WordPressa jest już HTML-em — renderujemy ją jako HTML,
    // nie przez parser Markdown.
    body: post.content?.rendered ?? '',
    format: 'html',
    keywords: [],
  };
}
