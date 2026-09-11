import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Testimonials } from '@/components/sections/Testimonials';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getTestimonials } from '@/cms/content';
import { getSiteData } from '@/lib/site-data';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Opinie o szkole jazdy konnej MSdream',
  description:
    'Co mówią kursanci i rodzice o nauce jazdy konnej w MSdream w Łomiankach. Opinie zbieramy w wizytówce Google.',
  path: '/opinie',
});

export default async function ReviewsPage() {
  const [testimonials, siteData] = await Promise.all([getTestimonials(), getSiteData()]);

  return (
    <>
      <Breadcrumbs items={[{ name: 'Opinie', href: '/opinie' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-8">
            <div className="col-span-7">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>Opinie</h1>
              <p
                className="mt-7 max-w-[48ch]"
                style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                Publikujemy wyłącznie opinie, które ktoś naprawdę wystawił —
                z imieniem, datą i możliwością sprawdzenia w Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials items={testimonials} placeId={siteData.googlePlaceId} tone="alt" />
      <ClosingCta />
    </>
  );
}
