import { Section } from '@/components/ui/Section';

const marquee = [
  'Next.js',
  'WordPress',
  'WooCommerce',
  'Three.js',
  'GSAP',
  'TypeScript',
  'Core Web Vitals',
  'Local SEO',
  'Headless CMS',
  'Motion design',
];

export default function Manifesto() {
  return (
    <Section className="relative overflow-hidden" bleed>
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-8">
            <h2 data-split className="text-giant text-gradient-star">
              Dobra strona to nie kwestia gustu. To kwestia decyzji, którą ma podjąć odwiedzający.
            </h2>
          </div>
          <div className="flex flex-col justify-end md:col-span-5 md:pb-2 lg:col-span-4">
            <p data-reveal className="text-lead text-dim">
              Zanim zacznę projektować, ustalam, kto ma trafić na stronę i co ma zrobić dalej.
              Dopiero potem powstaje layout, typografia i cała warstwa wizualna — bo forma bez celu
              jest tylko dekoracją.
            </p>
            <p data-reveal className="mt-6 text-dim">
              Pracujesz bezpośrednio ze mną: tą samą osobą, która projektuje, pisze kod i wdraża.
              Bez pośredników i bez przekazywania projektu między działami.
            </p>
          </div>
        </div>
      </div>

      {/* Pasek kompetencji — element rytmiczny między sekcjami */}
      <div
        aria-hidden
        className="marquee mt-20 flex overflow-hidden border-y border-hairline py-6 select-none"
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__track flex shrink-0 items-center gap-12 pr-12">
            {marquee.map((item) => (
              <li
                key={item}
                className="flex items-center gap-12 font-display text-[clamp(1.25rem,2.4vw,2rem)] font-medium tracking-tight whitespace-nowrap text-star/25"
              >
                {item}
                <span className="inline-block h-1 w-1 rounded-full bg-signal/60" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </Section>
  );
}
