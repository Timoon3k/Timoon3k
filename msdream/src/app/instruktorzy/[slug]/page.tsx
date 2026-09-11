import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Photo } from '@/components/ui/Photo';
import { JsonLd } from '@/components/ui/JsonLd';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { getInstructor, getInstructors } from '@/cms/content';
import { buildMetadata, personJsonLd } from '@/lib/seo';
import { isOwnerRequired } from '@/lib/site';

/**
 * Profil instruktora.
 *
 * Generujemy wyłącznie profile osób z uzupełnionym imieniem i nazwiskiem —
 * pusta strona „Instruktor 1" byłaby w indeksie Google gorsza niż jej brak.
 */
export async function generateStaticParams() {
  const instructors = await getInstructors();
  return instructors.filter((i) => !isOwnerRequired(i.name)).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
  props: PageProps<'/instruktorzy/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const instructor = await getInstructor(slug);
  if (!instructor || isOwnerRequired(instructor.name)) return {};

  return buildMetadata({
    title: `${instructor.name} — ${instructor.role}`,
    description: instructor.bio.slice(0, 158),
    path: `/instruktorzy/${instructor.slug}`,
  });
}

export default async function InstructorPage(props: PageProps<'/instruktorzy/[slug]'>) {
  const { slug } = await props.params;
  const instructor = await getInstructor(slug);

  if (!instructor || isOwnerRequired(instructor.name)) notFound();
  const name = instructor.name as string;

  return (
    <>
      <JsonLd data={personJsonLd(name, instructor.role, `/instruktorzy/${instructor.slug}`)} />
      <Breadcrumbs
        items={[
          { name: 'Instruktorzy', href: '/instruktorzy' },
          { name, href: `/instruktorzy/${instructor.slug}` },
        ]}
      />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-5">
              <Photo
                photo={instructor.portrait}
                sizes="(max-width: 899px) 100vw, 40vw"
                quality={82}
                priority
              />
            </div>

            <div className="col-span-6 lg:col-start-7">
              <p className="eyebrow">{instructor.role}</p>
              <h1 className="mt-6" style={{ fontSize: 'var(--text-display)' }}>{name}</h1>

              <p
                className="mt-8 max-w-[52ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
              >
                {instructor.bio}
              </p>

              {instructor.experience && (
                <div className="mt-9 border-t pt-5" style={{ borderColor: 'var(--color-line)' }}>
                  <h2 className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)', fontFamily: 'var(--font-sans)' }}>
                    Doświadczenie
                  </h2>
                  <p className="mt-2 text-[0.9375rem]">{instructor.experience}</p>
                </div>
              )}

              {instructor.specialization.length > 0 && (
                <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--color-line)' }}>
                  <h2 className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)', fontFamily: 'var(--font-sans)' }}>
                    Specjalizacje
                  </h2>
                  <ul className="mt-3 space-y-2 text-[0.9375rem]">
                    {instructor.specialization.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" style={{ color: 'var(--color-brass-500)' }}>—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {instructor.socials && instructor.socials.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-5 text-[0.9375rem]">
                  {instructor.socials.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} className="rein-link" rel="noopener noreferrer" target="_blank">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <ClosingCta title={`Zarezerwuj zajęcia`} />
    </>
  );
}
