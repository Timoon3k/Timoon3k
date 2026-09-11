import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal/LegalPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Regulamin rezerwacji',
  description: 'Zasady rezerwacji zajęć, płatności online oraz odwoływania terminów.',
  path: '/regulamin-rezerwacji',
});

export default function Page() {
  return <LegalPage slug="regulamin-rezerwacji" title="Regulamin rezerwacji" intro="Zasady rezerwacji zajęć, płatności online oraz odwoływania terminów." />;
}
