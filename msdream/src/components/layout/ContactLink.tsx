'use client';

import type { ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

/** Link kontaktowy (tel:/mailto:) raportujący zdarzenie do analityki. */
export function ContactLink({
  href,
  children,
  event,
  className = '',
}: {
  href: string;
  children: ReactNode;
  event: AnalyticsEvent;
  className?: string;
}) {
  return (
    <a href={href} className={className} onClick={() => track(event, { href })}>
      {children}
    </a>
  );
}
