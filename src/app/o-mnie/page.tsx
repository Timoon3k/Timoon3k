import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import HeroCanvas from '@/components/three/HeroCanvas';
import { Eyebrow, SectionHeader } from '@/components/ui/Section';
import { getProcessSteps } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'O mnie — web developer i projektant stron z Wołomina',
  description:
    'Freelancer z Wołomina projektujący i kodujący strony internetowe. Jak pracuję, w czym się specjalizuję i dlaczego zaczynam każdy projekt od celu, a nie od layoutu.',
  path: '/o-mnie',
});

const competences = [
  {
    title: 'Projektowanie',
    body: 'Układ, typografia, hierarchia informacji i system komponentów. Projektuję w oparciu o cel strony, nie o aktualnie modny styl.',
    items: ['Architektura informacji', 'Layout i typografia', 'Design system', 'Motion design'],
  },
  {
    title: 'Kod',
    body: 'Frontend w Next.js i TypeScript, WordPress z dedykowanymi rozszerzeniami, integracje płatności i logika zamówień.',
    items: ['Next.js / React', 'TypeScript', 'WordPress / WooCommerce', 'Three.js / GSAP'],
  },
  {
    title: 'Wydajność i SEO',
    body: 'Core Web Vitals traktuję jako część zakresu. Struktura nagłówków, dane strukturalne i optymalizacja obrazów to standard, nie płatny dodatek.',
    items: ['Core Web Vitals', 'SEO techniczne', 'Dane strukturalne', 'Dostępność WCAG'],
  },
];

const beliefs = [
  {
    claim: 'Ładna strona, która nic nie sprzedaje, jest nieudanym projektem.',
    body: 'Estetyka ma znaczenie, bo buduje zaufanie w pierwszych sekundach. Ale jeśli po tych sekundach użytkownik nie wie, co ma zrobić dalej, projekt nie spełnił swojej roli.',
  },
  {
    claim: 'Szybkość to nie parametr techniczny, tylko element sprzedaży.',
    body: 'Klient na telefonie, przy słabym zasięgu, nie czeka. Dlatego pilnuję, co ładuje się przed pierwszym ekranem, i nie dokładam efektów, za które płaci użytkownik.',
  },
  {
    claim: 'Strona, której nie umiesz zaktualizować, umiera po pół roku.',
    body: 'Każdy projekt oddaję z panelem i krótkim szkoleniem. Treść, która nie jest aktualizowana, przestaje pracować — a nie każdy chce dzwonić do wykonawcy po zmianę godzin otwarcia.',
  },
];

