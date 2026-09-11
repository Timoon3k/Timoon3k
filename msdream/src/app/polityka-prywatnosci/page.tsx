import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Polityka prywatności',
  description: 'Jakie dane zbieramy, w jakim celu i jak długo je przechowujemy.',
  path: '/polityka-prywatnosci',
});

export default function Page() {
  return <LegalPage slug="polityka-prywatnosci" title="Polityka prywatności" intro="Jakie dane zbieramy, w jakim celu i jak długo je przechowujemy." />;
}
