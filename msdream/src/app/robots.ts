import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * robots.txt
 *
 * Blokujemy wyłącznie to, co nie ma prawa trafić do indeksu: endpointy API
 * i strony statusu płatności. Reszta serwisu jest w pełni dostępna dla
 * robotów — na stronie lokalnej firmy nie ma powodu niczego ukrywać.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/platnosc/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
