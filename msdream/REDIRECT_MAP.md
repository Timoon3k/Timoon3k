# REDIRECT_MAP — mapa przekierowań ze starego serwisu

---

## ⚠️ Status: **DO WERYFIKACJI PRZED WDROŻENIEM**

> Domena `msdream.pl` była **nieosiągalna** ze środowiska, w którym powstawał
> ten projekt (blokada polityki sieciowej; bezskutecznie próbowano również
> archiwum Wayback Machine oraz indeksu wyszukiwarki).
>
> **Nie udało się więc pobrać rzeczywistej listy zaindeksowanych adresów.**
> Poniższa mapa zawiera przekierowania oparte na typowych wzorcach adresów
> oraz na strukturze wynikającej z briefu. Są **zaimplementowane i działają**,
> ale **muszą zostać skonfrontowane z faktyczną listą adresów** przed
> przełączeniem DNS.
>
> Sekcja 2 opisuje, jak zdobyć tę listę w 15 minut.

---

## 1. Przekierowania zaimplementowane

Zdefiniowane w `next.config.ts` (funkcja `redirects()`), wszystkie jako **301**.

| Stary adres | Nowy adres | Powód |
| --- | --- | --- |
| `/warsztaty-tuftingu` | `/oferta/warsztaty-tuftingu` | Warsztaty włączone w strukturę oferty |
| `/jazda-konna` | `/oferta/jazda-konna` | j.w. |
| `/cennik` | `/oferta` | Cennik nie jest osobną stroną — ceny są przy usługach |
| `/o-firmie` | `/o-nas` | Ujednolicenie nazewnictwa |
| `/kontakt.html` | `/kontakt` | Czyste adresy bez rozszerzeń |
| `/galeria-zdjec` | `/galeria` | Skrócenie adresu |
| `/rezerwacje` | `/rezerwacja` | Liczba pojedyncza, spójnie z resztą |
| `/regulamin-serwisu` | `/regulamin` | Skrócenie adresu |
| `/polityka-cookies` | `/cookies` | Skrócenie adresu |

## 2. Adresy zachowane bez zmian

Te adresy **nie wymagają przekierowania** — jeśli istniały w starym serwisie,
działają dalej pod tym samym adresem. To celowe: zmiana działającego,
zaindeksowanego adresu jest czystą stratą.

```
/
/o-nas
/oferta
/galeria
/opinie
/instruktorzy
/mapa
/kontakt
/rezerwacja
/rezerwacja-tuftingu
/polityka-prywatnosci
```

## 3. Adresy nowe (bez odpowiednika w starym serwisie)

```
/oferta/jazda-konna
/oferta/warsztaty-tuftingu
/oferta/[9 stron usług]
/instruktorzy/[profile]
/jazda-konna-dla-dzieci-lomianki
/nauka-jazdy-konnej-lomianki
/poradnik
/poradnik/[wpisy]
/regulamin-rezerwacji
/cookies
/platnosc/[status]              (noindex)
```

---

## 4. Jak uzupełnić tę mapę przed wdrożeniem

**Wykonaj to koniecznie, zanim przełączysz DNS.** Zajmuje kilkanaście minut
i chroni pozycje wypracowane przez lata.

### Krok 1 — pobierz rzeczywistą listę zaindeksowanych adresów

**Źródło najlepsze: Google Search Console** (stara własność `msdream.pl`)
→ **Indeksowanie → Strony** → eksport listy zaindeksowanych adresów.

**Źródła zapasowe:**

- `https://msdream.pl/sitemap.xml` — jeśli stary serwis ją generował
- W wyszukiwarce Google: `site:msdream.pl` — pokaże główne adresy
- Logi serwera albo panel hostingu — najczęściej odwiedzane ścieżki
- Eksport z Google Analytics: najpopularniejsze strony z ostatnich 12 miesięcy

### Krok 2 — zestaw adresy z nową strukturą

