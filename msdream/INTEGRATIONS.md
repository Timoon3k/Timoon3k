# INTEGRATIONS — rezerwacje, płatności, dokumenty, poczta

Dokument opisuje, **jak faktycznie działają** integracje i **dlaczego zostały
zbudowane właśnie tak**. Konfigurację krok po kroku znajdziesz w `SETUP.md`.

> **Zasada nadrzędna całego projektu:** nie zaimplementowano tu ani jednego
> wymyślonego endpointu. Każdy adres, nazwa parametru i sposób podpisywania
> pochodzi z oficjalnej dokumentacji dostawcy. Tam, gdzie dokumentacji
> nie udało się zweryfikować, kod tego **nie udaje** — pokazuje jawny stan
> „do skonfigurowania”.

---

## Spis treści

1. [Architektura przepływu rezerwacji](#1-architektura-przepływu-rezerwacji)
2. [Który wariant płatności wybrać](#2-który-wariant-płatności-wybrać) ← **zacznij tutaj**
3. [Bookero](#3-bookero)
4. [HotPay](#4-hotpay)
5. [Fakturownia](#5-fakturownia)
6. [Idempotencja — dlaczego nie powstanie pięć faktur](#6-idempotencja)
7. [Formularz kontaktowy](#7-formularz-kontaktowy-resend)
8. [Opinie Google](#8-opinie-google)
9. [Bezpieczeństwo](#9-bezpieczeństwo)

---

## 1. Architektura przepływu rezerwacji

Docelowy przepływ z briefu:

```
REZERWACJA → BOOKERO → PŁATNOŚĆ → POTWIERDZENIE → DOKUMENT SPRZEDAŻY → E-MAIL
```

Kluczowe ustalenie z analizy dokumentacji dostawców:

> **Bookero realizuje ten przepływ natywnie, w całości.** Obsługuje płatności
> online przy rezerwacji, automatyczne anulowanie nieopłaconych terminów,
> e-maile potwierdzające **oraz ma własną, oficjalną integrację z Fakturownią**,
> która wystawia dokument i wysyła go klientowi.

Dlatego projekt przewiduje **dwa warianty** — a nie jeden narzucony.

---

## 2. Który wariant płatności wybrać

### Wariant A — płatności po stronie Bookero (**zalecany**)

```
Użytkownik → widget Bookero na msdream.pl
           → płatność (operator skonfigurowany w Bookero)
           → Bookero: rezerwacja + e-mail + Fakturownia
```

**Rola witryny:** osadzić kalendarz, nie dotykać pieniędzy.

**Dlaczego zalecany:**

- **Jedno źródło prawdy o transakcji.** Bookero już wie, czy termin jest
  opłacony — bo od tego zależy, czy go nie anuluje. Gdyby witryna prowadziła
  własny rejestr płatności, powstałyby dwa stany, które mogą się rozjechać.
  Rozjazd w systemie rezerwacji oznacza dwie osoby na jeden termin.
- **Mniejszy obszar odpowiedzialności.** Aplikacja nie przyjmuje ani nie
  potwierdza płatności, więc nie ma czego pomylić ani czym wyciec.
- **Mniej pracy przy zmianach.** Nowa metoda płatności albo zmiana cennika
  to zmiana w panelu Bookero, nie wdrożenie kodu.

**Co skonfigurować:** w panelu Bookero — operatora płatności, czas na opłacenie,
treści e-maili i integrację z Fakturownią. W witrynie tylko
`NEXT_PUBLIC_BOOKERO_PLUGIN_ID`. Zmienne `HOTPAY_*` i `FAKTUROWNIA_*`
zostawiasz **puste**.

### Wariant B — płatności po stronie aplikacji (HotPay + Fakturownia)

```
Użytkownik → rezerwacja → HotPay (Pay by Link)
           → webhook /api/hotpay/notification (podpis SHA256)
           → Fakturownia (idempotentnie) → e-mail z dokumentem
```

**Kiedy ma sens:** gdy HotPay jest wymagany, a nie ma go na liście operatorów
obsługiwanych przez Bookero, albo gdy potrzebna jest własna logika
wokół płatności.

Ten wariant jest **w pełni zaimplementowany** — weryfikacja podpisu,
idempotentne wystawianie dokumentów, obsługa statusów, rate limiting.
Uruchamia się przez uzupełnienie zmiennych `HOTPAY_*` i `FAKTUROWNIA_*`.

> **Nie włączaj obu naraz.** Jeśli Bookero ma włączoną własną integrację
> z Fakturownią, a jednocześnie ustawisz `FAKTUROWNIA_*` w aplikacji,
> do jednej transakcji powstaną **dwa dokumenty** — z różnych systemów,
> więc żaden mechanizm idempotencji tego nie wyłapie.

---

## 3. Bookero

**Plik:** `src/components/booking/BookeroWidget.tsx`

### Metoda integracji

Zgodna z oficjalną dokumentacją Bookero (panel → zakładka **Integracje**):

```html
<div id="bookero"></div>
<script>
  var bookero_config = {
    id: 'ID_WTYCZKI',
    container: 'bookero',
    type: 'calendar',
    position: '',
    plugin_css: true,
    lang: 'pl'
  };
</script>
<script src="https://www.bookero.pl/plugin/v2/js/bookero-compiled.js"></script>
```

Komponent robi dokładnie to samo, tylko sterowane Reactem: ustawia
`window.bookero_config` **przed** wstrzyknięciem skryptu (plugin czyta
konfigurację przy inicjalizacji) i dokłada kontener o wymaganym `id="bookero"`.

### Decyzje projektowe

**Widget, nie przekierowanie.** Kliknięcie „Zarezerwuj” nie wyrzuca użytkownika
na obcą domenę. Przekierowanie do zewnętrznego kalendarza jest najczęstszym
miejscem, w którym rezerwacje się urywają — znika kontekst, znika zaufanie,
znika analityka.

**Ponowne wstrzyknięcie skryptu przy nawigacji.** Przy przejściu między
stronami po stronie klienta skrypt Bookero jest już w dokumencie i nie
zainicjalizuje się drugi raz. Komponent usuwa stary element `<script>`
i dodaje nowy, żeby kalendarz pojawił się także przy powrocie na stronę.

**Osobna wtyczka dla tuftingu.** `NEXT_PUBLIC_BOOKERO_PLUGIN_ID_TUFTING`
pozwala obsłużyć warsztaty osobnym grafikiem. Brak zmiennej = tufting
korzysta z wtyczki głównej.

**Brak konfiguracji jest widoczny.** Bez `NEXT_PUBLIC_BOOKERO_PLUGIN_ID`
komponent nie pokazuje atrapy kalendarza, tylko komunikat z nazwą brakującej
zmiennej i odesłaniem do `SETUP.md`.

### Stylowanie

Widget renderuje własny HTML, nad którym nie mamy kontroli. Otacza go
`.bookero-shell` (`globals.css`), który:

- osadza kalendarz w ramce spójnej z systemem projektowym,
- narzuca krój pisma na kontrolkach,
- **przewija widget poziomo na wąskich ekranach** zamiast rozpychać całą stronę.

Stylowanie jest **defensywne** — opiera się na selektorach ogólnych, nie na
klasach Bookero. Gdy Bookero zmieni strukturę HTML, kalendarz nadal działa,
traci co najwyżej dopasowanie kolorów.

---

## 4. HotPay

**Pliki:** `src/server/hotpay.ts`, `src/app/api/hotpay/notification/route.ts`

### Weryfikacja powiadomień

Zgodnie z dokumentacją techniczną Pay by Link, powiadomienie zawiera
`KWOTA`, `ID_PLATNOSCI`, `ID_ZAMOWIENIA`, `STATUS`, `SEKRET` oraz `HASH`, gdzie:

```
HASH = sha256( HASŁO_Z_USTAWIEŃ ; KWOTA ; ID_PLATNOSCI ; ID_ZAMOWIENIA ; STATUS ; SEKRET )
```

Implementacja:

1. Sprawdza obecność **wszystkich** wymaganych pól — brak choćby jednego → `400`.
2. Porównuje `SEKRET` z powiadomienia z `HOTPAY_SECRET`.
3. Wylicza skrót i porównuje go z `HASH` przez **`timingSafeEqual`**
   (porównanie w czasie stałym — nie wyciekamy informacji przez pomiar czasu).
4. Niepoprawny podpis → `403` i wpis w logu. **Nic więcej się nie dzieje.**

### Obsługa statusów

| `STATUS` | Zachowanie |
| --- | --- |
| `SUCCESS` | Wystawienie dokumentu + e-mail |
| `PENDING` | Tylko wpis w logu |
| `FAILURE` | Tylko wpis w logu |

### Adresy powrotne a prawda o płatności

Strony `/platnosc/sukces`, `/platnosc/oczekujaca`, `/platnosc/nieudana`
służą **wyłącznie do poinformowania użytkownika**.

> **To nie jest szczegół.** Parametry w adresie zwrotnym może podmienić
> każdy, kto potrafi edytować URL. O tym, czy płatność doszła, decyduje
> **wyłącznie podpisane powiadomienie serwer-serwer**. Nigdy nie wystawiamy
> dokumentu ani nie potwierdzamy rezerwacji na podstawie tego, co widzi
> przeglądarka.

Strony statusu mają `noindex` i są wykluczone z mapy witryny.

### Dlaczego webhook zwraca 200 nawet przy błędzie Fakturowni

Płatność jest w tym momencie poprawna i zaksięgowana. Zwrócenie błędu
spowodowałoby lawinę ponowień ze strony HotPay, która i tak niczego nie
naprawi (skoro Fakturownia nie odpowiada). Problem trafia do logów
do ręcznej obsługi — a klient nie zostaje bez rezerwacji z powodu awarii
systemu księgowego.

---

## 5. Fakturownia

**Plik:** `src/server/fakturownia.ts`

Zgodnie z oficjalną dokumentacją (`github.com/fakturownia/API`):

```
POST https://{konto}.fakturownia.pl/invoices.json
{ "api_token": "...", "invoice": { kind, positions[], buyer_*, oid, oid_unique } }
```

| Ustawienie | Wartość | Uwagi |
| --- | --- | --- |
| `kind` | `receipt` / `vat` | Paragon lub faktura — `FAKTUROWNIA_DEFAULT_KIND` |
| `status` | `paid` | Płatność już nastąpiła |
| `oid` | ID płatności HotPay | Klucz idempotencji |
| `oid_unique` | `yes` | **Blokada duplikatów po stronie Fakturowni** |
| `positions[].tax` | `FAKTUROWNIA_VAT_RATE` | Domyślnie 23 — potwierdź z księgowością |

Wysyłka dokumentu e-mailem: `POST /invoices/{id}/send_by_email.json?email_pdf=true`.

**E-mail wychodzi tylko przy pierwszym wystawieniu.** Przy powtórzonym
webhooku klient nie dostanie tej samej faktury drugi raz.

---

## 6. Idempotencja

> Wymaganie z briefu: *„Nie może powstać 5 faktur po pięciokrotnym wysłaniu
> webhooka.”*

Bramki płatnicze **ponawiają** webhooki — przy timeoutach, błędach sieci,
albo po prostu z ostrożności. To nie jest sytuacja wyjątkowa, tylko normalna
praca systemu.

Zabezpieczenie ma **dwie warstwy**:

### Warstwa 1 — `oid_unique` (właściwa ochrona)

Każdy dokument dostaje `oid` równy **ID płatności HotPay** (globalnie unikalne)
oraz `oid_unique: 'yes'`. Przy tym ustawieniu **Fakturownia odmawia** utworzenia
drugiego dokumentu z tym samym `oid`.

Kluczowe: **kontrola jest po stronie Fakturowni, nie naszej.** Działa więc także:

- przy równoległych żądaniach (dwa webhooki w tej samej milisekundzie),
- po restarcie aplikacji,
- przy wielu instancjach serverless, które nie współdzielą pamięci.

Odrzucenie z powodu nieunikalnego `oid` jest traktowane jako **sukces**
(`status: 'duplicate'`), nie awaria — bo znaczy dokładnie tyle, że dokument
dla tej transakcji już istnieje.

### Warstwa 2 — sprawdzenie przed zapisem

Przed wystawieniem pytamy o dokument o danym `oid`. Jeśli istnieje, zwracamy go
bez próby zapisu. Ta warstwa oszczędza niepotrzebne żądania i daje czytelny log —
ale **nie jest zabezpieczeniem**, bo między sprawdzeniem a zapisem jest okno
wyścigu. Zamyka je dopiero warstwa 1.

### Czego świadomie NIE robimy

**Nie prowadzimy własnej bazy „przetworzonych transakcji”.** Byłoby to trzecie
źródło prawdy o płatnościach — obok Bookero i Fakturowni — które może rozjechać
się z pozostałymi i wymaga własnej kopii zapasowej. Skoro Fakturownia
udostępnia udokumentowany mechanizm unikalności, korzystamy z niego.

---

## 7. Formularz kontaktowy (Resend)

**Pliki:** `src/app/api/contact/route.ts`, `src/lib/contact-schema.ts`

Zabezpieczenia, świadomie **bez CAPTCHA**:

| Warstwa | Działanie |
| --- | --- |
| Honeypot | Ukryte pole `website` — wypełniają je tylko boty |
| Próg czasu | Wysyłka szybciej niż 3 s od wyrenderowania = spam |
| Rate limiting | 5 zgłoszeń / 10 min na adres IP |
| Walidacja Zod | Ten sam schemat po stronie klienta i serwera |

Wykryty spam dostaje odpowiedź **sukcesu** — bot nie dowiaduje się,
że został rozpoznany, więc nie próbuje obejścia.

**Dlaczego bez CAPTCHA:** reCAPTCHA dokłada kilkaset kilobajtów JavaScriptu
na stronie kontaktu, przekazuje ruch użytkowników Google i realnie utrudnia
wysłanie wiadomości osobom korzystającym z czytników ekranu. Dla formularza
lokalnej stajni powyższe cztery warstwy w zupełności wystarczą.

**Bez klucza Resend endpoint nie udaje wysyłki.** Zwraca `503`, zapisuje
zgłoszenie w logu serwera i pokazuje użytkownikowi komunikat z alternatywną
drogą kontaktu. Formularz, który mówi „wysłano”, a nic nie wysyła, jest
gorszy od braku formularza.

---

## 8. Opinie Google

**Plik:** `src/content/testimonials.ts` — **celowo pusta tablica**.

Nie generujemy fikcyjnych opinii i nie emitujemy `AggregateRating`
bez realnych recenzji. To naruszenie wytycznych Google dotyczących opinii
i realne ryzyko kary ręcznej, która usuwa firmę z wyników lokalnych.

Dopóki opinii nie ma, sekcja pokazuje uczciwy stan pusty z linkiem
do wizytówki Google.

**Droga 1 — ręcznie (zalecana na start).** WordPress → **Opinie**.
Autor, ocena i data przepisane bez zmian z wizytówki Google.

**Droga 2 — automatycznie.** Google Places API, metoda **Place Details**
z polem `reviews`:

```
GET https://maps.googleapis.com/maps/api/place/details/json
    ?place_id={PLACE_ID}&fields=reviews,rating,user_ratings_total&language=pl&key={KEY}
```

Warto wiedzieć przed decyzją:

- API zwraca **maksymalnie 5 opinii** i nie pozwala wybrać, których,
- warunki Google wymagają wyświetlania opinii bez modyfikacji, z atrybucją,
- klucz musi być używany **wyłącznie po stronie serwera** (nie `NEXT_PUBLIC_`),
- odpowiedzi trzeba cache'ować — to płatne API rozliczane za wywołanie.

Miejsce na tę integrację: nowa funkcja w `src/cms/content.ts`, obok
`getTestimonials()`, z zachowaniem tego samego typu `Testimonial`.
Reszta serwisu nie wymaga zmian.

---

## 9. Bezpieczeństwo

| Obszar | Rozwiązanie |
| --- | --- |
| Sekrety | Wyłącznie przez zmienne środowiskowe; `.env.local` w `.gitignore` |
| Dane kart | **Nigdy nie dotykają aplikacji** — HotPay ich nie przekazuje i nie chcemy ich mieć |
| Podpisy webhooków | HotPay: SHA256 + `timingSafeEqual`; revalidate: sekret nagłówkowy + `timingSafeEqual` |
| Rate limiting | Formularz 5/10 min, webhook HotPay 60/min, revalidate 120/min (per IP) |
| Walidacja wejścia | Zod na każdym endpoint'cie; odrzucenie przed jakąkolwiek logiką |
| CSP | Pełna polityka w `next.config.ts` — hosty CMS-u brane ze zmiennej, bez wieloznaczników |
| Nagłówki | HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` |
| Indeksowanie | `X-Robots-Tag: noindex` na `/api/*`, `noindex` na stronach płatności |
| WordPress | Headless — `publicly_queryable` wyłączone, WP nie serwuje stron publicznie |
| Tagi cache | Webhook przyjmuje **tylko** tagi z własnej listy — nie da się odświeżyć cudzego cache |

**Uwaga o rate limitingu:** licznik żyje w pamięci instancji, więc przy wielu
instancjach serverless limit obowiązuje per instancja. Dla tej skali ruchu to
wystarcza — chodzi o odcięcie prostego zalewu, nie o rozproszony rate limiting.
Gdyby ruch tego wymagał, `src/server/rate-limit.ts` jest jedynym miejscem
do podmiany (np. na Upstash Redis).
