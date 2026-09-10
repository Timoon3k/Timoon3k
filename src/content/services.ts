import type { Service, ProcessStep } from '@/lib/types';

export const services: Service[] = [
  {
    slug: 'strony-wizytowki',
    index: '01',
    title: 'Strony wizytówki',
    tagline: 'Dla firm, które potrzebują wiarygodnego adresu w sieci.',
    description:
      'Kompaktowa strona firmowa, która tłumaczy, czym się zajmujesz, i prowadzi odwiedzającego do kontaktu. Bez zbędnych podstron, za to z dopracowanym projektem i treścią napisaną językiem klienta.',
    deliverables: [
      'Projekt graficzny przygotowany pod Twoją branżę',
      'Do pięciu podstron wraz z formularzem kontaktowym',
      'Podstawowa optymalizacja SEO i dane strukturalne',
      'Panel do samodzielnej edycji treści',
      'Konfiguracja domeny, hostingu i certyfikatu SSL',
    ],
    priceFrom: 1500,
    duration: '7–14 dni',
  },
  {
    slug: 'strony-firmowe',
    index: '02',
    title: 'Rozbudowane strony firmowe',
    tagline: 'Kiedy strona ma realnie sprzedawać, a nie tylko istnieć.',
    description:
      'Wielostronicowy serwis z rozbudowaną ofertą, portfolio, blogiem i przemyślaną architekturą informacji. Projektowany pod pozyskiwanie zapytań, z myślą o rozwoju treści w kolejnych miesiącach.',
    deliverables: [
      'Indywidualny projekt i system komponentów',
      'Struktura podstron ofertowych pod frazy sprzedażowe',
      'Blog i zaplecze contentowe',
      'Rozbudowane SEO techniczne, sitemapa, dane strukturalne',
      'Formularze, integracje i analityka',
    ],
    priceFrom: 3500,
    duration: '14–30 dni',
  },
  {
    slug: 'sklepy-woocommerce',
    index: '03',
    title: 'Sklepy i systemy rezerwacji',
    tagline: 'E-commerce, rezerwacje i dedykowana logika zamówień.',
    description:
      'WooCommerce rozszerzony o funkcje, których nie da się załatwić wtyczką: własne pola zamówień, walidacja warunków oferty, rezerwacje terminów i płatności online. Buduję to kodem, nie stosem dodatków.',
    deliverables: [
      'Konfiguracja sklepu i procesu zakupowego',
      'Dedykowana logika zamówień i walidacja danych',
      'Rezerwacje terminów z kontrolą dostępności',
      'Integracja płatności i statusów zamówień',
      'Optymalizacja wydajności ścieżki zakupowej',
    ],
    priceFrom: 5000,
    duration: 'od 30 dni',
  },
  {
    slug: 'aplikacje-webowe',
    index: '04',
    title: 'Rozwiązania dedykowane',
    tagline: 'Next.js, React i interfejsy budowane od zera.',
    description:
      'Projekty, w których gotowy system jest ograniczeniem: aplikacje webowe, konfiguratory, panele, interaktywne prezentacje i strony z zaawansowaną warstwą wizualną — Three.js, motion design, animacje sterowane przewijaniem.',
    deliverables: [
      'Architektura aplikacji w Next.js i TypeScript',
      'Interfejs zbudowany na własnym systemie komponentów',
      'Warstwa 3D / motion design tam, gdzie ma uzasadnienie',
      'Integracja z headless CMS i API',
      'Wdrożenie produkcyjne i przekazanie dokumentacji',
    ],
    priceFrom: null,
    duration: 'wycena indywidualna',
  },
  {
    slug: 'seo-i-wydajnosc',
    index: '05',
    title: 'SEO i wydajność',
    tagline: 'Strona, którą Google rozumie, a użytkownik ogląda bez czekania.',
    description:
      'Audyt i wdrożenie poprawek: Core Web Vitals, struktura nagłówków, dane strukturalne, linkowanie wewnętrzne, optymalizacja obrazów i eliminacja tego, co niepotrzebnie obciąża wczytywanie.',
    deliverables: [
      'Audyt techniczny i lista priorytetów',
      'Optymalizacja Core Web Vitals (LCP, CLS, INP)',
      'Uporządkowanie struktury nagłówków i metadanych',
      'Dane strukturalne JSON-LD',
      'Raport z wnioskami i dalszymi krokami',
    ],
    priceFrom: null,
    duration: 'wycena indywidualna',
  },
  {
    slug: 'opieka-nad-strona',
    index: '06',
    title: 'Opieka nad stroną',
    tagline: 'Żeby po wdrożeniu nie zostać z tym samemu.',
    description:
      'Stała obsługa techniczna: aktualizacje, kopie zapasowe, monitoring dostępności, drobne zmiany w treści i reagowanie, gdy coś przestaje działać.',
    deliverables: [
      'Aktualizacje systemu i komponentów',
      'Regularne kopie zapasowe',
      'Monitoring dostępności strony',
      'Pula godzin na zmiany w treści i drobne poprawki',
      'Kontakt bezpośredni, bez systemu zgłoszeń',
    ],
    priceFrom: null,
    duration: 'współpraca miesięczna',
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug);

export const processSteps: ProcessStep[] = [
  {
    index: '01',
    title: 'Rozmowa i cel',
    duration: 'dzień 1',
    body: 'Zaczynamy od tego, po co ta strona ma powstać. Kto ma na nią trafiać, jakiej decyzji od tej osoby oczekujesz i co dziś stoi na przeszkodzie. Bez tego reszta jest zgadywaniem.',
  },
  {
    index: '02',
    title: 'Wycena i zakres',
    duration: 'do 24 h',
    body: 'Dostajesz konkretny zakres prac, termin i cenę. Jeśli coś da się zrobić prościej lub taniej bez straty dla efektu — mówię o tym na tym etapie, nie po podpisaniu umowy.',
  },
  {
    index: '03',
    title: 'Struktura i treść',
    duration: '2–5 dni',
    body: 'Układamy architekturę podstron i kolejność informacji. Ustalamy, co znajdzie się na stronie głównej, jak wygląda ścieżka do kontaktu i pod jakie frazy budujemy widoczność.',
  },
  {
    index: '04',
    title: 'Projekt',
    duration: '3–7 dni',
    body: 'Projektuję layout, typografię i system komponentów. Widzisz kierunek wizualny, zanim powstanie pierwsza linijka kodu produkcyjnego, i możesz zgłosić uwagi, gdy zmiany są jeszcze tanie.',
  },
  {
    index: '05',
    title: 'Kod i wdrożenie',
    duration: '5–20 dni',
    body: 'Buduję stronę, podłączam panel do zarządzania treścią, konfiguruję SEO, formularze i analitykę. Testuję na realnych urządzeniach, nie tylko w symulatorze przeglądarki.',
  },
  {
    index: '06',
    title: 'Start i rozwój',
    duration: 'po publikacji',
    body: 'Publikacja, przekazanie dostępów i krótkie szkolenie z panelu. Potem zostaję w kontakcie — do drobnych poprawek albo do kolejnego etapu rozwoju serwisu.',
  },
];
