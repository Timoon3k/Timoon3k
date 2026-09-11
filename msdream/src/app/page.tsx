import type { Metadata } from 'next';
import Link from 'next/link';

import { Hero } from '@/components/home/Hero';
import { Intro } from '@/components/home/Intro';
import { Story } from '@/components/home/Story';
import { Audience } from '@/components/home/Audience';
import { Values } from '@/components/home/Values';
import { Process } from '@/components/home/Process';
import { ServiceRows } from '@/components/home/ServiceRows';
import { InstructorList } from '@/components/sections/InstructorList';
import { Testimonials } from '@/components/sections/Testimonials';
import { MapSection } from '@/components/sections/LazyMap';
import { FaqSection } from '@/components/sections/FaqSection';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { EditorialGallery } from '@/components/gallery/EditorialGallery';
import { Photo } from '@/components/ui/Photo';

import {
  getFaqByTopic,
  getGallery,
  getHorses,
  getInstructors,
  getRidingServices,
  getTestimonials,
  getTuftingServices,
} from '@/cms/content';
import { getSiteData } from '@/lib/site-data';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Szkoła jazdy konnej Łomianki — nauka jazdy dla dzieci i dorosłych',
  description:
    'MSdream — szkoła jazdy konnej w Łomiankach pod Warszawą. Nauka jazdy konnej dla dzieci i dorosłych, zajęcia indywidualne, pakiety jazd i warsztaty tuftingu. Rezerwacja online.',
  path: '/',
});

export default async function HomePage() {
  // Jedno równoległe pobranie całej treści strony głównej. `cache()` w warstwie
  // CMS dba o to, żeby te same dane nie były pobierane dwa razy.
  const [riding, tufting, gallery, horses, instructors, testimonials, faq, siteData] =
    await Promise.all([
      getRidingServices(),
      getTuftingServices(),
      getGallery(),
      getHorses(),
      getInstructors(),
      getTestimonials(),
      getFaqByTopic('ogolne', 'jazda-konna', 'dzieci', 'rezerwacja'),
      getSiteData(),
    ]);

  return (
    <>
      {/* 01 */} <Hero />
      {/* 02 */} <Intro />
      {/* 03 */} <Story />

      {/* 04 — oferta */}
      <section className="section" style={{ background: 'var(--color-ivory-100)' }}>
        <div className="shell">
          <div className="grid-editorial items-end gap-y-6 pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="col-span-7">
              <p className="eyebrow mb-7" data-reveal>
                <span aria-hidden="true">04</span> Oferta
              </p>
              <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Zajęcia dobrane
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> do jeźdźca</span>
              </h2>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }} data-reveal>
                Nie mamy jednego programu dla wszystkich. Poziom, wiek i to, ile czasu
                realnie możesz poświęcić, decydują o tym, jak wyglądają Twoje zajęcia.
              </p>
            </div>
          </div>

          <ServiceRows services={riding} basePath="/oferta" />

          <div className="mt-12" data-reveal>
            <Link href="/oferta" className="btn btn--ghost">
              Zobacz pełną ofertę
            </Link>
          </div>
        </div>
      </section>

      {/* 05 + 06 — dzieci i dorośli */}
      <Audience />

      {/* 07 — konie. Sekcja pojawia się dopiero, gdy w CMS są prawdziwe konie. */}
      {horses.length > 0 && (
        <section className="section" style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}>
          <div className="shell">
            <p className="eyebrow eyebrow--light mb-7" data-reveal>
              <span aria-hidden="true">07</span> Nasze konie
            </p>
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              Poznaj nasze konie
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {horses.map((horse, i) => (
                <article key={horse.name} data-reveal data-reveal-delay={(i % 3) * 0.07}>
                  <Photo photo={horse.photo} sizes="(max-width: 639px) 100vw, 30vw" quality={75} />
                  <h3 className="mt-5" style={{ fontSize: 'var(--text-heading)' }}>{horse.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-brass-300)' }}>
                    {horse.breed}
                  </p>
                  <p className="mt-3 max-w-[36ch] text-[0.875rem] leading-relaxed" style={{ color: 'var(--color-sand-400)' }}>
                    {horse.character}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 08 + 09 — dlaczego MSdream i dobrostan koni */}
      <Values />

      {/* 10 — instruktorzy */}
      <InstructorList instructors={instructors} />

      {/* 11 — galeria */}
      <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
        <div className="shell">
          <div className="grid-editorial items-end gap-y-6 pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="col-span-7">
              <p className="eyebrow mb-7" data-reveal>
                <span aria-hidden="true">11</span> Galeria
              </p>
              <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Zwykły dzień
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> w stajni</span>
              </h2>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <Link href="/galeria" className="btn btn--ghost" data-reveal>
                Cała galeria
              </Link>
            </div>
          </div>

          <EditorialGallery images={gallery.slice(0, 6)} />
        </div>
      </section>

      {/* 12 — opinie */}
      <Testimonials items={testimonials} placeId={siteData.googlePlaceId} tone="page" />

      {/* 13 — proces */}
      <Process />

      {/* — tufting: most do drugiej gałęzi oferty */}
      <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
        <div className="shell">
          <div className="grid-editorial items-end gap-y-6 pb-[clamp(2rem,4vw,3.5rem)]">
            <div className="col-span-7">
              <p className="eyebrow mb-7" style={{ color: 'var(--color-wool-700)' }} data-reveal>
                <span aria-hidden="true">—</span> Warsztaty tuftingu
              </p>
              <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Nie tylko konie.
                <span style={{ fontStyle: 'italic', color: 'var(--color-wool-500)' }}> Też wełna.</span>
              </h2>
            </div>
            <div className="col-span-4 lg:col-start-9">
              <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }} data-reveal>
                Warsztaty, z których wychodzisz z gotowym dywanikiem własnego projektu —
                indywidualnie, w duecie albo całą grupą.
              </p>
            </div>
          </div>

          <ServiceRows services={tufting.slice(0, 2)} basePath="/oferta" />

          <div className="mt-12" data-reveal>
            <Link href="/oferta/warsztaty-tuftingu" className="btn btn--ghost">
              Wszystkie warsztaty tuftingu
            </Link>
          </div>
        </div>
      </section>

      {/* 14 — FAQ */}
      <FaqSection items={faq.slice(0, 8)} />

      {/* 15 — mapa */}
      <MapSection data={siteData} tone="alt" />

      {/* 16 — CTA */}
      <ClosingCta />
    </>
  );
}
