import { formatPrice, formatDuration, priceHint } from '@/lib/format';
import type { Service } from '@/lib/types';

/**
 * Wyświetla cenę usługi — albo czytelny komunikat, że cena czeka
 * na uzupełnienie. Nigdy nie pokazuje zmyślonej liczby.
 */
export function PriceTag({ service, tone = 'dark' }: { service: Service; tone?: 'dark' | 'light' }) {
  const price = formatPrice(service.price);
  const duration = formatDuration(service.durationMin);
  const hint = priceHint(service.price);

  if (!price) {
    return (
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-brass-600)' }}>
        <span className="font-medium uppercase tracking-[0.14em]">Cena do uzupełnienia</span>
        {hint && (
          <span className="mt-1 block" style={{ color: 'var(--color-graphite-500)' }}>
            {hint}
          </span>
        )}
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span
        className="text-2xl sm:text-3xl"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}
      >
        {price}
      </span>
      {service.priceNote && (
        <span
          className="text-xs"
          style={{ color: tone === 'light' ? 'var(--color-sand-400)' : 'var(--color-graphite-500)' }}
        >
          {service.priceNote}
        </span>
      )}
      {duration && (
        <span
          className="text-xs"
          style={{ color: tone === 'light' ? 'var(--color-sand-400)' : 'var(--color-graphite-500)' }}
        >
          · {duration}
        </span>
      )}
    </p>
  );
}
