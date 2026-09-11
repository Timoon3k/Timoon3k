import { createHash, timingSafeEqual } from 'node:crypto';
import { hotpayEnv } from './env';

/**
 * Weryfikacja powiadomień HotPay (Pay by Link).
 *
 * Zgodnie z dokumentacją techniczną HotPay powiadomienie zawiera parametry
 * KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SEKRET oraz HASH, gdzie:
 *
 *   HASH = sha256( HASLO_Z_USTAWIEN ; KWOTA ; ID_PLATNOSCI ; ID_ZAMOWIENIA ; STATUS ; SEKRET )
 *
 * Nie implementujemy tu żadnego wymyślonego endpointu — jedyne, co robimy,
 * to sprawdzenie podpisu przychodzącego żądania.
 */

export interface HotpayNotification {
  KWOTA: string;
  ID_PLATNOSCI: string;
  ID_ZAMOWIENIA: string;
  STATUS: 'SUCCESS' | 'PENDING' | 'FAILURE' | string;
  SEKRET: string;
  HASH: string;
}

const REQUIRED_FIELDS = [
  'KWOTA',
  'ID_PLATNOSCI',
  'ID_ZAMOWIENIA',
  'STATUS',
  'SEKRET',
  'HASH',
] as const;

/** Wyciąga powiadomienie z ciała żądania; `null`, gdy brakuje pól. */
export function parseNotification(form: FormData): HotpayNotification | null {
  const data: Record<string, string> = {};

  for (const field of REQUIRED_FIELDS) {
    const value = form.get(field);
    if (typeof value !== 'string' || value.length === 0) return null;
    data[field] = value;
  }

  return data as unknown as HotpayNotification;
}

/**
 * Sprawdza autentyczność powiadomienia.
 *
 * Porównanie skrótów robimy w czasie stałym (`timingSafeEqual`), żeby nie
 * wyciekać informacji przez pomiar czasu odpowiedzi.
 */
export function verifyNotification(notification: HotpayNotification): boolean {
  const env = hotpayEnv();
  if (!env) return false;

  // SEKRET przychodzi w powiadomieniu — musi zgadzać się z naszym.
  if (notification.SEKRET !== env.HOTPAY_SECRET) return false;

  const payload = [
    env.HOTPAY_PASSWORD,
    notification.KWOTA,
    notification.ID_PLATNOSCI,
    notification.ID_ZAMOWIENIA,
    notification.STATUS,
    env.HOTPAY_SECRET,
  ].join(';');

  const expected = createHash('sha256').update(payload, 'utf8').digest();
  const received = Buffer.from(notification.HASH.trim().toLowerCase(), 'hex');

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}
