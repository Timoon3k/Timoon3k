import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Pliki cookies',
  description: 'Jakich plików cookies używamy i jak zarządzać zgodą.',
  path: '/cookies',
});

export default function Page() {
  return <LegalPage slug="cookies" title="Pliki cookies" intro="Jakich plików cookies używamy i jak zarządzać zgodą." />;
}
