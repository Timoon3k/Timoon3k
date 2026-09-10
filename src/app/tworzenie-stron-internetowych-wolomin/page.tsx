import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import FaqList from '@/components/ui/FaqList';
import JsonLd from '@/components/seo/JsonLd';
import BrowserFrame from '@/components/portfolio/BrowserFrame';
import { Eyebrow, SectionHeader } from '@/components/ui/Section';
import { getFaq, getProjectBySlug } from '@/lib/content';
import { buildMetadata, serviceSchema } from '@/lib/seo';
import { formatPrice } from '@/lib/format';

export const metadata: Metadata = buildMetadata({
  title: 'Tworzenie stron internetowych — Wołomin | Tomasz Majewski',
  description:
    'Strony internetowe dla firm z Wołomina i powiatu wołomińskiego. Bezpośrednia współpraca z wykonawcą, możliwość spotkania na miejscu, strony od 1500 zł.',
  path: '/tworzenie-stron-internetowych-wolomin',
  ogImage: '/og/wolomin.png',
});

const towns = [
  'Wołomin',
  'Kobyłka',
  'Zielonka',
  'Ząbki',
  'Marki',
  'Radzymin',
  'Tłuszcz',
  'Klembów',
  'Poświętne',
  'Dąbrówka',
  'Jadów',
  'Strachówka',
];

const localCases = [
  {
    title: 'Usługi z dojazdem',
    body: 'Serwisy, hydraulicy, elektrycy, warsztaty. Klient szuka w Google w momencie awarii — liczy się widoczność na mapkach i telefon dostępny jednym kliknięciem.',
  },
  {
    title: 'Gabinety i salony',
    body: 'Fryzjer, kosmetyczka, fizjoterapeuta, gabinet stomatologiczny. Tu decyduje wiarygodność: zdjęcia miejsca, jasny cennik i prosty sposób umówienia wizyty.',
  },
  {
    title: 'Handel i lokalna produkcja',
    body: 'Sklepy stacjonarne, piekarnie, kwiaciarnie, firmy budowlane. Strona jest wizytówką, katalogiem oferty i miejscem, w którym potwierdza się, że firma naprawdę istnieje.',
  },
  {
    title: 'Jednoosobowe działalności',
    body: 'Trenerzy, księgowi, fotografowie, korepetytorzy. Często pierwsza strona w życiu firmy — musi być tania w utrzymaniu i możliwa do rozbudowy później.',
  },
];

