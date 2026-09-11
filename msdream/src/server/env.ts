import { z } from 'zod';

/**
 * Zmienne środowiskowe używane wyłącznie po stronie serwera.
 *
 * Walidujemy je leniwie (przy pierwszym użyciu), a nie przy starcie procesu —
 * dzięki temu strona wizytówkowa działa i buduje się bez skonfigurowanych
 * płatności, a brak sekretu ujawnia się dopiero na endpointcie, który go
 * naprawdę potrzebuje, z czytelnym komunikatem w logu.
 */

const hotpaySchema = z.object({
  /** ID/nazwa usługi w panelu HotPay (parametr SEKRET jest osobny). */
  HOTPAY_SECRET: z.string().min(1),
  /** „Hasło z ustawień" usługi — pierwszy człon skrótu HASH. */
  HOTPAY_PASSWORD: z.string().min(1),
});

const fakturowniaSchema = z.object({
  FAKTUROWNIA_API_TOKEN: z.string().min(1),
  /** Poddomena konta, np. „msdream" dla msdream.fakturownia.pl. */
  FAKTUROWNIA_ACCOUNT: z.string().min(1),
});

export type HotpayEnv = z.infer<typeof hotpaySchema>;
export type FakturowniaEnv = z.infer<typeof fakturowniaSchema>;

/** Zwraca konfigurację HotPay albo `null`, gdy integracja nie jest włączona. */
export function hotpayEnv(): HotpayEnv | null {
  const parsed = hotpaySchema.safeParse(process.env);
  return parsed.success ? parsed.data : null;
}

export function fakturowniaEnv(): FakturowniaEnv | null {
  const parsed = fakturowniaSchema.safeParse(process.env);
  return parsed.success ? parsed.data : null;
}

/** Domyślna stawka VAT dla usług rekreacyjnych. Nadpisywalna zmienną. */
export const INVOICE_VAT_RATE = Number(process.env.FAKTUROWNIA_VAT_RATE ?? '23');

/** `receipt` = paragon, `vat` = faktura VAT. */
export const INVOICE_KIND = (process.env.FAKTUROWNIA_DEFAULT_KIND ?? 'receipt') as
  | 'receipt'
  | 'vat';
