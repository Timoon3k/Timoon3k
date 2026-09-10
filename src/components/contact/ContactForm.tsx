'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import {
  budgets,
  contactSchema,
  projectTypes,
  type ContactResponse,
} from '@/lib/contact-schema';

type Status = 'idle' | 'sending' | 'success' | 'error';

const fieldClass =
  'w-full border border-hairline-strong bg-graphite/60 px-4 py-3.5 text-star transition-colors placeholder:text-faint focus:border-signal focus:outline-none';

const labelClass = 'eyebrow block';

export default function ContactForm() {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('');

  const fieldId = (name: string) => `${formId}-${name}`;
  const errorId = (name: string) => `${formId}-${name}-error`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());

    const payload = {
      ...values,
      consent: values.consent === 'on',
    };

    // Walidacja po stronie klienta tym samym schematem, którego używa serwer.
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string' && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      setStatus('error');
      setMessage('Formularz zawiera błędy. Popraw zaznaczone pola.');
      const firstKey = Object.keys(nextErrors)[0];
      if (firstKey) document.getElementById(fieldId(firstKey))?.focus();
      return;
    }

    setStatus('sending');
    setErrors({});
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as ContactResponse;

      if (result.ok) {
        setStatus('success');
        setMessage('Dziękuję — wiadomość dotarła. Odpowiadam zwykle w ciągu 24 godzin.');
        form.reset();
        return;
      }

      setStatus('error');
      setErrors(result.errors ?? {});
      setMessage(result.message);
    } catch {
      setStatus('error');
      setMessage('Coś poszło nie tak z połączeniem. Spróbuj ponownie lub napisz bezpośrednio na e-mail.');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="border border-signal/40 bg-graphite/60 px-8 py-14 text-center"
      >
        <span aria-hidden className="mx-auto block h-2 w-2 rounded-full bg-signal" />
        <h3 className="mt-8 font-display text-headline font-semibold tracking-tight text-star">
          Wiadomość wysłana
        </h3>
        <p className="mx-auto mt-4 max-w-md text-dim">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle');
            setMessage('');
          }}
          className="link-underline mt-8 font-mono text-[0.6875rem] tracking-[0.14em] text-signal uppercase"
        >
          Wyślij kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-7">
      {/* Pole-pułapka na boty — ukryte przed użytkownikiem i czytnikami ekranu */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={fieldId('company')}>Nazwa firmy (nie wypełniaj)</label>
        <input
          id={fieldId('company')}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className={labelClass}>
            Imię <span className="text-signal">*</span>
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="given-name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? errorId('name') : undefined}
            className={`mt-3 ${fieldClass}`}
            placeholder="Jak się do Ciebie zwracać?"
          />
          {errors.name ? (
            <p id={errorId('name')} className="mt-2 text-sm text-flare">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId('email')} className={labelClass}>
            E-mail <span className="text-signal">*</span>
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId('email') : undefined}
            className={`mt-3 ${fieldClass}`}
            placeholder="adres@twojafirma.pl"
          />
          {errors.email ? (
            <p id={errorId('email')} className="mt-2 text-sm text-flare">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('phone')} className={labelClass}>
            Telefon <span className="text-faint">(opcjonalnie)</span>
          </label>
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errorId('phone') : undefined}
            className={`mt-3 ${fieldClass}`}
            placeholder="+48 000 000 000"
          />
          {errors.phone ? (
            <p id={errorId('phone')} className="mt-2 text-sm text-flare">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={fieldId('budget')} className={labelClass}>
            Orientacyjny budżet <span className="text-signal">*</span>
          </label>
          <select
            id={fieldId('budget')}
            name="budget"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? errorId('budget') : undefined}
            className={`mt-3 ${fieldClass}`}
          >
            <option value="" disabled>
              Wybierz przedział
            </option>
            {budgets.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.budget ? (
            <p id={errorId('budget')} className="mt-2 text-sm text-flare">
              {errors.budget}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={fieldId('projectType')} className={labelClass}>
          Typ projektu <span className="text-signal">*</span>
        </label>
        <select
          id={fieldId('projectType')}
          name="projectType"
          required
          defaultValue=""
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? errorId('projectType') : undefined}
          className={`mt-3 ${fieldClass}`}
        >
          <option value="" disabled>
            Wybierz zakres
          </option>
          {projectTypes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.projectType ? (
          <p id={errorId('projectType')} className="mt-2 text-sm text-flare">
            {errors.projectType}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={fieldId('message')} className={labelClass}>
          Opis projektu <span className="text-signal">*</span>
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId('message') : undefined}
          className={`mt-3 resize-y ${fieldClass}`}
          placeholder="Czym zajmuje się firma, co ma osiągnąć strona, czy masz już domenę i materiały, na kiedy potrzebujesz efektu."
        />
        {errors.message ? (
          <p id={errorId('message')} className="mt-2 text-sm text-flare">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={fieldId('consent')} className="flex cursor-pointer items-start gap-4">
          <input
            id={fieldId('consent')}
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? errorId('consent') : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-signal)]"
          />
          <span className="text-sm leading-relaxed text-dim">
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi na
            zapytanie, zgodnie z{' '}
            <a href="/polityka-prywatnosci" className="link-underline text-signal">
              polityką prywatności
            </a>
            . <span className="text-signal">*</span>
          </span>
        </label>
        {errors.consent ? (
          <p id={errorId('consent')} className="mt-2 text-sm text-flare">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-star px-8 py-4 font-medium tracking-tight text-void transition-opacity disabled:cursor-wait disabled:opacity-60"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-y-full bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
          />
          <span className="relative z-10">
            {status === 'sending' ? 'Wysyłanie…' : 'Wyślij zapytanie'}
          </span>
        </button>

        <p className="text-sm text-faint">Odpowiadam zwykle w ciągu 24 godzin.</p>
      </div>

      <p role="alert" aria-live="polite" className="min-h-6 text-sm text-flare">
        {status === 'error' ? message : ''}
      </p>
    </form>
  );
}
