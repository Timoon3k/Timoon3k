import type { Project } from '@/lib/types';

/**
 * Treść startowa (seed). Po podpięciu Sanity te dane służą jako fallback
 * dla środowisk bez skonfigurowanego CMS-u (np. lokalny dev bez kluczy).
 *
 * Grafiki `cover`/`gallery` to autorskie plansze kierunkowe. Po wgraniu
 * właściwych zrzutów ekranu w Sanity (Realizacje → Okładka / Galeria)
 * podmieniają się automatycznie.
 */
export const projects: Project[] = [
  {
    slug: 'msdream',
    client: 'MS Dream',
    domain: 'msdream.pl',
    url: 'https://msdream.pl',
    title: 'Szkoła jazdy konnej z rezerwacją i płatnością online',
    summary:
      'Strona ośrodka jeździeckiego z autorskim systemem rezerwacji terminów, płatnościami online i indywidualnym designem.',
    role: 'Projekt, kod, wdrożenie, rozwój',
    category: 'Strona usługowa + system rezerwacji',
    tags: ['Rezerwacje online', 'Płatności', 'Indywidualny design'],
    stack: ['WordPress', 'PHP', 'JavaScript', 'System rezerwacji', 'Bramka płatnicza', 'SEO'],
    accent: '#E0A458',
    cover: {
      src: '/projects/msdream-cover.svg',
      alt: 'Plansza kierunkowa realizacji MS Dream — strona szkoły jazdy konnej',
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: '/projects/msdream-desktop.svg',
        alt: 'Widok desktopowy strony MS Dream z sekcją rezerwacji',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/msdream-mobile.svg',
        alt: 'Widok mobilny strony MS Dream — kalendarz wyboru terminu',
        width: 800,
        height: 1400,
      },
    ],
    context:
      'Ośrodek jeździecki prowadzi zajęcia dla dzieci, młodzieży i dorosłych. Cała organizacja zapisów opierała się na telefonach i wiadomościach, a każdy nowy termin oznaczał ręczne pilnowanie, kto i kiedy przyjdzie.',
    challenge: {
      heading: 'Wyzwanie',
      body: [
        'Największym problemem nie była sama strona, tylko to, co działo się po jej odwiedzeniu. Klient dzwonił, pytał o wolne terminy, umawiał się ustnie — a obsługa musiała prowadzić grafik równolegle w kilku miejscach. Część rezerwacji przepadała po prostu dlatego, że nikt nie odebrał telefonu w środku zajęć.',
        'Do tego dochodziła kwestia wizerunku. Jeździectwo jest usługą, którą wybiera się emocjonalnie — strona musiała oddawać charakter miejsca, a nie wyglądać jak kolejny szablon dla „firmy usługowej”.',
        'Trzeci wątek to płatności. Bez zaliczki część zapisanych osób nie pojawiała się na zajęciach, co blokowało terminy realnie zainteresowanym klientom.',
      ],
    },
    solution: {
      heading: 'Rozwiązanie',
      body: [
        'Zaprojektowałem stronę wokół jednego celu: od wejścia do potwierdzonej rezerwacji ma być jak najkrócej. Kalendarz dostępnych terminów jest dostępny bezpośrednio z nawigacji i z każdej sekcji ofertowej, a formularz zbiera tylko te dane, które są faktycznie potrzebne do zapisu.',
        'System rezerwacji pilnuje dostępności — zajęte godziny znikają z kalendarza, a limity miejsc są kontrolowane po stronie serwera, nie tylko w interfejsie. Dzięki temu nie da się zapisać dwóch osób na ten sam slot przez odświeżenie strony w dwóch kartach.',
        'Płatność online zamyka proces. Po opłaceniu zaliczki klient dostaje potwierdzenie, a ośrodek widzi rezerwację jako opłaconą — bez ręcznego odhaczania.',
        'Warstwa wizualna została zbudowana indywidualnie: fotografia w dużych kadrach, spokojna typografia i ciepła paleta zamiast agresywnych banerów sprzedażowych.',
      ],
    },
    features: [
      {
        title: 'Kalendarz dostępności',
        body: 'Terminy zajęć z kontrolą limitu miejsc i blokadą kolizji po stronie serwera.',
      },
      {
        title: 'Płatność online',
        body: 'Zaliczka opłacana przy rezerwacji, z automatycznym oznaczeniem statusu zamówienia.',
      },
      {
        title: 'Panel dla ośrodka',
        body: 'Podgląd zapisów, edycja terminów i ofert bez kontaktu z programistą.',
      },
      {
        title: 'Autorski layout',
        body: 'Projekt graficzny przygotowany od zera pod charakter miejsca, nie na gotowym motywie.',
      },
      {
        title: 'Sekcje ofertowe',
        body: 'Rodzaje zajęć, cennik i informacje organizacyjne opisane językiem klienta, nie branżowym.',
      },
      {
        title: 'Responsywność',
        body: 'Wybór terminu zaprojektowany osobno pod ekran telefonu — bez pomniejszania widoku desktopowego.',
      },
    ],
    outcome: [
      'Zapis na zajęcia odbywa się bez udziału obsługi — również poza godzinami pracy ośrodka.',
      'Zaliczka pobierana przy rezerwacji ogranicza nieodwołane nieobecności.',
      'Grafik zajęć prowadzony jest w jednym miejscu, zamiast w kilku równoległych notatkach.',
      'Ośrodek samodzielnie zarządza terminami i treścią oferty.',
    ],
    featured: true,
    seo: {
      title: 'MS Dream — case study: strona szkoły jazdy konnej z rezerwacją online',
      description:
        'Jak powstała strona ośrodka jeździeckiego MS Dream: system rezerwacji terminów, płatności online i indywidualny projekt graficzny. Case study realizacji.',
    },
  },
  {
    slug: 'weekendowe-loty',
    client: 'Weekendowe Loty',
    domain: 'weekendoweloty.pl',
    url: 'https://weekendoweloty.pl',
    title: 'Sklep WooCommerce z rezerwacjami i dedykowaną logiką zamówień',
    summary:
      'Rozbudowany sklep oparty o WooCommerce, w którym zamówienie to nie paczka, tylko termin, uczestnicy i zestaw warunków do sprawdzenia.',
    role: 'Projekt, kod, logika zamówień, wdrożenie',
    category: 'E-commerce / WooCommerce',
    tags: ['WooCommerce', 'Rezerwacje', 'Płatności online'],
    stack: ['WordPress', 'WooCommerce', 'PHP', 'JavaScript', 'Bramka płatnicza', 'Wydajność'],
    accent: '#5CE1FF',
    cover: {
      src: '/projects/weekendowe-loty-cover.svg',
      alt: 'Plansza kierunkowa realizacji Weekendowe Loty — sklep rezerwacyjny WooCommerce',
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: '/projects/weekendowe-loty-desktop.svg',
        alt: 'Widok desktopowy sklepu Weekendowe Loty — karta oferty',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/weekendowe-loty-mobile.svg',
        alt: 'Widok mobilny sklepu Weekendowe Loty — koszyk i podsumowanie zamówienia',
        width: 800,
        height: 1400,
      },
    ],
    context:
      'Projekt e-commerce, w którym standardowy sklep nie wystarcza. Produktem nie jest przedmiot wysyłany kurierem, tylko rezerwacja z konkretnym terminem, liczbą uczestników i danymi, które trzeba zweryfikować przed potwierdzeniem.',
    challenge: {
      heading: 'Wyzwanie',
      body: [
        'WooCommerce w domyślnej postaci zakłada prosty schemat: produkt, koszyk, wysyłka. Tutaj każdy z tych etapów wymagał innej logiki. Zamówienie musiało nieść ze sobą dodatkowe dane, a checkout — pytać o rzeczy, których zwykły sklep nigdy nie potrzebuje.',
        'Druga trudność to walidacja. Część zamówień nie może zostać przyjęta, jeśli dane nie spełniają warunków oferty. Sprawdzanie tego dopiero po opłaceniu oznaczałoby zwroty i tłumaczenia — więc walidacja musiała działać wcześniej i po obu stronach: w przeglądarce i na serwerze.',
        'Trzecia rzecz: sklep obudowany wtyczkami zaczyna działać wolno. Przy rezerwacjach każda sekunda opóźnienia na checkoucie to realna szansa na porzucony koszyk.',
      ],
    },
    solution: {
      heading: 'Rozwiązanie',
      body: [
        'Zamiast doklejać kolejne wtyczki, rozszerzyłem WooCommerce dedykowanym kodem. Zamówienie zostało wzbogacone o własne pola i reguły, które przechodzą przez cały proces — od karty produktu, przez koszyk, po podsumowanie w panelu administracyjnym.',
        'Walidacja działa dwustopniowo. W przeglądarce klient dostaje natychmiastową informację o błędzie, zanim przejdzie dalej. Na serwerze te same reguły są sprawdzane ponownie, więc zamówienie niezgodne z warunkami nie zostanie przyjęte nawet przy próbie ominięcia interfejsu.',
        'Checkout został uproszczony do niezbędnego minimum i zaprojektowany osobno pod telefon — z dużymi polami, czytelnym podsumowaniem kosztów i widocznym stanem procesu.',
        'Warstwa wydajnościowa: ograniczenie liczby wtyczek, kontrola tego, co ładuje się na stronach transakcyjnych, i optymalizacja obrazów. Sklep miał być szybki mimo rozbudowanej logiki.',
      ],
    },
    features: [
      {
        title: 'Rezerwacja jako produkt',
        body: 'Termin, liczba uczestników i dane dodatkowe przenoszone przez cały proces zakupowy.',
      },
      {
        title: 'Dedykowana logika zamówień',
        body: 'Własne reguły rozszerzające WooCommerce zamiast stosu wtyczek robiących „prawie to”.',
      },
      {
        title: 'Podwójna walidacja',
        body: 'Sprawdzanie danych w przeglądarce i ponownie po stronie serwera przed przyjęciem zamówienia.',
      },
      {
        title: 'Płatności online',
        body: 'Integracja bramki płatniczej ze statusami zamówień i potwierdzeniami dla klienta.',
      },
      {
        title: 'Checkout mobilny',
        body: 'Osobno zaprojektowana ścieżka zakupowa na telefonie, nie zmniejszona wersja desktopu.',
      },
      {
        title: 'Panel zamówień',
        body: 'Komplet danych rezerwacji widoczny w jednym miejscu w panelu WordPressa.',
      },
    ],
    outcome: [
      'Zamówienia trafiają do systemu kompletne — bez ręcznego dopytywania klienta o brakujące dane.',
      'Warunki oferty są egzekwowane automatycznie, także przy próbie ominięcia formularza.',
      'Obsługa zamówień odbywa się w panelu WordPressa, bez dodatkowych narzędzi.',
      'Sklep pozostał rozwijalny — kolejne typy ofert dokłada się bez przebudowy logiki.',
    ],
    featured: true,
    seo: {
      title: 'Weekendowe Loty — case study: sklep WooCommerce z rezerwacjami',
      description:
        'Rozbudowany sklep WooCommerce z rezerwacjami terminów, płatnościami online i dedykowaną logiką zamówień. Zobacz, jak został zaprojektowany i zbudowany.',
    },
  },
  {
    slug: 'lmajewski',
    client: 'Ł. Majewski',
    domain: 'lmajewski.pl',
    url: 'https://lmajewski.pl',
    title: 'Portfolio fotografa — galeria, w której liczy się tylko zdjęcie',
    summary:
      'Minimalistyczne portfolio fotograficzne z galerią, lightboxem i płynnymi animacjami, zbudowane tak, by interfejs nie konkurował ze zdjęciami.',
    role: 'Projekt, kod, wdrożenie',
    category: 'Portfolio / strona wizytówka',
    tags: ['Galeria', 'Lightbox', 'Motion design'],
    stack: ['WordPress', 'JavaScript', 'CSS', 'Optymalizacja obrazów', 'SEO'],
    accent: '#C8CDD8',
    cover: {
      src: '/projects/lmajewski-cover.svg',
      alt: 'Plansza kierunkowa realizacji lmajewski.pl — portfolio fotografa',
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: '/projects/lmajewski-desktop.svg',
        alt: 'Widok desktopowy portfolio fotograficznego — siatka galerii',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/lmajewski-mobile.svg',
        alt: 'Widok mobilny portfolio fotograficznego — pojedyncze zdjęcie w lightboxie',
        width: 800,
        height: 1400,
      },
    ],
    context:
      'Fotograf potrzebował miejsca, w którym prezentuje prace w pełnej jakości — bez kompresji i kadrowania narzucanego przez media społecznościowe.',
    challenge: {
      heading: 'Wyzwanie',
      body: [
        'Portfolio fotograficzne ma sprzeczne wymagania. Zdjęcia muszą wyglądać znakomicie, czyli być duże i ostre. Jednocześnie strona nie może się przez to ładować w nieskończoność — a fotografowie rzadko wgrywają pliki przygotowane pod web.',
        'Drugi problem to design. Każdy dodatkowy element interfejsu — ramka, cień, kolorowy przycisk — odbiera uwagę zdjęciu. Strona musiała być zaprojektowana tak, żeby jej nie było widać.',
        'Trzeci: przeglądanie. Kliknięcie w miniaturę powinno otwierać zdjęcie natychmiast i pozwalać przechodzić dalej bez wracania do siatki.',
      ],
    },
    solution: {
      heading: 'Rozwiązanie',
      body: [
        'Layout oparłem na siatce o zmiennym rytmie — zdjęcia poziome i pionowe układają się naturalnie, bez przycinania kadru do jednego formatu. Interfejs ograniczony jest do typografii i odstępów.',
        'Obrazy serwowane są w rozmiarach dopasowanych do ekranu, w nowoczesnych formatach i z ładowaniem odroczonym poza pierwszym widokiem. Każde zdjęcie ma zarezerwowane proporcje, więc siatka nie „skacze” podczas wczytywania.',
        'Lightbox obsługuje klawiaturę i gesty, otwiera się płynnie i utrzymuje kontekst — po zamknięciu wracasz dokładnie tam, gdzie byłeś.',
        'Animacje są celowo powściągliwe: miękkie wejścia przy przewijaniu i delikatne przejścia w galerii. Nic, co odciągałoby wzrok od fotografii.',
      ],
    },
    features: [
      {
        title: 'Siatka o zmiennym rytmie',
        body: 'Układ dopasowany do proporcji zdjęć zamiast wymuszania jednego formatu.',
      },
      {
        title: 'Lightbox',
        body: 'Pełnoekranowy podgląd z obsługą klawiatury, gestów i nawigacji między kadrami.',
      },
      {
        title: 'Optymalizacja obrazów',
        body: 'Warianty rozmiarowe, nowoczesne formaty i lazy loading poza pierwszym ekranem.',
      },
      {
        title: 'Zero layout shiftu',
        body: 'Zarezerwowane proporcje kadrów — galeria nie przeskakuje podczas ładowania.',
      },
      {
        title: 'Powściągliwy motion',
        body: 'Płynne wejścia sekcji i przejścia galerii, bez efektów przyciągających uwagę.',
      },
      {
        title: 'Samodzielna aktualizacja',
        body: 'Dodanie nowej sesji to wgranie zdjęć w panelu — bez kontaktu z programistą.',
      },
    ],
    outcome: [
      'Prace prezentowane są w jakości, której nie da się osiągnąć w mediach społecznościowych.',
      'Galeria pozostaje szybka mimo dużych zdjęć.',
      'Fotograf samodzielnie dokłada kolejne sesje.',
      'Strona działa jako stały punkt odniesienia w kontakcie z klientami.',
    ],
    featured: true,
    seo: {
      title: 'lmajewski.pl — case study: portfolio fotografa z galerią i lightboxem',
      description:
        'Minimalistyczne portfolio fotograficzne: galeria o zmiennym rytmie, lightbox, optymalizacja obrazów i powściągliwe animacje. Case study realizacji.',
    },
  },
  {
    slug: 'damian-cebula-serwis',
    client: 'Damian Cebula Serwis',
    domain: 'damiancebula-serwis.pl',
    url: 'https://damiancebula-serwis.pl',
    title: 'Strona lokalnego serwisu AGD nastawiona na telefon od klienta',
    summary:
      'Wizytówka firmy serwisowej zaprojektowana pod jeden cel — żeby osoba szukająca naprawy w Google zadzwoniła w kilkanaście sekund.',
    role: 'Projekt, kod, Local SEO, wdrożenie',
    category: 'Strona lokalna / Local SEO',
    tags: ['Local SEO', 'Konwersja', 'Strona wizytówka'],
    stack: ['WordPress', 'CSS', 'Local SEO', 'Dane strukturalne', 'Wydajność'],
    accent: '#FF7A4D',
    cover: {
      src: '/projects/damian-cebula-serwis-cover.svg',
      alt: 'Plansza kierunkowa realizacji damiancebula-serwis.pl — strona serwisu AGD',
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: '/projects/damian-cebula-serwis-desktop.svg',
        alt: 'Widok desktopowy strony serwisu AGD z sekcją usług',
        width: 1600,
        height: 1000,
      },
      {
        src: '/projects/damian-cebula-serwis-mobile.svg',
        alt: 'Widok mobilny strony serwisu AGD z przyciskiem połączenia',
        width: 800,
        height: 1400,
      },
    ],
    context:
      'Serwis sprzętu AGD działa lokalnie. Klient trafia tu w konkretnym momencie: coś się zepsuło, jest zdenerwowany i szuka kogoś, kto przyjedzie najszybciej.',
    challenge: {
      heading: 'Wyzwanie',
      body: [
        'To nie jest strona, którą się przegląda. Użytkownik ma bardzo krótką cierpliwość i jedno pytanie w głowie: czy ta firma naprawi mój sprzęt i jak szybko. Wszystko, co opóźnia odpowiedź, działa na niekorzyść.',
        'Znaczna część ruchu przychodzi z telefonu, często przy słabym zasięgu. Ciężka strona oznacza po prostu utraconego klienta — wróci do wyników wyszukiwania i kliknie w konkurencję.',
        'Do tego dochodzi widoczność. Firma musiała być znajdowana na zapytania łączące usługę z lokalizacją, a nie tylko na własną nazwę.',
      ],
    },
    solution: {
      heading: 'Rozwiązanie',
      body: [
        'Strona została zbudowana wokół kontaktu. Numer telefonu jest widoczny natychmiast i pozostaje dostępny podczas przewijania — na telefonie jako element stały, klikalny jednym kciukiem.',
        'Treść odpowiada na realne pytania w kolejności, w jakiej się pojawiają: co naprawiamy, gdzie dojeżdżamy, jak szybko, ile to kosztuje. Bez rozbudowanych opisów „o firmie” na starcie.',
        'Warstwa Local SEO: struktura nagłówków oparta na usłudze i lokalizacji, dane strukturalne opisujące firmę usługową, obszar działania i dane kontaktowe, spójne z wizytówką Google.',
        'Wydajność potraktowałem jako element konwersji, nie jako techniczny dodatek — lekki kod, minimum skryptów, zoptymalizowane obrazy.',
      ],
    },
    features: [
      {
        title: 'Kontakt zawsze pod ręką',
        body: 'Stały, klikalny numer telefonu na mobile i wyraźne CTA w każdej sekcji.',
      },
      {
        title: 'Treść pod intencję',
        body: 'Kolejność informacji dopasowana do pytań, które klient zadaje w pierwszej minucie.',
      },
      {
        title: 'Local SEO',
        body: 'Struktura pod frazy usługowo-lokalne i spójność danych z wizytówką Google.',
      },
      {
        title: 'Dane strukturalne',
        body: 'Opis firmy usługowej, obszaru działania i kontaktu w formacie zrozumiałym dla wyszukiwarki.',
      },
      {
        title: 'Lekka strona',
        body: 'Minimum skryptów i zoptymalizowane obrazy — szybkie wczytanie także na słabym zasięgu.',
      },
      {
        title: 'Zakres usług',
        body: 'Czytelny podział napraw i obsługiwanych marek zamiast jednego długiego akapitu.',
      },
    ],
    outcome: [
      'Ścieżka od wejścia na stronę do połączenia telefonicznego skrócona do jednego kliknięcia.',
      'Strona odpowiada na pytania klienta, zanim ten zdąży wrócić do wyników wyszukiwania.',
      'Firma jest opisana dla wyszukiwarki w sposób spójny z wizytówką Google.',
      'Lekki kod utrzymuje szybkie ładowanie na urządzeniach mobilnych.',
    ],
    featured: true,
    seo: {
      title: 'Damian Cebula Serwis — case study: strona lokalnej firmy usługowej',
      description:
        'Strona serwisu AGD zbudowana pod Local SEO i kontakt telefoniczny. Zobacz założenia projektu, rozwiązania i efekty wdrożenia.',
    },
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);
