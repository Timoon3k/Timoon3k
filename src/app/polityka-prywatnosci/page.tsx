import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Eyebrow } from '@/components/ui/Section';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Polityka prywatności',
  description:
    'Informacja o tym, jakie dane zbiera ta witryna, w jakim celu są przetwarzane, jak długo są przechowywane i jakie prawa przysługują osobom, których dotyczą.',
  path: '/polityka-prywatnosci',
});

const sections = [
  {
    heading: 'Administrator danych',
    paragraphs: [
      `Administratorem danych osobowych przekazanych za pośrednictwem tej witryny jest ${site.name}, prowadzący działalność w zakresie projektowania i tworzenia stron internetowych, z siedzibą w miejscowości ${site.city} (województwo ${site.region}).`,
      `Kontakt w sprawach dotyczących danych osobowych: ${site.email}.`,
    ],
  },
  {
    heading: 'Zakres zbieranych danych',
    paragraphs: [
      'Za pośrednictwem formularza kontaktowego zbierane są: imię, adres e-mail, opcjonalnie numer telefonu, wybrany typ projektu, orientacyjny budżet oraz treść wiadomości.',
      'Dodatkowo, na potrzeby ochrony formularza przed automatycznym spamem, przetwarzany jest tymczasowo adres IP osoby wysyłającej zgłoszenie. Dane te służą wyłącznie ograniczeniu liczby zgłoszeń z jednego adresu i nie są łączone z pozostałymi informacjami.',
    ],
  },
  {
    heading: 'Cel i podstawa prawna przetwarzania',
    paragraphs: [
      'Dane przekazane w formularzu przetwarzane są w celu udzielenia odpowiedzi na zapytanie oraz przygotowania oferty — na podstawie zgody osoby, której dane dotyczą (art. 6 ust. 1 lit. a RODO) oraz w celu podjęcia działań przed zawarciem umowy na żądanie tej osoby (art. 6 ust. 1 lit. b RODO).',
      'Przetwarzanie adresu IP w celu ochrony formularza odbywa się na podstawie prawnie uzasadnionego interesu administratora, jakim jest zapewnienie bezpieczeństwa witryny (art. 6 ust. 1 lit. f RODO).',
    ],
  },
  {
    heading: 'Okres przechowywania',
    paragraphs: [
      'Korespondencja związana z zapytaniem ofertowym przechowywana jest przez czas niezbędny do jego obsługi, a następnie przez okres wynikający z przepisów o przedawnieniu roszczeń — nie dłużej niż jest to konieczne.',
      'Jeżeli kontakt nie zakończy się nawiązaniem współpracy, dane usuwane są po zakończeniu korespondencji, chyba że osoba zainteresowana wyrazi wolę pozostania w kontakcie.',
    ],
  },
  {
    heading: 'Odbiorcy danych',
    paragraphs: [
      'Wiadomości z formularza dostarczane są za pośrednictwem zewnętrznego dostawcy usługi wysyłki poczty elektronicznej, działającego jako podmiot przetwarzający na podstawie umowy powierzenia.',
      'Witryna hostowana jest na infrastrukturze dostawcy usług hostingowych, który może przetwarzać dane techniczne niezbędne do świadczenia usługi.',
      'Dane nie są sprzedawane ani udostępniane podmiotom trzecim w celach marketingowych.',
    ],
  },
  {
    heading: 'Pliki cookie i analityka',
    paragraphs: [
      'Witryna nie korzysta z plików cookie służących śledzeniu ani profilowaniu użytkowników. Nie są na niej osadzone skrypty reklamowe ani piksele mediów społecznościowych.',
      'W przeglądarce mogą być zapisywane wyłącznie dane techniczne niezbędne do prawidłowego działania strony.',
      'W razie wdrożenia w przyszłości narzędzi analitycznych, informacja o tym zostanie zamieszczona w niniejszym dokumencie wraz z opisem zakresu zbieranych danych.',
    ],
  },
  {
    heading: 'Prawa osoby, której dane dotyczą',
    paragraphs: [
      'Przysługuje Ci prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, prawo do przenoszenia danych, prawo wniesienia sprzeciwu wobec przetwarzania oraz prawo do cofnięcia zgody w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem.',
      `W celu skorzystania z powyższych praw wystarczy wiadomość na adres ${site.email}.`,
      'Przysługuje Ci również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeżeli uznasz, że przetwarzanie Twoich danych narusza przepisy o ochronie danych osobowych.',
    ],
  },
  {
    heading: 'Dobrowolność podania danych',
    paragraphs: [
      'Podanie danych w formularzu kontaktowym jest dobrowolne, jednak niezbędne do udzielenia odpowiedzi na zapytanie. Bez adresu e-mail nie ma technicznej możliwości przesłania odpowiedzi.',
    ],
  },
  {
    heading: 'Zmiany polityki',
    paragraphs: [
      'Niniejszy dokument może być aktualizowany w przypadku zmiany zakresu przetwarzanych danych lub wykorzystywanych narzędzi. Aktualna wersja jest zawsze dostępna pod tym adresem.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Polityka prywatności', href: '/polityka-prywatnosci' },
        ]}
      />

      <section className="container-page pt-14 pb-section md:pt-20">
        <Eyebrow>Dokument prawny</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[16ch] text-major text-gradient-star">
          Polityka prywatności
        </h1>
        <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
          Krótko i bez prawniczego żargonu tam, gdzie to możliwe: jakie dane zbiera ta strona, po co
          i co możesz z nimi zrobić.
        </p>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <nav aria-label="Spis treści" className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-32">
              <h2 className="eyebrow">Spis treści</h2>
              <ol className="mt-5 space-y-2.5">
                {sections.map((section, index) => (
                  <li key={section.heading}>
                    <a
                      href={`#sekcja-${index + 1}`}
                      className="link-underline text-sm text-dim transition-colors hover:text-signal"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="space-y-12 md:col-span-8 lg:col-span-7">
            {sections.map((section, index) => (
              <section key={section.heading} id={`sekcja-${index + 1}`} className="scroll-mt-28">
                <h2 className="font-display text-headline font-semibold tracking-tight text-star">
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="leading-relaxed text-dim">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <p className="border-t border-hairline pt-8 text-sm text-faint">
              Masz pytanie dotyczące przetwarzania danych? Napisz przez{' '}
              <Link href="/kontakt" className="link-underline text-signal">
                formularz kontaktowy
              </Link>{' '}
              lub bezpośrednio na adres e-mail podany powyżej.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
