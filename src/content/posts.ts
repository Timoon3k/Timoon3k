import type { Post } from '@/lib/types';

/**
 * Wpisy startowe. Docelowo blog prowadzony jest z poziomu Sanity —
 * te teksty stanowią bazę merytoryczną i fallback dla środowisk bez CMS-u.
 */
export const posts: Post[] = [
  {
    slug: 'ile-kosztuje-strona-internetowa',
    title: 'Ile kosztuje strona internetowa i od czego naprawdę zależy cena',
    excerpt:
      'Rozbicie wyceny na części pierwsze: co kupujesz za 1500 zł, co za 5000 zł i dlaczego dwie pozornie podobne strony potrafią różnić się ceną trzykrotnie.',
    publishedAt: '2026-02-18',
    readingTime: 8,
    category: 'Biznes',
    seo: {
      title: 'Ile kosztuje strona internetowa? Realne widełki i co wpływa na cenę',
      description:
        'Od czego zależy cena strony internetowej: zakres, projekt, funkcje, treść i utrzymanie. Praktyczne widełki cenowe i wskazówki, na czym nie warto oszczędzać.',
    },
    body: `Pytanie o cenę pada zwykle w pierwszej wiadomości. To zrozumiałe — tylko odpowiedź „to zależy” niczego nie wyjaśnia. Poniżej rozkładam wycenę na elementy, które faktycznie decydują o kwocie.

## Co składa się na cenę

Strona internetowa to nie jeden produkt, tylko kilka prac wykonanych w określonej kolejności. Każda z nich może być tania albo droga.

- **Projekt graficzny.** Gotowy motyw kosztuje kilkadziesiąt złotych. Indywidualny projekt to kilkanaście–kilkadziesiąt godzin pracy. Różnica w efekcie jest widoczna od pierwszej sekundy.
- **Liczba i typ podstron.** Pięć podstron informacyjnych to inna praca niż dwadzieścia podstron ofertowych z osobną strukturą.
- **Funkcje.** Formularz kontaktowy jest standardem. Rezerwacja terminu z kontrolą dostępności, płatność online czy konfigurator produktu to osobne moduły, które trzeba zaprojektować, zaprogramować i przetestować.
- **Treść.** Jeżeli masz gotowe teksty i zdjęcia, projekt idzie szybciej. Jeżeli trzeba je stworzyć, to osobny koszt.
- **SEO.** Podstawowa optymalizacja techniczna powinna być w cenie każdej strony. Rozbudowana strategia treści to już oddzielna usługa.

## Realne widełki

Poniższe kwoty dotyczą rynku freelancerskiego w Polsce i mojej własnej praktyki.

**Od 1500 zł — strona wizytówka.** Kilka podstron, indywidualny projekt, formularz, podstawowe SEO, panel do edycji treści. Wystarczy jednoosobowej firmie usługowej, która potrzebuje wiarygodnego adresu w sieci i telefonów od klientów.

**Od 3500 zł — rozbudowany serwis firmowy.** Rozbudowana oferta podzielona na podstrony, portfolio, blog, przemyślana architektura informacji i struktura pod frazy sprzedażowe. To wybór firmy, która traktuje stronę jako kanał pozyskiwania klientów, a nie wizytówkę.

**Od 5000 zł — sklep lub system rezerwacji.** Proces zakupowy, płatności, logika zamówień, integracje. Tutaj rozpiętość jest największa, bo o koszcie decyduje to, jak bardzo sklep odbiega od standardu.

## Dlaczego dwie podobne strony różnią się ceną

Bo „podobne” dotyczy zwykle tylko tego, co widać na zrzucie ekranu. Poniżej powierzchni różnice bywają zasadnicze: czy strona ładuje się w sekundę czy w pięć, czy da się ją samodzielnie edytować, czy da się ją rozbudować bez przepisywania od zera, czy przetrwa aktualizację systemu.

Najdroższa strona to ta, którą trzeba zrobić dwa razy.

## Na czym nie warto oszczędzać

1. **Na szybkości.** Wolna strona traci klientów, zanim zdążą cokolwiek przeczytać. Na telefonie, przy słabym zasięgu, każda sekunda ma znaczenie.
2. **Na wersji mobilnej.** Większość ruchu lokalnego to telefony. Strona, którą trzeba powiększać palcami, nie sprzedaje.
3. **Na możliwości samodzielnej edycji.** Jeśli każda zmiana ceny wymaga kontaktu z wykonawcą, treść na stronie przestaje być aktualizowana już po kilku miesiącach.

## Jak przygotować się do wyceny

Zbierz trzy informacje: kto ma trafiać na stronę, jaką decyzję ma podjąć i co konkretnie ma się na niej znaleźć. Z tym da się przygotować konkretną wycenę zamiast przedziału „od–do”, który nie mówi nic.`,
  },
  {
    slug: 'core-web-vitals-w-praktyce',
    title: 'Core Web Vitals w praktyce — co realnie poprawia wynik',
    excerpt:
      'LCP, CLS i INP bez teorii. Konkretne przyczyny słabych wyników i kolejność działań, która daje największą poprawę przy najmniejszym nakładzie pracy.',
    publishedAt: '2026-03-24',
    readingTime: 9,
    category: 'Wydajność',
    seo: {
      title: 'Core Web Vitals w praktyce — LCP, CLS i INP krok po kroku',
      description:
        'Jak poprawić Core Web Vitals: najczęstsze przyczyny słabego LCP, CLS i INP oraz kolejność optymalizacji, która daje realną poprawę wyników.',
    },
    body: `Core Web Vitals to trzy wskaźniki, którymi Google mierzy odczucia użytkownika. Nie są magią — każdy z nich ma kilka typowych przyczyn i skończoną listę rozwiązań.

## LCP — jak szybko pojawia się najważniejszy element

LCP mierzy moment, w którym widoczny staje się największy element pierwszego ekranu. Zwykle jest to zdjęcie w nagłówku albo duży tekst.

Najczęstsze przyczyny słabego wyniku:

- **Nieoptymalizowany obraz.** Zdjęcie o szerokości 4000 px serwowane na ekran telefonu. Rozwiązanie: warianty rozmiarowe, formaty AVIF/WebP i atrybut \`sizes\` dopasowany do layoutu.
- **Obraz ładowany leniwie.** \`loading="lazy"\` na obrazie w pierwszym ekranie opóźnia dokładnie to, co powinno pojawić się najszybciej. W pierwszym widoku używaj \`priority\`.
- **Blokujące zasoby.** Arkusze stylów i skrypty ładowane synchronicznie w nagłówku wstrzymują renderowanie.
- **Powolna odpowiedź serwera.** Zanim przeglądarka cokolwiek narysuje, musi dostać dokument. Cache i sensowny hosting robią tu różnicę.

Osobna sprawa: jeżeli pierwszym ekranem jest animacja, canvas albo scena 3D, LCP zależy od czasu wykonania JavaScriptu. To prawie zawsze błąd projektowy — najpierw powinien pojawić się tekst, dopiero potem warstwa efektowna.

## CLS — czy układ strony skacze

CLS mierzy przesunięcia treści po jej wyświetleniu. Każdy, kto próbował kliknąć link, który uciekł spod palca, wie, o co chodzi.

Przyczyny są bardzo powtarzalne:

- Obrazy bez zadeklarowanych wymiarów lub proporcji.
- Reklamy i osadzone elementy bez zarezerwowanego miejsca.
- Fonty webowe podmieniane po wczytaniu, bez dopasowanych metryk.
- Elementy dodawane nad istniejącą treścią, np. paski informacyjne.

Rozwiązanie sprowadza się do jednej zasady: rezerwuj miejsce, zanim treść się pojawi.

## INP — jak szybko strona odpowiada na kliknięcie

INP zastąpił FID i jest znacznie bardziej wymagający, bo mierzy wszystkie interakcje, nie tylko pierwszą. Wysoki INP oznacza zwykle, że główny wątek przeglądarki jest zajęty.

Co pomaga:

- Mniej JavaScriptu. Najszybszy kod to ten, którego nie ma.
- Dzielenie paczek i ładowanie na żądanie tego, co nie jest potrzebne od razu.
- Ograniczenie skryptów zewnętrznych. Każdy widget czatu, mapa i piksel śledzący kosztują.
- Przeniesienie ciężkich obliczeń poza główny wątek albo rozbicie ich na mniejsze fragmenty.

## Kolejność działań

Jeżeli masz poprawić wyniki i ograniczony czas, rób to w tej kolejności:

1. Obrazy — rozmiary, formaty, priorytety. Największy zysk przy najmniejszym nakładzie.
2. Zarezerwowane wymiary dla wszystkiego, co ładuje się asynchronicznie.
3. Fonty — ograniczenie liczby krojów, subsetting, \`font-display: swap\`.
4. Skrypty zewnętrzne — przegląd i usunięcie tego, z czego nikt nie korzysta.
5. Własny JavaScript — code splitting i ładowanie dynamiczne.

## Mierz na danych z rzeczywistości

Wynik z Lighthouse w laboratorium bywa optymistyczny. Ostatecznie liczą się dane z realnych wizyt, widoczne w Search Console i raporcie CrUX. Jeżeli laboratorium pokazuje zieleń, a użytkownicy skarżą się na czekanie, prawda jest po stronie użytkowników.`,
  },
  {
    slug: 'lokalne-seo-dla-firmy-uslugowej',
    title: 'Lokalne SEO dla firmy usługowej — od czego zacząć',
    excerpt:
      'Wizytówka Google, spójność danych, struktura strony i treść pod intencję lokalną. Praktyczna kolejność działań dla firmy działającej na jednym obszarze.',
    publishedAt: '2026-05-12',
    readingTime: 7,
    category: 'SEO',
    seo: {
      title: 'Lokalne SEO dla firmy usługowej — praktyczny przewodnik',
      description:
        'Jak zwiększyć widoczność lokalnej firmy w Google: wizytówka, spójność danych NAP, struktura strony, treść pod frazy lokalne i opinie klientów.',
    },
    body: `Firma działająca na jednym obszarze rywalizuje o zupełnie inne wyniki wyszukiwania niż sklep wysyłający paczki po całym kraju. Dobra wiadomość: konkurencja jest mniejsza, a efekty widać szybciej.

## Zacznij od wizytówki Google

Profil Firmy w Google odpowiada za większość widoczności lokalnej — to on pojawia się w mapkach nad wynikami organicznymi. Zadbaj o:

- pełną i poprawną kategorię działalności,
- dokładny adres albo zdefiniowany obszar działania, jeśli dojeżdżasz do klienta,
- godziny otwarcia utrzymywane w aktualności,
- zdjęcia realnych realizacji, nie zdjęć stockowych,
- regularne odpowiadanie na opinie.

## Pilnuj spójności danych

Nazwa, adres i telefon muszą wyglądać identycznie wszędzie: na stronie, w wizytówce, w katalogach branżowych i na portalach społecznościowych. Rozbieżności osłabiają zaufanie algorytmu do danych o firmie.

To najbardziej niedoceniany element lokalnego SEO — i jednocześnie najtańszy do naprawienia.

## Zbuduj stronę pod intencję lokalną

Osoba wpisująca „naprawa pralek Wołomin” ma bardzo konkretną potrzebę. Strona powinna odpowiedzieć na nią, zanim użytkownik zdąży wrócić do wyników.

W praktyce oznacza to:

- nagłówek, który łączy usługę z lokalizacją w naturalny sposób,
- widoczny numer telefonu, na telefonie w formie stałego, klikalnego elementu,
- jasno opisany obszar dojazdu,
- informację o czasie reakcji i orientacyjnych kosztach,
- dane strukturalne opisujące firmę usługową i obszar działania.

## Nie powielaj treści dla każdej miejscowości

Najczęstszy błąd: dwadzieścia niemal identycznych podstron, w których zmienia się wyłącznie nazwa miasta. Google rozpoznaje ten wzorzec, a użytkownik nie znajduje na nich żadnej użytecznej informacji.

Lepiej mieć trzy podstrony lokalne z realnie różną treścią — konkretnymi przykładami realizacji z danego obszaru, specyfiką klientów, informacją o dojeździe — niż dwadzieścia wygenerowanych automatycznie.

## Opinie mają znaczenie

Liczba, świeżość i treść opinii wpływają zarówno na pozycję w mapkach, jak i na decyzję klienta. Proś o nie po zakończonej usłudze, w momencie, w którym klient jest zadowolony. Nie kupuj ich — sztuczne opinie są rozpoznawalne i ryzykowne.

## Realistyczne oczekiwania

Lokalne SEO to nie kampania na miesiąc. Pierwsze zmiany w widoczności zwykle widać po kilku tygodniach od uporządkowania podstaw, a stabilna pozycja buduje się miesiącami. Za to w przeciwieństwie do reklamy efekt nie znika w dniu, w którym przestajesz płacić.`,
  },
  {
    slug: 'wordpress-czy-next-js',
    title: 'WordPress czy Next.js — jak wybrać bez ideologii',
    excerpt:
      'Kiedy sprawdzony system zarządzania treścią jest właściwym wyborem, a kiedy warto zbudować rozwiązanie dedykowane. Kryteria zamiast preferencji.',
    publishedAt: '2026-07-08',
    readingTime: 8,
    category: 'Technologia',
    seo: {
      title: 'WordPress czy Next.js — kiedy wybrać które rozwiązanie',
      description:
        'Porównanie WordPressa i Next.js dla stron firmowych i sklepów: koszt, wydajność, elastyczność, utrzymanie i realne kryteria wyboru technologii.',
    },
    body: `Dyskusja o technologii zwykle zaczyna się od preferencji wykonawcy, a powinna od potrzeb projektu. Oba rozwiązania są dobre — w innych sytuacjach.

## Co WordPress robi dobrze

WordPress obsługuje ogromną część internetu i to nie jest przypadek. Jego przewagi są konkretne:

- **Znajomy panel.** Duża szansa, że ktoś w firmie już go zna.
- **Ekosystem.** Do większości typowych potrzeb istnieje sprawdzone rozwiązanie.
- **Koszt utrzymania.** Tani hosting, łatwo dostępne wsparcie.
- **WooCommerce.** Dojrzały sklep bez budowania procesu zakupowego od zera.

Dla strony firmowej z blogiem, portfolio i formularzem kontaktowym WordPress jest zwykle wyborem rozsądnym i wystarczającym.

## Gdzie WordPress zaczyna przeszkadzać

Problemy pojawiają się, gdy projekt odbiega od standardu:

- **Wtyczkoza.** Każda wtyczka dokłada skrypty i style. Dwadzieścia wtyczek to strona, która ładuje się kilka sekund, niezależnie od jakości hostingu.
- **Nietypowa logika.** Kiedy zamówienie musi zachowywać się inaczej niż paczka wysyłana kurierem, walka z domyślnym zachowaniem systemu bywa droższa niż napisanie tego od zera.
- **Zaawansowana warstwa wizualna.** Płynne przejścia między podstronami, animacje sterowane przewijaniem, sceny 3D — da się je dołożyć, ale pod prąd architektury.

## Co daje Next.js

Next.js to framework do budowania aplikacji webowych. Przy stronie oznacza to:

- **Kontrolę nad wydajnością.** Decydujesz, co wykonuje się na serwerze, a co w przeglądarce, i ile kodu trafia do użytkownika.
- **Swobodę interfejsu.** Brak ograniczeń motywu — każdy element jest projektowany świadomie.
- **Headless CMS.** Treść mieszka w systemie takim jak Sanity, a warstwa prezentacji jest niezależna.
- **Nowoczesną warstwę wizualną.** Three.js, motion design i przejścia między podstronami są tu naturalną częścią stosu, nie doklejką.

Ceną jest wyższy koszt startowy i konieczność współpracy z osobą, która to utrzyma.

## Kryteria wyboru

Zamiast pytać „co jest lepsze”, odpowiedz sobie na cztery pytania:

1. **Czy projekt mieści się w standardzie?** Strona firmowa, blog, typowy sklep — WordPress. Nietypowa logika, konfigurator, aplikacja — rozwiązanie dedykowane.
2. **Jak ważna jest wydajność?** Jeżeli szybkość jest przewagą konkurencyjną, Next.js daje nad nią większą kontrolę.
3. **Jaki jest budżet — nie tylko wdrożenia, ale też utrzymania?** WordPress jest tańszy w obu miejscach.
4. **Kto będzie rozwijał stronę za rok?** To pytanie bywa najważniejsze i najczęściej się o nim zapomina.

## Wniosek

Nie ma jednej właściwej odpowiedzi. Jest natomiast zły sposób podejmowania tej decyzji: wybór technologii, zanim ktokolwiek ustali, co strona ma robić.`,
  },
];

export const getPost = (slug: string): Post | undefined => posts.find((post) => post.slug === slug);

export const sortedPosts = (): Post[] =>
  [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
