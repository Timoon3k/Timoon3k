import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MotionProvider from '@/components/motion/MotionProvider';
import Interactions from '@/components/motion/Interactions';
import ScrollManager from '@/components/motion/ScrollManager';
import BackToTop from '@/components/ui/BackToTop';
import PageTransition from '@/components/motion/PageTransition';
import JsonLd from '@/components/seo/JsonLd';
import { personSchema, professionalServiceSchema, websiteSchema } from '@/lib/seo';
import { site, siteUrl } from '@/lib/site';
import './globals.css';

/*
 * Fonty hostowane lokalnie przez next/font — zero zapytań do zewnętrznych domen.
 * Wagi ograniczone do tych faktycznie używanych w projekcie; podzbiory `latin`
 * i `latin-ext` są wymagane dla polskich znaków diakrytycznych.
 */
const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['500', '600'],
});

const sans = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono-jb',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Projektowanie i tworzenie stron internetowych | Tomasz Majewski',
    template: '%s | Tomasz Majewski',
  },
  description: site.shortDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { email: false, address: false, telephone: false },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#04060b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain antialiased">
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-star focus:px-5 focus:py-3 focus:font-medium focus:text-void"
        >
          Przejdź do treści
        </a>

        <ScrollManager />
        <Header />

        <main id="tresc">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
        <BackToTop />

        <MotionProvider />
        <Interactions />
        <JsonLd data={[websiteSchema, personSchema, professionalServiceSchema]} />
      </body>
    </html>
  );
}
