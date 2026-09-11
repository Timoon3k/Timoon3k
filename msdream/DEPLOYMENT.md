# DEPLOYMENT — wdrożenie produkcyjne

---

## 1. Architektura wdrożenia

Dwa niezależne elementy, na dwóch różnych serwerach:

```
┌──────────────────────────┐         ┌────────────────────────────┐
│  msdream.pl              │         │  cms.msdream.pl            │
│  Next.js na Vercelu      │◄────────│  WordPress (headless)      │
│  — 39 stron statycznych  │  REST   │  — panel treści            │
│  — webhooki API          │────────►│  — webhook odświeżania     │
└──────────────────────────┘         └────────────────────────────┘
```

**Dlaczego dwa serwery:** WordPress nie obsługuje ruchu odwiedzających —
jest wyłącznie panelem redakcyjnym. Nawet gdyby padł, strona działa dalej
(patrz „Odporność na awarie” w `README.md`). To także główna zaleta
bezpieczeństwa: publiczny WordPress jest jednym z najczęściej atakowanych
celów w internecie, a tutaj nie jest publiczny.

---

## 2. Wdrożenie WordPressa

### 2.1. Hosting

Wystarczy zwykły hosting współdzielony z **PHP 8.0+** i MySQL.
Nie potrzeba VPS-a ani wydajnego serwera — panel obsługuje jedną osobę,
nie tysiące odwiedzających.

Zalecana subdomena: `cms.msdream.pl`.

### 2.2. Instalacja

1. Zainstaluj WordPressa standardową procedurą.
2. Skopiuj `wordpress/msdream-cms.php` do
   `wp-content/plugins/msdream-cms/msdream-cms.php`.
3. **Wtyczki → Włącz** „MSdream — model treści”.
4. Usuń domyślne treści („Witaj, świecie!”, przykładowa strona).

### 2.3. Utwardzenie

W `wp-config.php`:

```php
// Blokada edycji plików z panelu — najczęstsza droga eskalacji po włamaniu.
define( 'DISALLOW_FILE_EDIT', true );
define( 'DISALLOW_FILE_MODS', true );

// Wymuszenie HTTPS na panelu.
define( 'FORCE_SSL_ADMIN', true );

// Webhook odświeżający cache witryny.
define( 'MSDREAM_REVALIDATE_URL', 'https://msdream.pl/api/revalidate' );
define( 'MSDREAM_REVALIDATE_SECRET', '<ten sam ciąg co CMS_REVALIDATE_SECRET>' );
```

Dodatkowo:

- silne, unikalne hasło administratora + **uwierzytelnianie dwuskładnikowe**
- konto redakcyjne w roli **Redaktor**, nie Administrator
- automatyczne aktualizacje wydań zabezpieczających
- regularne kopie zapasowe bazy (większość hostingów robi to sama)

> Wtyczka celowo nie dodaje żadnych publicznych endpointów poza jednym
> (`/wp-json/msdream/v1/settings`), który zwraca dane firmowe widoczne
> i tak w stopce strony.

---

## 3. Wdrożenie witryny (Vercel)

### 3.1. Podłączenie repozytorium

1. Vercel → **Add New → Project** → wskaż repozytorium.
2. **Root Directory:** ustaw na **`msdream`** ← *to jest kluczowe; aplikacja
   leży w podkatalogu repozytorium*.
3. Framework preset: **Next.js** (wykryje się sam).
4. Build command i output: **zostaw domyślne**.

### 3.2. Zmienne środowiskowe

W **Settings → Environment Variables** dodaj zmienne z `.env.example`,
które chcesz aktywować. Minimum na start:

| Zmienna | Wartość |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://msdream.pl` (bez ukośnika na końcu) |
| `WORDPRESS_API_URL` | `https://cms.msdream.pl/wp-json` |
| `CMS_REVALIDATE_SECRET` | ten sam ciąg co w `wp-config.php` |
| `NEXT_PUBLIC_BOOKERO_PLUGIN_ID` | ID wtyczki z panelu Bookero |
| `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` | obsługa formularza |

> **Ustaw `NEXT_PUBLIC_SITE_URL` dopiero wtedy, gdy domena wskazuje
> na wdrożenie.** Wcześniej zostaw ją pustą — projekt użyje wtedy adresu
> `*.vercel.app`, dzięki czemu `canonical`, Open Graph i mapa witryny
> nie będą wskazywać domeny prowadzącej jeszcze pod stary serwis.

