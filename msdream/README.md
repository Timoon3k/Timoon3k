# MSdream — szkoła jazdy konnej w Łomiankach

Witryna produkcyjna szkoły jazdy konnej MSdream: prezentacja oferty, rezerwacja
online, płatności, automatyczne dokumenty sprzedaży i CMS dla osoby nietechnicznej.

> **Zanim zaczniesz czytać dalej — ważna informacja o danych.**
> Domena `msdream.pl` była **nieosiągalna ze środowiska, w którym powstawał ten
> projekt** (blokada polityki sieciowej; próbowano też Wayback Machine i indeksu
> wyszukiwarki). Nie udało się więc pobrać oryginalnych cen, nazwisk instruktorów,
> zdjęć, opinii ani danych adresowych.
>
> **Żadna z tych informacji nie została zmyślona.** Każda z nich jest w kodzie
> jawnie oznaczona jako „do uzupełnienia” i gotowa do wprowadzenia w CMS.
> Pełna lista: [`SETUP.md`](./SETUP.md), sekcja **WYMAGANE OD WŁAŚCICIELA**.
> Uzasadnienie tej decyzji znajdziesz niżej, w sekcji [Uczciwość danych](#uczciwość-danych).

---

## Spis treści

- [Stos technologiczny](#stos-technologiczny)
- [Dlaczego taki wybór](#dlaczego-taki-wybór)
- [Uczciwość danych](#uczciwość-danych)
- [Szybki start](#szybki-start)
- [Struktura projektu](#struktura-projektu)
- [Mapa podstron](#mapa-podstron)
- [System projektowy](#system-projektowy)
- [Wydajność](#wydajność)
- [Dostępność](#dostępność)
- [Skrypty npm](#skrypty-npm)
- [Pozostała dokumentacja](#pozostała-dokumentacja)

---

## Stos technologiczny

| Obszar | Rozwiązanie |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components, Turbopack) |
| Język | TypeScript w trybie `strict` |
| Style | Tailwind CSS v4 (tokeny w `@theme`) + autorski CSS |
| Animacje | GSAP + ScrollTrigger, ładowane dynamicznie |
| CMS | **Headless WordPress** (REST API) + wtyczka z modelem treści |
| Rezerwacje | Bookero (oficjalny widget) |
| Płatności | HotPay (Pay by Link) — opcjonalnie, patrz `INTEGRATIONS.md` |
| Dokumenty | Fakturownia API (idempotentnie) |
| Poczta | Resend |
| Walidacja | Zod — te same schematy po stronie klienta i serwera |
| Hosting | Vercel (lub dowolna platforma obsługująca Next.js) |

**Zależności produkcyjne: 6 pakietów.** Bez bibliotek UI, bez klienta CMS,
bez bibliotek do parsowania Markdown i bez frameworka animacji poza GSAP.

## Dlaczego taki wybór

### Next.js 16 zamiast czystego Reacta czy WordPressa z motywem

Strona lokalnej firmy usługowej żyje z wyszukiwarki. Potrzebowaliśmy renderowania
po stronie serwera (SEO, Core Web Vitals), a jednocześnie pełnej kontroli nad
warstwą wizualną — czego motyw WordPressa nie daje bez walki z cudzym CSS-em.
App Router pozwala wygenerować **cały serwis statycznie** (39 stron przy starcie),
więc odwiedzający dostaje gotowy HTML, a nie wynik odpytywania bazy.

### Headless WordPress zamiast Sanity / Payload / Directus

Decydujące było **kto będzie tego używał**. Właściciel szkoły jazdy konnej
z dużym prawdopodobieństwem widział już panel WordPressa albo zna kogoś, kto go zna.
Interfejs Sanity Studio czy Directusa jest dla programisty przyjemniejszy,
ale dla osoby nietechnicznej to kolejne narzędzie do nauczenia się od zera.

Dodatkowe argumenty:

- **Brak vendor lock-inu i kosztu za miejsce w planie.** WordPress stoi na zwykłym
  hostingu współdzielonym za kilkadziesiąt złotych rocznie; nie ma limitów
  dokumentów ani opłat za wywołania API.
- **Znacznie lżejszy frontend.** Rezygnacja z osadzonego studia CMS
  usunęła z projektu **851 pakietów npm**. Panel treści żyje na własnym serwerze
  i nie waży ani jednego kilobajta w bundlu odwiedzającego.
- **Model treści jako kod.** Typy treści i pola rejestruje wtyczka
  [`wordpress/msdream-cms.php`](./wordpress/msdream-cms.php) — leży w repozytorium,
  przechodzi code review i odtwarza się na nowym serwerze przez skopiowanie
  jednego pliku. Bez klikania w panelu i bez płatnego ACF Pro.
- **Zero ryzyka po stronie WordPressa.** Jest headless: `publicly_queryable`
  jest wyłączone, WordPress nie serwuje żadnych stron publicznie i nie musi
  wytrzymywać ruchu. To najczęstsza droga ataku na WP — tutaj zamknięta.

**Kompromis, którego jesteśmy świadomi:** WordPress wymaga aktualizacji
i własnego hostingu, czego usługi SaaS nie wymagają. Uznaliśmy, że wygoda
codziennej pracy właściciela jest ważniejsza niż wygoda utrzymania — bo
z CMS-u ktoś będzie korzystał co tydzień, a serwer aktualizuje się raz na kwartał.

### Awaria CMS-u nie zdejmuje strony

Warstwa treści (`src/cms/content.ts`) przy każdym zapytaniu ma zapasowe
źródło w `src/content`. Jeśli WordPress nie odpowie — timeout, HTTP 500,
wygasły certyfikat — strona zbuduje się i wyświetli treścią startową,
a w logu pojawi się ostrzeżenie. **Nie ma scenariusza, w którym problem
z CMS-em kończy się białym ekranem.**

## Uczciwość danych

To najważniejsza zasada architektoniczna tego projektu i warto ją rozumieć
przed pierwszą edycją kodu.

**Nigdzie nie generujemy prawdopodobnie wyglądających danych zastępczych.**
Zamiast tego dane, których nie potwierdziliśmy, są typowane jako
`OwnerRequired` (`src/lib/site.ts`) i obsługiwane konsekwentnie:

| Rodzaj danych | Zachowanie bez uzupełnienia |
| --- | --- |
| Cena usługi | Interfejs pokazuje „Cena do uzupełnienia” + podpowiedź; `Service.offers` **nie trafia** do JSON-LD |
| Adres, telefon, NIP | Stopka i kontakt pokazują jawny placeholder; `PostalAddress` **nie trafia** do JSON-LD |
| Opinie klientów | Sekcja pokazuje uczciwy stan pusty z linkiem do Google; `AggregateRating` **nie jest generowane** |
| Zdjęcia | Komponent `Photo` renderuje **brief fotograficzny** (`PHOTO_REQUIRED`) zamiast stocku |
| Instruktorzy | Profil nie jest generowany ani dodawany do sitemapy, dopóki nie ma nazwiska |
| Dokumenty prawne | Strona informuje, że treść czeka na uzupełnienie — bez generowania zastępczej treści prawnej |

Dlaczego to nie jest nadgorliwość:

- **Zmyślony NAP niszczy lokalne SEO.** Niespójne dane adresowe między witryną,
  wizytówką Google i katalogami to jeden z najskuteczniejszych sposobów
  na osłabienie pozycji w wynikach lokalnych. Brak danych jest lepszy niż błędne.
- **Fikcyjne opinie to ryzyko kary ręcznej** od Google i naruszenie
  wytycznych dotyczących danych strukturalnych.
- **Zmyślona cena to wprowadzanie klienta w błąd** — a przy płatnościach online
  także problem prawny.
- **Zdjęcie stockowe na stronie prawdziwej stajni jest rozpoznawalne**
  i podkopuje wiarygodność mocniej, niż pomaga estetyka.

Placeholdery są zaprojektowane jako część systemu wizualnego, nie jako
uszkodzony interfejs — stronę można pokazać klientowi w obecnym stanie.

## Szybki start

```bash
cd msdream
npm install
cp .env.example .env.local   # opcjonalne — strona działa bez zmiennych
npm run dev                  # http://localhost:3000
```

Podpięcie CMS-u, rezerwacji i płatności opisuje [`SETUP.md`](./SETUP.md).

## Struktura projektu

```
msdream/
├── src/
│   ├── app/                    # trasy App Routera (39 stron)
│   │   ├── layout.tsx          # powłoka, fonty, globalne JSON-LD
│   │   ├── page.tsx            # strona główna
│   │   ├── api/                # webhooki: HotPay, revalidate, formularz
│   │   ├── sitemap.ts          # generowana z tych samych źródeł co strony
│   │   └── …                   # pozostałe podstrony
│   ├── cms/                    # warstwa WordPressa
│   │   ├── client.ts           # klient REST (bez zależności)
│   │   ├── map.ts              # mapowanie WP → typy domenowe
│   │   └── content.ts          # JEDYNE API treści + fallback na seed
│   ├── components/
│   │   ├── layout/             # header, stopka, sticky CTA
│   │   ├── home/               # sekcje strony głównej
│   │   ├── sections/           # sekcje współdzielone między podstronami
│   │   ├── gallery/            # galeria editorialowa + lightbox
│   │   ├── booking/            # widget Bookero, stan płatności
│   │   ├── contact/            # formularz
│   │   ├── legal/              # zgoda cookies, dokumenty prawne
│   │   ├── motion/             # warstwa animacji (GSAP)
│   │   └── ui/                 # prymitywy: Photo, Section, Cta, FAQ…
│   ├── content/                # treść startowa (fallback bez CMS-u)
│   ├── lib/                    # typy, SEO, formatowanie, hooki
│   └── server/                 # HotPay, Fakturownia, rate limiting, ENV
├── wordpress/
│   └── msdream-cms.php         # model treści jako wtyczka WordPressa
├── scripts/generate-og.mjs     # generator obrazu Open Graph
└── …                           # dokumentacja (patrz niżej)
```

## Mapa podstron

| Adres | Rola |
| --- | --- |
| `/` | Strona główna — pełna narracja sprzedażowa |
| `/o-nas` | O szkole, filozofia pracy, zespół |
| `/oferta` | Obie gałęzie oferty |
| `/oferta/jazda-konna` | Kategoria: nauka jazdy konnej |
| `/oferta/warsztaty-tuftingu` | Kategoria: warsztaty (własna osobowość wizualna) |
| `/oferta/[slug]` | Pojedyncza usługa (9 stron) |
| `/galeria` | Galeria editorialowa z lightboxem |
| `/opinie` | Opinie klientów |
| `/instruktorzy` + `/instruktorzy/[slug]` | Zespół i profile |
| `/mapa` | Dojazd i lokalizacja |
| `/kontakt` | Formularz, dane kontaktowe, mapa |
| `/rezerwacja` | Kalendarz Bookero — jazda konna |
| `/rezerwacja-tuftingu` | Kalendarz Bookero — warsztaty |
| `/jazda-konna-dla-dzieci-lomianki` | Lokalna strona docelowa (SEO) |
| `/nauka-jazdy-konnej-lomianki` | Lokalna strona docelowa (SEO) |
| `/poradnik` + `/poradnik/[slug]` | Treść SEO odpowiadająca na realne zapytania |
| `/platnosc/[status]` | Statusy płatności (`noindex`) |
| Dokumenty prawne | `/polityka-prywatnosci`, `/cookies`, `/regulamin`, `/regulamin-rezerwacji` |

## System projektowy

Autorski język wizualny: **premium equestrian editorial**. Tokeny znajdują się
w `src/app/globals.css` (dyrektywa `@theme` Tailwinda v4).

- **Paleta** — głęboka zieleń lasu, ciemna oliwka, kremowa kość słoniowa,
  piaskowy, mosiądz jako akcent, grafit dla tekstu. Osobna, cieplejsza gałąź
  (wełna, glina) dla tuftingu — ta sama konstrukcja, inna osobowość.
- **Typografia** — **Fraunces** (zmienny krój szeryfowy, osie `SOFT`/`WONK`/`opsz`)
  na nagłówki, **Instrument Sans** na interfejs. Skala płynna (`clamp()`),
  z wartościami minimalnymi dobranymi osobno dla telefonu — mobile nie jest
  pomniejszonym desktopem.
- **Kompozycja** — siatka 12-kolumnowa, układy asymetryczne, kontrolowane
  wychodzenie elementów poza siatkę, łuk stajennego okna jako motyw brandingowy.
  Świadomie **nie budujemy strony z prostokątnych kart**.
- **Mikrointerakcje** — „wodze” (linia pod linkiem napina się od lewej,
  zwalnia w prawo), wypełnienie przycisku wjeżdżające od dołu, delikatny
  zoom fotografii, maskowe odsłanianie nagłówków.

Zero gradientów, zero glassmorphism, zero cieni pod kartami.

## Wydajność

- **39 stron generowanych statycznie** — dynamiczne są wyłącznie webhooki.
- **Fonty self-hostowane** przez `next/font` — zero żądań do Google
  w przeglądarce, zero CLS dzięki automatycznym metrykom zastępczym.
- **GSAP ładowany dynamicznie** i pomijany całkowicie przy
  `prefers-reduced-motion`, trybie oszczędzania danych, łączu 2G
  i urządzeniach z ≤ 2 GB RAM.
- **Mapa Google jako fasada** — iframe powstaje dopiero po kliknięciu
  użytkownika, więc nie obciąża LCP ani INP.
- **Analityka za zgodą** — bez akceptacji cookies nie leci ani jedno żądanie
  do Google czy Meta.
- **Obrazy** — AVIF/WebP, jawne `sizes` przy każdym zdjęciu, `priority`
  wyłącznie na obrazie LCP, placeholdery rezerwujące dokładne proporcje kadru.

Cele i sposób pomiaru opisuje [`SEO.md`](./SEO.md).

## Dostępność

WCAG 2.2 AA jako cel projektowy:

- pełna obsługa klawiaturą, widoczny wskaźnik focusu (`:focus-visible`),
- pułapka focusu i obsługa `Esc` w nakładce menu oraz w lightboxie,
  z przywróceniem focusu na element wywołujący,
- `inert` na ukrytych nakładkach — czytnik ekranu ich nie widzi,
- semantyczny HTML, jedna hierarchia H1–H6 na stronę, „przejdź do treści”,
- pola formularza z etykietami, `aria-invalid`, `aria-describedby`
  i komunikatami w `role="alert"`,
- cele dotykowe minimum 48 px,
- pełne wsparcie `prefers-reduced-motion` — treść jest widoczna domyślnie,
  animacje włączają się dopiero po potwierdzeniu, że są dozwolone.

## Skrypty npm

| Polecenie | Działanie |
| --- | --- |
| `npm run dev` | Serwer deweloperski (Turbopack) |
| `npm run build` | Budowa produkcyjna |
| `npm start` | Uruchomienie zbudowanej aplikacji |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript bez emisji |
| `npm run og` | Regeneracja obrazu Open Graph |

## Pozostała dokumentacja

| Plik | Zawartość |
| --- | --- |
| [`SETUP.md`](./SETUP.md) | Uruchomienie krok po kroku + **lista danych wymaganych od właściciela** |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Wdrożenie produkcyjne i checklista zmiany DNS |
| [`CMS-GUIDE.md`](./CMS-GUIDE.md) | **Instrukcja obsługi CMS-u dla osoby nietechnicznej (po polsku)** |
| [`INTEGRATIONS.md`](./INTEGRATIONS.md) | Bookero, HotPay, Fakturownia, Resend — architektura i przepływy |
| [`SEO.md`](./SEO.md) | Strategia SEO, dane strukturalne, cele wydajnościowe |
| [`REDIRECT_MAP.md`](./REDIRECT_MAP.md) | Mapa przekierowań 301 ze starego serwisu |
