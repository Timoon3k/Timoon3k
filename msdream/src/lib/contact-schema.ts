import { z } from 'zod';

/**
 * Schemat formularza kontaktowego — używany PO OBU STRONACH:
 * w komponencie formularza i w route handlerze. Jedna definicja oznacza,
 * że walidacja kliencka i serwerowa nie mogą się rozjechać.
 *
 * Walidacja po stronie klienta jest wygodą, nie zabezpieczeniem —
 * serwer waliduje wszystko od nowa.
 */
export const contactSchema = z.object({
  name: z
    .string({ error: 'Podaj imię.' })
    .trim()
    .min(2, 'Podaj imię (min. 2 znaki).')
    .max(80, 'Imię jest za długie.'),
  email: z
    .string({ error: 'Podaj adres e-mail.' })
    .trim()
    .min(1, 'Podaj adres e-mail.')
    .email('To nie wygląda na poprawny adres e-mail.')
    .max(160, 'Adres e-mail jest za długi.'),
  phone: z
    .string()
    .trim()
    .max(24, 'Numer jest za długi.')
    .regex(/^[\d\s+()-]*$/, 'Numer może zawierać tylko cyfry i znaki + ( ) -')
    .optional()
    .or(z.literal('')),
  topic: z.enum(['jazda-konna', 'tufting', 'inne'], {
    error: 'Wybierz, czego dotyczy wiadomość.',
  }),
  message: z
    .string({ error: 'Napisz wiadomość.' })
    .trim()
    .min(10, 'Napisz choć dwa zdania — łatwiej nam będzie odpowiedzieć.')
    .max(3000, 'Wiadomość jest za długa (max 3000 znaków).'),
  /** Zgoda na kontakt — wymagana (RODO). */
  consent: z.literal(true, { error: 'Zgoda jest niezbędna, żebyśmy mogli odpowiedzieć.' }),
  /**
   * Honeypot — pole niewidoczne dla człowieka.
   *
   * Celowo przyjmuje DOWOLNY tekst, zamiast wymuszać pusty ciąg. Gdyby schemat
   * odrzucał wypełniony honeypot, bot dostałby błąd walidacji i dowiedziałby
   * się, że pole jest sprawdzane. Zamiast tego wartość przechodzi dalej,
   * a route handler odpowiada botowi „sukcesem” i po cichu nic nie wysyła.
   */
  website: z.string().max(200).optional(),
  /** Znacznik czasu wyrenderowania formularza (ochrona przed botami). */
  renderedAt: z.coerce.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const TOPIC_LABELS: Record<ContactInput['topic'], string> = {
  'jazda-konna': 'Jazda konna',
  tufting: 'Warsztaty tuftingu',
  inne: 'Inna sprawa',
};
