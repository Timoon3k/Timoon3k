import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import FaqList from '@/components/ui/FaqList';
import JsonLd from '@/components/seo/JsonLd';
import ProjectRow from '@/components/portfolio/ProjectRow';
import { Eyebrow, SectionHeader } from '@/components/ui/Section';
import { getFaq, getProjects } from '@/lib/content';
import { buildMetadata, serviceSchema } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tworzenie stron internetowych — Warszawa | Tomasz Majewski',
  description:
    'Strony internetowe i sklepy dla firm z Warszawy: rozwiązania dedykowane, WooCommerce, Next.js, wysokie Core Web Vitals. Praca bezpośrednio z wykonawcą, bez narzutu agencji.',
  path: '/tworzenie-stron-internetowych-warszawa',
  ogImage: '/og/warszawa.png',
});

const comparison = [
  {
    aspect: 'Kto wykonuje projekt',
    freelancer: 'Jedna osoba: projekt, kod, wdrożenie',
    agency: 'Zespół, z account managerem jako punktem kontaktu',
  },
  {
    aspect: 'Ścieżka ustaleń',
    freelancer: 'Rozmawiasz bezpośrednio z wykonawcą',
    agency: 'Ustalenia przechodzą przez opiekuna projektu',
  },
  {
    aspect: 'Koszt',
    freelancer: 'Bez narzutu na strukturę i biuro',
    agency: 'Wyższy, obejmuje obsługę zespołu',
  },
  {
    aspect: 'Skala',
    freelancer: 'Projekty do kilkudziesięciu podstron',
    agency: 'Duże wdrożenia z wieloma równoległymi zespołami',
  },
  {
    aspect: 'Tempo zmian',
    freelancer: 'Poprawka wchodzi tego samego dnia',
    agency: 'Zmiana przechodzi przez kolejkę zadań',
  },
];

const standards = [
  {
    index: '01',
    title: 'Wydajność mierzona, nie deklarowana',
    body: 'Core Web Vitals sprawdzam na realnych pomiarach po wdrożeniu, nie tylko w laboratorium. Kontroluję, co ładuje się przed pierwszym ekranem, i nie dokładam efektów, za które płaci użytkownik czasem oczekiwania.',
  },
  {
    index: '02',
    title: 'Warstwa wizualna, która nie jest doklejką',
    body: 'Animacje sterowane przewijaniem, motion design i sceny 3D w Three.js buduję jako część architektury projektu — z fallbackiem dla słabszych urządzeń i pełnym poszanowaniem prefers-reduced-motion.',
  },
  {
    index: '03',
    title: 'Logika, której nie da się załatwić wtyczką',
    body: 'Nietypowe procesy zamówień, rezerwacje z kontrolą dostępności, walidacja warunków oferty po stronie serwera. Tam, gdzie gotowe rozwiązanie robi „prawie to”, piszę dedykowany kod.',
  },
  {
    index: '04',
    title: 'SEO techniczne od pierwszego commita',
    body: 'Struktura nagłówków, dane strukturalne, kanoniczne adresy, sitemapa i linkowanie wewnętrzne projektowane razem z serwisem — a nie dokładane po odbiorze jako osobna usługa.',
  },
];

