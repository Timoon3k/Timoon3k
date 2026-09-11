'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

/**
 * Osadzony kalendarz rezerwacji Bookero.
 *
 * Metoda integracji jest ZGODNA Z OFICJALNĄ DOKUMENTACJĄ Bookero
 * (zakładka „Integracje" w panelu Bookero): na stronie umieszcza się
 * kontener `<div id="bookero">`, konfigurację w globalnej zmiennej
 * `bookero_config` i skrypt `bookero-compiled.js`. Nie wymyślamy własnego
 * API ani nie odpytujemy niepublicznych endpointów.
 *
 * Dlaczego widget, a nie przekierowanie na stronę Bookero:
 * użytkownik zostaje w serwisie, zachowujemy kontekst, analitykę i to,
 * co właśnie oglądał. Przekierowanie do zewnętrznego kalendarza jest
 * najczęstszym miejscem, w którym rezerwacje się urywają.
 *
 * Bez skonfigurowanego `NEXT_PUBLIC_BOOKERO_PLUGIN_ID` komponent NIE udaje,
 * że kalendarz działa — pokazuje jawny stan konfiguracyjny (patrz SETUP.md).
 */

const SCRIPT_SRC = 'https://www.bookero.pl/plugin/v2/js/bookero-compiled.js';
const SCRIPT_ID = 'bookero-plugin';

declare global {
  interface Window {
    bookero_config?: Record<string, unknown>;
  }
}

interface BookeroWidgetProps {
  /** Wariant kalendarza — zgodnie z konfiguracją w panelu Bookero. */
  type?: 'calendar' | 'form';
  /** Opcjonalne ID usługi, żeby otworzyć kalendarz od razu na właściwych zajęciach. */
  serviceId?: string | null;
  /** Etykieta do analityki — pozwala rozróżnić rezerwację jazdy od tuftingu. */
  context: 'jazda-konna' | 'tufting';
}

export function BookeroWidget({ type = 'calendar', serviceId, context }: BookeroWidgetProps) {
  // Warsztaty tuftingu mogą mieć w Bookero osobną wtyczkę (inne usługi, inny
  // grafik). Jeśli jej nie ma, spadamy na wtyczkę główną — jedna rezerwacja
  // obsługuje wtedy obie gałęzie oferty.
  // Zmienne NEXT_PUBLIC_* muszą być odczytywane w pełnej formie, żeby Next.js
  // podstawił je w czasie builda — stąd rozpisane wyrażenie zamiast pętli.
  const tuftingId = process.env.NEXT_PUBLIC_BOOKERO_PLUGIN_ID_TUFTING;
  const defaultId = process.env.NEXT_PUBLIC_BOOKERO_PLUGIN_ID;
  const pluginId = context === 'tufting' ? tuftingId || defaultId : defaultId;
  const containerRef = useRef<HTMLDivElement>(null);
  // Stan startowy wynika wprost z konfiguracji — nie ustawiamy go w efekcie,
  // bo to powodowałoby dodatkowe, niepotrzebne renderowanie.
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    pluginId ? 'loading' : 'idle',
  );

  useEffect(() => {
    if (!pluginId) return;

    track('booking_start', { context });

    // Konfiguracja musi istnieć ZANIM skrypt wystartuje — plugin czyta ją
    // przy inicjalizacji.
    window.bookero_config = {
      id: pluginId,
      container: 'bookero',
      type,
      position: '',
      plugin_css: true,
      lang: 'pl',
      ...(serviceId ? { service: serviceId } : {}),
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      // Przy nawigacji klienckiej skrypt już jest w dokumencie. Ponowne
      // wstrzyknięcie go nie zainicjalizuje widgetu drugi raz, więc
      // przeładowujemy element, żeby plugin wykonał się od nowa.
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => setStatus('ready');
    script.onerror = () => setStatus('error');
    document.body.appendChild(script);

    // Kopiujemy referencję do zmiennej lokalnej: w momencie sprzątania
    // `containerRef.current` może już wskazywać co innego.
    const container = containerRef.current;

    return () => {
      // Sprzątamy kontener, żeby przy powrocie na stronę nie został
      // podwójnie wyrenderowany kalendarz.
      if (container) container.innerHTML = '';
    };
  }, [pluginId, type, serviceId, context]);

  // --- Brak konfiguracji: mówimy to wprost, zamiast pokazywać atrapę --------
  if (!pluginId) {
    return (
      <div
        className="bookero-shell"
        role="status"
        style={{ padding: 'clamp(1.5rem, 4vw, 3rem)' }}
      >
        <p className="eyebrow">Kalendarz rezerwacji</p>
        <p
          className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed"
          style={{ color: 'var(--color-graphite-700)' }}
        >
          Kalendarz Bookero jest zintegrowany, ale czeka na identyfikator wtyczki.
          Po jego dodaniu ta sekcja zamieni się w działający kalendarz — bez zmian
          w kodzie.
        </p>
        <p className="mt-4 text-[0.875rem]" style={{ color: 'var(--color-graphite-500)' }}>
          Ustaw zmienną <code>NEXT_PUBLIC_BOOKERO_PLUGIN_ID</code> wartością z panelu
          Bookero (zakładka <strong>Integracje</strong>). Instrukcja: <strong>SETUP.md</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bookero-shell">
      {status === 'loading' && (
        <p className="p-6 text-[0.875rem]" style={{ color: 'var(--color-graphite-500)' }} role="status">
          Wczytuję dostępne terminy…
        </p>
      )}

      {status === 'error' && (
        <div className="p-6" role="alert">
          <p className="text-[0.9375rem]" style={{ color: 'var(--color-graphite-900)' }}>
            Nie udało się wczytać kalendarza rezerwacji.
          </p>
          <p className="mt-2 text-[0.875rem]" style={{ color: 'var(--color-graphite-500)' }}>
            Odśwież stronę albo skontaktuj się z nami telefonicznie — zarezerwujemy termin ręcznie.
          </p>
        </div>
      )}

      {/* Kontener wymagany przez plugin Bookero. Identyfikator musi brzmieć
          dokładnie „bookero" — tak czyta go skrypt. */}
      <div id="bookero" ref={containerRef} />
    </div>
  );
}
