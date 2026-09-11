import { photoRequired, type Horse } from '@/lib/types';

/**
 * Konie.
 *
 * Sekcja „Poznaj nasze konie" działa tylko wtedy, gdy wypełniona jest
 * prawdziwymi zwierzętami — imiona i charaktery uzupełnia właściciel w CMS
 * (Sanity → Konie). Puste sloty poniżej pokazują strukturę; strona główna
 * pomija tę sekcję, dopóki nie ma choć jednego konia z imieniem.
 */
export const HORSES: readonly Horse[] = [
  {
    name: '',
    breed: '',
    character: '',
    photo: photoRequired(
      'Portret konia z profilu na jednolitym tle stajni, uszy do przodu — pion 4:5',
      'Koń ze stajni MSdream',
    ),
  },
];

export function publishedHorses(): readonly Horse[] {
  return HORSES.filter((h) => h.name.trim().length > 0);
}
