/**
 * Prosty limiter zapytań (okno przesuwne, pamięć procesu).
 *
 * Świadome ograniczenie: licznik żyje w pamięci instancji, więc przy wielu
 * instancjach serverless limit jest per instancja. Dla formularza kontaktowego
 * i webhooka to w zupełności wystarcza — chodzi o odcięcie prostego zalewu,
 * nie o rozproszony rate limiting. Gdyby ruch tego wymagał, ten moduł jest
 * jedynym miejscem do podmiany (np. na Upstash Redis).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Sprzątanie, żeby mapa nie rosła w nieskończoność. */
function sweep(now: number): void {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  if (bucket.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

/** Adres klienta zza proxy (Vercel/Cloudflare). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
