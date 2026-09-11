import type { Testimonial } from '@/lib/types';

/** Ocena zbiorcza liczona wyłącznie z realnie zebranych opinii. */
function aggregateRating(items: readonly Testimonial[]) {
  if (items.length === 0) return null;
  const sum = items.reduce((acc, t) => acc + t.rating, 0);
  return { value: Math.round((sum / items.length) * 10) / 10, count: items.length };
}

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`Ocena ${rating} na 5`} style={{ color: 'var(--color-brass-500)', letterSpacing: '0.15em' }}>
      <span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
    </span>
  );
}

/**
 * Opinie.
 *
 * Nie jest to slider testimoniali. Jedna opinia dostaje pełną skalę
 * typograficzną (cytat w kroju display), pozostałe układają się obok
 * w kolumnie. Po lewej — ocena zbiorcza policzona z realnych opinii.
 *
 * Stan pusty jest tu funkcją, nie brakiem: dopóki nie ma prawdziwych opinii,
 * pokazujemy uczciwe zaproszenie do wizytówki Google zamiast wymyślonych
 * cytatów (patrz `content/testimonials.ts`).
 */
export function Testimonials({
  items,
  placeId,
  tone = 'alt',
}: {
  items: readonly Testimonial[];
  placeId: string | null;
  tone?: 'alt' | 'page';
}) {
  const rating = aggregateRating(items);
  const [lead, ...rest] = items;
  const googleUrl = placeId
    ? `https://search.google.com/local/reviews?placeid=${placeId}`
    : 'https://www.google.com/maps';

  return (
    <section
      className="section"
      style={{ background: tone === 'alt' ? 'var(--color-ivory-200)' : 'var(--color-ivory-100)' }}
    >
      <div className="shell">
        <p className="eyebrow mb-10" data-reveal>
          <span aria-hidden="true">12</span> Opinie
        </p>

        {items.length === 0 ? (
          <div className="grid-editorial gap-y-8" data-reveal>
            <div className="col-span-7">
              <h2 style={{ fontSize: 'var(--text-title)' }}>
                Opinie zbieramy tam, gdzie
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> nie da się ich napisać samemu</span>
              </h2>
              <p
                className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                Nie publikujemy tu wymyślonych cytatów. Prawdziwe opinie naszych
                kursantów znajdziesz w wizytówce Google — razem z datami, imionami
                i możliwością dopisania własnej po pierwszej jeździe.
              </p>
              <a
                href={googleUrl}
                className="btn btn--ghost mt-8"
                rel="noopener noreferrer"
                target="_blank"
              >
                Zobacz opinie w Google
              </a>
            </div>
          </div>
        ) : (
          <div className="grid-editorial gap-y-12">
            {/* --- Ocena zbiorcza --- */}
            <div className="col-span-3">
              {rating && (
                <div data-reveal>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(3.5rem,9vw,6rem)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {rating.value.toFixed(1)}
                  </p>
                  <div className="mt-3">
                    <Stars rating={Math.round(rating.value)} />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>
                    Google · {rating.count}{' '}
                    {rating.count === 1 ? 'opinia' : rating.count < 5 ? 'opinie' : 'opinii'}
                  </p>
                </div>
              )}
            </div>

            {/* --- Opinia wiodąca --- */}
            <div className="col-span-8 lg:col-start-5">
              <blockquote data-reveal>
                <Stars rating={lead.rating} />
                <p
                  className="mt-6 max-w-[24ch]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-title)',
                    lineHeight: 1.22,
                    letterSpacing: '-0.015em',
                  }}
                >
                  „{lead.text}”
                </p>
                <footer className="mt-6 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>
                  {lead.author}
                </footer>
              </blockquote>

              {rest.length > 0 && (
                <div className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2">
                  {rest.map((t, i) => (
                    <blockquote
                      key={`${t.author}-${i}`}
                      className="border-t pt-6"
                      style={{ borderColor: 'var(--color-line)' }}
                      data-reveal
                      data-reveal-delay={i * 0.06}
                    >
                      <Stars rating={t.rating} />
                      <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-700)' }}>
                        „{t.text}”
                      </p>
                      <footer className="mt-4 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>
                        {t.author}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
