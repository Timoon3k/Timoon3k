import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';

/**
 * Webhook odświeżający pamięć podręczną treści po publikacji w CMS-ie.
 *
 * Obsługuje oba źródła, bo każde podaje sekret inaczej:
 *   • Sanity    → API → Webhooks → URL `/api/revalidate?secret=…`
 *   • WordPress → wtyczka mu wysyła POST z `{ "secret": "…" }` w treści
 *
 * Sekret ustaw w `CONTENT_REVALIDATE_SECRET`. Stara nazwa
 * `SANITY_REVALIDATE_SECRET` nadal działa, żeby nie psuć istniejącej
 * konfiguracji webhooka w Sanity.
 */
export async function POST(request: Request) {
  const secret = process.env.CONTENT_REVALIDATE_SECRET || process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, message: 'Odświeżanie nie jest skonfigurowane.' },
      { status: 503 },
    );
  }

  const fromQuery = new URL(request.url).searchParams.get('secret');
  let fromBody: string | null = null;

  if (!fromQuery) {
    try {
      const body: unknown = await request.json();
      if (typeof body === 'object' && body !== null && 'secret' in body) {
        const value = (body as { secret: unknown }).secret;
        if (typeof value === 'string') fromBody = value;
      }
    } catch {
      // Brak treści albo niepoprawny JSON — zostaje sam parametr zapytania.
    }
  }

  if ((fromQuery ?? fromBody) !== secret) {
    return NextResponse.json({ ok: false, message: 'Nieprawidłowy sekret.' }, { status: 401 });
  }

  revalidateTag('content', 'max');
  return NextResponse.json({ ok: true, revalidated: 'content', now: Date.now() });
}
