import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { dataset, isSanityConfigured, projectId } from '@/sanity/env';

const builder = isSanityConfigured ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlForImage(source: SanityImageSource, width = 1600): string | null {
  if (!builder) return null;
  return builder.image(source).width(width).auto('format').fit('max').url();
}
