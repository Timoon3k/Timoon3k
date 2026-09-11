import { INVOICE_KIND, INVOICE_VAT_RATE, fakturowniaEnv } from './env';

/**
 * Wystawianie dokumentów sprzedaży przez API Fakturowni.
 *
 * Zgodnie z oficjalną dokumentacją (github.com/fakturownia/API):
 *   POST https://{konto}.fakturownia.pl/invoices.json
 *   { "api_token": "...", "invoice": { kind, positions[], buyer_*, oid, ... } }
 *
 * ---------------------------------------------------------------------------
 * IDEMPOTENCJA — najważniejsza właściwość tego modułu
 * ---------------------------------------------------------------------------
 * Bramki płatnicze ponawiają webhooki. Pięciokrotnie wysłane powiadomienie
 * NIE MOŻE wystawić pięciu faktur. Zabezpieczamy się dwiema warstwami:
 *
 *  1. `oid` — zewnętrzny numer zamówienia (u nas: ID płatności HotPay) —
 *     razem z `oid_unique: 'yes'`. To udokumentowany mechanizm Fakturowni:
 *     przy tym ustawieniu system **odmawia** utworzenia drugiego dokumentu
 *     z tym samym `oid`. Kontrola jest po stronie Fakturowni, więc działa
 *     nawet przy równoległych żądaniach i po restarcie naszej aplikacji.
 *
 *  2. Sprawdzenie przed zapisem — pytamy o dokument o danym `oid`
 *     i jeśli istnieje, zwracamy go bez tworzenia nowego. Ta warstwa
 *     oszczędza niepotrzebne zapisy i daje czytelny log.
 *
 * Świadomie NIE trzymamy własnej bazy „przetworzonych transakcji":
 * źródłem prawdy jest Fakturownia, a dodatkowy magazyn stanu to kolejne
 * miejsce, które może się z nią rozjechać.
 */

export interface InvoiceRequest {
  /** Zewnętrzny identyfikator transakcji — klucz idempotencji. */
  externalId: string;
  /** Kwota brutto w PLN. */
  grossAmount: number;
  /** Nazwa pozycji na dokumencie, np. „Jazda konna — zajęcia indywidualne". */
  itemName: string;
  buyer: {
    name: string;
    email?: string;
    taxId?: string;
    street?: string;
    postCode?: string;
    city?: string;
  };
}

export interface InvoiceResult {
  status: 'created' | 'duplicate' | 'skipped' | 'error';
  invoiceId?: number;
  number?: string;
  message?: string;
}

function baseUrl(account: string): string {
  return `https://${account}.fakturownia.pl`;
}

/** Szuka dokumentu o podanym `oid`. Zwraca `null`, gdy nie istnieje. */
async function findByExternalId(
  account: string,
  token: string,
  externalId: string,
): Promise<{ id: number; number: string } | null> {
  const url = new URL(`${baseUrl(account)}/invoices.json`);
  url.searchParams.set('api_token', token);
  url.searchParams.set('period', 'all');
  url.searchParams.set('oid', externalId);

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const list = (await res.json()) as Array<{ id: number; number: string; oid?: string }>;
  const match = Array.isArray(list) ? list.find((i) => i.oid === externalId) : undefined;

  return match ? { id: match.id, number: match.number } : null;
}

/**
 * Wystawia paragon lub fakturę. Bezpieczne do wielokrotnego wywołania
 * z tym samym `externalId`.
 */
export async function issueInvoice(request: InvoiceRequest): Promise<InvoiceResult> {
  const env = fakturowniaEnv();

  if (!env) {
    // Brak konfiguracji nie jest błędem krytycznym — płatność i rezerwacja
    // są już poprawne. Dokument wystawi się ręcznie albo po dodaniu tokenu.
    return {
      status: 'skipped',
      message: 'Fakturownia nie jest skonfigurowana (FAKTUROWNIA_API_TOKEN / FAKTUROWNIA_ACCOUNT).',
    };
  }

  const { FAKTUROWNIA_ACCOUNT: account, FAKTUROWNIA_API_TOKEN: token } = env;

  // --- Warstwa 1: czy dokument już istnieje? -------------------------------
  try {
    const existing = await findByExternalId(account, token, request.externalId);
    if (existing) {
      return { status: 'duplicate', invoiceId: existing.id, number: existing.number };
    }
  } catch {
    // Nieudane sprawdzenie nie blokuje wystawienia — `oid_unique` niżej
    // i tak nie pozwoli na duplikat.
  }

  // --- Warstwa 2: wystawienie z blokadą unikalności -----------------------
  const today = new Date().toISOString().slice(0, 10);

  const payload = {
    api_token: token,
    invoice: {
      kind: INVOICE_KIND,
      issue_date: today,
      sell_date: today,
      // Płatność już nastąpiła — dokument od razu opłacony.
      status: 'paid',
      paid_date: today,
      payment_type: 'transfer',
      oid: request.externalId,
      // Kluczowe dla idempotencji: Fakturownia odrzuci drugi dokument
      // z tym samym numerem zamówienia.
      oid_unique: 'yes',
      buyer_name: request.buyer.name,
      ...(request.buyer.email ? { buyer_email: request.buyer.email } : {}),
      ...(request.buyer.taxId ? { buyer_tax_no: request.buyer.taxId } : {}),
      ...(request.buyer.street ? { buyer_street: request.buyer.street } : {}),
      ...(request.buyer.postCode ? { buyer_post_code: request.buyer.postCode } : {}),
      ...(request.buyer.city ? { buyer_city: request.buyer.city } : {}),
      positions: [
        {
          name: request.itemName,
          tax: INVOICE_VAT_RATE,
          total_price_gross: request.grossAmount,
          quantity: 1,
        },
      ],
    },
  };

  const res = await fetch(`${baseUrl(account)}/invoices.json`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const body = (await res.json().catch(() => null)) as
    | { id?: number; number?: string; message?: string; code?: string }
    | null;

  if (!res.ok) {
    // Odrzucenie z powodu nieunikalnego `oid` to sukces idempotencji,
    // a nie awaria: dokument dla tej transakcji już istnieje.
    const message = JSON.stringify(body ?? {});
    if (/oid/i.test(message)) {
      return { status: 'duplicate', message: 'Dokument dla tej transakcji już istnieje.' };
    }
    return { status: 'error', message: `Fakturownia HTTP ${res.status}: ${message}` };
  }

  return { status: 'created', invoiceId: body?.id, number: body?.number };
}

/** Wysyła wystawiony dokument e-mailem na adres nabywcy. */
export async function sendInvoiceByEmail(invoiceId: number): Promise<boolean> {
  const env = fakturowniaEnv();
  if (!env) return false;

  const url = new URL(
    `${baseUrl(env.FAKTUROWNIA_ACCOUNT)}/invoices/${invoiceId}/send_by_email.json`,
  );
  url.searchParams.set('api_token', env.FAKTUROWNIA_API_TOKEN);
  url.searchParams.set('email_pdf', 'true');

  const res = await fetch(url, { method: 'POST', cache: 'no-store' });
  return res.ok;
}
