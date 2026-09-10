import { z } from 'zod';

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

/**
 * Jedno źródło reguł walidacji — ten sam schemat działa w przeglądarce
 * i w handlerze API, więc nie da się ich rozjechać.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Podaj imię (minimum 2 znaki).')
    .max(80, 'To pole jest za długie.'),
  email: z.email('Podaj poprawny adres e-mail.').max(160, 'To pole jest za długie.'),
  phone: z
    .string()
    .trim()
    .max(24, 'To pole jest za długie.')
    .refine((value) => value === '' || /^[+\d][\d\s()-]{6,}$/.test(value), {
      message: 'Podaj poprawny numer telefonu lub zostaw pole puste.',
    })
    .optional()
    .default(''),
  projectType: z.enum(projectTypes, { message: 'Wybierz typ projektu.' }),
  budget: z.enum(budgets, { message: 'Wybierz orientacyjny budżet.' }),
  message: z
    .string()
    .trim()
    .min(20, 'Opisz projekt w co najmniej 20 znakach — łatwiej będzie mi odpowiedzieć konkretnie.')
    .max(4000, 'Wiadomość jest za długa (maksimum 4000 znaków).'),
  consent: z.literal(true, { message: 'Zgoda na kontakt jest wymagana, żeby odpisać.' }),
  /** Pole-pułapka: widoczne wyłącznie dla botów. Musi pozostać puste. */
  company: z.string().max(0).optional().default(''),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type ContactResponse =
  | { ok: true }
  | { ok: false; message: string; errors?: Record<string, string> };