Dla każdego starego adresu wybierz jedną z opcji:

| Sytuacja | Co zrobić |
| --- | --- |
| Adres istnieje w nowej strukturze bez zmian | **Nic** — zostaw jak jest |
| Adres się zmienia | Dodaj przekierowanie **301** |
| Treść zniknęła, ale jest bliski odpowiednik | **301** do najbliższej tematycznie strony |
| Treść zniknęła bez odpowiednika | Zostaw **404** — lepsze niż 301 do strony głównej |

> **Nie przekierowuj wszystkiego na stronę główną.** Google traktuje masowe
> przekierowania do korzenia jako „miękkie 404” i nie przenosi wartości linków.
> Świadome 404 jest uczciwsze i mniej szkodliwe.

### Krok 3 — dopisz przekierowania

W `next.config.ts`, w funkcji `redirects()`:

```ts
{ source: '/stary-adres', destination: '/nowy-adres', permanent: true },
```

`permanent: true` oznacza **301** (trwałe) — to właściwy kod przy migracji.
`308` też przenosi wartość, ale 301 jest lepiej rozumiane przez starsze
narzędzia.

### Krok 4 — sprawdź, czy nie powstały łańcuchy

**Łańcuch przekierowań** (A → B → C) rozmywa wartość linków i spowalnia
wejście. Każdy stary adres musi trafiać do celu **jednym skokiem**.

```bash
# Powinien pokazać dokładnie jedno 301, a potem 200
curl -sIL https://msdream.pl/warsztaty-tuftingu | grep -E "^HTTP|^location"
```

Szybki audyt całej listy:

```bash
while read -r path; do
  printf '%-36s ' "$path"
  curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' "https://msdream.pl$path"
done < stare-adresy.txt
```

---

## 5. Checklista przed przełączeniem DNS

- [ ] Pobrano rzeczywistą listę adresów z Google Search Console
- [ ] Każdy zaindeksowany adres ma decyzję: zachowany / 301 / świadome 404
- [ ] Żaden adres nie tworzy łańcucha przekierowań (max **jeden** skok)
- [ ] Żadne wartościowe 301 nie prowadzi na stronę główną „bo tak łatwiej”
- [ ] `sitemap.xml` zawiera **wyłącznie** adresy zwracające 200
- [ ] Canonical na każdej podstronie wskazuje sam siebie pod nową domeną
- [ ] `NEXT_PUBLIC_SITE_URL` ustawione na docelową domenę (bez ukośnika)
- [ ] Nowa własność dodana i zweryfikowana w Google Search Console
- [ ] Nowa `sitemap.xml` przesłana w Search Console
- [ ] Stara własność **pozostaje** w Search Console — pozwala śledzić migrację
- [ ] Sprawdzono, że `robots.txt` nie blokuje niczego przez pomyłkę

---

## 6. Po migracji

**Przez pierwsze 4–6 tygodni obserwuj, nie działaj.**

Po każdej migracji pozycje zwykle chwilowo spadają, zanim wrócą i wzrosną.
To normalne — Google musi ponownie przeindeksować i zestawić sygnały.
Wprowadzanie zmian w panice w drugim tygodniu jest najczęstszym sposobem
na pogłębienie spadku.

Co monitorować w Search Console:

| Raport | Na co patrzeć |
| --- | --- |
| **Indeksowanie → Strony** | Czy nowe adresy są indeksowane; czy nie rosną błędy 404 |
| **Skuteczność** | Porównaj kliknięcia rok do roku, nie tydzień do tygodnia |
| **Core Web Vitals** | Dane z ruchu rzeczywistego pojawiają się po ~28 dniach |
| **Ulepszenia** | Czy dane strukturalne są odczytywane bez błędów |

Jeśli po sześciu tygodniach ruch nie wrócił do poziomu sprzed migracji —
najpierw sprawdź przekierowania i spójność NAP, dopiero potem treść.
