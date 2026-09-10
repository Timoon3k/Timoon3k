import Link from 'next/link';
import ProjectRow from '@/components/portfolio/ProjectRow';
import { Eyebrow } from '@/components/ui/Section';
import type { Project } from '@/lib/types';

export default function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <section id="realizacje" className="py-section">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>Wybrane realizacje</Eyebrow>
            <h2 data-split className="mt-6 max-w-[14ch] text-major text-gradient-star">
              Projekty, które pracują po wdrożeniu
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="link-underline font-mono text-[0.6875rem] tracking-[0.14em] text-dim uppercase transition-colors hover:text-signal"
          >
            Całe portfolio ({projects.length})
          </Link>
        </div>

        <div className="mt-14">
          {projects.map((project, index) => (
            // Realizacje leżą daleko poniżej pierwszego ekranu — każda okładka
            // ładuje się leniwie, żeby nie rywalizowała o pasmo z treścią hero.
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