### 3.3. Inne platformy

Projekt nie używa niczego specyficznego dla Vercela. Zadziała wszędzie,
gdzie działa Next.js 16 w trybie Node.js — Netlify, Cloudflare Pages
(z adapterem Node), własny VPS z `npm run build && npm start`, Docker.

Jedyny wymóg: **środowisko Node.js**, nie eksport statyczny — webhooki
(`/api/*`) muszą wykonywać się po stronie serwera.

---

## 4. Konfiguracja integracji po wdrożeniu

Po pierwszym wdrożeniu uzupełnij adresy zwrotne w panelach zewnętrznych:

| System | Co ustawić |
| --- | --- |
| **Bookero** | Domenę witryny na liście dozwolonych (jeśli panel tego wymaga) |
| **HotPay** | Powiadomienia → `https://msdream.pl/api/hotpay/notification`<br>Sukces → `/platnosc/sukces`, błąd → `/platnosc/nieudana`, oczekująca → `/platnosc/oczekujaca` |
| **Resend** | Weryfikacja domeny nadawcy (SPF/DKIM w DNS) |
| **Google Maps** | Ograniczenie klucza do domeny `msdream.pl` |
| **Google Search Console** | Dodanie własności + `GOOGLE_SITE_VERIFICATION` |

---

## 5. Testy przed przełączeniem DNS

Wykonaj na adresie tymczasowym (`*.vercel.app`), zanim domena zacznie
wskazywać nowy serwer.

### Budowa i jakość kodu

```bash
npm run lint && npm run typecheck && npm run build
```

Wszystkie trzy muszą przejść bez błędów.

### Lista kontrolna funkcjonalna

**Nawigacja i układ**
- [ ] Wszystkie pozycje menu prowadzą do istniejących stron
- [ ] Menu mobilne otwiera się, zamyka `Esc` i zamyka się po przejściu na stronę
- [ ] Sticky CTA rezerwacji pojawia się po zejściu z pierwszego ekranu
- [ ] Stopka: wszystkie odnośniki działają
- [ ] Strona 404 (wejdź na `/nieistniejacy-adres`)

**Treść i CMS**
- [ ] Zmiana w panelu WordPress pojawia się na stronie w ciągu ~15 s
- [ ] Wyłączenie WordPressa nie kładzie strony (spada na treść startową)
- [ ] Zdjęcia z CMS-u wyświetlają się (host w `WORDPRESS_API_URL`)

**Rezerwacja i płatności**
- [ ] Kalendarz Bookero ładuje się na `/rezerwacja` i `/rezerwacja-tuftingu`
- [ ] Kalendarz jest używalny na telefonie (szerokość 375 px)
- [ ] Testowa rezerwacja przechodzi do końca
- [ ] Strony `/platnosc/sukces`, `/oczekujaca`, `/nieudana` wyświetlają się
- [ ] **Webhook HotPay:** żądanie z błędnym `HASH` zwraca **403**
- [ ] **Idempotencja:** pięciokrotne wysłanie tego samego powiadomienia
      tworzy **dokładnie jeden** dokument w Fakturowni

**Formularz**
- [ ] Walidacja pokazuje błędy przy pustych i błędnych polach
- [ ] Poprawne zgłoszenie dociera na `CONTACT_EMAIL_TO`
- [ ] „Odpowiedz” w kliencie poczty kieruje na adres nadawcy
- [ ] Sześć zgłoszeń pod rząd → szóste odrzucone (`429`)