export default async function WolominPage() {
  const [faq, localProject] = await Promise.all([
    getFaq('wolomin'),
    getProjectBySlug('damian-cebula-serwis'),
  ]);

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Tworzenie stron internetowych — Wołomin',
          description:
            'Projektowanie i wykonanie stron internetowych dla firm z Wołomina i powiatu wołomińskiego, z optymalizacją pod widoczność lokalną.',
          path: '/tworzenie-stron-internetowych-wolomin',
          areaServed: towns,
          priceFrom: 1500,
        })}
      />

      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Oferta', href: '/oferta' },
          { name: 'Wołomin', href: '/tworzenie-stron-internetowych-wolomin' },
        ]}
      />

      <section className="container-page pt-14 pb-20 md:pt-20">
        <Eyebrow>Wołomin i powiat wołomiński</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[15ch] text-giant text-gradient-star">
          Strona internetowa dla firmy z Wołomina
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p data-reveal className="text-lead text-dim md:col-span-6">
            Mieszkam i pracuję w Wołominie. Jeśli prowadzisz tu firmę, możemy usiąść i przegadać
            projekt osobiście — bez wideorozmów, formularzy briefowych i tłumaczenia przez telefon,
            o co dokładnie chodzi.
          </p>
          <p data-reveal className="text-dim md:col-span-5 md:col-start-8">
            Robię strony, które mają przynieść lokalnemu biznesowi konkretne telefony i zapytania:
            widoczne w Google na frazy z okolicy, szybkie na telefonie i na tyle proste w obsłudze,
            żebyś sam zmienił godziny otwarcia czy cennik.
          </p>
        </div>

        <dl
          data-reveal-group
          className="mt-14 grid gap-x-8 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-3"
        >
          {[
            { label: 'Strony od', value: formatPrice(1500) },
            { label: 'Realizacja', value: '7–14 dni' },
            { label: 'Spotkanie', value: 'możliwe na miejscu' },
          ].map((item) => (
            <div key={item.label} data-reveal>
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2.5 font-display text-[1.25rem] font-semibold tracking-tight text-star">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Dlaczego lokalnie */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-32">
              <Eyebrow>Dlaczego lokalnie</Eyebrow>
            </div>
          </div>
          <div data-reveal-group className="space-y-7 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Znam ten rynek z perspektywy mieszkańca, nie z raportu. Wiem, że w Wołominie i
              okolicach większość zleceń nadal przychodzi z polecenia i z wizytówki Google, a nie z
              rozbudowanych kampanii. Wiem też, jak wyglądają strony konkurencji — bo trafiam na nie
              tak samo jak Twoi klienci.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              To zmienia priorytety. W lokalnym projekcie ważniejsze od rozbudowanej oferty jest
              zwykle to, żeby ktoś stojący na parkingu z telefonem w ręku w kilka sekund znalazł
              numer, godziny i informację, czy dojeżdżasz pod jego adres.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Bezpośrednia współpraca też ma znaczenie. Uzgodnienia robimy przy stole albo przez
              telefon, poprawki wprowadzam sam, a jeśli po roku trzeba coś zmienić, dzwonisz do tej
              samej osoby, która stronę zbudowała.
            </p>
          </div>
        </div>
      </section>

      {/* Dla kogo */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Dla kogo"
            title="Firmy, dla których to ma największy sens"
            lead="Nie każdy biznes potrzebuje rozbudowanego serwisu. Poniżej cztery sytuacje, w których dobrze zrobiona strona lokalna zwraca się najszybciej."
          />
          <div data-reveal-group className="mt-16 grid gap-px sm:grid-cols-2">
            {localCases.map((item, index) => (
              <article key={item.title} data-reveal className="border-t border-hairline py-8 sm:pr-10">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-faint">
                  0{index + 1}
                </span>
                <h3 className="mt-4 font-display text-headline font-semibold tracking-tight text-star">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-dim">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Realizacja lokalna */}
      {localProject ? (
        <section className="border-t border-hairline py-section">
          <div className="container-page grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <Eyebrow>Przykład z okolicy</Eyebrow>
              <h2 data-reveal className="mt-6 font-display text-major font-semibold tracking-tight text-star">
                {localProject.client}
              </h2>
              <p data-reveal className="mt-5 text-lead text-dim">
                {localProject.summary}
              </p>
              <p data-reveal className="mt-6 leading-relaxed text-dim">
                Lokalna firma usługowa, w której cała strona podporządkowana jest jednemu celowi:
                skróceniu drogi od wyniku w Google do telefonu.
              </p>
              <Link
                href={`/portfolio/${localProject.slug}`}
                className="link-underline mt-8 inline-block font-mono text-[0.6875rem] tracking-[0.14em] text-signal uppercase"
              >
                Zobacz case study →
              </Link>
            </div>
            <div data-reveal className="md:col-span-6 md:col-start-7">
              <BrowserFrame image={localProject.cover} domain={localProject.domain} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Obszar */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Eyebrow>Obszar</Eyebrow>
            <h2 data-split className="mt-6 text-major text-gradient-star">
              Gdzie dojeżdżam
            </h2>
            <p data-reveal className="mt-6 max-w-sm text-dim">
              Spotkanie na miejscu jest możliwe w Wołominie i okolicznych miejscowościach. Projekty
              spoza tego obszaru prowadzę zdalnie — z takim samym zakresem prac.
            </p>
          </div>
          <ul data-reveal-group className="flex flex-wrap gap-x-3 gap-y-3 md:col-span-7 md:col-start-6 md:content-start">
            {towns.map((town) => (
              <li
                key={town}
                data-reveal
                className="border border-hairline px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.1em] text-dim uppercase"
              >
                {town}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqList items={faq} eyebrow="FAQ — Wołomin" title="Pytania lokalnych klientów" />

      <section className="border-t border-hairline py-16">
        <div className="container-page">
          <p data-reveal className="max-w-2xl text-dim">
            Prowadzisz firmę w Warszawie? Przygotowałem osobną stronę o{' '}
            <Link href="/tworzenie-stron-internetowych-warszawa" className="link-underline text-signal">
              tworzeniu stron internetowych dla firm z Warszawy
            </Link>{' '}
            — z innym zakresem tematów, bo i rynek jest inny. Możesz też zajrzeć do{' '}
            <Link href="/portfolio" className="link-underline text-signal">
              portfolio
            </Link>{' '}
            albo{' '}
            <Link href="/oferta" className="link-underline text-signal">
              pełnej oferty
            </Link>
            .
          </p>
        </div>
      </section>

      <ContactCta
        title="Zróbmy stronę, którą znajdą Twoi sąsiedzi"
        lead="Napisz, czym się zajmujesz i kogo chcesz przyciągnąć. Odeślę zakres i wycenę — a jeśli wolisz, umówimy się na kawę w Wołominie."
      />
    </>
  );
}
