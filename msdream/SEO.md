# SEO — strategia, implementacja, wydajność

---

## 1. Cel biznesowy

Strona lokalnej szkoły jazdy konnej żyje z jednego rodzaju ruchu: **ktoś
w promieniu kilkunastu kilometrów szuka, gdzie zapisać siebie albo dziecko
na jazdę konną.** Cała strategia jest podporządkowana temu scenariuszowi.

Fraza główna: **szkoła jazdy konnej Łomianki**

---

## 2. Mapowanie fraz na podstrony

Zasada: **jedna intencja = jedna podstrona.** Dwie strony walczące o to samo
zapytanie osłabiają się nawzajem.

| Podstrona | Intencja | Frazy |
| --- | --- | --- |
| `/` | Marka + fraza główna | szkoła jazdy konnej Łomianki, jazda konna Łomianki, stajnia Łomianki |
| `/nauka-jazdy-konnej-lomianki` | Dorosły rozważa naukę | nauka jazdy konnej Łomianki, lekcje jazdy konnej Łomianki, jazda konna dla dorosłych, jazda konna okolice Warszawy |
| `/jazda-konna-dla-dzieci-lomianki` | Rodzic rozważa zapisanie dziecka | jazda konna dla dzieci Łomianki, nauka jazdy konnej dla dzieci, szkółka jeździecka Łomianki |
| `/oferta/jazda-konna` | Porównanie zajęć i cen | cennik jazda konna Łomianki, zajęcia jeździeckie |
| `/oferta/[usługa]` | Konkretne zajęcia (9 stron) | jazda indywidualna, ABC jazdy konnej, pakiety jazd |
| `/oferta/warsztaty-tuftingu` | Zupełnie inna intencja | warsztaty tuftingu Warszawa, tufting dla dzieci, urodziny z tuftingiem |
| `/rezerwacja` | Gotowość do zakupu | rezerwacja jazdy konnej online |
| `/instruktorzy` + profile | Weryfikacja zaufania | instruktor jazdy konnej Łomianki |
| `/poradnik/[wpis]` | Zapytania informacyjne | od jakiego wieku dziecko może jeździć konno, jak przygotować się do jazdy konnej |
| `/mapa` | Intencja nawigacyjna | stajnia Łomianki dojazd, jak dojechać |

### Rozdzielenie stron docelowych od stron usług

Ryzyko duplikacji rozwiązane świadomie:

| | `/oferta/jazda-konna-dla-dzieci` | `/jazda-konna-dla-dzieci-lomianki` |
| --- | --- | --- |
| **Intencja** | Transakcyjna | Informacyjna |
| **Treść** | Cena, co obejmuje, ograniczenia, przycisk rezerwacji | Od jakiego wieku, bezpieczeństwo, FAQ rodziców, mapa |
| **Cel** | Rezerwacja | Rozwianie wątpliwości → przejście do oferty |

Strony linkują do siebie nawzajem, ale nie powielają treści.

---

## 3. Zasady pisania treści

Teksty w tym projekcie są pisane pod **czytelnika**, nie pod algorytm.
Nowe treści warto pisać według tych samych reguł:

**Czego unikamy (i dlaczego to zostało wprost zapisane):**

- „Witaj w świecie, gdzie pasja spotyka innowację” — puste, generyczne, nic nie mówi
- Upychania frazy: „szkoła jazdy konnej Łomianki” trzy razy w akapicie
- Obietnic bez pokrycia: „najlepsza szkoła w regionie”
- Języka korporacyjnego tam, gdzie mówimy o koniach

**Co robimy zamiast tego:**

- **Konkret zamiast ogólnika:** „około czwartego roku życia” zamiast
  „gdy dziecko jest gotowe”
- **Odpowiedź w pierwszym akapicie**, bez budowania napięcia
- **Uczciwość jako argument sprzedażowy:** sekcja „Czego nie obiecujemy”
  buduje więcej zaufania niż kolejna lista zalet
