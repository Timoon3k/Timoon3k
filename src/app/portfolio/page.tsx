import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactCta from '@/components/layout/ContactCta';
import PortfolioShowcase from '@/components/portfolio/PortfolioShowcase';
import { Eyebrow, SectionHeader } from '@/components/ui/Section';
import { getProjects } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Portfolio — realizacje stron internetowych i sklepów',
  description:
    'Zrealizowane projekty: sklep WooCommerce z rezerwacjami, system zapisów online, portfolio fotograficzne i strona lokalnej firmy usługowej. Case studies z opisem rozwiązań.',
  path: '/portfolio',
  ogImage: '/og/portfolio.png',
});

const angles = [
  {
    title: 'Cel przed formą',
    body: 'Każdy z tych projektów zaczynał się od pytania, jaką decyzję ma podjąć odwiedzający. Layout był konsekwencją odpowiedzi, nie punktem wyjścia.',
  },
  {
    title: 'Logika, nie wtyczki',
    body: 'Tam, gdzie gotowe rozwiązanie robiło „prawie to”, pisałem dedykowany kod. Wtyczka mniej to zwykle sekunda ładowania mniej.',
  },
  {
    title: 'Utrzymanie po stronie klienta',
    body: 'Wszystkie realizacje mają panel, w którym właściciel samodzielnie zmienia treść, ceny i terminy. Bez faktury za każdą poprawkę.',
  },
];

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Portfolio', href: '/portfolio' },
        ]}
      />

      <section className="container-page pt-14 pb-20 md:pt-20">
        <Eyebrow>Portfolio — {projects.length} realizacje</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[14ch] text-giant text-gradient-star">
          Projekty, które można sprawdzić pod adresem
        </h1>
        <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
          Poniżej realizacje, przy których odpowiadałem za projekt, kod i wdrożenie. Każda ma pełne
          case study: kontekst, problem biznesowy, zakres prac i zastosowane rozwiązania.
        </p>
      </section>

      <div className="container-page pb-section">
        <PortfolioShowcase projects={projects} />
      </div>

      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <SectionHeader
            eyebrow="Podejście"
            title="Czego nie widać na zrzucie ekranu"
            lead="Wygląd to warstwa, którą ocenia się w pierwszej sekundzie. O wartości projektu decyduje zwykle to, co pod nią."
          />
          <div data-reveal-group className="mt-16 grid gap-px md:grid-cols-3">
            {angles.map((angle) => (
              <article key={angle.title} data-reveal className="border-t border-hairline pt-7 md:pr-8">
                <h3 className="font-display text-headline font-semibold tracking-tight text-star">
                  {angle.title}
                </h3>
                <p className="mt-4 leading-relaxed text-dim">{angle.body}</p>
              </article>
            ))}
          </div>

          <p data-reveal className="mt-14 text-dim">
            Interesuje Cię konkretny typ projektu? Zobacz{' '}
            <Link href="/oferta" className="link-underline text-signal">
              pełną ofertę
            </Link>{' '}
            albo napisz, co chcesz osiągnąć — dobiorę zakres do celu.
          </p>
        </div>
      </section>

      <ContactCta
        title="Twój projekt może być następny"
        lead="Opisz, co chcesz zbudować. Odeślę zakres, termin i wycenę — zwykle w ciągu 24 godzin."
      />
    </>
  );
}
