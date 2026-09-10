import type { MetadataRoute } from 'next';
import { getPosts, getProjects } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${siteUrl}/portfolio`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/oferta`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/tworzenie-stron-internetowych-wolomin`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/tworzenie-stron-internetowych-warszawa`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${siteUrl}/o-mnie`, changeFrequency: 'yearly' as const, priority: 0.7 },
    { url: `${siteUrl}/blog`, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${siteUrl}/kontakt`, changeFrequency: 'yearly' as const, priority: 0.8 },
    { url: `${siteUrl}/polityka-prywatnosci`, changeFrequency: 'yearly' as const, priority: 0.2 },
  ].map((route) => ({ ...route, lastModified: now }));

  return [
    ...staticRoutes,
    ...projects.map((project) => ({
      url: `${siteUrl}/portfolio/${project.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
