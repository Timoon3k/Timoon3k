'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Wysyła zdarzenie `booking_complete` po wejściu na stronę potwierdzenia.
 *
 * Uwaga: to jest wyłącznie sygnał analityczny. Źródłem prawdy o płatności
 * pozostaje podpisany webhook serwer-serwer — tutaj mierzymy konwersję,
 * a nie potwierdzamy transakcję.
 */
export function PaymentTracking() {
  useEffect(() => {
    track('booking_complete');
  }, []);

  return null;
}
