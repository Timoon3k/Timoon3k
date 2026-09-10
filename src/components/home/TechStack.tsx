import { SectionHeader } from '@/components/ui/Section';

const groups = [
  {
    label: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'HTML / CSS', 'JavaScript'],
  },
  {
    label: 'Motion & 3D',
    items: ['GSAP', 'ScrollTrigger', 'Three.js', 'React Three Fiber', 'Shadery GLSL'],
  },
  {
    label: 'CMS & backend',
    items: ['WordPress', 'WooCommerce', 'PHP', 'Sanity', 'REST API', 'Node.js'],
  },
  {
    label: 'Jakość',
    items: ['Core Web Vitals', 'SEO techniczne', 'Dane strukturalne', 'WCAG', 'Analityka'],
  },
];

export default function TechStack() {
  return (
    <section className="border-t border-hairline py-section">
      <div className="container-page">
        <SectionHeader
          eyebrow="Technologie"
          title="Narzędzia dobierane do zadania"
          lead="Nie mam jednego ulubionego rozwiązania, które pasuje do wszystkiego. WordPress, gdy liczy się prostota utrzymania. Next.js, gdy liczy się wydajność i nietypowa logika."
        />

        <dl data-reveal-group className="mt-16 border-t border-hairline">
          {groups.map((group) => (
            <div
              key={group.label}
              data-reveal
              className="grid gap-4 border-b border-hairline py-7 md:grid-cols-12 md:gap-8"
            >
              <dt className="eyebrow md:col-span-3 md:pt-1">{group.label}</dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap gap-x-7 gap-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-display text-[1.0625rem] font-medium tracking-tight text-dim"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
