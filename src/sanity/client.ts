import { createClient, type SanityClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

let cached: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (cached) return cached;

  cached = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === 'production' && !process.env.SANITY_API_READ_TOKEN,
    token: process.env.SANITY_API_READ_TOKEN || undefined,
    perspective: 'published',
  });

  return cached;
}