**SEO**
- [ ] `/sitemap.xml` zwraca wszystkie strony i żadnego martwego adresu
- [ ] `/robots.txt` poprawny
- [ ] Każda podstrona ma unikalny tytuł i opis
- [ ] [Test wyników z elementami rozszerzonymi](https://search.google.com/test/rich-results) bez błędów
- [ ] Canonical na każdej podstronie wskazuje sam siebie

**Wygląd i urządzenia**
- [ ] Szerokości: 375, 390, 430, 768, 1024, 1440, 1920 px
- [ ] Chrome, Firefox, Safari (także iOS)
- [ ] Brak poziomego przewijania na żadnej szerokości
- [ ] Galeria i lightbox działają dotykiem

**Dostępność**
- [ ] Cały serwis obsługiwalny samą klawiaturą
- [ ] Widoczny wskaźnik focusu na każdym elemencie interaktywnym
- [ ] `Esc` zamyka menu mobilne i lightbox, focus wraca na miejsce
- [ ] Włącz „ogranicz ruch” w systemie → animacje znikają, treść widoczna
- [ ] Lighthouse Accessibility ≥ 95

**Wydajność** *(mierz po wgraniu prawdziwych zdjęć)*
- [ ] Lighthouse mobile: Performance ≥ 90, SEO ≥ 95, Best Practices ≥ 95
- [ ] LCP < 2,0 s, CLS < 0,1

---

## 6. Checklista zmiany DNS

> **Najpierw wykonaj kroki z `REDIRECT_MAP.md`, sekcja 4** — pobranie
> rzeczywistej listy zaindeksowanych adresów. Bez tego ryzykujesz utratę
> pozycji wypracowanych przez lata.

### Przed zmianą

- [ ] Wszystkie testy z sekcji 5 zaliczone na adresie tymczasowym
- [ ] **Pełna kopia zapasowa starej strony** (pliki + baza) — zachowaj ją
- [ ] Lista zaindeksowanych adresów pobrana z Search Console
- [ ] Każdy stary adres ma decyzję: zachowany / 301 / świadome 404
- [ ] Brak łańcuchów przekierowań (maksymalnie jeden skok)
- [ ] `NEXT_PUBLIC_SITE_URL` ustawione na docelową domenę
- [ ] Domena dodana w Vercelu, certyfikat SSL wystawiony
- [ ] **Obniż TTL rekordów DNS do 300 s — na 24 h przed zmianą**

### Zmiana

- [ ] Przełącz rekordy DNS zgodnie z instrukcją Vercela (rekord A / CNAME)
- [ ] Poczekaj na propagację (zwykle minuty, formalnie do 48 h)
- [ ] Sprawdź, że `https://msdream.pl` prowadzi na nową stronę
- [ ] Sprawdź, że `https://www.msdream.pl` przekierowuje na wersję bez `www`
      (albo odwrotnie — **wybierz jeden wariant i trzymaj się go**)
- [ ] Sprawdź ważność certyfikatu SSL
- [ ] Przetestuj 5–10 starych adresów: każdy ma zwrócić **301** we właściwe miejsce

### Bezpośrednio po zmianie

- [ ] Dodaj nową własność w Google Search Console i zweryfikuj
- [ ] Prześlij `sitemap.xml`
- [ ] **Zostaw starą własność w Search Console** — pozwala śledzić migrację
- [ ] Sprawdź działanie formularza na produkcji (wyślij testową wiadomość)
- [ ] Wykonaj **jedną prawdziwą rezerwację z płatnością** i sprawdź, czy
      dokument sprzedaży powstał dokładnie raz
- [ ] Zaktualizuj adres strony w wizytówce Google Business Profile
- [ ] Zaktualizuj odnośniki w profilach social media
- [ ] Przywróć normalny TTL rekordów DNS (3600 s)

### Pierwsze tygodnie

- [ ] Monitoruj błędy 404 w Search Console — dopisuj brakujące przekierowania
- [ ] Sprawdzaj logi webhooków HotPay pod kątem nieudanych wystawień
- [ ] Obserwuj Core Web Vitals (dane rzeczywiste pojawiają się po ~28 dniach)
- [ ] **Nie panikuj przy chwilowym spadku pozycji** — po migracji to normalne;
      powrót zajmuje zwykle 4–6 tygodni

---

## 7. Wycofanie zmian

Jeśli coś pójdzie źle po przełączeniu DNS:

1. **Przywróć poprzednie rekordy DNS** — przy TTL 300 s stara strona
   wraca w kilka minut. To dlatego obniżamy TTL przed zmianą.
2. Stara strona działa nadal, dopóki nie usuniesz jej z hostingu —
   **nie usuwaj jej przez co najmniej miesiąc po migracji.**

Wycofanie samego wdrożenia witryny (bez DNS): Vercel → **Deployments** →
wybierz poprzednie wdrożenie → **Promote to Production**. Trwa kilkanaście
sekund i nie wymaga budowania od nowa.
