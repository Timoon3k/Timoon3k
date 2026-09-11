import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import type { PhotoRef } from '@/lib/types';

/**
 * Nagłówek lokalnej strony docelowej (landing SEO).
 *
 * Świadomie inny niż hero strony głównej: mniejsza skala, treść od razu
 * merytoryczna. Użytkownik trafia tu z konkretnego zapytania w Google
 * i chce odpowiedzi, nie kolejnego wprowadzenia do marki.
 */
export function LandingHero({
  eyebrow,
  title,
  highlight,
  lead,
  photo,
  primaryHref = '/rezerwacja',
  primaryLabel = 'Zarezerwuj zajęcia',
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
  photo: PhotoRef;
  primaryHref?: string;
  primaryLabel?: string;
}) {
  return (
    <section className="section section--tight">
      <div className="shell">
        <div className="grid-editorial items-center gap-y-10">
          <div className="col-span-6">
            <p className="eyebrow" data-reveal>{eyebrow}</p>

            <h1 className="mt-6" style={{ fontSize: 'var(--text-display)' }} data-reveal>
              {title}{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}>{highlight}</span>
            </h1>

            <p
              className="mt-7 max-w-[48ch]"
              style={{ fontSize: 'var(--text-lead)', color: 'var(--color-graphite-700)' }}
              data-reveal
              data-reveal-delay="0.08"
            >
              {lead}
            </p>

            <div className="mt-9 flex flex-wrap gap-3" data-reveal data-reveal-delay="0.14">
              <Link href={primaryHref} className="btn">{primaryLabel}</Link>
              <Link href="/kontakt" className="btn btn--ghost">Zadaj pytanie</Link>
            </div>
          </div>

          <div className="col-span-5 lg:col-start-8" data-reveal data-reveal-delay="0.1">
            <Photo photo={photo} sizes="(max-width: 899px) 100vw, 38vw" quality={82} priority />
          </div>
        </div>
      </div>
    </section>
  );
}
