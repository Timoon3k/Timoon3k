'use client';

import { useEffect, useRef, useState } from 'react';
import { contactSchema, TOPIC_LABELS, type ContactInput } from '@/lib/contact-schema';
import { track } from '@/lib/analytics';

type FieldErrors = Partial<Record<keyof ContactInput, string[]>>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const inputStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '3rem',
  padding: '0.75rem 0.875rem',
  background: 'var(--color-ivory-50)',
  border: '1px solid var(--color-line-strong)',
  borderRadius: 'var(--radius-soft)',
  fontSize: '1rem',
};

/**
 * Formularz kontaktowy.
 *
 * • Waliduje tym samym schematem Zod, co serwer — komunikaty są identyczne.
 * • Błędy trafiają do `aria-describedby` i regionu `role="alert"`, więc
 *   czytnik ekranu je odczytuje.
 * • Honeypot + znacznik czasu jako lekka ochrona antyspamowa (bez CAPTCHA).
 * • Stan wysyłki jest prawdziwy: „Wysłano" pojawia się wyłącznie wtedy,
 *   gdy serwer potwierdził przyjęcie wiadomości.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  // Czas wyrenderowania formularza — serwer odrzuca zgłoszenia wysłane
  // podejrzanie szybko po załadowaniu strony. Ustawiamy go w efekcie, bo
  // `Date.now()` w ciele renderu jest funkcją nieczystą.
  const renderedAt = useRef(0);
  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      topic: String(formData.get('topic') ?? 'inne'),
      message: String(formData.get('message') ?? ''),
      consent: formData.get('consent') === 'on',
      website: String(formData.get('website') ?? ''),
      renderedAt: renderedAt.current || Date.now(),
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as FieldErrors);
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const body = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string; fields?: FieldErrors }
        | null;

      if (res.ok && body?.ok) {
        setStatus('sent');
        track('contact_click', { topic: parsed.data.topic });
        return;
      }

      if (body?.fields) setErrors(body.fields);
      setServerError(body?.error ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie.');
      setStatus('error');
    } catch {
      setServerError('Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="p-8"
        style={{ background: 'var(--color-forest-900)', color: 'var(--color-ivory-100)' }}
      >
        <p className="eyebrow eyebrow--light">Wysłane</p>
        <p className="mt-5" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-heading)' }}>
          Dziękujemy — wiadomość do nas dotarła.
        </p>
        <p className="mt-4 max-w-[44ch] text-[0.9375rem]" style={{ color: 'var(--color-sand-400)' }}>
          Odpowiadamy zwykle tego samego dnia. Jeśli sprawa jest pilna, zadzwoń —
          w stajni telefon odbieramy szybciej niż pocztę.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot — ukryty przed ludźmi, widoczny dla botów.
          `aria-hidden` + tabIndex=-1, żeby czytniki ekranu go pominęły. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="website">Nie wypełniaj tego pola</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field label="Imię" name="name" errors={errors.name}>
        <input id="name" name="name" type="text" autoComplete="given-name" required style={inputStyle}
          aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="E-mail" name="email" errors={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required inputMode="email" style={inputStyle}
            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
        </Field>

        <Field label="Telefon" name="phone" errors={errors.phone} optional>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" style={inputStyle}
            aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        </Field>
      </div>

      <Field label="Czego dotyczy wiadomość" name="topic" errors={errors.topic}>
        <select id="topic" name="topic" defaultValue="jazda-konna" style={inputStyle}>
          {Object.entries(TOPIC_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </Field>

      <Field label="Wiadomość" name="message" errors={errors.message}>
        <textarea id="message" name="message" required rows={6} style={{ ...inputStyle, minHeight: '9rem', resize: 'vertical' }}
          placeholder="Napisz, kogo dotyczą zajęcia (wiek, doświadczenie) i jakie terminy Ci pasują."
          aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />
      </Field>

      <div>
        <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-relaxed"
          style={{ color: 'var(--color-graphite-500)' }}>
          <input id="consent" name="consent" type="checkbox" required
            style={{ marginTop: '0.2rem', width: '1.15rem', height: '1.15rem', flexShrink: 0 }}
            aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? 'consent-error' : undefined} />
          <span>
            Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na wiadomość.
            Szczegóły opisuje <a href="/polityka-prywatnosci" className="rein-link">polityka prywatności</a>.
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" className="mt-2 text-[0.8125rem]" style={{ color: 'var(--color-wool-700)' }}>
            {errors.consent[0]}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="p-4 text-[0.875rem]"
          style={{ background: 'color-mix(in oklab, var(--color-wool-500) 12%, transparent)', color: 'var(--color-wool-700)' }}>
          {serverError}
        </p>
      )}

      <button type="submit" className="btn w-full sm:w-auto" disabled={status === 'sending'}>
        {status === 'sending' ? 'Wysyłam…' : 'Wyślij wiadomość'}
      </button>
    </form>
  );
}

function Field({
  label, name, errors, optional = false, children,
}: {
  label: string;
  name: string;
  errors?: string[];
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-[0.12em]"
        style={{ color: 'var(--color-graphite-500)' }}>
        {label}
        {optional && <span style={{ textTransform: 'none', letterSpacing: 0 }}> (opcjonalnie)</span>}
      </label>
      {children}
      {errors && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-[0.8125rem]" style={{ color: 'var(--color-wool-700)' }}>
          {errors[0]}
        </p>
      )}
    </div>
  );
}
