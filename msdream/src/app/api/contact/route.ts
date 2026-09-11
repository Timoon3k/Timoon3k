import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, TOPIC_LABELS } from '@/lib/contact-schema';
import { clientIp, rateLimit } from '@/server/rate-limit';

/**
 * Obsługa formularza kontaktowego.
 *
 * Zabezpieczenia (lekkie, bez CAPTCHA — nie chcemy oddawać ruchu Google
 * ani dokładać kilkuset kilobajtów JS na stronie kontaktu):
 *   1. honeypot — ukryte pole `website`, które wypełniają tylko boty,
 *   2. próg czasu — formularz wysłany szybciej niż 3 s po wyrenderowaniu
 *      prawie na pewno nie został wypełniony przez człowieka,
 *   3. rate limiting po adresie IP,
 *   4. pełna walidacja Zod po stronie serwera.
 *
 * Bez klucza Resend endpoint NIE udaje wysyłki: zwraca jawny błąd
 * konfiguracji i zapisuje zgłoszenie w logu, żeby nic nie przepadło.
 */

export const dynamic = 'force-dynamic';

const MIN_FILL_TIME_MS = 3000;

export async function POST(request: Request) {
  const ip = clientIp(request);

  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Zbyt wiele wiadomości. Spróbuj ponownie za chwilę.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Formularz zawiera błędy.',
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // --- Honeypot ------------------------------------------------------------
  if (data.website) {
    // Odpowiadamy sukcesem, żeby bot nie dowiedział się, że został wykryty.
    console.info(`[kontakt] honeypot wychwycił zgłoszenie z ${ip}`);
    return NextResponse.json({ ok: true });
  }

  // --- Próg czasu ----------------------------------------------------------
  if (data.renderedAt && Date.now() - data.renderedAt < MIN_FILL_TIME_MS) {
    console.info(`[kontakt] zgłoszenie wysłane zbyt szybko z ${ip} — potraktowane jako spam`);
    return NextResponse.json({ ok: true });
  }

  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  const summary = [
    `Temat: ${TOPIC_LABELS[data.topic]}`,
    `Imię: ${data.name}`,
    `E-mail: ${data.email}`,
    data.phone ? `Telefon: ${data.phone}` : null,
    '',
    data.message,
  ]
    .filter(Boolean)
    .join('\n');

  if (!apiKey || !to || !from) {
    // Nie udajemy, że wiadomość poszła. Zgłoszenie ląduje w logach serwera,
    // a użytkownik dostaje uczciwy komunikat z alternatywną drogą kontaktu.
    console.warn('[kontakt] brak konfiguracji poczty — zgłoszenie zapisane tylko w logu:\n', summary);
    return NextResponse.json(
      {
        ok: false,
        error:
          'Wysyłka wiadomości nie jest jeszcze skonfigurowana. Zadzwoń do nas albo napisz bezpośrednio na nasz adres e-mail.',
        code: 'MAIL_NOT_CONFIGURED',
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      // Odpowiedź trafia prosto do nadawcy, bez kopiowania adresu ręcznie.
      replyTo: data.email,
      subject: `Formularz MSdream — ${TOPIC_LABELS[data.topic]} — ${data.name}`,
      text: summary,
    });

    if (error) {
      console.error('[kontakt] Resend odrzucił wiadomość:', error);
      return NextResponse.json(
        { ok: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[kontakt] błąd wysyłki:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { ok: false, error: 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.' },
      { status: 502 },
    );
  }
}

export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
