import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema, type ContactResponse } from '@/lib/contact-schema';
import { site } from '@/lib/site';

export const runtime = 'nodejs';

/** Prosty limit zgłoszeń per adres IP — bariera przeciw zalewaniu formularza. */
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  submissions.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: 'Zbyt wiele zgłoszeń w krótkim czasie. Spróbuj ponownie za chwilę.' },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Nieprawidłowe dane formularza.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, message: 'Formularz zawiera błędy. Popraw zaznaczone pola.', errors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Wypełnione pole-pułapka oznacza bota. Odpowiadamy sukcesem, żeby nie
  // podpowiadać, że zgłoszenie zostało odrzucone.
  if (data.company) return NextResponse.json({ ok: true });

  const to = process.env.CONTACT_EMAIL_TO ?? site.email;
  const from = process.env.CONTACT_EMAIL_FROM ?? 'Formularz <onboarding@resend.dev>';
  const apiKey = process.env.RESEND_API_KEY;

  const summary = [
    `Imię: ${data.name}`,
    `E-mail: ${data.email}`,
    `Telefon: ${data.phone || '—'}`,
    `Typ projektu: ${data.projectType}`,
    `Budżet: ${data.budget}`,
    '',
    data.message,
  ].join('\n');

  if (!apiKey) {
    // Środowisko bez klucza (np. lokalny development) — zgłoszenie jest
    // poprawnie zwalidowane, ale nie ma czym go wysłać.
    console.warn('[kontakt] Brak RESEND_API_KEY — wiadomość nie została wysłana.\n', summary);
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Nowe zapytanie: ${data.projectType} — ${data.name}`,
      text: summary,
      html: `
        <h2 style="font-family:sans-serif">Nowe zapytanie ze strony</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0"><strong>Imię</strong></td><td>${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>E-mail</strong></td><td>${escapeHtml(data.email)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Telefon</strong></td><td>${escapeHtml(data.phone || '—')}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Typ projektu</strong></td><td>${escapeHtml(data.projectType)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0"><strong>Budżet</strong></td><td>${escapeHtml(data.budget)}</td></tr>
        </table>
        <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `,
    });

    if (result.error) {
      console.error('[kontakt] Resend zwrócił błąd:', result.error);
      return NextResponse.json(
        { ok: false, message: 'Nie udało się wysłać wiadomości. Napisz proszę bezpośrednio na e-mail.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[kontakt] Wysyłka nie powiodła się:', error);
    return NextResponse.json(
      { ok: false, message: 'Nie udało się wysłać wiadomości. Napisz proszę bezpośrednio na e-mail.' },
      { status: 502 },
    );
  }
}
