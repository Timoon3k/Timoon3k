import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Regulamin strony',
  description: 'Zasady korzystania z serwisu msdream.pl.',
  path: '/regulamin',
});

export default function Page() {
  return <LegalPage slug="regulamin" title="Regulamin strony" intro="Zasady korzystania z serwisu msdream.pl." />;
}
