# majewskitomasz.pl

Witryna portfolio **Tomasza Majewskiego** — web developera i projektanta stron
internetowych z Wołomina, obsługującego klientów z Wołomina, Warszawy i całej
Polski.

Projekt wielostronicowy zbudowany na Next.js (App Router) z warstwą 3D w
Three.js, motion designem w GSAP i treścią zarządzaną przez headless CMS.

---

## Spis treści

- [Stos technologiczny](#stos-technologiczny)
- [Wymagania](#wymagania)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Zmienne środowiskowe](#zmienne-środowiskowe)
- [Struktura projektu](#struktura-projektu)
- [Mapa podstron](#mapa-podstron)
- [CMS — WordPress albo Sanity](#cms--wordpress-albo-sanity)
- [Formularz kontaktowy](#formularz-kontaktowy)
- [Warstwa 3D i animacje](#warstwa-3d-i-animacje)
- [SEO](#seo)
- [Wydajność](#wydajność)
- [Dostępność](#dostępność)
- [Generowanie grafik](#generowanie-grafik)
- [Skrypty npm](#skrypty-npm)
- [Wdrożenie produkcyjne](#wdrożenie-produkcyjne)
- [Do uzupełnienia przez właściciela](#do-uzupełnienia-przez-właściciela)

---

## Stos technologiczny

| Obszar | Rozwiązanie |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components) |
| Język | TypeScript w trybie `strict` |
| Style | Tailwind CSS v4 (tokeny w `@theme`) |
| 3D | Three.js + React Three Fiber, autorskie shadery GLSL |
| Animacje | GSAP + ScrollTrigger + SplitText |
| CMS | Sanity (Studio osadzone pod `/studio`) |
| Walidacja | Zod (te same schematy po stronie klienta i serwera) |
| Poczta | Resend |
| Hosting | Vercel (lub dowolna platforma obsługująca Next.js) |

## Wymagania

- Node.js **20.9+** (zalecane 22 LTS)
- npm 10+

## Uruchomienie lokalne

```bash
git clone <adres-repozytorium>
cd Timoon3k

npm install
cp .env.example .env.local     # uzupełnij, jeśli chcesz podpiąć CMS lub pocztę

npm run dev                    # http://localhost:3000
```

> Witryna **działa bez żadnych kluczy** — korzysta wtedy z treści startowej
> z `src/content`. Klucze są potrzebne dopiero do podpięcia CMS-u i wysyłki
> formularza.

Jeśli port 3000 jest zajęty:

```bash
npx next dev -p 3001
```

## Zmienne środowiskowe

Wszystkie zmienne opisuje `.env.example`. Do pracy lokalnej skopiuj go do
`.env.local`.

| Zmienna | Wymagana | Opis |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | do wdrożenia | Adres kanoniczny, bez ukośnika na końcu. Używany w `canonical`, OG, sitemapie i JSON-LD. |
| `CONTENT_SOURCE` | nie | `wordpress`, `sanity` albo `seed`. Puste = wykrywanie automatyczne. |
| `WORDPRESS_API_URL` | do WordPressa | Adres REST API, np. `https://cms.example.pl/wp-json`. Nie jest sekretem. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | nie | Identyfikator projektu Sanity. Pusty = tryb treści startowej, Studio wyłączone. |
| `NEXT_PUBLIC_SANITY_DATASET` | nie | Domyślnie `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | nie | Data wersji API, domyślnie `2024-10-01`. |
| `SANITY_API_READ_TOKEN` | nie | Token tylko do odczytu — wymagany wyłącznie dla prywatnego datasetu. |
| `CONTENT_REVALIDATE_SECRET` | nie | Sekret webhooka `/api/revalidate` — wspólny dla obu CMS-ów. Stara nazwa `SANITY_REVALIDATE_SECRET` nadal działa. |
| `RESEND_API_KEY` | do wysyłki | Bez klucza formularz waliduje dane i loguje zgłoszenie zamiast je wysyłać. |
| `CONTACT_EMAIL_TO` | do wysyłki | Adres odbiorcy zgłoszeń. |
| `CONTACT_EMAIL_FROM` | do wysyłki | Nadawca zweryfikowany w Resend. |
| `GOOGLE_SITE_VERIFICATION` | nie | Token weryfikacji Google Search Console. |

**Nigdy nie commituj `.env.local`** — plik jest w `.gitignore`.

## Struktura projektu

```
src/
├── app/                        # trasy App Routera
│   ├── layout.tsx              # powłoka, fonty, globalne JSON-LD
│   ├── page.tsx                # strona główna
│   ├── api/contact/            # obsługa formularza (walidacja + Resend)
│   ├── api/revalidate/         # webhook odświeżający cache (WordPress i Sanity)
│   ├── studio/[[...tool]]/     # osadzone Sanity Studio
│   ├── sitemap.ts, robots.ts   # generowane dynamicznie
│   └── …                       # pozostałe podstrony
├── components/
│   ├── layout/                 # nagłówek, stopka, CTA domykające
│   ├── home/                   # sekcje strony głównej
│   ├── portfolio/              # karty, ramka przeglądarki, lista realizacji
│   ├── contact/                # formularz
│   ├── motion/                 # globalna warstwa animacji i przejścia stron
│   ├── three/                  # scena WebGL, shadery, fallback
│   ├── seo/                    # wstrzykiwanie JSON-LD
│   └── ui/                     # prymitywy: CTA, sekcje, FAQ, breadcrumbs
├── content/                    # treść startowa (fallback dla trybu bez CMS)
├── lib/
│   ├── content.ts              # jedno źródło treści — wybiera CMS albo seed
│   └── wordpress/              # klient REST, mapery, konwerter HTML→markdown
├── lib/                        # typy, SEO, formatowanie, dostęp do treści
└── sanity/                     # klient, zapytania GROQ, schematy, struktura
scripts/                        # generatory grafik i ikon
```

## Mapa podstron

| Ścieżka | Zawartość |
| --- | --- |
| `/` | Strona główna — hero 3D, realizacje, usługi, proces, technologie, blog |
| `/o-mnie` | Historia, podejście, kompetencje, sposób współpracy |
| `/oferta` | Pełny zakres usług, proces, FAQ |
| `/tworzenie-stron-internetowych-wolomin` | Landing lokalny — Wołomin i powiat |
| `/tworzenie-stron-internetowych-warszawa` | Landing lokalny — Warszawa |
| `/portfolio` | Lista realizacji z podglądem podążającym za kursorem |
| `/portfolio/[slug]` | Case study realizacji |
| `/blog` | Lista wpisów |
| `/blog/[slug]` | Artykuł |
| `/kontakt` | Formularz i dane kontaktowe |
| `/polityka-prywatnosci` | Dokument prawny |
| `/studio` | Sanity Studio (tylko przy skonfigurowanym CMS) |

## CMS — WordPress albo Sanity

Warstwa treści ma jeden szew: `src/lib/content.ts`. Komponenty nie wiedzą,
skąd pochodzą dane, więc zmiana CMS-a nie dotyka ani jednego widoku.
Zmienna `CONTENT_SOURCE` wybiera źródło:

| Wartość | Znaczenie |
| --- | --- |
| `wordpress` | WordPress headless przez REST (`WORDPRESS_API_URL`) |
| `sanity` | Sanity ze Studiem pod `/studio` |
| `seed` | wyłącznie treść wbudowana w `src/content` |
| puste | wykrywanie: WordPress → Sanity → treść startowa |

Niezależnie od wyboru: gdy CMS nie odpowie albo zwróci pustą kolekcję,
strona pokazuje treść startową i zapisuje powód w logach builda. Awaria
hostingu CMS-a nie kładzie witryny.

### WordPress

Instalacja krok po kroku, opis wszystkich pól i rozwiązywanie problemów:
**[`wordpress/README.md`](wordpress/README.md)**.

W skrócie: wgrywasz `wordpress/majewski-content.php` do `wp-content/mu-plugins/`,
a w `.env.production` ustawiasz `CONTENT_SOURCE=wordpress` i `WORDPRESS_API_URL`.
Wtyczka mu rejestruje typy treści (Realizacje, Usługi, FAQ, Opinie) i wystawia
je pod `/wp-json/majewski/v1/…` w kształcie, którego oczekuje frontend —
niezależnie od tego, czy pola wprowadzasz przez ACF, Meta Box czy Pods.

Blog korzysta ze zwykłych Wpisów WordPressa. HTML z edytora jest zamieniany
na wąski markdown i renderowany jako elementy Reacta, więc treść z CMS-u
nigdy nie trafia do DOM jako HTML — `<script>` w treści nie wykona się,
a odnośnik `javascript:` zostaje samym tekstem. Pilnują tego testy (`npm test`).

### Sanity

#### Konfiguracja

1. Załóż projekt na [sanity.io/manage](https://www.sanity.io/manage).
2. Uzupełnij `NEXT_PUBLIC_SANITY_PROJECT_ID` i `NEXT_PUBLIC_SANITY_DATASET`.
3. W ustawieniach projektu (**API → CORS origins**) dodaj adres witryny
   z zaznaczoną opcją *Allow credentials*.
4. Uruchom aplikację i wejdź na `/studio`.

#### Co da się edytować bez dotykania kodu

- **Ustawienia witryny** — nazwa, e-mail, telefon, profile społecznościowe,
  domyślne SEO i domyślne CTA
- **Strony** — nagłówek H1, lead, treść, FAQ, CTA i SEO każdej podstrony
- **Usługi** — nazwa, opis, zakres prac, cena od, czas realizacji, kolejność
- **Realizacje / case studies** — komplet pól: kontekst, wyzwanie, rozwiązanie,
  funkcjonalności, rezultat, technologie, kolor akcentu, okładka, galeria, SEO
- **Blog** — wpisy z treścią, grafiką, datami i SEO
- **FAQ** — trzy zestawy: `general`, `wolomin`, `warszawa`
- **Opinie** — wyłącznie prawdziwe, wraz ze wskazaniem źródła

Każdy typ treści ma pole **SEO** (title, meta description, grafika Open Graph,
przełącznik `noindex`).

### Odświeżanie treści po publikacji

Dane są cache'owane na 5 minut i otagowane jako `content`. Aby publikacja
w CMS-ie odświeżała stronę natychmiast, dodaj w Sanity webhook:

```
# Sanity → API → Webhooks
POST https://twoja-domena.pl/api/revalidate?secret=CONTENT_REVALIDATE_SECRET

# WordPress — wtyczka mu robi to sama po ustawieniu w wp-config.php:
#   define('MJ_REVALIDATE_URL',    'https://twoja-domena.pl/api/revalidate');
#   define('MJ_REVALIDATE_SECRET', '…');
```

### Tryb bez CMS-u

Bez skonfigurowanego źródła aplikacja korzysta z treści w `src/content`
(realizacje, usługi, wpisy, FAQ). Ta sama treść jest awaryjnym źródłem, gdy
zapytanie do CMS-u zawiedzie — witryna nigdy nie wyświetli pustej strony
z powodu niedostępności CMS-u.

## Formularz kontaktowy

- Pola: imię, e-mail, telefon (opcjonalny), typ projektu, budżet, wiadomość,
  checkbox zgody
- Walidacja **tym samym schematem Zod** w przeglądarce i na serwerze
  (`src/lib/contact-schema.ts`)
- Ochrona przed spamem: pole-pułapka (honeypot) + limit 5 zgłoszeń na adres IP
  w oknie 10 minut
- Komunikaty sukcesu i błędu bez przeładowania strony, z `aria-live`
- Bez `RESEND_API_KEY` zgłoszenie przechodzi walidację i trafia do logu serwera
  zamiast do skrzynki — wygodne przy pracy lokalnej

## Warstwa 3D i animacje

### Scena WebGL

Autorska scena „cyfrowego układu orbitalnego": zdeformowana szumem
simplex bryła centralna z shaderem fresnela, trzy pierścienie orbitalne,
cząsteczki na orbitach i pole gwiazd.

Zasady, których scena przestrzega:

- **Nigdy nie jest elementem LCP** — cały pakiet WebGL ładuje się dynamicznie
  dopiero po pierwszym renderze, w czasie bezczynności przeglądarki
- **Nie renderuje w tle** — pętla zatrzymuje się, gdy canvas wyjdzie poza
  widok albo karta przeglądarki przestanie być aktywna
- **Skaluje jakość** — na słabszym sprzęcie mniejsza tesselacja i ~3× mniej
  cząsteczek; DPR ograniczony do 1,75 (desktop) i 1,4 (mobile)
- **Ma fallback** — przy braku WebGL lub włączonym `prefers-reduced-motion`
  wyświetla statyczną grafikę SVG (poniżej 2 kB)
- **Jest dekoracją** — pozostaje poza drzewem dostępności

### Motion design

Animacje obsługuje jedna globalna warstwa (`src/components/motion`), która
skanuje DOM w poszukiwaniu atrybutów. Dzięki temu sekcje stron pozostają
komponentami serwerowymi i nie trafiają do paczki klienckiej.

| Atrybut | Działanie |
| --- | --- |
| `data-reveal` | Wejście elementu (opacity + translate) |
| `data-reveal-group` | Kaskada dla elementów potomnych, `data-stagger` steruje odstępem |
| `data-split` | Nagłówek rozbijany na linie; `data-split="immediate"` startuje od razu |
| `data-parallax` | Delikatny parallax na scrollu (tylko od 768 px) |
| `data-draw-line` | Rysowanie poziomej linii |

Zasady:

- Animowane są wyłącznie `transform` i `opacity` — zero przesunięć układu
- Wszystko żyje w `gsap.context()`, więc `revert()` przy zmianie ścieżki
  czyści również instancje ScrollTriggera
- Elementy widoczne w pierwszym ekranie animują się po załadowaniu, a nie
  po przewinięciu
- Jeśli warstwa animacji będzie gotowa później niż 1,2 s (wolne łącze),
  pierwszy ekran wyświetla się **bez animacji** — bo odtwarzanie wejścia
  treści, którą użytkownik zdążył przeczytać, wygląda jak błąd
- `prefers-reduced-motion: reduce` wyłącza animacje i scenę 3D

## SEO

- Unikalne `title`, `description` i `canonical` na każdej podstronie
- Open Graph i Twitter Cards z dedykowanymi grafikami 1200 × 630
- `sitemap.xml` i `robots.txt` generowane z realnej listy tras
- Okruszki (breadcrumbs) wraz z `BreadcrumbList`
- JSON-LD: `Person`, `ProfessionalService`, `WebSite`, `BreadcrumbList`,
  `Service`, `CreativeWork`, `Article`, `FAQPage`
- Dwa landingi lokalne z **osobną, nieduplikowaną treścią** — Wołomin kładzie
  nacisk na bezpośrednią współpracę i widoczność lokalną, Warszawa na
  konkurencyjny rynek, zaawansowane wdrożenia i porównanie z agencją
- Linkowanie wewnętrzne między ofertą, realizacjami, landingami i blogiem

## Wydajność

Pomiary na produkcyjnym buildzie, profil mobilny (390 × 844, throttling CPU 4×,
łącze 1,6 Mb/s, 150 ms opóźnienia):

| Strona | FCP | LCP | CLS | Element LCP |
| --- | --- | --- | --- | --- |
| `/` | 1,06 s | 1,06 s | 0 | akapit tekstowy |
| `/portfolio` | 0,34 s | 0,34 s | 0 | akapit tekstowy |
| `/portfolio/msdream` | 0,42 s | 0,42 s | 0 | akapit tekstowy |
| `/oferta` | 0,42 s | 0,42 s | 0 | akapit tekstowy |
| `/blog` | 0,38 s | 0,38 s | 0 | akapit tekstowy |
| `/kontakt` | 0,43 s | 0,43 s | 0 | akapit tekstowy |

Budżet JavaScriptu:

- **~143 kB** w ścieżce krytycznej (React, runtime Next.js, kod aplikacji)
- **~375 kB** ładowane dopiero po pierwszym renderze (GSAP, Three.js, R3F)
- **0 skryptów zewnętrznych** — brak zapytań do innych domen

Zastosowane techniki: React Server Components wszędzie, gdzie to możliwe,
`dynamic()` dla WebGL i GSAP, lokalnie hostowane fonty z ograniczonymi wagami,
jawne wymiary i `aspect-ratio` wszystkich obrazów, grafiki wektorowe zamiast
rastrowych w portfolio, wstrzymywanie renderu poza widokiem.

## Dostępność

- Semantyczny HTML, dokładnie jeden `H1` na stronę, brak przeskoków w hierarchii
  nagłówków (zweryfikowane automatycznie na 12 podstronach × 6 szerokościach)
- Kontrast tekstu względem tła: 5,8 : 1 (etykiety), 8,1 : 1 (tekst pomocniczy),
  13,2 : 1 (akcent) — powyżej progu WCAG AA
- Widoczny focus na każdym elemencie interaktywnym, link „Przejdź do treści"
- FAQ na natywnym `<details>` — pełna obsługa klawiaturą bez JavaScriptu
- Nagłówki rozbijane na linie zachowują `aria-label` z pełnym tekstem
- Dekoracyjne canvasy i grafiki oznaczone `aria-hidden`
- Brak poziomego przewijania od 360 px do 2560 px

## Generowanie grafik

```bash
node scripts/generate-assets.mjs   # plansze realizacji + grafiki Open Graph
node scripts/generate-icons.mjs    # favicon, icon.svg, apple-icon.png
```

Plansze w `public/projects` to **autorskie wizualizacje kierunkowe**, a nie
zrzuty ekranu. Po wgraniu prawdziwych screenów w Sanity (Realizacje → Okładka
i Galeria) podmieniają się automatycznie.

## Skrypty npm

| Polecenie | Opis |
| --- | --- |
| `npm run dev` | Serwer deweloperski (domyślnie port 3000) |
| `npm run build` | Build produkcyjny |
| `npm start` | Serwer produkcyjny (po `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript bez emisji plików |
| `npm test` | Testy jednostkowe warstwy treści (wbudowany runner Node) |

## Wdrożenie produkcyjne

### Vercel (zalecane)

1. Zaimportuj repozytorium na [vercel.com/new](https://vercel.com/new).
2. Framework zostanie wykryty automatycznie (Next.js) — ustawienia buildu
   pozostaw domyślne.
3. W **Settings → Environment Variables** dodaj zmienne z `.env.example`
   (minimum `NEXT_PUBLIC_SITE_URL`).
4. Deploy.
5. Podepnij domenę i ustaw `NEXT_PUBLIC_SITE_URL` na jej adres — od tej
   wartości zależą `canonical`, Open Graph, sitemapa i JSON-LD.

### Po wdrożeniu

- [ ] Dodaj adres produkcyjny do **CORS origins** w Sanity
- [ ] Skonfiguruj webhook `/api/revalidate`
- [ ] Zweryfikuj domenę nadawcy w Resend i ustaw `CONTACT_EMAIL_FROM`
- [ ] Wyślij testowe zgłoszenie z formularza
- [ ] Zgłoś `sitemap.xml` w Google Search Console
- [ ] Sprawdź dane strukturalne w [Rich Results Test](https://search.google.com/test/rich-results)

### Inna platforma

Projekt nie korzysta z funkcji specyficznych dla jednego dostawcy. Wymagane
jest środowisko Node.js obsługujące Next.js w trybie standalone:

```bash
npm ci && npm run build && npm start
```

## Do uzupełnienia przez właściciela

Świadomie **nie wymyślono** danych, których nie dało się zweryfikować. Poniższe
pozycje warto uzupełnić po wdrożeniu:

1. **Numer telefonu** — `src/lib/site.ts` (pole `phone`) lub Ustawienia witryny
   w CMS. Dopóki jest puste, numer nie jest nigdzie publikowany.
2. **Opinie klientów** — sekcja opinii pojawia się dopiero, gdy w CMS istnieje
   przynajmniej jedna prawdziwa opinia wraz ze źródłem. Nie ma treści
   zastępczych, bo wymyślone referencje wprowadzałyby w błąd.
3. **Zrzuty ekranu realizacji** — obecnie wyświetlane są autorskie plansze
   kierunkowe. Prawdziwe screeny wgrywa się w Sanity.
4. **Dane rejestrowe firmy** — jeśli działalność jest zarejestrowana, warto
   uzupełnić NIP i adres w polityce prywatności oraz w JSON-LD
   (`professionalServiceSchema` w `src/lib/seo.ts`).
5. **Daty i szczegóły realizacji** — case studies opisują zakres i rozwiązania,
   ale nie zawierają liczb (wzrostów konwersji, ruchu), bo nie były dostępne.
   Po zebraniu danych warto je dodać w sekcji „Rezultat".

---

© Tomasz Majewski
