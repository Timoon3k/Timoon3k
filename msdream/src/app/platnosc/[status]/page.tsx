import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { PaymentTracking } from '@/components/booking/PaymentTracking';

/**
 * Strony statusu płatności.
 *
 * HotPay (i Bookero, jeśli obsługuje płatności samodzielnie) przekierowuje
 * tu użytkownika po zakończeniu transakcji. Uwaga: te strony służą wyłącznie
 * do POINFORMOWANIA użytkownika — o tym, czy płatność faktycznie doszła,
 * decyduje wyłącznie podpisane powiadomienie serwer-serwer
 * (`/api/hotpay/notification`).
 *
 * To nie jest szczegół: parametry w adresie zwrotnym może podmienić każdy,
 * kto potrafi edytować URL. Nigdy nie nadajemy uprawnień ani nie wystawiamy
 * dokumentów na podstawie tego, co widzi przeglądarka.
 */

const STATES = {
  sukces: {
    title: 'Płatność przyjęta',
    heading: 'Rezerwacja potwierdzona',
    body: 'Dziękujemy. Potwierdzenie rezerwacji oraz dokument sprzedaży wysyłamy na adres e-mail podany przy rezerwacji. Jeśli wiadomość nie dotrze w ciągu kilkunastu minut, sprawdź folder ze spamem.',
    note: 'Do zobaczenia w stajni. Przyjedź 15 minut przed zajęciami.',
    tone: 'forest' as const,
  },
  oczekujaca: {
    title: 'Płatność w toku',
    heading: 'Czekamy na potwierdzenie',
    body: 'Twoja płatność jest przetwarzana przez bank. To potrafi potrwać od kilku minut do kilku godzin — nie musisz płacić drugi raz.',
    note: 'Gdy tylko otrzymamy potwierdzenie, wyślemy e-mail z rezerwacją i dokumentem sprzedaży.',
    tone: 'olive' as const,
  },
  nieudana: {
    title: 'Płatność nieudana',
    heading: 'Płatność nie doszła do skutku',
    body: 'Transakcja została odrzucona lub przerwana. Środki nie zostały pobrane, a termin nie został zarezerwowany.',
    note: 'Spróbuj ponownie albo zadzwoń — zarezerwujemy termin ręcznie i ustalimy inną formę płatności.',
    tone: 'wool' as const,
  },
} as const;

type StatusKey = keyof typeof STATES;

export function generateStaticParams() {
  return (Object.keys(STATES) as StatusKey[]).map((status) => ({ status }));
}

export async function generateMetadata(props: PageProps<'/platnosc/[status]'>): Promise<Metadata> {
  const { status } = await props.params;
  const state = STATES[status as StatusKey];
  if (!state) return {};

  return buildMetadata({
    title: state.title,
    description: state.body.slice(0, 158),
    path: `/platnosc/${status}`,
    // Strony transakcyjne nie mają czego szukać w indeksie Google.
    noIndex: true,
  });
}

const TONE_STYLES = {
  forest: { background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' },
  olive: { background: 'var(--color-olive-700)', color: 'var(--color-ivory-100)' },
  wool: { background: 'var(--color-wool-700)', color: 'var(--color-ivory-100)' },
} as const;

export default async function PaymentStatusPage(props: PageProps<'/platnosc/[status]'>) {
  const { status } = await props.params;
  const state = STATES[status as StatusKey];
  if (!state) notFound();

  return (
    <section className="section" style={TONE_STYLES[state.tone]}>
      {status === 'sukces' && <PaymentTracking />}

      <div className="shell pt-16">
        <div className="grid-editorial gap-y-8">
          <div className="col-span-7">
            <p className="eyebrow eyebrow--light">{state.title}</p>

            <h1 className="mt-7" style={{ fontSize: 'var(--text-display)' }}>
              {state.heading}
            </h1>

            <p className="mt-7 max-w-[48ch]" style={{ fontSize: 'var(--text-lead)', color: 'var(--color-sand-400)' }}>
              {state.body}
            </p>

            <p className="mt-5 max-w-[48ch] text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
              {state.note}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {status === 'nieudana' ? (
                <>
                  <Link href="/rezerwacja" className="btn btn--brass">Spróbuj ponownie</Link>
                  <Link href="/kontakt" className="btn btn--ghost-light">Skontaktuj się z nami</Link>
                </>
              ) : (
                <>
                  <Link href="/" className="btn btn--brass">Wróć na stronę główną</Link>
                  <Link href="/poradnik/jak-przygotowac-sie-do-pierwszej-lekcji" className="btn btn--ghost-light">
                    Jak się przygotować
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
