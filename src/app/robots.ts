import type { MetadataRoute } from 'next';
import { isProductionDeployment, siteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Deploymenty podglądowe (preview, gałęzie) muszą pozostać poza indeksem —
  // inaczej konkurują w wyszukiwarce z witryną produkcyjną.
  if (!isProductionDeployment) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
