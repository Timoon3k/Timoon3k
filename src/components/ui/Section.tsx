import type { ReactNode } from 'react';

export function Section({
  children,
  className = '',
  id,
  as: Tag = 'section',
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'section' | 'div' | 'article';
  /** `true` wyłącza standardowy kontener — sekcja sama zarządza szerokością. */
  bleed?: boolean;
}) {
  return (
    <Tag id={id} className={`py-section ${className}`}>
      {bleed ? children : <div className="container-page">{children}</div>}
    </Tag>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      <span aria-hidden className="inline-block h-px w-8 bg-signal/70" />
      {children}
    </p>
  );
}

/**
 * Nagłówek sekcji w układzie asymetrycznym: etykieta w lewej kolumnie,
 * tytuł i lead w szerokiej kolumnie po prawej.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'split',
  headingLevel: Heading = 'h2',
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'split' | 'stack';
  headingLevel?: 'h2' | 'h3';
}) {
  if (align === 'stack') {
    return (
      <header className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading data-split className="mt-6 text-major text-gradient-star">
          {title}
        </Heading>
        {lead ? (
          <p data-reveal className="mt-6 max-w-2xl text-lead text-dim">
            {lead}
          </p>
        ) : null}
      </header>
    );
  }

  return (
    <header className="grid gap-8 md:grid-cols-12 md:gap-10">
      <div className="md:col-span-4 lg:col-span-3">
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <div className="md:col-span-8 lg:col-span-9">
        <Heading data-split className="text-major text-gradient-star">
          {title}
        </Heading>
        {lead ? (
          <p data-reveal className="mt-7 max-w-2xl text-lead text-dim">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  );
}
