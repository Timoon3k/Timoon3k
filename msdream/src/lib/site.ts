/**
 * Dane firmowe (NAP) i konfiguracja globalna.
 *
 * WAŻNE — zasada uczciwości danych
 * --------------------------------
 * Każda wartość owinięta w `owner()` to dana, której NIE udało się pobrać
 * z msdream.pl (domena jest niedostępna z tego środowiska — szczegóły
 * w SETUP.md). Takie wartości:
 *   1. są widoczne w interfejsie jako placeholder do uzupełnienia,
 *   2. NIE trafiają do JSON-LD ani do metadanych SEO — patrz `lib/seo.ts`.
 *
 * Nie zmyślamy adresu, telefonu ani NIP-u: błędny NAP jest dla lokalnego SEO
 * gorszy niż jego brak, a błędne dane strukturalne to ryzyko ręcznej kary.
 *
 * Właściciel uzupełnia je w CMS (Sanity → Ustawienia witryny) albo tutaj.
 */

/** Znacznik danej wymaganej od właściciela. */
export type OwnerRequired<T = string> = {
  readonly __ownerRequired: true;
  readonly hint: string;
  readonly value: T | null;
};

export function owner<T = string>(hint: string, value: T | null = null): OwnerRequired<T> {
  return { __ownerRequired: true, hint, value };
}

export function isOwnerRequired(v: unknown): v is OwnerRequired<unknown> {
  return typeof v === 'object' && v !== null && '__ownerRequired' in v;
}

/**
 * Rozpakowuje wartość: zwraca `null`, jeśli dana nie została jeszcze podana.
 * Używaj wszędzie, gdzie dana ma trafić do schema.org lub metadanych.
 */
export function resolved<T>(v: T | OwnerRequired<T>): T | null {
  if (isOwnerRequired(v)) return (v.value as T) ?? null;
  return v;
}

/** Tekst do wyświetlenia w UI — albo prawdziwa wartość, albo czytelny brief. */
export function display<T>(v: T | OwnerRequired<T>, fallback = 'Do uzupełnienia'): string {
  if (isOwnerRequired(v)) {
    return v.value != null ? String(v.value) : `${fallback} — ${v.hint}`;
  }
  return String(v);
}

// ---------------------------------------------------------------------------

export const SITE_NAME = 'MSdream';
export const SITE_LEGAL_NAME = owner(
  'pełna nazwa firmy z CEIDG/KRS, np. „MSdream Marta Kowalska"',
);

/** Adres kanoniczny. Na Vercelu podstawia się automatycznie adres wdrożenia. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '');

export const CITY = 'Łomianki';

/**
 * Miejscownik nazwy miasta („w Łomiankach”).
 *
 * Polski wymaga odmiany przez przypadki, a nazwa miejscowości pochodzi
 * z konfiguracji — sklejenie „w ” + CITY dałoby „w Łomianki”. Trzymamy
 * obie formy jawnie, zamiast próbować odmieniać nazwy własne programowo.
 */
export const CITY_LOCATIVE = 'Łomiankach';

export const REGION = 'mazowieckie';

export const NAP = {
  street: owner('ulica i numer stajni w Łomiankach'),
  postalCode: owner('kod pocztowy, format 05-092'),
  city: CITY,
  region: REGION,
  country: 'PL',
  phone: owner('telefon kontaktowy w formacie +48 XXX XXX XXX'),
  email: owner('adres e-mail do kontaktu, np. kontakt@msdream.pl'),
  taxId: owner('NIP firmy'),
  /** Współrzędne stajni — potrzebne do mapy i LocalBusiness.geo. */
  latitude: owner<number>('szerokość geograficzna stajni (z Google Maps)'),
  longitude: owner<number>('długość geograficzna stajni (z Google Maps)'),
  /** Link „Wyznacz trasę". Bez współrzędnych używamy wyszukiwania po nazwie. */
  googleMapsPlaceId: owner('Place ID wizytówki Google (Google Business Profile)'),
} as const;

/**
 * Godziny otwarcia. Format zgodny ze schema.org OpeningHoursSpecification.
 * Dopóki `hours` jest puste, sekcja godzin i pole w JSON-LD są pomijane.
 */
export const OPENING_HOURS: ReadonlyArray<{
  days: readonly string[];
  opens: string;
  closes: string;
}> = [];

export const SOCIALS: ReadonlyArray<{ label: string; href: string }> = [
  // Uzupełnij w CMS (Ustawienia witryny → Social media) lub tutaj.
  // { label: 'Facebook', href: 'https://www.facebook.com/...' },
];

export const ANALYTICS = {
  ga4: process.env.NEXT_PUBLIC_GA4_ID || '',
  metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  searchConsole: process.env.GOOGLE_SITE_VERIFICATION || '',
} as const;

/** Nawigacja główna — jedno źródło prawdy dla headera, stopki i sitemapy. */
export const NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Strona główna', href: '/' },
  { label: 'O nas', href: '/o-nas' },
  { label: 'Oferta', href: '/oferta' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Opinie', href: '/opinie' },
  { label: 'Instruktorzy', href: '/instruktorzy' },
  { label: 'Mapa', href: '/mapa' },
  { label: 'Kontakt', href: '/kontakt' },
];

export const LEGAL_NAV: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'Polityka prywatności', href: '/polityka-prywatnosci' },
  { label: 'Pliki cookies', href: '/cookies' },
  { label: 'Regulamin strony', href: '/regulamin' },
  { label: 'Regulamin rezerwacji', href: '/regulamin-rezerwacji' },
];
