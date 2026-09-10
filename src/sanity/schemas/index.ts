import type { SchemaTypeDefinition } from 'sanity';
import {
  caseSectionType,
  ctaType,
  faqItemType,
  featureType,
  richImageType,
  seoType,
} from '@/sanity/schemas/objects';
import {
  faqType,
  pageType,
  postType,
  projectType,
  serviceType,
  settingsType,
  testimonialType,
} from '@/sanity/schemas/documents';

export const schemaTypes: SchemaTypeDefinition[] = [
  seoType,
  ctaType,
  faqItemType,
  richImageType,
  caseSectionType,
  featureType,
  settingsType,
  pageType,
  serviceType,
  projectType,
  postType,
  faqType,
  testimonialType,
];
