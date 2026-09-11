'use client';

import { useSyncExternalStore } from 'react';

/**
 * Hooki do odczytu stanu przeglądarki.
 *
 * Używamy `useSyncExternalStore` zamiast pary `useState` + `useEffect`, bo:
 *  • React ma wtedy spójny obraz stanu także przy renderowaniu współbieżnym,
 *  • nie wywołujemy `setState` w efekcie (co powoduje kaskadowe renderowania),
 *  • `getServerSnapshot` daje jawną wartość dla SSR, więc nie ma rozjazdu
 *    przy hydratacji.
 */

/** Czy strona jest przewinięta poniżej zadanego progu (w pikselach). */
export function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    // Na serwerze zakładamy górę strony — tak samo wygląda pierwszy render
    // w przeglądarce, więc hydratacja przebiega bez ostrzeżeń.
    () => false,
  );
}

function subscribeToScroll(onChange: () => void): () => void {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/** Wartość z localStorage, odświeżana przy zmianach w innych kartach. */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(
    (onChange) => subscribeToStorage(key, onChange),
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        // Prywatne okno albo zablokowane dane witryny.
        return null;
      }
    },
    () => null,
  );
}

const storageListeners = new Map<string, Set<() => void>>();

function subscribeToStorage(key: string, onChange: () => void): () => void {
  let listeners = storageListeners.get(key);
  if (!listeners) {
    listeners = new Set();
    storageListeners.set(key, listeners);
  }
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) onChange();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** Powiadamia subskrybentów po zapisie z tej samej karty. */
export function notifyStoredValueChanged(key: string): void {
  storageListeners.get(key)?.forEach((listener) => listener());
}
