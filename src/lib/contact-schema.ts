import { z } from 'zod';
import { budgets, projectTypes } from '@/lib/contact-options';

/**
 * Jedno źródło reguł walidacji — ten sam schemat działa w przeglądarce
 * i w handlerze API, więc nie da się ich rozjechać.
 *
 * W przeglądarce ładowany dynamicznie (patrz `ContactForm`), żeby Zod nie
 * trafiał do paczki startowej. Na serwerze importowany normalnie.
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

export { budgets, projectTypes } from '@/lib/contact-options';
export type { ContactResponse } from '@/lib/contact-options';
