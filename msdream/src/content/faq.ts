import type { FaqItem } from '@/lib/types';

/**
 * FAQ pisane pod realne pytania, które padają przy pierwszym telefonie
 * do stajni. Odpowiedzi celowo nie obiecują niczego, czego nie potwierdziliśmy
 * — tam, gdzie potrzebna jest konkretna liczba, odsyłamy do kontaktu zamiast
 * ją zmyślać.
 */
export const FAQ: readonly FaqItem[] = [
  {
    topic: 'dzieci',
    question: 'Od jakiego wieku dziecko może zacząć jazdę konną?',
    answer:
      'Najmłodsi zaczynają u nas zwykle około czwartego roku życia, od zajęć ABC — czyli kontaktu z koniem z ziemi i krótkiej jazdy prowadzonej przez instruktora. Nie ma jednej granicy dla wszystkich: liczy się to, czy dziecko potrafi przez kilkanaście minut słuchać instruktora i czy samo chce podejść do konia. Jeśli nie jesteś pewien, zadzwoń — umówimy pierwsze spotkanie i sprawdzimy to bez zobowiązań.',
  },
  {
    topic: 'jazda-konna',
    question: 'Nigdy nie siedziałem na koniu. Czy pierwsza jazda ma sens?',
    answer:
      'Tak — większość naszych dorosłych kursantów zaczyna dokładnie w tym miejscu. Pierwsze zajęcia prowadzimy na lonży: instruktor kontroluje konia, a Ty możesz skupić się wyłącznie na tym, jak siedzisz. Nie musisz nic umieć wcześniej i nie musisz mieć własnego sprzętu.',
  },
  {
    topic: 'jazda-konna',
    question: 'Jak przygotować się do pierwszej lekcji jazdy konnej?',
    answer:
      'Załóż długie spodnie bez grubych szwów po wewnętrznej stronie nogi i buty na płaskiej podeszwie z niewielkim obcasem — obcas zatrzymuje stopę w strzemieniu. Kask dostaniesz na miejscu. Przyjedź 15 minut wcześniej, żeby spokojnie poznać konia zamiast wskakiwać na niego w biegu. Nie jedz ciężkiego posiłku bezpośrednio przed jazdą.',
  },
  {
    topic: 'jazda-konna',
    question: 'Czego się spodziewać podczas pierwszej jazdy?',
    answer:
      'Zaczynamy przy koniu, nie na nim: pokazujemy, jak bezpiecznie podejść, jak go dotknąć i jak się zachować w stajni. Potem dosiad, praca w stępie i — jeśli czujesz się pewnie — kilka odcinków kłusa. Pierwsze zajęcia to głównie oswojenie się z ruchem konia. Prawie każdy schodzi z siodła zaskoczony, ile pracują mięśnie.',
  },
  {
    topic: 'jazda-konna',
    question: 'Czy trzeba mieć własny sprzęt jeździecki?',
    answer:
      'Nie. Kask i podstawowy sprzęt są na miejscu i wliczone w zajęcia. Jeśli jeździsz regularnie, z czasem warto kupić własny kask i bryczesy — ale to decyzja na później, nie warunek pierwszej jazdy.',
  },
  {
    topic: 'rezerwacja',
    question: 'Jak zarezerwować termin?',
    answer:
      'Przez kalendarz rezerwacji na stronie — wybierasz zajęcia, wolny termin i potwierdzasz rezerwację. Kalendarz pokazuje wyłącznie terminy faktycznie dostępne, więc nie musisz dzwonić, żeby to sprawdzić. Potwierdzenie dostajesz e-mailem.',
  },
  {
    topic: 'rezerwacja',
    question: 'Czy mogę zapłacić online?',
    answer:
      'Tak. Płatność online realizujemy bezpośrednio w procesie rezerwacji, a po opłaceniu otrzymujesz e-mailem potwierdzenie oraz dokument sprzedaży. Jeśli potrzebujesz faktury na firmę, podaj dane firmowe przy rezerwacji.',
  },
  {
    topic: 'rezerwacja',
    question: 'Co, jeśli będę musiał odwołać jazdę?',
    answer:
      'Termin można odwołać lub przełożyć na zasadach opisanych w regulaminie rezerwacji. Im wcześniej dasz znać, tym większa szansa, że uda się przesunąć zajęcia bez konsekwencji — i tym większa szansa, że ktoś inny skorzysta ze zwolnionego terminu.',
  },
  {
    topic: 'jazda-konna',
    question: 'Czy jazdy odbywają się przy złej pogodzie?',
    answer:
      'Deszcz czy chłód zwykle nie odwołują zajęć — konie pracują, a my ubieramy się odpowiednio. Odwołujemy przy warunkach realnie niebezpiecznych: burzy, wichurze, gołoledzi. W takiej sytuacji kontaktujemy się z Tobą i proponujemy nowy termin.',
  },
  {
    topic: 'ogolne',
    question: 'Czy rodzic może zostać na zajęciach?',
    answer:
      'Tak, i przy pierwszych zajęciach wręcz o to prosimy. Przy zajęciach ABC obecność opiekuna jest obowiązkowa. Prosimy tylko, żeby obserwować z wyznaczonego miejsca — nagłe wejście na ujeżdżalnię rozprasza konia i dziecko.',
  },
  {
    topic: 'tufting',
    question: 'Czy trzeba umieć rysować, żeby przyjść na tufting?',
    answer:
      'Nie. Projekt możesz przynieść, wybrać z naszych szablonów albo narysować na miejscu — prowadząca pomoże przenieść go na ramę. Pistolet tuftingowy jest prostszy w obsłudze, niż wygląda; pierwsze linie robisz zwykle w kilka minut od instruktażu.',
  },
  {
    topic: 'tufting',
    question: 'Ile trwają warsztaty tuftingu i co zabieram do domu?',
    answer:
      'Warsztat kończy się gotowym dywanikiem — wykończonym i gotowym do położenia na podłodze, nie półproduktem do dokończenia w domu. Dokładny czas i rozmiar pracy zależą od wybranego wariantu; podajemy je przy każdym z warsztatów w ofercie.',
  },
];

export function faqByTopic(...topics: readonly FaqItem['topic'][]): readonly FaqItem[] {
  return FAQ.filter((f) => topics.includes(f.topic));
}
