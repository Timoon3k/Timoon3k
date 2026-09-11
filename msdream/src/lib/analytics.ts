/**
 * Warstwa zdarzeń analitycznych.
 *
 * Nie ładuje żadnych skryptów sama z siebie — GA4 i Meta Pixel wchodzą
 * dopiero po zgodzie użytkownika (patrz `components/legal/CookieConsent.tsx`)
 * i tylko jeśli ustawiono odpowiednie zmienne środowiskowe. Dzięki temu
 * strona bez zgody nie wysyła ani jednego żądania do zewnętrznych domen.
 */

export type AnalyticsEvent =
  | 'booking_click'
  | 'service_view'
  | 'booking_start'
  | 'booking_complete'
  | 'contact_click'
  | 'phone_click'
  | 'email_click'
  | 'directions_click'
  | 'gallery_open';

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === 'undefined') return;

  // dataLayer działa niezależnie od tego, czy GTM/GA4 zostały już wczytane —
  // zdarzenia sprzed zgody po prostu nie zostaną nigdzie wysłane.
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });

  window.gtag?.('event', event, payload);

  // Meta Pixel rozumie tylko część zdarzeń jako standardowe.
  if (window.fbq) {
    const standard: Partial<Record<AnalyticsEvent, string>> = {
      booking_start: 'InitiateCheckout',
      booking_complete: 'Purchase',
      contact_click: 'Contact',
    };
    const mapped = standard[event];
    if (mapped) window.fbq('track', mapped, payload);
    else window.fbq('trackCustom', event, payload);
  }
}