- **Lokalność naturalna:** „dwadzieścia minut od północnej Warszawy”
  zamiast „Łomianki, Warszawa, Bielany, Młociny”

Przykłady w `src/content/guides.ts` i `src/content/services.ts`.

---

## 4. Dane strukturalne (schema.org)

**Plik:** `src/lib/seo.ts`

| Typ | Gdzie | Uwagi |
| --- | --- | --- |
| `SportsActivityLocation` + `LocalBusiness` | Każda strona | Podtyp właściwszy dla szkoły jazdy niż samo `LocalBusiness` |
| `WebSite` | Każda strona | |
| `BreadcrumbList` | Wszystkie podstrony | Generowany z tego samego źródła co widoczne okruszki |
| `Service` | 9 stron usług | `offers` **tylko** przy potwierdzonej cenie |
| `FAQPage` | Strony z FAQ | Z tej samej treści, którą widzi użytkownik |
| `Person` | Profile instruktorów | Tylko dla uzupełnionych nazwisk |
| `Article` | Wpisy poradnika | |

### Czego celowo NIE emitujemy

To jest najważniejsza część tej sekcji.

| Pole | Warunek emisji |
| --- | --- |
| `PostalAddress` | Tylko gdy ulica **i** kod pocztowy są uzupełnione |
| `geo` | Tylko przy obu współrzędnych |
| `telephone`, `email`, `vatID` | Tylko gdy uzupełnione |
| `openingHoursSpecification` | Tylko przy wypełnionym grafiku |
| `offers` | Tylko przy potwierdzonej cenie |
| `aggregateRating` | **Wyłącznie wyliczane z realnych opinii** — nigdy wpisywane |
| `priceRange` | Nie emitowane do czasu potwierdzenia cennika |

Funkcja `compact()` usuwa klucze o wartości `undefined`, więc niekompletne
obiekty nigdy nie trafiają do znacznika.

> **Dlaczego to ma znaczenie:** niespójny NAP między witryną a wizytówką
> Google osłabia pozycję w wynikach lokalnych. Fikcyjne `AggregateRating`
> to naruszenie wytycznych i ryzyko kary ręcznej. **Brak danych jest
> bezpieczniejszy niż dane nieprawdziwe.**

---

## 5. Techniczne SEO

| Element | Stan |
| --- | --- |
| Tytuły | Szablon `%s — MSdream`; strona główna z pełną frazą lokalną |
| Meta description | Unikalne na każdej podstronie, pisane ręcznie |
| Canonical | Bezwzględny URL na każdej podstronie |
| `robots` | `index, follow` + `max-image-preview:large`; `noindex` na stronach płatności |
| Open Graph / Twitter | Pełne, z obrazem 1200×630 |
| `sitemap.xml` | Generowana z tych samych źródeł co strony — nie może się rozjechać |
| `robots.txt` | Blokuje tylko `/api/` i `/platnosc/` |
| Język | `<html lang="pl">`, `locale: pl_PL` |
| Adresy URL | Czyste, po polsku, bez parametrów i identyfikatorów |
| Hierarchia nagłówków | Dokładnie jeden `<h1>` na stronę, bez przeskoków poziomów |
| HTML semantyczny | `<header>`, `<main>`, `<nav>`, `<article>`, `<address>`, `<time>` |
| Przekierowania 301 | `REDIRECT_MAP.md` + `next.config.ts` — bez łańcuchów |
| Strona 404 | Z nawigacją i CTA, nie ślepy zaułek |

### Linkowanie wewnętrzne

Każda strona docelowa linkuje do: konkretnych usług, powiązanych wpisów
poradnika i rezerwacji. Wpisy poradnika linkują do stron usług.
Stopka linkuje do obu stron docelowych z frazami w treści odnośnika.

Zasada: **treść odnośnika opisuje cel**, nigdy „kliknij tutaj”.

---

## 6. Wydajność (Core Web Vitals)

### Cele

