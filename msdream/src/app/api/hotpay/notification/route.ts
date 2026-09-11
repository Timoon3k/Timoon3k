import { NextResponse } from 'next/server';
import { parseNotification, verifyNotification } from '@/server/hotpay';
import { issueInvoice, sendInvoiceByEmail } from '@/server/fakturownia';
import { clientIp, rateLimit } from '@/server/rate-limit';

/**
 * Webhook powiadomień HotPay.
 *
 * Przepływ:
 *   HotPay → ten endpoint → weryfikacja podpisu → (STATUS=SUCCESS)
 *          → Fakturownia (idempotentnie) → e-mail z dokumentem
 *
 * Zasady:
 *  • Nigdy nie ufamy treści żądania przed sprawdzeniem HASH.
 *  • Odpowiadamy 200 również na powtórzone powiadomienie — inaczej HotPay
 *    ponawiałby je w nieskończoność.
 *  • Nie przechowujemy i nie logujemy danych karty. HotPay ich nam nie
 *    przekazuje i nie chcemy ich mieć.
 *  • Błąd Fakturowni NIE unieważnia płatności — logujemy go i zwracamy 200,
 *    żeby nie wywołać lawiny ponowień; dokument da się wystawić ręcznie.
 */

// Webhook musi wykonać się na żądanie — bez cache'owania odpowiedzi.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Zgrubny limit — chroni przed zalewem sfałszowanych powiadomień.
  const limit = rateLimit(`hotpay:${clientIp(request)}`, { limit: 60, windowMs: 60_000 });
  if (!limit.allowed) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': String(limit.retryAfterSeconds) },
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const notification = parseNotification(form);
  if (!notification) {
    console.warn('[hotpay] powiadomienie bez wymaganych pól — odrzucone');
    return new NextResponse('Bad Request', { status: 400 });
  }

  if (!verifyNotification(notification)) {
    // Niepoprawny podpis: albo integracja nie jest skonfigurowana, albo ktoś
    // podszywa się pod HotPay. W obu przypadkach nic nie robimy.
    console.warn(
      `[hotpay] nieprawidłowy podpis dla zamówienia ${notification.ID_ZAMOWIENIA} — odrzucone`,
    );
    return new NextResponse('Forbidden', { status: 403 });
  }

  const { STATUS, ID_PLATNOSCI, ID_ZAMOWIENIA, KWOTA } = notification;

  // Płatności nieudane i oczekujące tylko odnotowujemy.
  if (STATUS !== 'SUCCESS') {
    console.info(`[hotpay] zamówienie ${ID_ZAMOWIENIA} → status ${STATUS}`);
    return NextResponse.json({ ok: true, status: STATUS });
  }

  const amount = Number(KWOTA.replace(',', '.'));
  if (!Number.isFinite(amount) || amount <= 0) {
    console.error(`[hotpay] nieprawidłowa kwota „${KWOTA}" w zamówieniu ${ID_ZAMOWIENIA}`);
    return NextResponse.json({ ok: true, status: 'invalid_amount' });
  }

  // Dane nabywcy przekazywane opcjonalnie w polach dodatkowych HotPay.
  const buyerName = (form.get('IMIE_NAZWISKO') as string | null)?.trim();
  const buyerEmail = (form.get('EMAIL') as string | null)?.trim();

  try {
    const result = await issueInvoice({
      // ID płatności HotPay jest globalnie unikalne — idealny klucz idempotencji.
      externalId: ID_PLATNOSCI,
      grossAmount: amount,
      itemName: `Rezerwacja MSdream — zamówienie ${ID_ZAMOWIENIA}`,
      buyer: {
        name: buyerName || 'Klient detaliczny',
        email: buyerEmail || undefined,
      },
    });

    console.info(
      `[hotpay] zamówienie ${ID_ZAMOWIENIA} / płatność ${ID_PLATNOSCI} → dokument: ${result.status}${
        result.number ? ` (${result.number})` : ''
      }`,
    );

    // E-mail wysyłamy tylko dla świeżo wystawionego dokumentu — przy
    // powtórzonym webhooku klient nie dostanie tej samej faktury drugi raz.
    if (result.status === 'created' && result.invoiceId && buyerEmail) {
      const sent = await sendInvoiceByEmail(result.invoiceId);
      if (!sent) console.warn(`[hotpay] nie udało się wysłać dokumentu ${result.invoiceId}`);
    }

    return NextResponse.json({ ok: true, document: result.status });
  } catch (error) {
    // Zwracamy 200 celowo: płatność jest poprawna, a ponawianie webhooka
    // niczego tu nie naprawi. Problem trafia do logów do ręcznej obsługi.
    console.error(
      `[hotpay] błąd wystawiania dokumentu dla płatności ${ID_PLATNOSCI}:`,
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ ok: true, document: 'error' });
  }
}

/** HotPay wysyła wyłącznie POST — pozostałe metody odrzucamy jawnie. */
export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
