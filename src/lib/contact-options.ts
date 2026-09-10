/**
 * Stałe formularza kontaktowego — bez żadnych zależności.
 *
 * Celowo oddzielone od `contact-schema.ts`: opcje list są potrzebne już przy
 * pierwszym renderze, a schemat walidacji (Zod, ~360 kB) dopiero przy wysyłce.
 * Trzymanie ich w jednym module ciągnęło Zoda do paczki startowej każdej
 * podstrony, która linkuje do `/kontakt` — czyli do wszystkich.
 */

export const projectTypes = [
  'Strona wizytówka',
  'Rozbudowany serwis firmowy',
  'Sklep internetowy / rezerwacje',
  'Rozwiązanie dedykowane',
  'Przebudowa istniejącej strony',
  'SEO i wydajność',
  'Jeszcze nie wiem',
] as const;

export const budgets = [
  'do 2 000 zł',
  '2 000 – 5 000 zł',
  '5 000 – 10 000 zł',
  'powyżej 10 000 zł',
  'do ustalenia',
] as const;

export type ContactResponse =
  | { ok: true }
  | { ok: false; message: string; errors?: Record<string, string> };
