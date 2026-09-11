# Instrukcja obsługi strony — MSdream

Ta instrukcja jest napisana dla osoby, która **nie programuje**. Nie musisz nic
instalować ani niczego się uczyć poza tym, co jest tutaj opisane.

Wszystko, co zmienisz w panelu, pojawia się na stronie **w ciągu kilkunastu
sekund**. Nie trzeba nikogo prosić o „wgranie zmian”.

---

## Spis treści

1. [Jak się zalogować](#1-jak-się-zalogować)
2. [Co znajdziesz w menu](#2-co-znajdziesz-w-menu)
3. [Jak zmienić dane firmy](#3-jak-zmienić-dane-firmy-adres-telefon-nip)
4. [Jak zmienić cenę zajęć](#4-jak-zmienić-cenę-zajęć)
5. [Jak dodać nową usługę](#5-jak-dodać-nową-usługę)
6. [Jak dodać instruktora](#6-jak-dodać-instruktora)
7. [Jak dodać zdjęcie do galerii](#7-jak-dodać-zdjęcie-do-galerii)
8. [Jak dodać pytanie do FAQ](#8-jak-dodać-pytanie-do-faq)
9. [Jak dodać opinię klienta](#9-jak-dodać-opinię-klienta)
10. [Jak napisać wpis w poradniku](#10-jak-napisać-wpis-w-poradniku)
11. [Jak zmienić dokumenty prawne](#11-jak-zmienić-dokumenty-prawne)
12. [Jak zmienić teksty SEO](#12-jak-zmienić-teksty-seo)
13. [Jak przygotować zdjęcia](#13-jak-przygotować-zdjęcia)
14. [Częste pytania i problemy](#14-częste-pytania-i-problemy)

---

## 1. Jak się zalogować

1. Wejdź na adres panelu — to zwykle **https://cms.msdream.pl/wp-admin**
   (dokładny adres dostaniesz od osoby, która wdrażała stronę).
2. Wpisz nazwę użytkownika i hasło.
3. Kliknij **Zaloguj się**.

> **Zapamiętaj ten adres w zakładkach przeglądarki.** To jedyne miejsce,
> w którym zmieniasz treść strony.

Jeśli zapomnisz hasła — kliknij „Nie pamiętasz hasła?” pod formularzem.
Link do zmiany przyjdzie na Twój adres e-mail.

---

## 2. Co znajdziesz w menu

Po zalogowaniu, po lewej stronie zobaczysz menu:

| Pozycja | Co tu zmieniasz |
| --- | --- |
| **Ustawienia witryny** | Adres, telefon, e-mail, NIP, social media |
| **Oferta** | Zajęcia jeździeckie i warsztaty tuftingu — ceny, opisy, zdjęcia |
| **Instruktorzy** | Zespół — nazwiska, opisy, portrety |
| **Galeria** | Zdjęcia w galerii |
| **Opinie** | Opinie klientów |
| **FAQ** | Częste pytania i odpowiedzi |
| **Konie** | Opisy koni (sekcja „Poznaj nasze konie”) |
| **Poradnik** | Artykuły poradnikowe |
| **Dokumenty prawne** | Regulaminy i polityka prywatności |
| **Media** | Wszystkie wgrane zdjęcia |

> Celowo ukryliśmy „Wpisy” i „Komentarze” — strona ich nie używa,
> więc nie musisz się nimi przejmować.

---

## 3. Jak zmienić dane firmy (adres, telefon, NIP)

Te dane pojawiają się w stopce, na stronie kontaktu, przy mapie **oraz
w danych, które czyta Google**. Warto je uzupełnić w pierwszej kolejności.

1. W menu po lewej kliknij **Ustawienia witryny**.
2. Wypełnij pola:
   - **Pełna nazwa firmy** — dokładnie tak, jak w dokumentach firmowych
   - **Ulica i numer**, **Kod pocztowy** — adres stajni
   - **Telefon** — w formacie `+48 501 234 567`
   - **E-mail**
   - **NIP**
   - **Szerokość / długość geograficzna** — patrz ramka niżej
   - **Place ID wizytówki Google** — patrz ramka niżej
   - **Social media** — jeden profil w każdej linii, w formacie:
     ```
     Facebook|https://facebook.com/msdream
     Instagram|https://instagram.com/msdream
     ```
3. Kliknij **Zapisz ustawienia** na dole.

> **Bardzo ważne:** adres i telefon muszą być zapisane **dokładnie tak samo**
> jak w wizytówce Google. Jeśli w Google jest „ul. Polna 5”, a tutaj wpiszesz
> „Polna 5” — Google traktuje to jako dwie różne firmy i strona gorzej
> wyświetla się w wynikach lokalnych.
>
> **Dopóki pole jest puste, na stronie w tym miejscu pojawia się napis
> „do uzupełnienia”.** To celowe — lepiej, żeby było widać brak, niż żeby
> na stronie znalazł się zmyślony adres.

<details>
<summary><strong>Jak znaleźć współrzędne geograficzne</strong></summary>

1. Wejdź na [google.com/maps](https://www.google.com/maps).
2. Znajdź swoją stajnię.
3. Kliknij **prawym przyciskiem myszy** w punkt na mapie.
4. Na samej górze menu zobaczysz dwie liczby, np. `52.339123, 20.886456`.
5. Kliknij je — skopiują się do schowka.
6. Pierwszą liczbę wklej w **Szerokość geograficzna**, drugą w **Długość**.
</details>

<details>
<summary><strong>Jak znaleźć Place ID wizytówki Google</strong></summary>

1. Wejdź na [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id).
2. W pole wyszukiwania wpisz nazwę i adres swojej firmy.
3. Pod wynikiem pojawi się ciąg znaków zaczynający się od `ChIJ…`.
4. Skopiuj go i wklej w panelu.
</details>

---

## 4. Jak zmienić cenę zajęć

1. W menu kliknij **Oferta**.
2. Kliknij nazwę zajęć, których cenę chcesz zmienić.
3. Przewiń w dół do sekcji **Szczegóły**.
4. W polu **Cena (PLN)** wpisz **samą liczbę** — np. `150`.
   - Nie wpisuj „zł”, nie wpisuj „150 zł”, nie wpisuj spacji.
   - Grosze oddziel kropką: `149.99`.
5. W polu **Dopisek przy cenie** możesz wpisać np. `/ 60 min` albo `od`.
6. Kliknij niebieski przycisk **Zaktualizuj** (prawy górny róg).

Gotowe. Odśwież stronę po kilkunastu sekundach, żeby zobaczyć zmianę.

> **Jeśli zostawisz cenę pustą**, na stronie pojawi się napis
> „Cena do uzupełnienia”. Użyj tego świadomie, gdy cena jest ustalana
> indywidualnie — nie zostawiaj pustego pola przez przypadek.

---

## 5. Jak dodać nową usługę

1. W menu najedź na **Oferta** i kliknij **Dodaj**.
2. **Tytuł** (u góry) — nazwa zajęć, np. „Obóz jeździecki”.
3. **Duże pole tekstowe pod tytułem** — opis zajęć. Dwa–cztery zdania.
   Pisz o tym, co klient z tego ma, a nie o tym, co zawiera pakiet.
4. Po prawej stronie kliknij **Ustaw obrazek wyróżniający** i wgraj zdjęcie.
5. Przewiń w dół do sekcji **Szczegóły** i wypełnij:

| Pole | Co wpisać |
| --- | --- |
| **Kategoria** | „Jazda konna” albo „Warsztaty tuftingu” — **to pole jest obowiązkowe** |
| **Hasło** | Jedno krótkie zdanie, np. „Pięć dni w siodle, od rana do wieczora” |
| **Cena (PLN)** | Sama liczba |
| **Dopisek przy cenie** | np. `/ os.`, `/ 60 min`, `od` |
| **Czas trwania (minuty)** | Sama liczba, np. `60` |
| **Dla kogo** | np. „Dzieci 8–14 lat z podstawami jazdy” |
| **Co obejmują zajęcia** | **Jedna pozycja w każdej linii** (naciskaj Enter) |
| **O czym trzeba wiedzieć** | Ograniczenia i wymagania, też po jednej w linii |
| **ID usługi w Bookero** | Opcjonalne — patrz niżej |
| **Wyróżnij na stronie głównej** | Zaznacz, jeśli mają być widoczne wyżej |

6. Kliknij **Opublikuj**.

> **Kolejność zajęć na stronie** ustawiasz polem **Kolejność** w sekcji
> „Atrybuty” po prawej stronie. Mniejsza liczba = wyżej na liście.

---

## 6. Jak dodać instruktora

1. Menu → **Instruktorzy** → **Dodaj**.
2. **Tytuł** — imię i nazwisko.
3. **Duże pole tekstowe** — kilka zdań o tym, jak prowadzi zajęcia
   i z kim pracuje najchętniej. Pisz konkretnie, unikaj ogólników.
4. Po prawej: **Ustaw obrazek wyróżniający** — portret.
5. Sekcja **Szczegóły**:
   - **Funkcja** — np. „Instruktorka jazdy konnej”
   - **Doświadczenie** — np. „12 lat pracy z dziećmi, instruktor rekreacji PZJ”
   - **Specjalizacje** — jedna w każdej linii
   - **Social media** — jeden profil w linii, format `Instagram|https://…`
6. **Opublikuj**.

> Każdy instruktor automatycznie dostaje własną podstronę.
> **Dopóki nie wpiszesz imienia i nazwiska, podstrona nie powstaje** —
> pusta wizytówka w Google szkodziłaby bardziej, niż pomagała.

---

## 7. Jak dodać zdjęcie do galerii

1. Menu → **Galeria** → **Dodaj**.
2. **Tytuł** — krótki opis, np. „Poranek w stajni”. Pojawi się jako podpis.
3. Po prawej: **Ustaw obrazek wyróżniający** → wgraj zdjęcie.
4. Sekcja **Szczegóły** → **Rozmiar w galerii**. Wybierz jeden z:
   - **Bardzo duże** — szeroki kadr na całą szerokość
   - **Szerokie** — poziome zdjęcie
   - **Wysokie (pion)** — zdjęcie pionowe
   - **Kwadrat**
5. **Opublikuj**.

> **Mieszaj rozmiary.** Galeria jest zaprojektowana tak, żeby wyglądać
> jak rozkładówka w magazynie, a nie jak równa siatka. Jeśli wszystkim
> zdjęciom nadasz ten sam rozmiar, efekt zniknie.
>
> Dobra proporcja na 9 zdjęć: 1 bardzo duże, 2 szerokie, 4 wysokie, 2 kwadraty.

---

## 8. Jak dodać pytanie do FAQ

1. Menu → **FAQ** → **Dodaj**.
2. **Tytuł** — pytanie, np. „Czy trzeba mieć własny kask?”
   Zapisz je **tak, jak zadają je klienci**, nie oficjalnym językiem.
3. **Duże pole tekstowe** — odpowiedź.
4. Sekcja **Szczegóły** → **Temat**. Wybór decyduje, **gdzie pytanie się pojawi**:

| Temat | Gdzie się pokaże |
| --- | --- |
| Ogólne | Strona główna |
| Jazda konna | Strony o jeździe konnej |
| Dzieci | Strona „Jazda konna dla dzieci” |
| Tufting | Strony o warsztatach |
| Rezerwacja i płatności | Strony rezerwacji |

5. **Opublikuj**.

> FAQ jest czytane przez Google i może pojawić się bezpośrednio w wynikach
> wyszukiwania. Odpowiadaj konkretnie i pełnym zdaniem — „Tak” nie wystarczy.

---

## 9. Jak dodać opinię klienta

> **Przepisuj wyłącznie opinie, które ktoś naprawdę wystawił.**
> Wymyślone opinie są niezgodne z zasadami Google i grożą karą, która
> usunie stronę z wyników lokalnych. To nie jest ostrożność na wyrost.

1. Menu → **Opinie** → **Dodaj**.
2. **Tytuł** — imię autora (do porządku w panelu).
3. **Duże pole tekstowe** — treść opinii, **przepisana bez zmian**.
4. Sekcja **Szczegóły**:
   - **Autor opinii** — imię tak, jak podpisano opinię w Google
   - **Ocena (1–5)** — rzeczywista liczba gwiazdek
   - **Data wystawienia**
5. **Opublikuj**.

Ocena średnia na stronie **wylicza się sama** z dodanych opinii —
nie ma pola, w którym można ją wpisać ręcznie. Tak ma być.

---

## 10. Jak napisać wpis w poradniku

Poradnik to najtańszy sposób na pojawianie się w Google przy pytaniach,
które ludzie wpisują przed pierwszą wizytą.

1. Menu → **Poradnik** → **Dodaj**.
2. **Tytuł** — najlepiej dokładnie takie pytanie, jakie ktoś wpisuje w Google,
   np. „Czy jazda konna jest bezpieczna dla dziecka?”
3. **Duże pole tekstowe** — treść. Używaj nagłówków (menu „Akapit” → „Nagłówek 2”),
   żeby podzielić tekst na sekcje.
4. Po prawej rozwiń **Zajawka** i napisz 1–2 zdania streszczenia —
   to pokaże się na liście wpisów i w Google.
5. **Opublikuj**.

**Jak pisać, żeby to działało:**

- Odpowiedz na pytanie **w pierwszym akapicie**. Nie buduj napięcia.
- Pisz konkretnie: „około czwartego roku życia” zamiast „gdy dziecko jest gotowe”.
- Pisz o Łomiankach i okolicy, jeśli to naturalne w zdaniu.
- Nie pisz „w świecie, gdzie pasja spotyka pasję”. Naprawdę.

---

## 11. Jak zmienić dokumenty prawne

1. Menu → **Dokumenty prawne**.
2. Kliknij dokument albo dodaj nowy.
3. **Tytuł** — np. „Polityka prywatności”.
4. **Ważne:** po prawej stronie rozwiń **Bezpośredni odnośnik** i ustaw
   **uproszczony adres (slug)** dokładnie na jedną z wartości:

| Dokument | Slug |
| --- | --- |
| Polityka prywatności | `polityka-prywatnosci` |
| Polityka cookies | `cookies` |
| Regulamin strony | `regulamin` |
| Regulamin rezerwacji | `regulamin-rezerwacji` |

5. Wklej treść i kliknij **Opublikuj**.

> Jeśli slug będzie inny, dokument nie pojawi się na stronie.
>
> **Nie zmieniaj znaczenia dokumentów prawnych bez potrzeby.** Najlepiej
> przenieść obowiązujące wersje ze starej strony bez modyfikacji.

---

## 12. Jak zmienić teksty SEO

Tytuły i opisy widoczne w Google są tworzone automatycznie na podstawie
treści, którą wpisujesz — **nazwy usługi, opisu i hasła**. Nie ma osobnych
pól „SEO title” do wypełniania, bo w praktyce prowadzi to do rozjazdu
między tym, co widzi klient, a tym, co widzi Google.

Chcesz zmienić to, co pokazuje się w wyszukiwarce? **Zmień treść strony:**

- **Tytuł w Google** ← nazwa usługi / tytuł wpisu
- **Opis pod tytułem** ← hasło + początek opisu
- **Obrazek przy udostępnianiu** ← obrazek wyróżniający

Jeśli potrzebujesz pełnej kontroli nad konkretną podstroną — zgłoś się
do osoby technicznej, to zmiana na kilka minut.

---

## 13. Jak przygotować zdjęcia

**Wymagania techniczne:**

- Format: JPG (zdjęcia) lub PNG (grafiki)
- Dłuższy bok: **minimum 1600 pikseli**
- Nie przejmuj się wagą pliku — strona sama go zmniejszy i przekonwertuje

**Jak dodać opis dla niewidomych i dla Google:**

1. Po wgraniu zdjęcia, po prawej stronie zobaczysz pole **Tekst alternatywny**.
2. Wpisz, **co widać na zdjęciu**, np. „Dziewczynka w kasku na kucyku
   prowadzonym przez instruktorkę”.
3. Nie pisz „zdjęcie”, „obrazek”, „IMG_2451”.

To pole jest ważne: czytają je zarówno osoby niewidome, jak i Google.

**Gdzie na stronie widzisz napis „PHOTO REQUIRED”:**

To miejsce czeka na zdjęcie. W ramce jest opisane, **jakie ujęcie** tam pasuje
(kadr, proporcje, światło). Zrób zdjęcie według opisu i wgraj je w odpowiednim
miejscu w panelu — napis zniknie sam.

---

## 14. Częste pytania i problemy

**Zmieniłem coś, ale na stronie nadal jest po staremu.**
Odczekaj kilkanaście sekund i odśwież stronę **z pominięciem pamięci podręcznej**:
`Ctrl + Shift + R` (Windows) lub `Cmd + Shift + R` (Mac).
Jeśli po minucie nadal nic — zgłoś to osobie technicznej, prawdopodobnie
rozłączyło się automatyczne odświeżanie.

**Przypadkowo usunąłem wpis.**
Nic nie przepadło. Wejdź w daną sekcję i kliknij zakładkę **Kosz** u góry listy,
a potem **Przywróć**.

**Chcę tymczasowo ukryć usługę bez usuwania.**
Otwórz ją i po prawej zmień **Stan: Opublikowany** na **Szkic**, potem
**Zaktualizuj**. Wróci jednym kliknięciem.

**Nie widzę sekcji „Szczegóły” z polami cen.**
Przewiń stronę edycji w dół — jest pod głównym polem tekstowym.
Jeśli nadal jej nie ma, kliknij **Opcje** (trzy kropki w prawym górnym rogu)
→ **Preferencje** → **Panele** i włącz **Szczegóły**.

**Kto zmienia ceny zajęć w kalendarzu rezerwacji?**
Kalendarz to osobny system — **Bookero**. Ceny i terminy w kalendarzu
ustawiasz w panelu Bookero. Ceny w sekcji „Oferta” na stronie to cennik
informacyjny. **Pamiętaj, żeby zmieniać je w obu miejscach**, inaczej klient
zobaczy inną cenę na stronie, a inną przy rezerwacji.

**Czy mogę zepsuć stronę?**
Praktycznie nie. Najgorsze, co może się stać, to pusta sekcja albo literówka —
jedno i drugie poprawiasz w minutę. Struktura strony jest w kodzie i nie da
się jej zmienić z panelu.
