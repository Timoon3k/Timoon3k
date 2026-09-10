import { Eyebrow } from '@/components/ui/Section';
import type { ProcessStep } from '@/lib/types';

export default function Process({ steps }: { steps: ProcessStep[] }) {
  return (
    <section className="relative border-t border-hairline py-section">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Kolumna przyklejona — tytuł towarzyszy przewijaniu kroków */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow>Proces</Eyebrow>
              <h2 data-split className="mt-6 text-major text-gradient-star">
                Jak wygląda współpraca
              </h2>
              <p data-reveal className="mt-6 max-w-sm text-dim">
                Sześć etapów, w których wiesz, co się dzieje i na czym stoisz. Bez znikania na dwa
                tygodnie i bez niespodzianek w wycenie.
              </p>
            </div>
          </div>

          <ol data-reveal-group data-stagger="0.1" className="lg:col-span-8">
            {steps.map((step) => (
              <li
                key={step.index}
                data-reveal
                className="group grid gap-3 border-t border-hairline py-8 md:grid-cols-12 md:gap-8"
              >
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-signal/70">
                    {step.index}
                  </span>
                  <h3 className="font-display text-[1.375rem] font-semibold tracking-tight text-star">
                    {step.title}
                  </h3>
                </div>
                <p className="text-dim md:col-span-6">{step.body}</p>
                <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase md:col-span-2 md:text-right">
                  {step.duration}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
