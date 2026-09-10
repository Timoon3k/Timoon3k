import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import BrowserFrame from '@/components/portfolio/BrowserFrame';
import ContactCta from '@/components/layout/ContactCta';
import JsonLd from '@/components/seo/JsonLd';
import { Eyebrow } from '@/components/ui/Section';
import { getProjects, getProjectBySlug } from '@/lib/content';
import { buildMetadata, creativeWorkSchema } from '@/lib/seo';
import type { CSSProperties } from 'react';

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: 'Nie znaleziono', description: '', path: '/portfolio', noIndex: true });

  return buildMetadata({
    title: project.seo.title,
    description: project.seo.description,
    path: `/portfolio/${project.slug}`,
    ogImage: '/og/portfolio.png',
  });
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length] ?? projects[0];
  const [desktopShot, mobileShot] = project.gallery;

  const meta = [
    { label: 'Zakres', value: project.role },
    { label: 'Typ projektu', value: project.category },
    { label: 'Adres', value: project.domain },
  ];

  return (
    <div style={{ '--project-accent': project.accent } as CSSProperties}>
      <JsonLd
        data={creativeWorkSchema({
          name: `${project.client} — ${project.title}`,
          description: project.summary,
          path: `/portfolio/${project.slug}`,
          image: project.cover.src,
          keywords: [...project.tags, ...project.stack],
        })}
      />

      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Portfolio', href: '/portfolio' },
          { name: project.client, href: `/portfolio/${project.slug}` },
        ]}
      />

      {/* Nagłówek realizacji */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 h-96"
          style={{
            background:
              'radial-gradient(50% 100% at 50% 0%, color-mix(in oklab, var(--project-accent) 16%, transparent), transparent 70%)',
          }}
        />
        <div className="relative container-page pt-14 pb-16 md:pt-20">
          <Eyebrow>{project.category}</Eyebrow>
          <h1 data-split="immediate" className="mt-7 text-giant text-gradient-star">
            {project.client}
          </h1>
          <p data-reveal className="mt-7 max-w-3xl text-lead text-dim">
            {project.title}
          </p>

          <dl
            data-reveal-group
            className="mt-14 grid gap-x-8 gap-y-8 border-t border-hairline pt-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {meta.map((item) => (
              <div key={item.label} data-reveal>
                <dt className="eyebrow">{item.label}</dt>
                <dd className="mt-2.5 font-display font-medium tracking-tight text-star">
                  {item.value}
                </dd>
              </div>
            ))}
            <div data-reveal>
              <dt className="eyebrow">Podgląd</dt>
              <dd className="mt-2.5">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline font-display font-medium tracking-tight text-signal"
                  >
                    Otwórz stronę ↗
                  </a>
                ) : (
                  <span className="text-dim">niedostępny</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Wizual otwierający wychodzi poza kontener — case study zaczyna się obrazem */}
      <div className="relative">
        <div className="mx-auto w-full max-w-[110rem] px-gutter">
          <BrowserFrame image={project.cover} domain={project.domain} priority />
        </div>
      </div>

      {/* Kontekst */}
      <section className="py-section">
        <div className="container-page grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <Eyebrow>Kontekst</Eyebrow>
          </div>
          <p
            data-split
            className="font-display text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.22] font-medium tracking-tight text-gradient-star md:col-span-8 lg:col-span-9"
          >
            {project.context}
          </p>
        </div>
      </section>

      {/* Wyzwanie i rozwiązanie */}
      {[project.challenge, project.solution].map((section, index) => (
        <section key={section.heading} className="border-t border-hairline py-section">
          <div className="container-page grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="md:sticky md:top-32">
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                  0{index + 1}
                </span>
                <h2 data-reveal className="mt-4 font-display text-major font-semibold tracking-tight text-star">
                  {section.heading}
                </h2>
              </div>
            </div>
            <div data-reveal-group className="space-y-6 md:col-span-8 lg:col-span-8 lg:col-start-5">
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} data-reveal className="text-lead leading-relaxed text-dim">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Funkcjonalności */}
      <section className="border-t border-hairline py-section">
        <div className="container-page">
          <Eyebrow>Kluczowe funkcjonalności</Eyebrow>
          <div data-reveal-group className="mt-14 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {project.features.map((feature, index) => (
              <article key={feature.title} data-reveal className="border-t border-hairline py-8 sm:pr-8">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-[1.1875rem] font-semibold tracking-tight text-star">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-dim">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Widoki desktop i mobile */}
      {desktopShot || mobileShot ? (
        <section className="border-t border-hairline py-section">
          <div className="container-page">
            <Eyebrow>Widoki</Eyebrow>
            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
              {desktopShot ? (
                <div data-reveal data-parallax="26" className="lg:col-span-8">
                  <BrowserFrame image={desktopShot} domain={project.domain} />
                  <p className="mt-4 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                    Widok desktopowy
                  </p>
                </div>
              ) : null}
              {mobileShot ? (
                <div data-reveal className="mx-auto w-[64%] sm:w-[46%] lg:col-span-4 lg:w-full">
                  <div className="overflow-hidden rounded-[2rem] border border-hairline-strong bg-graphite p-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mobileShot.src}
                      alt={mobileShot.alt}
                      width={mobileShot.width}
                      height={mobileShot.height}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-[1.5rem]"
                      style={{ aspectRatio: `${mobileShot.width} / ${mobileShot.height}` }}
                    />
                  </div>
                  <p className="mt-4 font-mono text-[0.625rem] tracking-[0.12em] text-faint uppercase">
                    Widok mobilny
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Rezultat i technologie */}
      <section className="border-t border-hairline py-section">
        <div className="container-page grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>Rezultat</Eyebrow>
            <ul data-reveal-group className="mt-9 space-y-5">
              {project.outcome.map((item, index) => (
                <li key={item} data-reveal className="flex gap-6 border-b border-hairline pb-5">
                  <span
                    aria-hidden
                    className="mt-2 font-mono text-[0.6875rem] tracking-[0.14em]"
                    style={{ color: 'var(--project-accent)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-lead leading-relaxed text-dim">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <Eyebrow>Technologie</Eyebrow>
            <ul data-reveal className="mt-9 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="border border-hairline px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.08em] text-dim"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Nawigacja do kolejnej realizacji */}
      {next && next.slug !== project.slug ? (
        <section className="border-t border-hairline">
          <Link href={`/portfolio/${next.slug}`} className="group block py-16 md:py-24">
            <div className="container-page flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow">Następna realizacja</p>
                <p className="mt-5 font-display text-[clamp(2rem,5vw,4rem)] leading-none font-semibold tracking-tight text-star transition-colors duration-500 group-hover:text-signal">
                  {next.client}
                </p>
              </div>
              <span
                aria-hidden
                className="font-mono text-sm text-dim transition-transform duration-500 group-hover:translate-x-2"
              >
                →
              </span>
            </div>
          </Link>
        </section>
      ) : null}

      <ContactCta
        title="Podobny projekt u Ciebie?"
        lead="Opisz, co ma robić Twoja strona. Odeślę propozycję zakresu, termin i wycenę."
        variant="compact"
      />
    </div>
  );
}
