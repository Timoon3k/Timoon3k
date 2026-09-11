# WordPress jako CMS dla tej strony

Strona zostaje w Next.js. WordPress jest tylko zapleczem do wpisywania treści —
frontend czyta z niego przez REST API. To układ zwany „headless": panel
WordPressa znasz, a odwiedzający dostają stronę zbudowaną w Next.js.

Bez skonfigurowanego WordPressa strona nadal działa — na treści startowej
z `src/content`. To samo dzieje się, gdy hosting WordPressa nie odpowiada:
frontend zaloguje powód i pokaże treść startową zamiast się wywrócić.

---

## Co musisz mieć

| Element | Po co | Koszt orientacyjny |
|---|---|---|
| Hosting PHP 7.4+ z MySQL | uruchomienie WordPressa | 15–40 zł/mc |
| Domena lub subdomena, np. `cms.twojadomena.pl` | adres panelu | zwykle w cenie hostingu |
| Wtyczka do pól własnych (ACF, Meta Box albo Pods) | pola realizacji i usług | wersje darmowe wystarczą do prostszego modelu |

Pola powtarzalne (funkcje realizacji, galeria, pozycje FAQ) wymagają
w większości wtyczek wersji płatnej. Jeśli chcesz zostać na darmowej,
zobacz „Model bez pól powtarzalnych" na końcu.

---

## Instalacja krok po kroku

### 1. Postaw WordPressa

Na subdomenie, np. `cms.twojadomena.pl`. Standardowa instalacja, bez motywu —
motyw nie ma znaczenia, bo strony nie renderuje WordPress.

### 2. Wgraj wtyczkę mu

Skopiuj `majewski-content.php` do:

```
wp-content/mu-plugins/majewski-content.php
```

Katalog `mu-plugins` prawdopodobnie nie istnieje — utwórz go. Wtyczki
„must-use" włączają się same, nie da się ich przypadkiem wyłączyć i nie
pojawiają się na liście aktualizacji.

Po wgraniu w menu panelu zobaczysz: **Realizacje**, **Usługi**, **FAQ**, **Opinie**.

### 3. Sprawdź, czy API odpowiada

Wejdź w przeglądarce na:

```
https://cms.twojadomena.pl/wp-json/majewski/v1/projects
```

Powinieneś zobaczyć `[]` (pustą tablicę) albo listę realizacji. Jeśli widzisz
404 — wejdź w **Ustawienia → Bezpośrednie odnośniki** i kliknij *Zapisz zmiany*
(to przebudowuje reguły adresów).

### 4. Przełącz frontend na WordPressa

W pliku `.env.production` w repozytorium:

```env
CONTENT_SOURCE=wordpress
WORDPRESS_API_URL=https://cms.twojadomena.pl/wp-json
```

To nie są sekrety — adres API jest publiczny — więc mogą zostać w repozytorium.
Po commicie i pushu Vercel przebuduje stronę.

Żeby wrócić do Sanity, zmień `CONTENT_SOURCE` na `sanity`. Żeby wymusić treść
startową, wpisz `seed`.

### 5. Podłącz odświeżanie po publikacji (opcjonalne)

Bez tego zmiany pojawiają się na stronie do 5 minut po publikacji. Z tym —
od razu. W `wp-config.php` dodaj:

```php
define('MJ_REVALIDATE_URL',    'https://twojadomena.pl/api/revalidate');
define('MJ_REVALIDATE_SECRET', 'dowolny-dlugi-losowy-ciag');
```

Ten sam ciąg ustaw w Vercelu jako zmienną `CONTENT_REVALIDATE_SECRET`.
**Ta jedna trafia do panelu Vercela, nie do repozytorium** — to sekret.

---

## Co gdzie wpisywać

### Blog → zwykłe **Wpisy** WordPressa

Tytuł, treść, zajawka, obrazek wyróżniający i kategoria — wszystko natywne.
Treść pisz normalnie w edytorze blokowym.

Obsługiwane formatowanie: nagłówki, akapity, listy punktowane i numerowane,
pogrubienie, kursywa, kod, odnośniki. Reszta bloków zostanie spłaszczona do
tekstu — świadomie, żeby typografia strony się nie rozjechała.

Czas czytania liczy się sam z długości tekstu.

### Realizacje → **Realizacje**

