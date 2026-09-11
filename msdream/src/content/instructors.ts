import { owner } from '@/lib/site';
import { photoRequired, type Instructor } from '@/lib/types';

/**
 * Instruktorzy.
 *
 * Imion i nazwisk NIE zmyślamy — na tej stronie stoi wiarygodność szkoły.
 * Poniżej znajdują się strukturalne sloty gotowe do wypełnienia w CMS
 * (Sanity → Instruktorzy). Dopóki `name` nie zostanie uzupełnione, karta
 * instruktora pokazuje brief zamiast danych, a JSON-LD typu `Person`
 * nie jest generowany.
 */
export const INSTRUCTORS: readonly Instructor[] = [
  {
    slug: 'instruktor-1',
    name: owner('imię i nazwisko instruktora prowadzącego'),
    role: 'Instruktor jazdy konnej',
    bio: 'Opis do uzupełnienia w CMS — kilka zdań o tym, jak prowadzi zajęcia i z kim pracuje najchętniej.',
    experience: 'Do uzupełnienia — lata doświadczenia i uprawnienia',
    specialization: ['Do uzupełnienia — np. praca z dziećmi, lonża, skoki'],
    portrait: photoRequired(
      'Portret instruktora przy koniu, kontakt wzrokowy z obiektywem, naturalne światło — pion 4:5',
      'Instruktor jazdy konnej w szkole MSdream w Łomiankach',
    ),
    sortOrder: 1,
  },
  {
    slug: 'instruktor-2',
    name: owner('imię i nazwisko kolejnego instruktora'),
    role: 'Instruktor jazdy konnej',
    bio: 'Opis do uzupełnienia w CMS.',
    experience: 'Do uzupełnienia',
    specialization: ['Do uzupełnienia'],
    portrait: photoRequired(
      'Portret instruktorki w trakcie zajęć, w ruchu, nieupozowany — pion 4:5',
      'Instruktorka jazdy konnej w szkole MSdream',
    ),
    sortOrder: 2,
  },
];

/** Zwraca tylko instruktorów z uzupełnionymi danymi — do JSON-LD i sitemapy. */
export function publishedInstructors(): readonly Instructor[] {
  return INSTRUCTORS.filter((i) => typeof i.name === 'string');
}
