import { owner } from '@/lib/site';
import { photoRequired, type Service } from '@/lib/types';

/**
 * Oferta jazdy konnej.
 *
 * Nazwy zajęć odpowiadają wariantom prowadzonym przez MSdream. Ceny i czasy
 * trwania są oznaczone jako `owner(...)` — nie zostały zmyślone. Właściciel
 * uzupełnia je w CMS (Sanity → Usługi) albo w tym pliku; do tego czasu
 * interfejs pokazuje „Cena do uzupełnienia" zamiast liczby, a JSON-LD
 * pomija pole `offers`.
 */
export const RIDING_SERVICES: readonly Service[] = [
  {
    slug: 'abc-jazdy-konnej',
    category: 'jazda-konna',
    name: 'ABC dla najmłodszych',
    tagline: 'Pierwsze spotkanie z koniem — bez pośpiechu i bez presji.',
    description:
      'Zajęcia dla dzieci, które konia znają na razie z książek. Zaczynamy na ziemi: głaskanie, czyszczenie, podanie marchewki. Dopiero kiedy dziecko samo chce, sadzamy je w siodle — instruktor prowadzi konia przez cały czas. Rodzic jest obok, nie za szybą.',
    price: owner<number>('cena zajęć ABC (PLN brutto)'),
    priceNote: '/ zajęcia',
    durationMin: owner<number>('czas trwania zajęć ABC w minutach'),
    audience: 'Dzieci od ok. 4 lat, bez żadnego doświadczenia',
    includes: [
      'Powitanie i kontakt z koniem z ziemi',
      'Nauka czyszczenia i podstaw bezpieczeństwa wokół konia',
      'Jazda na lonży lub prowadzona przez instruktora',
      'Kask i cały sprzęt po naszej stronie',
    ],
    requirements: [
      'Obecność rodzica lub opiekuna przez całe zajęcia',
      'Długie spodnie i buty na płaskiej podeszwie z obcasem',
      'Zgoda opiekuna na udział w zajęciach',
    ],
    photo: photoRequired(
      'Dziecko w kasku czyszczące konia szczotką, instruktorka kuca obok i tłumaczy — światło poranne, ujęcie z poziomu dziecka, pion 4:5',
      'Dziecko czyści konia pod okiem instruktorki podczas zajęć ABC w MSdream',
    ),
    featured: true,
  },
  {
    slug: 'jazda-indywidualna',
    category: 'jazda-konna',
    name: 'Jazda indywidualna',
    tagline: 'Jeden jeździec, jeden instruktor, jedna godzina tylko dla Ciebie.',
    description:
      'Najszybszy sposób na postęp. Instruktor patrzy wyłącznie na Ciebie i koryguje na bieżąco — dosiad, ręce, pracę nogą. Program układamy pod to, gdzie jesteś dzisiaj: pierwszy kłus, praca nad galopem albo przygotowanie do skoków.',
    price: owner<number>('cena jazdy indywidualnej (PLN brutto)'),
    priceNote: '/ 60 min',
    durationMin: owner<number>('czas trwania jazdy indywidualnej w minutach'),
    audience: 'Młodzież i dorośli, każdy poziom — od pierwszej jazdy po zaawansowanych',
    includes: [
      'Dobór konia do poziomu i budowy jeźdźca',
      'Rozgrzewka i podsumowanie po zajęciach',
      'Sprzęt jeździecki i kask',
      'Plan na kolejne jazdy',
    ],
    requirements: [
      'Osoby początkujące zaczynają na lonży',
      'Limit wagi jeźdźca — potwierdź przy rezerwacji',
      'Odwołanie bezpłatne zgodnie z regulaminem rezerwacji',
    ],
    photo: photoRequired(
      'Dorosły jeździec w kłusie na ujeżdżalni, instruktorka na środku placu w kadrze — golden hour, kurz spod kopyt, poziom 3:2',
      'Jazda indywidualna na ujeżdżalni MSdream w Łomiankach',
    ),
    featured: true,
  },
  {
    slug: 'jazda-konna-dla-dzieci',
    category: 'jazda-konna',
    name: 'Zajęcia dla dzieci',
    tagline: 'Regularna nauka, która buduje odwagę — nie tylko technikę.',
    description:
      'Zajęcia dla dzieci, które mają już pierwszy kontakt z koniem za sobą i chcą jeździć na serio. Uczymy dosiadu, równowagi i samodzielności w stajni — bo jeździectwo zaczyna się przy boksie, nie na ujeżdżalni. Grupy są małe, żeby każde dziecko realnie jeździło, a nie czekało w kolejce.',
    price: owner<number>('cena zajęć dla dzieci (PLN brutto)'),
    priceNote: '/ zajęcia',
    durationMin: owner<number>('czas trwania zajęć dla dzieci w minutach'),
    audience: 'Dzieci i młodzież po zajęciach ABC lub z podstawami',
    includes: [
      'Praca nad dosiadem i równowagą',
      'Samodzielne przygotowanie konia do jazdy',
      'Ćwiczenia w stępie, kłusie i — z czasem — galopie',
      'Informacja zwrotna dla rodzica po zajęciach',
    ],
    requirements: [
      'Podstawowy kontakt z koniem lub ukończone zajęcia ABC',
      'Strój jeździecki lub długie spodnie i buty z obcasem',
      'Kask — mamy na miejscu, można też przyjechać z własnym',
    ],
    photo: photoRequired(
      'Dziewczynka w kasku w kłusie, skupiona twarz, instruktorka w tle nieostra — pion 4:5, ciepłe światło',
      'Dziecko podczas regularnych zajęć jazdy konnej w MSdream',
    ),
    featured: true,
  },
  {
    slug: 'jazda-konna-dla-doroslych',
    category: 'jazda-konna',
    name: 'Jazda dla dorosłych',
    tagline: 'Na konia można wsiąść pierwszy raz w każdym wieku.',
    description:
      'Duża część naszych dorosłych kursantów zaczyna od zera — czasem po latach odkładania tego „na kiedyś". Nie ma tu grup, w których trzeba za kimś nadążać. Pierwsze zajęcia to spokojne oswojenie się z koniem i praca na lonży, żebyś nie musiał myśleć o sterowaniu, tylko o tym, jak siedzisz.',
    price: owner<number>('cena jazdy dla dorosłych (PLN brutto)'),
    priceNote: '/ 60 min',
    durationMin: owner<number>('czas trwania jazdy dla dorosłych w minutach'),
    audience: 'Dorośli — początkujący, wracający po przerwie i jeżdżący regularnie',
    includes: [
      'Zajęcia na lonży dla początkujących',
      'Dobór konia do wzrostu i temperamentu',
      'Praca nad rozluźnieniem i dosiadem',
      'Sprzęt i kask na miejscu',
    ],
    requirements: [
      'Limit wagi jeźdźca — potwierdź przy rezerwacji',
      'Wygodny, nieluźny strój i buty z obcasem',
      'Przyjedź 15 minut wcześniej na pierwsze zajęcia',
    ],
    photo: photoRequired(
      'Dorosła osoba przy koniu, dłoń na szyi konia, spokojny kontakt wzrokowy — pion 4:5, naturalne światło stajni',
      'Dorosły kursant podczas nauki jazdy konnej w MSdream w Łomiankach',
    ),
  },
  {
    slug: 'pakiety-jazd',
    category: 'jazda-konna',
    name: 'Pakiety jazd',
    tagline: 'Regularność robi różnicę większą niż talent.',
    description:
      'Pakiet kilku jazd wykupiony z góry — taniej niż pojedyncze zajęcia i, co ważniejsze, łatwiej się go trzymać. Terminy rezerwujesz elastycznie, a my pilnujemy ciągłości pracy z tym samym instruktorem i tym samym koniem.',
    price: owner<number>('cena pakietu (PLN brutto) oraz liczba jazd w pakiecie'),
    priceNote: 'od',
    durationMin: owner<number>('czas pojedynczej jazdy w pakiecie'),
    audience: 'Dzieci i dorośli jeżdżący regularnie',
    includes: [
      'Kilka jazd w jednej cenie — korzystniej niż pojedynczo',
      'Elastyczna rezerwacja terminów',
      'Ciągłość pracy z tym samym instruktorem',
      'Możliwość opłacenia online przy rezerwacji',
    ],
    requirements: [
      'Termin ważności pakietu — potwierdź przy zakupie',
      'Pakiet jest imienny',
      'Zasady odwoływania jazd opisuje regulamin rezerwacji',
    ],
    photo: photoRequired(
      'Dwa konie przy koniowiązie, w tle jeźdźcy szykujący się do zajęć — szerokie ujęcie 3:2',
      'Pakiety jazd konnych w szkole jazdy konnej MSdream',
    ),
  },
];