| Pole | Nazwa techniczna | Uwagi |
|---|---|---|
| Tytuł | (tytuł wpisu) | wymagane |
| Nazwa klienta | `client` | brak → użyty tytuł |
| Domena | `domain` | np. `klient.pl` |
| Adres | `url` | pusty → brak odnośnika |
| Streszczenie | `summary` | jedno zdanie na listę |
| Rola | `role` | co było po Twojej stronie |
| Kategoria | `category` | |
| Tagi | `tags` | lista albo po przecinku |
| Technologie | `stack` | j.w. |
| Kolor akcentu | `accent` | format `#rrggbb`; zły → domyślny |
| Okładka | (obrazek wyróżniający) | |
| Galeria | `gallery` | pole powtarzalne |
| Kontekst | `context` | |
| Wyzwanie | `challenge_heading`, `challenge_body` | body: akapit w wierszu |
| Rozwiązanie | `solution_heading`, `solution_body` | j.w. |
| Funkcje | `features` | powtarzalne: `title`, `body` |
| Efekty | `outcome` | pozycja w wierszu |
| Wyróżniona | `featured` | pokazuje na stronie głównej |
| SEO | `seo_title`, `seo_description` | puste → tytuł i streszczenie |

### Usługi → **Usługi**

`tagline`, `description`, `deliverables` (pozycja w wierszu),
`price_from` (liczba; puste = wycena indywidualna), `duration`, `index`.

Kolejność na stronie ustawia pole **Kolejność** w *Atrybutach strony*.

### FAQ → **FAQ**

Jeden zestaw na stronę. Pole `key` decyduje, gdzie się pojawi:

- `general` — strona główna i oferta
- `wolomin` — landing Wołomin
- `warszawa` — landing Warszawa

Pozycje w polu powtarzalnym `items`: `question`, `answer`.

**Trzymaj te zestawy różne.** Identyczne FAQ na obu landingach szkodzi
pozycjonowaniu — Google traktuje to jako duplikat treści.

### Opinie → **Opinie**

`quote`, `author`, `role`, `source` (skąd pochodzi, np. „Google", „e-mail").

Wpisuj wyłącznie opinie, które faktycznie dostałeś. Puste albo niekompletne
rekordy są pomijane, więc sekcja po prostu się nie pokaże, dopóki nie ma czego
pokazać.

---

## Jak to działa pod spodem

```
panel WordPressa
      ↓  (wtyczka mu normalizuje pola do jednego kształtu JSON)
/wp-json/majewski/v1/…
      ↓  (src/lib/wordpress — pobranie, walidacja, mapowanie)
src/lib/content.ts
      ↓
komponenty Next.js
```

Dwie rzeczy warto znać:

**Frontend nie wie, w czym wpisujesz dane.** Wtyczka mu sprawdza po kolei ACF,
Meta Box i natywne pola własne WP. Zmieniasz wtyczkę do pól — poprawiasz jedną
funkcję `mj_field()` w PHP i nic więcej.

**Treść z CMS-u nigdy nie trafia do strony jako HTML.** HTML z edytora jest
zamieniany na wąski markdown, a ten renderowany jako elementy Reacta.
Dlatego `<script>` wklejony w treść nie wykona się, a odnośnik `javascript:`
zostaje samym tekstem. Testy tego pilnują (`npm test`).

---

## Model bez pól powtarzalnych

Jeśli chcesz zostać na darmowej wtyczce, pola `gallery`, `features` i `items`
możesz zastąpić zwykłym polem tekstowym — wtedy jednak wtyczka mu wymaga
drobnej zmiany: zamiast `mj_rows()` użyj własnego parsera, np. jedna pozycja
w wierszu w formacie `Tytuł :: Opis`.

Alternatywa bez żadnej zmiany w kodzie: zostaw te pola puste. Realizacje
wyświetlą się bez galerii i listy funkcji, FAQ nie pokaże się wcale.
Strona działa, po prostu pokazuje mniej.

---

## Rozwiązywanie problemów

**Strona pokazuje starą treść** — pamięć podręczna trzyma 5 minut. Poczekaj
albo podłącz webhook z kroku 5.

**Strona pokazuje treść startową zamiast mojej** — sprawdź logi builda w
Vercelu. Frontend zapisuje tam dokładny powód, np. `WordPress projects:
HTTP 404`. Najczęstsza przyczyna to literówka w `WORDPRESS_API_URL` albo
nieprzebudowane bezpośrednie odnośniki (krok 3).

**`/wp-json/majewski/v1/projects` zwraca 404** — wtyczka mu nie wgrała się
albo leży w złym katalogu. Sprawdź **Wtyczki → Wymagane** w panelu.

**Realizacja nie pojawia się na liście** — brakuje tytułu albo uproszczonej
nazwy (slug). Oba są wymagane; rekordy bez nich są pomijane, żeby nie
generować pustych podstron.