export default function AboutPage() {
  const steps = getProcessSteps();

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'O mnie', href: '/o-mnie' },
        ]}
      />

      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40 md:left-1/3">
          <HeroCanvas />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,var(--color-void)_20%,rgba(4,6,11,0.7)_55%,transparent_85%)]"
        />
        <div className="relative container-page pt-14 pb-20 md:pt-20 md:pb-28">
          <Eyebrow>O mnie</Eyebrow>
          <h1 data-split="immediate" className="mt-7 max-w-[13ch] text-giant text-gradient-star">
            Tomasz Majewski. Projektuję i koduję.
          </h1>
          <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
            Jestem freelancerem z Wołomina. Zajmuję się stronami internetowymi od strony projektu i
            od strony kodu — dla małych firm, osób prowadzących jednoosobową działalność,
            fotografów, lokalnych usługodawców i sklepów.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-32">
              <Eyebrow>Jak to się zaczęło</Eyebrow>
            </div>
          </div>
          <div data-reveal-group className="space-y-7 md:col-span-8 lg:col-span-8 lg:col-start-5">
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Zaczęło się od własnych projektów — takich, przy których nikt nie płacił, a jedyną
              motywacją było sprawdzenie, czy da się zrobić coś, co wygląda i działa lepiej niż to,
              co widziałem dookoła.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Szybko zauważyłem rzecz, która zmieniła sposób, w jaki podchodzę do tej pracy: dobra
              strona potrafi realnie wesprzeć biznes. Nie jako element wizerunku, tylko jako kanał,
              z którego przychodzą telefony i zapytania. I odwrotnie — strona zrobiona bez pomysłu
              potrafi kosztować firmę klientów, o których nikt się nie dowie.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Dziś pracuję głównie z przedsiębiorcami z Wołomina, powiatu wołomińskiego i Warszawy,
              choć projekty prowadzę też zdalnie w całej Polsce. Najczęściej trafiają do mnie firmy
              w jednym z dwóch momentów: albo wchodzą do sieci pierwszy raz, albo mają stronę,
              która przestała im wystarczać.
            </p>
            <p data-reveal className="text-lead leading-relaxed text-dim">
              Nie prowadzę agencji i nie zatrudniam podwykonawców do rzeczy, za które biorę
              odpowiedzialność. Osoba, z którą ustalasz zakres, jest tą samą, która projektuje,
              pisze kod i wdraża. To ogranicza skalę projektów, które mogę przyjąć — ale
              eliminuje etap, na którym ustalenia rozmywają się między działami.
            </p>
          </div>
        </div>
      </section>

      {/* Przekonania */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Podejście"
            title="Trzy rzeczy, co do których nie jestem elastyczny"
            align="stack"
          />
          <div data-reveal-group className="mt-16 space-y-px">
            {beliefs.map((belief, index) => (
              <article
                key={belief.claim}
                data-reveal
                className="grid gap-6 border-t border-hairline py-9 md:grid-cols-12 md:gap-10"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70 md:col-span-1">
                  0{index + 1}
                </span>
                <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-snug font-semibold tracking-tight text-star md:col-span-6">
                  {belief.claim}
                </h3>
                <p className="leading-relaxed text-dim md:col-span-5">{belief.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Kompetencje */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Kompetencje"
            title="Co realnie robię własnymi rękami"
            lead="Projekt, kod i wdrożenie w jednym miejscu. Tam, gdzie potrzebna jest fotografia albo copywriting w specjalistycznej branży, pracuję z zewnętrznymi specjalistami i mówię o tym otwarcie."
          />

          <div data-reveal-group className="mt-16 grid gap-px md:grid-cols-3">
            {competences.map((group) => (
              <article key={group.title} data-reveal className="border-t border-hairline pt-8 md:pr-8">
                <h3 className="font-display text-headline font-semibold tracking-tight text-star">
                  {group.title}
                </h3>
                <p className="mt-4 leading-relaxed text-dim">{group.body}</p>
                <ul className="mt-7 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-[0.6875rem] tracking-[0.1em] text-faint uppercase"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Współpraca */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>Współpraca</Eyebrow>
            <h2 data-split className="mt-6 text-major text-gradient-star">
              Jak wygląda praca ze mną
            </h2>
            <p data-reveal className="mt-6 max-w-md text-dim">
              Sześć etapów, o których piszę szerzej w{' '}
              <Link href="/oferta" className="link-underline text-signal">
                ofercie
              </Link>
              . Tutaj skrót — żebyś wiedział, czego się spodziewać, zanim napiszesz pierwszą
              wiadomość.
            </p>
            <p data-reveal className="mt-6 max-w-md text-dim">
              Piszesz na{' '}
              <a href={`mailto:${site.email}`} className="link-underline text-signal">
                {site.email}
              </a>{' '}
              albo przez formularz. Odpowiadam zwykle tego samego dnia.
            </p>
          </div>

          <ol data-reveal-group className="md:col-span-6 md:col-start-7">
            {steps.map((step) => (
              <li key={step.index} data-reveal className="flex gap-5 border-t border-hairline py-5">
                <span className="mt-0.5 font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                  {step.index}
                </span>
                <div>
                  <h3 className="font-display font-semibold tracking-tight text-star">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-faint">{step.duration}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactCta
        title="Porozmawiajmy o Twoim projekcie"
        lead="Nie musisz mieć gotowej specyfikacji. Wystarczy, że wiesz, co chcesz osiągnąć — resztę ustalimy."
      />
    </>
  );
}
