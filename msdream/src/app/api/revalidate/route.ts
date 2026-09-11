import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { CMS_TAGS } from '@/cms/config';
import { clientIp, rateLimit } from '@/server/rate-limit';

/**
 * Webhook odświeżania cache'u wywoływany przez WordPressa
 * (funkcja `msdream_revalidate` we wtyczce `wordpress/msdream-cms.php`).
 *
 * Bez niego zmiana treści w panelu byłaby widoczna dopiero po wygaśnięciu
 * godzinnego cache'u.
 */

export const dynamic = 'force-dynamic';

const VALID_TAGS = new Set<string>(Object.values(CMS_TAGS));

function secretsMatch(received: string, expected: string): boolean {
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const limit = rateLimit(`revalidate:${clientIp(request)}`, { limit: 120, windowMs: 60_000 });
  if (!limit.allowed) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const expected = process.env.CMS_REVALIDATE_SECRET;
  if (!expected) {
    console.warn('[revalidate] CMS_REVALIDATE_SECRET nie jest ustawiony — endpoint wyłączony');
    return new NextResponse('Not Configured', { status: 503 });
  }

  const received = request.headers.get('x-msdream-secret') ?? '';
  if (!secretsMatch(received, expected)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { tag?: string } | null;
  const tag = body?.tag;

  // Nieznany tag odświeżałby cudzy cache — dopuszczamy tylko własne.
  if (!tag || !VALID_TAGS.has(tag)) {
    return NextResponse.json({ ok: false, error: 'Nieznany tag' }, { status: 400 });
  }

  // Drugi argument jest w Next.js 16 wymagany: „max" oznacza
  // stale-while-revalidate — odwiedzający nie czeka na przebudowę.
  revalidateTag(tag, 'max');

  console.info(`[revalidate] odświeżono ${tag}`);
  return NextResponse.json({ ok: true, tag, revalidatedAt: new Date().toISOString() });
}

export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}
