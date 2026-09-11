'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useState } from 'react';
import { ANALYTICS } from '@/lib/site';
import { notifyStoredValueChanged, useStoredValue } from '@/lib/hooks/use-browser-state';

const STORAGE_KEY = 'msdream-consent-v1';
type Consent = 'granted' | 'denied' | null;

/**
 * Zgoda na cookies inne niż niezbędne.
 *
 * Kluczowa zasada: **przed zgodą nie ładujemy żadnego zewnętrznego skryptu**.
 * GA4 i Meta Pixel montują się dopiero po kliknięciu „Akceptuję". Dzięki temu
 * użytkownik, który nic nie kliknął, nie wysyła żadnego żądania do Google
 * ani Meta — a strona nie płaci za to wydajnością.
 *
 * Baner nie ma „ciemnych wzorców": odmowa jest jednym kliknięciem, tak samo
 * widocznym jak zgoda.
 */
export function CookieConsent() {
  // Zapisana decyzja czytana przez useSyncExternalStore — bez setState
  // w efekcie i bez rozjazdu przy hydratacji (na serwerze zawsze `null`).
  const stored = useStoredValue(STORAGE_KEY);
  // Zapasowy stan na wypadek, gdy zapis do localStorage się nie powiedzie
  // (prywatne okno) — decyzja obowiązuje wtedy do końca sesji.
  const [sessionConsent, setSessionConsent] = useState<Consent>(null);

  const consent: Consent =
    stored === 'granted' || stored === 'denied' ? stored : sessionConsent;

  const decide = (value: Exclude<Consent, null>) => {
    setSessionConsent(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
      notifyStoredValueChanged(STORAGE_KEY);
    } catch {
      /* brak storage — zostaje stan sesyjny powyżej */
    }
  };

  const hasAnalytics = Boolean(ANALYTICS.ga4 || ANALYTICS.metaPixel);

  return (
    <>
      {/* Skrypty analityczne — wyłącznie po zgodzie i tylko jeśli skonfigurowane. */}
      {consent === 'granted' && ANALYTICS.ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga4}`}
            strategy="lazyOnload"
          />
          <Script id="ga4-init" strategy="lazyOnload">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());gtag('config','${ANALYTICS.ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {consent === 'granted' && ANALYTICS.metaPixel && (
        <Script id="meta-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${ANALYTICS.metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Baner pokazujemy tylko wtedy, gdy jest o co pytać. */}
      {consent === null && hasAnalytics && (
        <div
          role="dialog"
          aria-labelledby="cookie-title"
          className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-sm"
          style={{
            background: 'var(--color-forest-900)',
            color: 'var(--color-ivory-100)',
            border: '1px solid color-mix(in oklab, var(--color-ivory-100) 18%, transparent)',
            marginBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          <div className="p-5">
            <p id="cookie-title" className="eyebrow eyebrow--light">
              Cookies
            </p>
            <p className="mt-3 text-[0.8125rem] leading-relaxed" style={{ color: 'var(--color-sand-400)' }}>
              Używamy plików cookies niezbędnych do działania strony. Za Twoją zgodą
              włączymy też statystyki, które pomagają nam ulepszać serwis.{' '}
              <Link href="/cookies" className="rein-link" style={{ color: 'var(--color-brass-300)' }}>
                Szczegóły
              </Link>
            </p>
            <div className="mt-5 flex gap-2">
              <button type="button" className="btn btn--brass flex-1" onClick={() => decide('granted')}>
                Akceptuję
              </button>
              <button
                type="button"
                className="btn btn--ghost-light flex-1"
                onClick={() => decide('denied')}
              >
                Tylko niezbędne
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
