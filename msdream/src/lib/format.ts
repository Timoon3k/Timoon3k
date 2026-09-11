import { isOwnerRequired, resolved, type OwnerRequired } from './site';

const PLN = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Formatuje cenę albo zwraca `null`, gdy nie została jeszcze potwierdzona. */
export function formatPrice(price: number | OwnerRequired<number>): string | null {
  const value = resolved(price);
  return value == null ? null : PLN.format(value);
}

export function priceHint(price: number | OwnerRequired<number>): string | null {
  return isOwnerRequired(price) && price.value == null ? price.hint : null;
}

export function formatDuration(min: number | OwnerRequired<number>): string | null {
  const value = resolved(min);
  if (value == null) return null;
  if (value < 60) return `${value} min`;
  const h = Math.floor(value / 60);
  const m = value % 60;
  return m === 0 ? `${h} godz.` : `${h} godz. ${m} min`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Telefon w formie nadającej się do `tel:` — bez spacji i myślników. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
