import type { Faq } from '@/lib/types';

export const generalFaq: Faq[] = [
  {
    question: 'Ile kosztuje strona internetowa?',
    answer:
      'Prosta strona wizytówka zaczyna się od 1500 zł. Rozbudowany serwis firmowy to koszt od 3500 zł, a sklep lub system rezerwacji — od 5000 zł. Ostateczna cena zależy od zakresu, dlatego zawsze przygotowuję konkretną wycenę po rozmowie, zwykle w ciągu 24 godzin.',
  },
  {
    question: 'Ile trwa realizacja?',
    answer:
      'Strony wizytówki i portfolia zamykam zwykle w 7–14 dni. Bardziej rozbudowane projekty, sklepy i systemy rezerwacji zajmują od 14 do 30 dni, licząc od momentu otrzymania materiałów. Terminy podaję przed startem, razem z wyceną.',
  },
  {
    question: 'Czy będę mógł samodzielnie edytować treść?',
    answer:
      'Tak. Każdy projekt oddaję z panelem do zarządzania treścią i krótkim szkoleniem. Zmiana tekstu, wymiana zdjęcia czy dodanie wpisu na blogu nie wymaga kontaktu ze mną ani znajomości kodu.',
  },
  {
    question: 'Czy zajmujesz się też treścią i zdjęciami?',
    answer:
      'Pomagam ułożyć strukturę treści i doradzam, co powinno znaleźć się na każdej podstronie. Teksty mogę napisać na podstawie rozmowy i materiałów, które przekażesz. Fotografię zwykle realizujemy z zewnętrznym fotografem albo korzystamy z Twoich zdjęć.',
  },
  {
    question: 'Co dzieje się po uruchomieniu strony?',
    answer:
      'Dostajesz komplet dostępów — strona jest Twoja. Możesz zostać z nią sam, korzystać ze wsparcia doraźnie albo wykupić stałą opiekę: aktualizacje, kopie zapasowe, monitoring i pulę godzin na zmiany.',
  },
  {
    question: 'Pracujesz tylko z klientami z Wołomina i Warszawy?',
    answer:
      'Nie — realizuję projekty w całej Polsce, zdalnie. Z klientami z Wołomina, powiatu wołomińskiego i Warszawy mogę dodatkowo spotkać się osobiście, jeśli to ułatwia ustalenia.',
  },
  {
    question: 'WordPress czy rozwiązanie dedykowane?',
    answer:
      'To zależy od projektu. WordPress sprawdza się przy stronach firmowych, blogach i sklepach — jest sprawdzony i tani w utrzymaniu. Rozwiązania dedykowane w Next.js wybieram tam, gdzie liczy się maksymalna wydajność, nietypowa logika albo zaawansowana warstwa wizualna. Rekomendację przedstawiam po poznaniu celu, nie z góry.',
  },
];

export const wolominFaq: Faq[] = [
  {
    question: 'Czy możemy spotkać się osobiście w Wołominie?',
    answer:
      'Tak. Mieszkam i pracuję w Wołominie, więc spotkanie na miejscu albo w okolicy — Kobyłka, Zielonka, Ząbki, Radzymin, Marki — nie jest problemem. Część klientów woli omówić projekt przy stole, zwłaszcza na starcie.',
  },
  {
    question: 'Czy strona pomoże mi być widocznym w wyszukiwarce lokalnie?',
    answer:
      'To jeden z głównych celów takiego projektu. Buduję strukturę pod frazy łączące usługę z lokalizacją, przygotowuję dane strukturalne opisujące firmę i obszar działania oraz porządkuję spójność informacji z wizytówką Google. To fundament — dalsza widoczność zależy też od opinii i konsekwencji w publikowaniu treści.',
  },
  {
    question: 'Prowadzę małą, jednoosobową firmę. Czy to nie za duży wydatek?',
    answer:
      'Przy małej firmie sensowny start to zwykle strona wizytówka od 1500 zł. Zakres dobieramy tak, żeby pokryć to, co realnie przynosi zapytania, i zostawić przestrzeń na rozbudowę, gdy firma urośnie. Nie sprzedaję sklepu komuś, kto potrzebuje pięciu podstron.',
  },
  {
    question: 'Mam już stronę, ale wygląda przestarzale. Trzeba robić wszystko od nowa?',
    answer:
      'Nie zawsze. Czasem wystarczy nowy projekt graficzny i uporządkowanie treści na istniejącym systemie. Jeżeli jednak strona jest wolna, nieresponsywna albo zbudowana na porzuconym motywie, budowa od zera bywa tańsza niż łatanie. Mówię wprost, który wariant się opłaca.',
  },
];

export const warszawaFaq: Faq[] = [
  {
    question: 'Czym różni się Twoja oferta od agencji interaktywnej?',
    answer:
      'Pracujesz bezpośrednio z osobą, która projektuje i pisze kod. Nie ma account managera pośredniczącego w ustaleniach ani narzutu na strukturę agencji. Przy dużych, wieloosobowych wdrożeniach agencja bywa lepszym wyborem — przy projektach do kilkudziesięciu podstron bezpośrednia współpraca jest zwykle szybsza i tańsza.',
  },
  {
    question: 'Czy realizujesz projekty z zaawansowaną warstwą wizualną?',
    answer:
      'Tak — animacje sterowane przewijaniem, motion design, sceny 3D w Three.js i interfejsy budowane od zera w Next.js. Z zastrzeżeniem, że efekt wizualny nie może odbywać się kosztem szybkości. Ta strona jest przykładem takiego podejścia.',
  },
  {
    question: 'Obsługujesz sklepy internetowe?',
    answer:
      'Tak, w oparciu o WooCommerce, także z niestandardową logiką zamówień, rezerwacjami terminów i integracją płatności. Przy sklepach rozszerzam system dedykowanym kodem, zamiast doklejać kolejne wtyczki, które spowalniają ścieżkę zakupową.',
  },
  {
    question: 'Czy spotykamy się na miejscu w Warszawie?',
    answer:
      'Warszawa jest tuż obok Wołomina, więc spotkanie osobiste jest możliwe. W praktyce większość projektów prowadzę zdalnie — wideorozmowa i wspólny dokument z ustaleniami działają szybciej niż dojazdy przez miasto.',
  },
  {
    question: 'Jak wygląda kwestia wydajności i Core Web Vitals?',
    answer:
      'Traktuję ją jako element zakresu, nie jako dodatek. Optymalizuję obrazy, ograniczam skrypty zewnętrzne, kontroluję to, co ładuje się przed pierwszym ekranem, i pilnuję stabilności układu. Wyniki pokazuję na realnych pomiarach po wdrożeniu.',
  },
];