export default async function WarszawaPage() {
  const [faq, projects] = await Promise.all([getFaq('warszawa'), getProjects()]);
  const advanced = projects
    .filter((project) => ['weekendowe-loty', 'msdream'].includes(project.slug))
    .slice(0, 2);

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Tworzenie stron internetowych — Warszawa',
          description:
            'Projektowanie i wdrażanie stron internetowych, sklepów i rozwiązań dedykowanych dla firm z Warszawy.',
          path: '/tworzenie-stron-internetowych-warszawa',
          areaServed: ['Warszawa', 'Praga-Północ', 'Praga-Południe', 'Targówek', 'Białołęka', 'Bemowo', 'Mokotów', 'Wola'],
          priceFrom: 3500,
        })}
      />

      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Oferta', href: '/oferta' },
          { name: 'Warszawa', href: '/tworzenie-stron-internetowych-warszawa' },
        ]}
      />

      <section className="container-page pt-14 pb-20 md:pt-20">
        <Eyebrow>Warszawa</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[16ch] text-giant text-gradient-star">
          Strony dla firm z rynku, na którym wszyscy się starają
        </h1>
        <div className="mt-10 grid gap-8 md:grid-cols-12">
          <p data-reveal className="text-lead text-dim md:col-span-6">
            W Warszawie przeciętna strona nie wystarcza. Twoja konkurencja też ma responsywny
            layout, blog i formularz kontaktowy. Przewagę budują dziś szczegóły: szybkość, jakość
            wykonania i to, jak szybko odwiedzający rozumie, dlaczego ma wybrać właśnie Ciebie.
          </p>
          <p data-reveal className="text-dim md:col-span-5 md:col-start-8">
            Pracuję z firmami usługowymi, sklepami, markami i freelancerami, którzy oczekują
            wykonania na poziomie agencyjnym, ale wolą rozmawiać bezpośrednio z osobą, która
            projektuje i pisze kod.
          </p>
        </div>
      </section>

      {/* Standard wykonania */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Standard wykonania"
            title="Cztery rzeczy, które odróżniają dobry projekt od poprawnego"
          />
          <div data-reveal-group className="mt-16 grid gap-px md:grid-cols-2">
            {standards.map((item) => (
              <article key={item.index} data-reveal className="border-t border-hairline py-9 md:pr-10">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                  {item.index}
                </span>
                <h3 className="mt-5 font-display text-headline font-semibold tracking-tight text-star">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-lg leading-relaxed text-dim">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Porównanie */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Freelancer czy agencja"
            title="Kiedy warto wybrać każde z tych rozwiązań"
            lead="Nie każdy projekt powinien trafić do freelancera. Poniżej uczciwe zestawienie — z zaznaczeniem sytuacji, w których agencja będzie lepszym wyborem."
          />

          <div data-reveal className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                Porównanie współpracy z freelancerem i z agencją interaktywną
              </caption>
              <thead>
                <tr className="border-b border-hairline-strong">
                  <th scope="col" className="eyebrow py-4 pr-6 font-normal">
                    Aspekt
                  </th>
                  <th scope="col" className="py-4 pr-6 font-display text-sm font-semibold text-signal">
                    Praca ze mną
                  </th>
                  <th scope="col" className="py-4 font-display text-sm font-semibold text-dim">
                    Agencja interaktywna
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.aspect} className="border-b border-hairline align-top">
                    <th scope="row" className="py-5 pr-6 text-sm font-normal text-faint">
                      {row.aspect}
                    </th>
                    <td className="py-5 pr-6 text-star">{row.freelancer}</td>
                    <td className="py-5 text-dim">{row.agency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p data-reveal className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            Jeśli Twój projekt wymaga równoległej pracy kilku zespołów, całodobowego SLA albo
            rozbudowanej obsługi kampanii reklamowych — agencja będzie właściwszym wyborem. Powiem o
            tym wprost, zamiast przyjmować zlecenie na siłę.
          </p>
        </div>
      </section>

      {/* Realizacje zaawansowane */}
      {advanced.length ? (
        <section className="border-t border-hairline py-section">
          <div className="container-page">
            <Eyebrow>Wdrożenia o większej złożoności</Eyebrow>
            <h2 data-split className="mt-6 max-w-[16ch] text-major text-gradient-star">
              Projekty, w których wtyczka nie wystarczyła
            </h2>
            <div className="mt-12">
              {advanced.map((project, index) => (
                <ProjectRow key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Praca zdalna */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Eyebrow>Jak pracujemy</Eyebrow>
          </div>
          <div data-reveal-group className="space-y-7 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Warszawa jest tuż obok Wołomina, więc spotkanie osobiste nie jest problemem. W praktyce
              większość projektów prowadzę jednak zdalnie — wideorozmowa i wspólny dokument z
              ustaleniami działają szybciej niż dwa dojazdy przez miasto w godzinach szczytu.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Ustalenia zapisujemy, zakres jest zamknięty przed startem, a postęp widzisz na
              działającym środowisku podglądowym, nie na statycznych zrzutach ekranu. Uwagi zgłaszasz
              na bieżąco, w miejscu, w którym są od razu widoczne w kontekście.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Po wdrożeniu dostajesz komplet dostępów i panel do samodzielnej edycji. Możesz zostać
              przy stałej opiece albo prowadzić stronę we własnym zakresie — obie ścieżki są w
              porządku, żadna nie jest warunkiem drugiej.
            </p>
          </div>
        </div>
      </section>

      <FaqList items={faq} eyebrow="FAQ — Warszawa" title="Pytania, które słyszę najczęściej" />

      <section className="border-t border-hairline py-16">
        <div className="container-page">
          <p data-reveal className="max-w-2xl text-dim">
            Twoja firma działa bliżej Wołomina? Zobacz stronę o{' '}
            <Link href="/tworzenie-stron-internetowych-wolomin" className="link-underline text-signal">
              tworzeniu stron internetowych w Wołominie
            </Link>{' '}
            — z naciskiem na widoczność lokalną i bezpośrednie spotkania. Szczegóły zakresu
            znajdziesz w{' '}
            <Link href="/oferta" className="link-underline text-signal">
              ofercie
            </Link>
            , a przykłady wdrożeń w{' '}
            <Link href="/portfolio" className="link-underline text-signal">
              portfolio
            </Link>
            .
          </p>
        </div>
      </section>

      <ContactCta
        title="Opowiedz, co ma osiągnąć Twoja strona"
        lead="Im konkretniej opiszesz cel, tym trafniejszą propozycję zakresu i wyceny odeślę. Zwykle w ciągu 24 godzin."
      />
    </>
  );
}
