import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { InstructorList } from '@/components/sections/InstructorList';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getInstructors } from '@/cms/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Instruktorzy jazdy konnej — MSdream Łomianki',
  description:
    'Poznaj instruktorów szkoły jazdy konnej MSdream w Łomiankach: doświadczenie, specjalizacje i sposób prowadzenia zajęć.',
  path: '/instruktorzy',
});

export default async function InstructorsPage() {
  const instructors = await getInstructors();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Instruktorzy', href: '/instruktorzy' }]} />
      <InstructorList instructors={instructors} />
      <ClosingCta
        title="Zarezerwuj zajęcia"
        body="Przy rezerwacji możesz wskazać instruktora, z którym chcesz pracować — o ile ma wolny termin."
      />
    </>
  );
}
