import Link from 'next/link';

/**
 * Duże domykające CTA.
 * Pełnoekranowa typografia zamiast paska z przyciskiem — ostatni ekran
 * przed stopką ma ciężar wizualny porównywalny z hero.
 */
export function ClosingCta({
  title = 'Zacznijmy od jednej jazdy',
  body = 'Nie musisz od razu decydować się na pakiet ani kupować sprzętu. Wystarczą jedne zajęcia, żeby wiedzieć, czy to jest dla Ciebie.',
  primaryHref = '/rezerwacja',
  primaryLabel = 'Zarezerwuj termin',
  secondaryHref = '/kontakt',
  secondaryLabel = 'Zadaj pytanie',
}: {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section
      className="section"
      style={{ background: 'var(--color-brass-500)', color: 'var(--color-forest-950)' }}
    >
      <div className="shell">
        <div className="grid-editorial items-end gap-y-9">
          <div className="col-span-8">
            <h2 style={{ fontSize: 'var(--text-display)' }} data-reveal>
              {title}
            </h2>
            <p className="mt-6 max-w-[46ch]" style={{ fontSize: 'var(--text-lead)' }} data-reveal data-reveal-delay="0.08">
              {body}
            </p>
          </div>
          <div className="col-span-4 flex flex-wrap gap-3 lg:justify-end" data-reveal data-reveal-delay="0.14">
            <Link
              href={primaryHref}
              className="btn"
              style={{ ['--btn-bg' as string]: 'var(--color-forest-950)', ['--btn-fg' as string]: 'var(--color-ivory-100)' }}
            >
              {primaryLabel}
            </Link>
            <Link
              href={secondaryHref}
              className="btn btn--ghost"
              style={{ borderColor: 'color-mix(in oklab, var(--color-forest-950) 35%, transparent)' }}
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
