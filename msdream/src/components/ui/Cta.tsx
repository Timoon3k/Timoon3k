'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

interface CtaProps {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'ghost' | 'ghost-light' | 'brass';
  /** Zdarzenie analityczne wysyłane przy kliknięciu. */
  event?: AnalyticsEvent;
  eventPayload?: Record<string, string | number>;
  className?: string;
  arrow?: boolean;
}

const VARIANT = {
  solid: '',
  ghost: 'btn--ghost',
  'ghost-light': 'btn--ghost-light',
  brass: 'btn--brass',
} as const;

export function Cta({
  href,
  children,
  variant = 'solid',
  event,
  eventPayload,
  className = '',
  arrow = true,
}: CtaProps) {
  const external = /^(https?:|tel:|mailto:)/.test(href);
  const cls = `btn ${VARIANT[variant]} ${className}`.trim();
  const onClick = event ? () => track(event, eventPayload) : undefined;

  const inner = (
    <>
      {children}
      {arrow && (
        <svg
          className="btn__arrow"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          aria-hidden="true"
        >
          <path d="M9 1L13 5L9 9M13 5H0" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(href.startsWith('http') ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}
