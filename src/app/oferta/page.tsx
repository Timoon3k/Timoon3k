import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import FaqList from '@/components/ui/FaqList';
import JsonLd from '@/components/seo/JsonLd';
import Process from '@/components/home/Process';
import { Eyebrow } from '@/components/ui/Section';
import { getFaq, getProcessSteps, getServices } from '@/lib/content';
import { buildMetadata, serviceSchema } from '@/lib/seo';
import { site } from '@/lib/site';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = buildMetadata({
  title: 'Oferta — strony internetowe, sklepy i rozwiązania dedykowane',
  description:
    'Zakres usług: strony wizytówki od 1500 zł, rozbudowane serwisy firmowe, sklepy WooCommerce z rezerwacjami, rozwiązania w Next.js, SEO i opieka nad stroną.',
  path: '/oferta',
});

export default async function OfferPage() {
  const [services, faq] = await Promise.all([getServices(), getFaq('general')]);

  return (
    <>
      <JsonLd
        data={services.map((service) =>
          serviceSchema({
            name: service.title,
            description: service.description,
            path: `/oferta#${service.slug}`,
            areaServed: [...site.serviceArea],
            priceFrom: service.priceFrom,
          }),
        )}
      />

      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Oferta', href: '/oferta' },
        ]}
      />

      <section className="container-page pt-14 pb-20 md:pt-20">
        <Eyebrow>Oferta</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[15ch] text-giant text-gradient-star">
          Zakres, który dobieram do celu, nie do cennika
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p data-reveal className="text-lead text-dim md:col-span-6">
            Sześć obszarów, w których pracuję. W praktyce projekt rzadko mieści się dokładnie w
            jednym — zwykle łączymy elementy kilku, zależnie od tego, co ma osiągnąć strona.
          </p>
          <p data-reveal className="text-dim md:col-span-5 md:col-start-8">
            Podane kwoty to punkty startowe dla typowego zakresu. Konkretna wycena powstaje po
            rozmowie i jest wiążąca — nie jest przedziałem, który rośnie w trakcie realizacji.
          </p>
        </div>
      </section>

      <section className="border-t border-hairline">
        {services.map((service) => (
          <article
            key={service.slug}
            id={service.slug}
            className="scroll-mt-28 border-b border-hairline"
          >
            <div className="container-page grid gap-10 py-14 md:grid-cols-12 md:gap-12 md:py-20">
              <div className="md:col-span-5">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                  {service.index}
                </span>
                <h2
                  data-reveal
                  className="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] font-semibold tracking-tight text-star"
                >
                  {service.title}
                </h2>
                <p data-reveal className="mt-5 max-w-md text-lead text-dim">
                  {service.description}
                </p>

                <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-5">
                  <div>
                    <dt className="eyebrow">Cena</dt>
                    <dd className="mt-2 font-display text-[1.25rem] font-semibold tracking-tight text-star">
                      {service.priceFrom ? `od ${formatPrice(service.priceFrom)}` : 'indywidualna'}
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow">Czas realizacji</dt>
                    <dd className="mt-2 font-display text-[1.25rem] font-semibold tracking-tight text-star">
                      {service.duration}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="md:col-span-6 md:col-start-7">
                <h3 className="eyebrow">Co wchodzi w zakres</h3>
                <ul data-reveal-group className="mt-6">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      data-reveal
                      className="flex gap-4 border-b border-hairline py-4 text-dim"
                    >
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Process steps={getProcessSteps()} />

      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <Eyebrow>Szukasz czegoś lokalnie?</Eyebrow>
          <div className="mt-10 grid gap-px md:grid-cols-2">
            {[
              {
                href: '/tworzenie-stron-internetowych-wolomin',
                title: 'Strony internetowe — Wołomin',
                body: 'Współpraca z lokalnym biznesem z Wołomina i powiatu, z możliwością spotkania na miejscu.',
              },
              {
                href: '/tworzenie-stron-internetowych-warszawa',
                title: 'Strony internetowe — Warszawa',
                body: 'Projekty dla firm z Warszawy: większa konkurencja w wyszukiwarce, wyższe wymagania wykonawcze.',
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                data-reveal
                className="group border-t border-hairline py-8 transition-colors duration-500 md:pr-10"
              >
                <h3 className="font-display text-headline font-semibold tracking-tight text-star transition-colors duration-500 group-hover:text-signal">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-md leading-relaxed text-dim">{card.body}</p>
                <span
                  aria-hidden
                  className="mt-6 inline-block text-dim transition-transform duration-500 group-hover:translate-x-2"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqList items={faq} title="Pytania, które padają najczęściej" />

      <ContactCta />
    </>
  );
}