| Metryka | Cel |
| --- | --- |
| Lighthouse Performance (mobile) | ≥ 90 |
| Lighthouse SEO | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| LCP | < 2,0 s |
| CLS | < 0,1 |
| INP | < 200 ms |

### Co zostało zrobione, żeby to osiągnąć

**LCP**
- 39 stron generowanych statycznie — przeglądarka dostaje gotowy HTML
- Hero jest komponentem serwerowym; nagłówek jest w pierwszej odpowiedzi
- Obraz hero: `priority` + `fetchPriority="high"`, AVIF/WebP, jawne `sizes`
- **Brak wideo w tle** — na telefonie kosztowałoby megabajty transferu
  i zniszczyło LCP. Gdy pojawi się materiał, miejsce na nie jest niżej
  na stronie, z leniwym ładowaniem
- Fonty self-hostowane przez `next/font` — zero żądań do Google

**CLS**
- Placeholdery zdjęć rezerwują **dokładne** proporcje kadru, więc podmiana
  briefu na prawdziwe zdjęcie nie przesuwa układu
- `next/font` dobiera metryki zastępcze automatycznie
- Animacje ruszają wyłącznie `opacity`, `translate` i `clip-path` —
  właściwości kompozytowane, które nie wywołują reflow
- Kompensacja szerokości paska przewijania przy otwieraniu menu

**INP**
- Minimalna ilość JavaScriptu; większość stron to komponenty serwerowe
- GSAP ładowany dynamicznie, **po** pierwszym renderze
- Animacje pomijane całkowicie przy `prefers-reduced-motion`, trybie
  oszczędzania danych, łączu 2G i urządzeniach z ≤ 2 GB RAM
- Parallax **tylko na desktopie** — na telefonie powodowałby janky repainty
- Mapa Google jako fasada: iframe powstaje dopiero po kliknięciu
- Analityka wyłącznie po zgodzie na cookies
- Nasłuch scrolla przez `useSyncExternalStore` z opcją `passive`

### Jak zmierzyć

```bash
npm run build && npm start
npx lighthouse http://localhost:3000 --preset=desktop --view
npx lighthouse http://localhost:3000 --form-factor=mobile --view
```

> **Uwaga metodologiczna:** pomiar ma sens dopiero **po wgraniu prawdziwych
> zdjęć**. Obecne placeholdery są lekkimi elementami HTML, więc wynik
> byłby zawyżony i nic by nie mówił o stanie produkcyjnym.
>
> Wyniki podane w raporcie końcowym jako „niezmierzone” pozostają takie
> do czasu wdrożenia na docelowym hostingu z kompletem materiałów.

---

## 7. Po wdrożeniu — lista zadań SEO

1. **Google Search Console** — dodaj własność, zweryfikuj
   (`GOOGLE_SITE_VERIFICATION`), prześlij `sitemap.xml`.
2. **Google Business Profile** — upewnij się, że NAP jest **znakowo
   identyczny** z danymi w CMS. To najczęstsza przyczyna słabych wyników
   lokalnych.
3. **Sprawdź przekierowania** — przejdź listę z `REDIRECT_MAP.md`
   i potwierdź, że każdy stary adres zwraca 301 do właściwego celu.
4. **Zweryfikuj dane strukturalne** —
   [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
   Sprawdź, czy `LocalBusiness` zawiera adres (czyli czy pola w CMS są uzupełnione).
5. **Poproś o opinie** — najskuteczniejszy pojedynczy czynnik w SEO lokalnym.
   Poproś kursantów po zajęciach, przepisz opinie do CMS.
6. **Monitoruj przez 4–6 tygodni** — po migracji pozycje zwykle chwilowo
   spadają, zanim wzrosną. Nie wprowadzaj zmian w panice.
7. **Rozbudowuj poradnik** — jeden wpis miesięcznie odpowiadający na realne
   pytanie klienta. To najtańsze źródło długoterminowego ruchu.
