import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isSanityConfigured } from '@/sanity/env';
import StudioClient from './StudioClient';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Studio',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  if (!isSanityConfigured) notFound();
  return <StudioClient />;
}
