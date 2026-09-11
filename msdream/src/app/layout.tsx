import type { Metadata, Viewport } from 'next';
import { Fraunces, Instrument_Sans } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StickyBooking } from '@/components/layout/StickyBooking';
import { CookieConsent } from '@/components/legal/CookieConsent';
import MotionProvider from '@/components/motion/MotionProvider';
import { JsonLd } from '@/components/ui/JsonLd';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/seo';
import { getSiteData } from '@/lib/site-data';
import { getTestimonials } from '@/cms/content';
import { ANALYTICS, SITE_NAME, SITE_URL } from '@/lib/site';

/**
 * Fonty.
 *
 * `next/font/google` pobiera pliki w czasie builda i serwuje je z naszej
 * domeny — zero żądań do Google w przeglądarce użytkownika, zero CLS dzięki
 * automatycznym metrykom zastępczym (`adjustFontFallback`).
 *
 * Fraunces jest zmienny: jedna zmienna oś zamiast czterech osobnych plików.
 */
const fraunces = Fraunces({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-fraunces',
  // Osie zmienne: SOFT i WONK dają Fraunces jego charakter, opsz dopasowuje
  // rysunek liter do stopnia pisma. Przy podanych `axes` `weight` musi zostać
  // pominięty — font jest wtedy w pełni zmienny (jeden plik na wszystkie grubości).
  axes: ['SOFT', 'WONK', 'opsz'],
});

const instrument = Instrument_Sans({
  subsets: ['latin-ext'],
  display: 'swap',
  variable: '--font-instrument',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Szkoła jazdy konnej Łomianki — MSdream',
    // Szablon zostawia miejsce na nazwę podstrony, bez powtarzania frazy
    // lokalnej w każdym tytule (to wygląda na spam w wynikach).
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Szkoła jazdy konnej w Łomiankach pod Warszawą. Nauka jazdy konnej dla dzieci i dorosłych, zajęcia indywidualne i pakiety jazd. Rezerwacja online.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, address: true, email: true },
  ...(ANALYTICS.searchConsole
    ? { verification: { google: ANALYTICS.searchConsole } }
    : {}),
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3ea' },
    { media: '(prefers-color-scheme: dark)', color: '#16271c' },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Dane firmowe i opinie pochodzą z WordPressa (albo z treści startowej,
  // gdy CMS nie jest podpięty). Pobieramy je raz, w powłoce.
  const [siteData, testimonials] = await Promise.all([getSiteData(), getTestimonials()]);

  return (
    <html lang="pl" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <a href="#tresc" className="skip-link">
          Przejdź do treści
        </a>

        <Header />

        <main id="tresc">{children}</main>

        <Footer data={siteData} />

        <StickyBooking />
        <CookieConsent />
        <MotionProvider />

        {/* Dane strukturalne globalne — obecne na każdej podstronie. */}
        <JsonLd data={localBusinessJsonLd(siteData, testimonials)} />
        <JsonLd data={websiteJsonLd()} />
      </body>
    </html>
  );
}
