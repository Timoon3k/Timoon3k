import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  /** Numer sekcji („01", „02"…) — element brandingowy spinający narrację. */
  index?: string;
  eyebrow?: string;
  id?: string;
  tone?: 'page' | 'alt' | 'forest' | 'olive';
  tight?: boolean;
  className?: string;
}

const TONE: Record<NonNullable<SectionProps['tone']>, { bg: string; fg: string }> = {
  page: { bg: 'var(--color-ivory-100)', fg: 'var(--color-graphite-900)' },
  alt: { bg: 'var(--color-ivory-200)', fg: 'var(--color-graphite-900)' },
  forest: { bg: 'var(--color-forest-900)', fg: 'var(--color-ivory-100)' },
  olive: { bg: 'var(--color-olive-700)', fg: 'var(--color-ivory-100)' },
};

export function Section({
  children,
  index,
  eyebrow,
  id,
  tone = 'page',
  tight = false,
  className = '',
}: SectionProps) {
  const { bg, fg } = TONE[tone];
  const dark = tone === 'forest' || tone === 'olive';

  return (
    <section
      id={id}
      className={`section ${tight ? 'section--tight' : ''} ${className}`}
      style={{ background: bg, color: fg }}
    >
      <div className="shell">
        {(index || eyebrow) && (
          <p className={`eyebrow ${dark ? 'eyebrow--light' : ''} mb-6`} data-reveal>
            {index && <span aria-hidden="true">{index}</span>}
            {eyebrow}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
