import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { display, isOwnerRequired } from '@/lib/site';
import type { Instructor } from '@/lib/types';

/**
 * Instruktorzy.
 *
 * Portrety w pionie 4:5, ułożone naprzemiennie z przesunięciem —
 * układ typograficzno-fotograficzny, nie siatka kart z cieniami.
 */
export function InstructorList({
  instructors,
  linkToProfiles = true,
}: {
  instructors: readonly Instructor[];
  linkToProfiles?: boolean;
}) {
  return (
    <section className="section" style={{ background: 'var(--color-ivory-100)' }}>
      <div className="shell">
        <div className="grid-editorial items-end gap-y-6">
          <div className="col-span-7">
            <p className="eyebrow mb-7" data-reveal>
              <span aria-hidden="true">10</span> Zespół
            </p>
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Poznaj ludzi, którzy
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> uczą jeździć</span>
            </h2>
          </div>
          <div className="col-span-4 lg:col-start-9">
            <p
              className="max-w-[34ch] text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--color-graphite-500)' }}
              data-reveal
            >
              Instruktora poznajesz przy pierwszej jeździe i zwykle zostajesz z nim
              na dłużej — ciągłość pracy z jedną osobą przyspiesza postępy bardziej
              niż zmiana szkoły.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, i) => {
            const named = !isOwnerRequired(instructor.name);
            const name = display(instructor.name, 'Imię i nazwisko');
            const href = `/instruktorzy/${instructor.slug}`;

            const body = (
              <>
                <Photo
                  photo={instructor.portrait}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 46vw, 30vw"
                  quality={75}
                />
                <h3 className="mt-6" style={{ fontSize: 'var(--text-heading)' }}>
                  {named ? <span className="rein-link">{name}</span> : name}
                </h3>
                <p className="mt-1.5 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-brass-600)' }}>
                  {instructor.role}
                </p>
                <p
                  className="mt-4 max-w-[38ch] text-[0.875rem] leading-relaxed"
                  style={{ color: 'var(--color-graphite-500)' }}
                >
                  {instructor.bio}
                </p>
              </>
            );

            return (
              <article
                key={instructor.slug}
                className={i % 3 === 1 ? 'lg:mt-16' : ''}
                data-reveal
                data-reveal-delay={(i % 3) * 0.07}
              >
                {named && linkToProfiles ? (
                  <Link href={href} className="group block">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
