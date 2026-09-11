import type { NextConfig } from 'next';

/**
 * Hosty, z których wolno optymalizować obrazy.
 *
 * Domyślnie tylko host WordPressa wskazany przez WORDPRESS_API_URL.
 * Jeśli media są serwowane z innej domeny (CDN, osobna subdomena uploadów),
 * dopisz ją w WORDPRESS_MEDIA_HOSTS jako listę rozdzieloną przecinkami.
 */
function wordpressImageHosts() {
  const hosts = new Set<string>();

  const apiUrl = process.env.WORDPRESS_API_URL?.trim();
  if (apiUrl) {
    try {
      hosts.add(new URL(apiUrl).hostname);
    } catch {
      console.warn('[next.config] WORDPRESS_API_URL nie jest poprawnym adresem URL');
    }
  }

  for (const host of (process.env.WORDPRESS_MEDIA_HOSTS ?? '').split(',')) {
    const trimmed = host.trim();
    if (trimmed) hosts.add(trimmed);
  }

  return [...hosts].map((hostname) => ({ protocol: 'https' as const, hostname }));
}

/** Hosty WordPressa w formie akceptowanej przez CSP. */
function wordpressCspHosts(): string {
  return wordpressImageHosts()
    .map((pattern) => `https://${pattern.hostname}`)
    .join(' ');
}

/**
 * Content Security Policy.
 *
 * Bookero jest wstrzykiwany jako zewnętrzny skrypt (www.bookero.pl), a jego
 * widget renderuje się w iframe — stąd `frame-src`. Mapa Google ładuje się
 * dopiero po interakcji użytkownika (komponent LazyMap), ale musi być dozwolona
 * w `frame-src`. `'unsafe-inline'` w `style-src` jest potrzebne, bo system
 * projektowy używa stylów inline do tokenów kolorystycznych.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self' https://platnosc.hotpay.pl",
  "frame-ancestors 'self'",
  `img-src 'self' data: blob: ${wordpressCspHosts()} https://www.bookero.pl https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${wordpressCspHosts()} https://www.bookero.pl https://www.google-analytics.com https://region1.google-analytics.com`,
  "frame-src 'self' https://www.bookero.pl https://www.google.com https://www.google.com/maps/ https://maps.google.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.bookero.pl https://www.googletagmanager.com https://connect.facebook.net",
  'upgrade-insecure-requests',
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Katalog msdream/ jest osobną aplikacją wewnątrz repozytorium, które ma
  // własny lockfile w katalogu nadrzędnym. Wskazujemy korzeń wprost,
  // żeby Turbopack nie zgadywał.
  turbopack: { root: __dirname },
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Multimedia pochodzą z WordPressa. Host bierzemy ze zmiennej
    // WORDPRESS_API_URL, żeby nie trzeba było go duplikować w konfiguracji —
    // jedno źródło prawdy dla adresu CMS-u.
    remotePatterns: wordpressImageHosts(),
    deviceSizes: [400, 640, 828, 1080, 1280, 1600, 1920, 2560],
    // Next 16 domyślnie dopuszcza tylko quality=75. Hero i galeria korzystają
    // z wyższej jakości, miniatury z niższej.
    qualities: [55, 70, 75, 82, 90],
  },

  experimental: {
    optimizePackageImports: ['gsap'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), payment=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Webhooki nie mogą być cache'owane ani indeksowane.
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },

  async redirects() {
    // Pełna mapa w REDIRECT_MAP.md. Każdy stary URL msdream.pl, który zmienia
    // adres, dostaje 301 — bez łańcuchów przekierowań.
    return [
      { source: '/warsztaty-tuftingu', destination: '/oferta/warsztaty-tuftingu', permanent: true },
      { source: '/jazda-konna', destination: '/oferta/jazda-konna', permanent: true },
      { source: '/cennik', destination: '/oferta', permanent: true },
      { source: '/o-firmie', destination: '/o-nas', permanent: true },
      { source: '/kontakt.html', destination: '/kontakt', permanent: true },
      { source: '/galeria-zdjec', destination: '/galeria', permanent: true },
      { source: '/rezerwacje', destination: '/rezerwacja', permanent: true },
      { source: '/regulamin-serwisu', destination: '/regulamin', permanent: true },
      { source: '/polityka-cookies', destination: '/cookies', permanent: true },
    ];
  },
};

export default nextConfig;
