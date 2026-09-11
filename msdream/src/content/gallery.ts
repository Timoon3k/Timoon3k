import { photoRequired, type GalleryImage } from '@/lib/types';

/**
 * Galeria editorialowa.
 *
 * `span` steruje kompozycją masonry — układ jest celowo nieregularny
 * (duży kadr, dwa piony, pełna szerokość), a nie siatką 3×3.
 * Briefy fotograficzne opisują ujęcia, które realnie sprzedają szkołę jazdy:
 * relacja człowiek–koń, ruch, detal, miejsce.
 */
export const GALLERY: readonly GalleryImage[] = [
  {
    span: 'hero',
    caption: 'Poranek w stajni',
    photo: photoRequired(
      'Koń wyglądający z boksu w porannym świetle, para z nozdrzy, ciepłe barwy — szeroki kadr 16:9',
      'Koń w boksie o poranku w stajni MSdream w Łomiankach',
      '16/9',
    ),
  },
  {
    span: 'tall',
    caption: 'Przed jazdą',
    photo: photoRequired(
      'Detal: dłoń zapinająca popręg, skóra siodła, faktura — pion 4:5',
      'Przygotowanie konia do jazdy — detal siodła',
      '4/5',
    ),
  },
  {
    span: 'tall',
    caption: 'Kłus',
    photo: photoRequired(
      'Jeździec w kłusie z profilu, tło rozmyte ruchem — pion 4:5',
      'Jeździec w kłusie na ujeżdżalni MSdream',
      '4/5',
    ),
  },
  {
    span: 'wide',
    caption: 'Ujeżdżalnia',
    photo: photoRequired(
      'Szerokie ujęcie ujeżdżalni z lotu ptaka lub z podwyższenia, jeden jeździec na środku — 16:9',
      'Ujeżdżalnia szkoły jazdy konnej MSdream w Łomiankach',
      '16/9',
    ),
  },
  {
    span: 'square',
    caption: 'Pierwszy kontakt',
    photo: photoRequired(
      'Dziecko wyciągające dłoń do pyska konia, ostrość na dłoni — kwadrat 1:1',
      'Dziecko poznaje konia podczas zajęć ABC',
      '1/1',
    ),
  },
  {
    span: 'tall',
    caption: 'Instruktor',
    photo: photoRequired(
      'Instruktor tłumaczący coś jeźdźcowi na koniu, gestykulacja — pion 4:5',
      'Instruktor podczas zajęć jazdy konnej w MSdream',
      '4/5',
    ),
  },
  {
    span: 'square',
    caption: 'Po zajęciach',
    photo: photoRequired(
      'Koń jedzący marchewkę z ręki, rozmyte tło — kwadrat 1:1',
      'Koń po zajęciach w stajni MSdream',
      '1/1',
    ),
  },
  {
    span: 'wide',
    caption: 'Warsztaty tuftingu',
    photo: photoRequired(
      'Stanowiska tuftingowe z kolorową wełną, praca w toku — szeroki kadr 16:9',
      'Warsztaty tuftingu w MSdream',
      '16/9',
    ),
  },
  {
    span: 'tall',
    caption: 'Wełna',
    photo: photoRequired(
      'Makro motków wełny w ciepłych kolorach — pion 4:5',
      'Wełna używana na warsztatach tuftingu',
      '4/5',
    ),
  },
];
