import { CtaLink } from '@/components/ui/Cta';
import { site } from '@/lib/site';

/**
 * Domykająca sekcja CTA używana na końcu większości podstron.
 * `variant="compact"` stosujemy tam, gdzie nad nią stoi już mocny blok treści.
 */
export default function ContactCta({
  title = 'Zróbmy stronę, która pracuje na Twój biznes',
  lead = 'Opisz projekt w kilku zdaniach — odeślę konkretny zakres, termin i wycenę. Zwykle w ciągu 24 godzin.',
  variant = 'default',
}: {
  title?: string;
  lead?: string;
  variant?: 'default' | 'compact';
}) {
  return (
    <section className="relative overflow-hidden border-t border-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(92,225,255,0.11),transparent_70%)]"
      />
      <div
        className={`container-page relative ${variant === 'compact' ? 'py-20 md:py-24' : 'py-section'}`}
      >
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <h2 data-split className="text-giant text-gradient-star">
              {title}
            </h2>
          </div>
          <div className="md:col-span-5 md:pb-3">
            <p data-reveal className="text-lead text-dim">
              {lead}
            </p>
            <div data-reveal className="mt-9 flex flex-wrap items-center gap-4">
              <CtaLink href="/kontakt#formularz">Rozpocznij projekt</CtaLink>
              <a
                href={`mailto:${site.email}`}
                className="link-underline font-mono text-[0.75rem] tracking-[0.12em] text-dim uppercase transition-colors hover:text-signal"
              >
                lub napisz e-mail
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
