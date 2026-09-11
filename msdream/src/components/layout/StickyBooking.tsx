'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/analytics';
import { useScrolledPast } from '@/lib/hooks/use-browser-state';

/**
 * Mobilny sticky CTA rezerwacji.
 *
 * Pojawia się dopiero po opuszczeniu pierwszego ekranu — żeby nie zasłaniać
 * hero i nie psuć pierwszego wrażenia — i znika na stronach rezerwacji,
 * gdzie użytkownik i tak już jest w kalendarzu.
 */
export function StickyBooking() {
  const pathname = usePathname();
  // Próg: mniej więcej wysokość pierwszego ekranu. Stała wartość zamiast
  // odczytu `innerHeight` w renderze — dzięki temu render pozostaje czysty.
  const scrolledPastHero = useScrolledPast(700);

  const hidden = pathname.startsWith('/rezerwacja') || pathname.startsWith('/platnosc');
  if (hidden) return null;

  const visible = scrolledPastHero;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 sm:hidden"
      style={{
        // Nakładka nie zasłania treści na stałe: chowa się poza ekran.
        translate: visible ? '0 0' : '0 120%',
        transition: 'translate 0.5s var(--ease-editorial)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'color-mix(in oklab, var(--color-ivory-100) 92%, transparent)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--color-line)',
      }}
      {...(visible ? {} : { inert: true })}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <p className="min-w-0 flex-1 text-xs leading-tight" style={{ color: 'var(--color-graphite-700)' }}>
          Wolne terminy widzisz od ręki
        </p>
        <Link
          href="/rezerwacja"
          className="btn shrink-0"
          style={{ minHeight: '2.75rem', padding: '0.6rem 1.25rem' }}
          onClick={() => track('booking_click', { location: 'sticky_mobile' })}
        >
          Zarezerwuj
        </Link>
      </div>
    </div>
  );
}
