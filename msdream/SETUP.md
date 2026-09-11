# SETUP — uruchomienie i konfiguracja

Dokument prowadzi od pustego katalogu do w pełni działającego serwisu.
Sekcje są ułożone w kolejności, w której warto je wykonywać — każda następna
jest opcjonalna względem poprzedniej.

---

## Spis treści

1. [Uruchomienie lokalne](#1-uruchomienie-lokalne)
2. [WYMAGANE OD WŁAŚCICIELA](#2-wymagane-od-właściciela) ← **zacznij tutaj, jeśli jesteś właścicielem**
3. [Instalacja WordPressa (CMS)](#3-instalacja-wordpressa-cms)
4. [Bookero — rezerwacje](#4-bookero--rezerwacje)
5. [HotPay — płatności](#5-hotpay--płatności)
6. [Fakturownia — dokumenty sprzedaży](#6-fakturownia--dokumenty-sprzedaży)
7. [Formularz kontaktowy](#7-formularz-kontaktowy)
8. [Mapa Google](#8-mapa-google)
9. [Analityka](#9-analityka)
10. [Weryfikacja końcowa](#10-weryfikacja-końcowa)

---

## 1. Uruchomienie lokalne

Wymagania: **Node.js 20.9+** (zalecane 22 LTS), npm 10+.

```bash
cd msdream
npm install
npm run dev
```

Strona ruszy na `http://localhost:3000` **bez żadnej konfiguracji**.
Korzysta wtedy z treści startowej, a integracje pokazują jawny stan
„do skonfigurowania” zamiast udawać, że działają.

Aby dodać zmienne środowiskowe:

```bash
cp .env.example .env.local
```

`.env.local` jest w `.gitignore` i **nigdy nie powinien trafić do repozytorium**.

---

## 2. WYMAGANE OD WŁAŚCICIELA

> **Dlaczego ta lista istnieje**
>
> Podczas budowy serwisu domena `msdream.pl` była **nieosiągalna** ze środowiska
> wykonawczego (blokada polityki sieciowej; bezskutecznie próbowano też archiwum
> Wayback Machine oraz indeksu wyszukiwarki). Nie udało się więc odczytać
> obowiązujących cen, nazwisk, zdjęć ani danych firmowych.
>
> **Te dane nie zostały zmyślone.** Każda pozycja poniżej jest w kodzie
> oznaczona i gotowa do wprowadzenia — patrz sekcja „Uczciwość danych”
> w `README.md`.

### 2.1. Dane firmowe (najwyższy priorytet — wpływają na SEO lokalne)

Panel WordPress → **Ustawienia witryny**:

| Pole | Uwagi |
| --- | --- |
| Pełna nazwa firmy | Z CEIDG/KRS — trafia do danych strukturalnych |
| Ulica i numer | Dokładny adres stajni |
| Kod pocztowy | Format `05-092` |
| Telefon | Format `+48 XXX XXX XXX` |
| E-mail | Np. `kontakt@msdream.pl` |
| NIP | |
| Szerokość / długość geograficzna | Z Google Maps — potrzebne do mapy i `LocalBusiness.geo` |
| Place ID wizytówki Google | Potrzebne do linku z opiniami |
| Social media | Jeden profil w linii, format `Facebook\|https://…` |

> **Krytyczne dla SEO lokalnego:** te dane muszą być **identyczne** z wizytówką
> Google Business Profile i z katalogami branżowymi. Rozjazd w zapisie adresu
> osłabia pozycję w wynikach lokalnych. Dopóki pola są puste, dane adresowe
> **nie są publikowane** w `schema.org` — świadomie, bo błędny NAP szkodzi
> bardziej niż jego brak.

### 2.2. Godziny otwarcia

Obecnie puste — sekcja godzin i pole `openingHoursSpecification` w danych
strukturalnych są pomijane. Uzupełnij w `src/lib/site.ts` (stała `OPENING_HOURS`)
w formacie:

```ts
export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '20:00' },
  { days: ['Saturday', 'Sunday'], opens: '09:00', closes: '18:00' },
];
```

### 2.3. Ceny i czasy trwania zajęć

Panel WordPress → **Oferta**. Dla każdej z 9 usług: pole **Cena** i **Czas trwania**.

Dopóki cena jest pusta, interfejs pokazuje „Cena do uzupełnienia”,
a oferta **nie trafia** do danych strukturalnych.

Usługi w systemie (nazwy odpowiadają obecnej ofercie MSdream):

- **Jazda konna:** ABC dla najmłodszych, Jazda indywidualna, Zajęcia dla dzieci,
  Jazda dla dorosłych, Pakiety jazd
- **Tufting:** Warsztaty indywidualne, Mama z dzieckiem, Warsztaty grupowe,
  Urodziny z tuftingiem

> Jeżeli faktyczna oferta różni się od powyższej — dodaj, usuń lub zmień
> nazwy usług w CMS. Kod nie zakłada tej listy na sztywno.

### 2.4. Instruktorzy

Panel WordPress → **Instruktorzy**. Wymagane: imię i nazwisko, funkcja, opis,
doświadczenie, zdjęcie portretowe.

Profile bez nazwiska **nie są generowane** i nie trafiają do mapy witryny —
pusta strona „Instruktor 1” w indeksie Google byłaby gorsza niż jej brak.

### 2.5. Zdjęcia

To największy pojedynczy element wpływający na odbiór serwisu.

W miejscach, gdzie brakuje zdjęcia, strona wyświetla **brief fotograficzny** —
opis ujęcia, które należy zrobić (kadr, proporcje, światło). Wystarczy przejść
przez serwis i wypisać wszystkie widoczne pola „PHOTO REQUIRED”.

Najważniejsze:

| Miejsce | Brief |
| --- | --- |
| Hero strony głównej | Jeździec i koń pod słońce, złota godzina, kadr pionowy 3:4, dużo przestrzeni u góry na typografię |
| Każda z 9 usług | Zdjęcie ilustrujące konkretne zajęcia |
| Portrety instruktorów | Pion 4:5, przy koniu, naturalne światło |
| Galeria | 9 kadrów w mieszanych proporcjach (duży, dwa piony, pełna szerokość) |
| Warsztaty tuftingu | 4 etapy procesu + gotowy dywanik |

> **Nie zastępuj tych briefów zdjęciami stockowymi.** Stockowy koń na stronie
> prawdziwej stajni jest natychmiast rozpoznawalny i podkopuje wiarygodność
> całego serwisu — dlatego kod celowo pokazuje brief zamiast wstawiać stock.

Wymagania techniczne: JPG/PNG, dłuższy bok **min. 1600 px**. Konwersję
do WebP/AVIF, skalowanie i `srcset` Next.js wykonuje automatycznie.

### 2.6. Opinie

Sekcja opinii jest **celowo pusta**. Nie generujemy fikcyjnych recenzji —
to naruszenie wytycznych Google i realne ryzyko kary ręcznej.

Dwie drogi:

1. **Ręcznie:** WordPress → **Opinie** → przepisz istniejące opinie
   z wizytówki Google (autor, ocena, data, treść — bez zmian w treści).
2. **Automatycznie:** integracja z Google Places API — opisana
   w `INTEGRATIONS.md`.

Ocena zbiorcza (`AggregateRating`) jest **wyliczana** z realnych opinii,
nigdy wpisywana ręcznie.

### 2.7. Dokumenty prawne

WordPress → **Dokumenty prawne**. Cztery dokumenty, każdy z uproszczonym
adresem (slug):

| Slug | Dokument |
| --- | --- |
| `polityka-prywatnosci` | Polityka prywatności |
| `cookies` | Polityka cookies |
| `regulamin` | Regulamin strony |
| `regulamin-rezerwacji` | Regulamin rezerwacji |

> **Przenieś obowiązujące wersje z dotychczasowej strony msdream.pl bez zmian
> w ich znaczeniu.** Świadomie nie wygenerowaliśmy zastępczej treści prawnej:
> dokument, który wygląda jak polityka prywatności, ale nie opisuje
> rzeczywistych procesów przetwarzania danych, wprowadza użytkownika w błąd
> co do jego praw.
>
> Uwaga: regulamin rezerwacji musi opisywać **rzeczywiste** zasady odwoływania
> terminów i zwrotów, zgodne z tym, co jest skonfigurowane w Bookero.

---

## 3. Instalacja WordPressa (CMS)

### 3.1. Postaw WordPressa

Dowolny hosting z PHP 8.0+. **Zalecana osobna subdomena**, np. `cms.msdream.pl` —
oddziela panel od witryny publicznej.

### 3.2. Zainstaluj wtyczkę z modelem treści

Skopiuj plik `wordpress/msdream-cms.php` do:

```
wp-content/plugins/msdream-cms/msdream-cms.php
```

Następnie: **Wtyczki → Zainstalowane → MSdream — model treści → Włącz**.

Po włączeniu w menu pojawią się: Oferta, Instruktorzy, Galeria, Opinie, FAQ,
Konie, Poradnik, Dokumenty prawne oraz Ustawienia witryny.

> Wtyczka nie wymaga **żadnych płatnych dodatków** — w szczególności nie
> potrzebuje ACF Pro. Korzysta wyłącznie z API rdzenia WordPressa.

### 3.3. Połącz z witryną

W `.env.local` (i w panelu hostingu produkcyjnego):

```bash
WORDPRESS_API_URL="https://cms.msdream.pl/wp-json"
CMS_REVALIDATE_SECRET="<długi losowy ciąg>"
```

Sekret wygenerujesz np. poleceniem:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4. Włącz natychmiastowe odświeżanie treści

W pliku `wp-config.php` WordPressa dodaj (przed linią `/* That's all */`):

```php
define( 'MSDREAM_REVALIDATE_URL', 'https://msdream.pl/api/revalidate' );
define( 'MSDREAM_REVALIDATE_SECRET', 'ten sam ciąg co CMS_REVALIDATE_SECRET' );
```

Bez tego zmiany w panelu będą widoczne dopiero po godzinie (czas życia cache).
Z tym — w kilkanaście sekund.

### 3.5. Sprawdź

```bash
curl https://cms.msdream.pl/wp-json/msdream/v1/settings
```

Powinien zwrócić JSON z danymi firmy (na początku: `{"socials":[]}`).

---

## 4. Bookero — rezerwacje

1. Zaloguj się do panelu Bookero.
2. Przejdź do zakładki **Integracje**.
3. Skopiuj **ID wtyczki** z gotowego kodu integracyjnego.
4. Ustaw zmienną:

```bash
NEXT_PUBLIC_BOOKERO_PLUGIN_ID="<id-wtyczki>"
```

Jeśli warsztaty tuftingu mają w Bookero osobną wtyczkę (inne usługi, inny grafik):

```bash
NEXT_PUBLIC_BOOKERO_PLUGIN_ID_TUFTING="<id-wtyczki-tuftingu>"
```

Puste = tufting korzysta z wtyczki głównej.

> **Do skonfigurowania po stronie Bookero:** lista usług wraz z cenami i czasem
> trwania, dostępność instruktorów, zasady i termin anulowania rezerwacji,
> treść e-maili potwierdzających. Kalendarz na stronie odzwierciedla to,
> co jest w panelu Bookero — witryna niczego tu nie nadpisuje.

Szczegóły działania widgetu: `INTEGRATIONS.md`.

---

## 5. HotPay — płatności

> **Najpierw przeczytaj `INTEGRATIONS.md`, sekcję „Który wariant płatności
> wybrać”.** W większości przypadków **nie należy** wypełniać tych zmiennych —
> płatności obsługuje bezpośrednio Bookero, a duplikowanie tej logiki po stronie
> witryny tworzy drugie źródło prawdy o transakcjach.

Jeśli płatności mają jednak przechodzić przez tę aplikację:

1. Panel HotPay → wybierz usługę.
2. Skopiuj **SEKRET** oraz **hasło z ustawień** usługi.
3. Ustaw adres powiadomień na: `https://msdream.pl/api/hotpay/notification`
4. Ustaw adresy powrotne:
   - sukces → `https://msdream.pl/platnosc/sukces`
   - błąd → `https://msdream.pl/platnosc/nieudana`
   - oczekująca → `https://msdream.pl/platnosc/oczekujaca`
5. Zmienne:

```bash
HOTPAY_SECRET="<sekret usługi>"
HOTPAY_PASSWORD="<hasło z ustawień usługi>"
```

---

## 6. Fakturownia — dokumenty sprzedaży

1. Zaloguj się do Fakturowni.
2. **Ustawienia → Ustawienia konta → Integracja → Kod autoryzacyjny API**.
3. Zmienne:

```bash
FAKTUROWNIA_API_TOKEN="<token>"
FAKTUROWNIA_ACCOUNT="msdream"        # poddomena: msdream.fakturownia.pl
FAKTUROWNIA_DEFAULT_KIND="receipt"   # "receipt" = paragon, "vat" = faktura VAT
FAKTUROWNIA_VAT_RATE="23"
```

> **Potwierdź stawkę VAT z księgowością.** Usługi rekreacyjne bywają objęte
> stawką obniżoną — domyślne 23% jest bezpiecznym założeniem technicznym,
> nie poradą podatkową.

> **Uwaga:** jeśli płatności obsługuje Bookero, ma ono **własną, natywną
> integrację z Fakturownią**. Włącz ją w panelu Bookero zamiast konfigurować
> te zmienne — inaczej powstaną dwa dokumenty do jednej transakcji.
> Szczegóły: `INTEGRATIONS.md`.

---

## 7. Formularz kontaktowy

1. Załóż konto na [resend.com](https://resend.com).
2. Zweryfikuj domenę nadawcy (rekordy SPF/DKIM w DNS).
3. Zmienne:

```bash
RESEND_API_KEY="re_..."
CONTACT_EMAIL_TO="kontakt@msdream.pl"
CONTACT_EMAIL_FROM="Formularz MSdream <formularz@msdream.pl>"
```

Bez klucza formularz **nie udaje wysyłki**: waliduje dane, zapisuje zgłoszenie
w logu serwera i zwraca użytkownikowi czytelny komunikat z alternatywną drogą
kontaktu.

---

## 8. Mapa Google

Opcjonalne. Bez klucza sekcja mapy pokazuje stylizowaną fasadę z przyciskiem
„Otwórz w Google Maps” — działającym i sensownym.

Z kluczem osadzamy mapę, ładowaną dopiero po kliknięciu użytkownika:

1. Google Cloud Console → włącz **Maps Embed API**.
2. Utwórz klucz i **ogranicz go do domeny** `msdream.pl`.
3. `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY="..."`

---

## 9. Analityka

```bash
NEXT_PUBLIC_GA4_ID="G-..."
NEXT_PUBLIC_META_PIXEL_ID="..."
GOOGLE_SITE_VERIFICATION="..."
```

Skrypty ładują się **wyłącznie po zgodzie użytkownika** na cookies.
Puste wartości = baner cookies w ogóle się nie pojawia (nie ma o co pytać).

Śledzone zdarzenia: `booking_click`, `service_view`, `booking_start`,
`booking_complete`, `contact_click`, `phone_click`, `email_click`,
`directions_click`, `gallery_open`.

---

## 10. Weryfikacja końcowa

```bash
npm run lint
npm run typecheck
npm run build
```

Wszystkie trzy muszą przejść bez błędów.

Następnie przejdź listę kontrolną w `DEPLOYMENT.md` przed przełączeniem DNS.
