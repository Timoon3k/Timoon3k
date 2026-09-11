'use client';

import { useState } from 'react';
import type { FaqItem } from '@/lib/types';

/**
 * FAQ oparte na natywnych <details> — działa bez JS, jest dostępne
 * z klawiatury i nie wymaga ról ARIA. Stan trzymamy tylko po to,
 * żeby animować strzałkę i pilnować, że otwarta jest jedna pozycja.
 */
export function FaqList({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t" style={{ borderColor: 'var(--color-line)' }}>
      {items.map((item) => {
        const isOpen = open === item.question;
        return (
          <details
            key={item.question}
            className="group border-b"
            style={{ borderColor: 'var(--color-line)' }}
            open={isOpen}
            onToggle={(e) => {
              const el = e.currentTarget;
              setOpen(el.open ? item.question : (prev) => (prev === item.question ? null : prev));
            }}
          >
            <summary
              className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden"
              style={{ minHeight: '3rem' }}
            >
              <span
                className="max-w-[52ch] text-base sm:text-lg"
                style={{ fontFamily: 'var(--font-display)', lineHeight: 1.25 }}
              >
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 transition-transform duration-500"
                style={{
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  transitionTimingFunction: 'var(--ease-editorial)',
                  color: 'var(--color-brass-600)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </span>
            </summary>
            <p
              className="max-w-[62ch] pb-7 text-[0.9375rem] leading-relaxed"
              style={{ color: 'var(--color-graphite-700)' }}
            >
              {item.answer}
            </p>
          </details>
        );
      })}
    </div>
  );
}