/**
 * Warsztaty tuftingu.
 * Warianty odpowiadają ofercie msdream.pl/warsztaty-tuftingu.
 */
export const TUFTING_SERVICES: readonly Service[] = [
  {
    slug: 'tufting-indywidualny',
    category: 'tufting',
    name: 'Warsztaty indywidualne',
    tagline: 'Cały stół, cały pistolet i cała uwaga prowadzącej — dla Ciebie.',
    description:
      'Przychodzisz z pomysłem albo ze zdjęciem i wychodzisz z gotowym dywanikiem. Prowadząca pracuje tylko z Tobą, więc możesz sobie pozwolić na bardziej wymagający projekt niż na zajęciach grupowych.',
    price: owner<number>('cena warsztatów indywidualnych (PLN brutto)'),
    priceNote: '/ os.',
    durationMin: owner<number>('czas trwania warsztatów indywidualnych w minutach'),
    audience: 'Dorośli i młodzież, bez doświadczenia',
    includes: [
      'Projekt — własny pomysł lub szablon do wyboru',
      'Wełna, rama, klej i wykończenie',
      'Nauka obsługi pistoletu tuftingowego',
      'Gotowy dywanik zabierasz ze sobą',
    ],
    requirements: [
      'Ubierz się w coś, czego nie szkoda — wełna się kurzy',
      'Rozmiar dywanika zależy od wybranego wariantu',
      'Minimalny wiek uczestnika — potwierdź przy rezerwacji',
    ],
    photo: photoRequired(
      'Dłonie trzymające pistolet tuftingowy przy ramie, kolorowa wełna w kadrze — makro, poziom 3:2',
      'Warsztaty tuftingu indywidualne — praca pistoletem tuftingowym',
    ),
    featured: true,
  },
  {
    slug: 'tufting-mama-z-dzieckiem',
    category: 'tufting',
    name: 'Mama z dzieckiem',
    tagline: 'Dwie pary rąk, jeden dywanik, żadnych telefonów.',
    description:
      'Warsztat dla dorosłego i dziecka przy jednej ramie. Dorosły obsługuje pistolet, dziecko odpowiada za kolory i wykończenie — albo odwrotnie, jeśli dziecko da radę. Wychodzicie z rzeczą, którą zrobiliście razem.',
    price: owner<number>('cena warsztatów „mama z dzieckiem" (PLN brutto za parę)'),
    priceNote: '/ para',
    durationMin: owner<number>('czas trwania warsztatów „mama z dzieckiem"'),
    audience: 'Dorosły + dziecko (dolna granica wieku — do potwierdzenia)',
    includes: [
      'Jedno stanowisko dla dwóch osób',
      'Wszystkie materiały i narzędzia',
      'Pomoc prowadzącej na każdym etapie',
      'Jeden wspólny dywanik do zabrania',
    ],
    requirements: [
      'Dziecko pracuje pod stałym nadzorem dorosłego',
      'Pistolet tuftingowy obsługuje osoba dorosła',
      'Ubrania robocze — wełna zostawia włókna',
    ],
    photo: photoRequired(
      'Dorosły i dziecko przy wspólnej ramie tuftingowej, uśmiech, wełniane motki w tle — poziom 3:2',
      'Warsztaty tuftingu dla mamy z dzieckiem w MSdream',
    ),
    featured: true,
  },
  {
    slug: 'tufting-grupowy',
    category: 'tufting',
    name: 'Warsztaty grupowe',
    tagline: 'Wieczór panieński, integracja zespołu albo po prostu ekipa znajomych.',
    description:
      'Każdy dostaje własną ramę i własny projekt — nie robicie jednej pracy na zmianę. Prowadząca krąży między stanowiskami. Sprawdza się jako alternatywa dla kolejnej kolacji w mieście, bo z warsztatów wychodzi się z czymś w rękach.',
    price: owner<number>('cena warsztatów grupowych (PLN brutto od osoby)'),
    priceNote: '/ os.',
    durationMin: owner<number>('czas trwania warsztatów grupowych'),
    audience: 'Grupy — znajomi, zespoły firmowe, wieczory panieńskie',
    includes: [
      'Osobne stanowisko i projekt dla każdego uczestnika',
      'Komplet materiałów',
      'Opieka prowadzącej przez cały warsztat',
      'Dywaniki gotowe do zabrania tego samego dnia',
    ],
    requirements: [
      'Minimalna i maksymalna liczba osób — potwierdź przy rezerwacji',
      'Termin grupowy rezerwujemy indywidualnie',
      'Ubrania robocze dla wszystkich uczestników',
    ],
    photo: photoRequired(
      'Kilka osób przy osobnych ramach tuftingowych w jednym pomieszczeniu, kolorowa wełna — szeroki kadr 16:9',
      'Grupowe warsztaty tuftingu w MSdream',
    ),
  },
  {
    slug: 'urodziny-z-tuftingiem',
    category: 'tufting',
    name: 'Urodziny z tuftingiem',
    tagline: 'Prezent, który solenizant robi sam — i który zostaje na lata.',
    description:
      'Urodziny dla dziecka albo nastolatka: każdy gość tuftuje własny mały dywanik i zabiera go do domu zamiast plastikowego gadżetu z paczki. My przygotowujemy stanowiska i pilnujemy bezpieczeństwa, wy przynosicie tort.',
    price: owner<number>('cena urodzin z tuftingiem (PLN brutto — od osoby lub za grupę)'),
    priceNote: 'od',
    durationMin: owner<number>('czas trwania urodzin z tuftingiem'),
    audience: 'Grupy urodzinowe — dzieci i nastolatki',
    includes: [
      'Stanowisko i materiały dla każdego gościa',
      'Prowadzenie warsztatu i opieka nad grupą',
      'Miejsce na tort i prezenty',
      'Dywanik dla każdego uczestnika jako pamiątka',
    ],
    requirements: [
      'Rezerwacja z wyprzedzeniem — terminy weekendowe schodzą pierwsze',
      'Liczba uczestników do ustalenia przy rezerwacji',
      'Poczęstunek po stronie organizatora',
    ],
    photo: photoRequired(
      'Grupa dzieci przy stanowiskach tuftingowych, kolorowe dywaniki w rękach, radość — poziom 3:2',
      'Urodziny z warsztatami tuftingu w MSdream',
    ),
  },
];

export const ALL_SERVICES: readonly Service[] = [...RIDING_SERVICES, ...TUFTING_SERVICES];

export function getService(slug: string): Service | undefined {
  return ALL_SERVICES.find((s) => s.slug === slug);
}
