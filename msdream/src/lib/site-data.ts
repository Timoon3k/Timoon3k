import { cache } from 'react';
import { getSettings } from '@/cms/content';
import { CITY, NAP, OPENING_HOURS, REGION, SITE_LEGAL_NAME, SOCIALS, resolved } from './site';

/**
 * Rozwiązane dane firmowe — jedno źródło prawdy dla stopki, kontaktu, mapy
 * i danych strukturalnych.
 *
 * Kolejność: WordPress → wartości z `lib/site.ts` → `null`.
 * `null` oznacza „dana wciąż nieuzupełniona" i jest traktowana poważnie:
 * takie pole nie trafia do schema.org i nie jest zmyślane w UI.
 */
export interface SiteData {
  legalName: string | null;
  street: string | null;
  postalCode: string | null;
  city: string;
  region: string;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  socials: ReadonlyArray<{ label: string; href: string }>;
  openingHours: ReadonlyArray<{ days: readonly string[]; opens: string; closes: string }>;
}

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function pick(fromCms: string | undefined, fallback: string | null): string | null {
  const trimmed = fromCms?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const cms = await getSettings();

  return {
    legalName: pick(cms?.legal_name, resolved(SITE_LEGAL_NAME)),
    street: pick(cms?.street, resolved(NAP.street)),
    postalCode: pick(cms?.postal_code, resolved(NAP.postalCode)),
    city: CITY,
    region: REGION,
    phone: pick(cms?.phone, resolved(NAP.phone)),
    email: pick(cms?.email, resolved(NAP.email)),
    taxId: pick(cms?.tax_id, resolved(NAP.taxId)),
    latitude: toNumber(cms?.latitude) ?? resolved(NAP.latitude),
    longitude: toNumber(cms?.longitude) ?? resolved(NAP.longitude),
    googlePlaceId: pick(cms?.google_place_id, resolved(NAP.googleMapsPlaceId)),
    socials: cms?.socials?.length ? cms.socials : SOCIALS,
    openingHours: cms?.opening_hours?.length ? cms.opening_hours : OPENING_HOURS,
  };
});

/** Podpowiedź dla właściciela, gdy dana nie została jeszcze uzupełniona. */
export const HINTS = {
  street: 'Adres — uzupełnij w panelu WordPress → Ustawienia witryny',
  postalCode: 'Kod pocztowy',
  phone: 'Telefon — uzupełnij w panelu WordPress',
  email: 'E-mail — uzupełnij w panelu WordPress',
  taxId: 'NIP — uzupełnij w panelu WordPress',
} as const;
