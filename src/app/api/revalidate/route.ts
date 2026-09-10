import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';

/**
 * Webhook do wywołania z Sanity po publikacji dokumentu.
 * Konfiguracja: Sanity → API → Webhooks → URL `/api/revalidate?secret=…`.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided = new URL(request.url).searchParams.get('secret');

  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false, message: 'Nieprawidłowy sekret.' }, { status: 401 });
  }

  revalidateTag('content', 'max');
  return NextResponse.json({ ok: true, revalidated: 'content', now: Date.now() });
}
