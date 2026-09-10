import type { ReactNode } from 'react';

/**
 * Renderer uproszczonego markdownu używanego w treści startowej bloga.
 *
 * Świadomie obsługuje wąski, zamknięty zbiór składni (nagłówki, listy,
 * akapity, pogrubienia, kod i odnośniki) i buduje elementy React zamiast
 * wstrzykiwać HTML — dzięki temu treść nie może wprowadzić znaczników do DOM.
 *
 * Wpisy pochodzące z Sanity zapisywane są jako Portable Text i renderowane
 * tą samą ścieżką po konwersji do czystego tekstu.
 */

type Token =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] };

function tokenize(markdown: string): Token[] {
  const blocks = markdown.trim().split(/\n{2,}/);
  const tokens: Token[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
    if (!lines.length) continue;

    const first = lines[0]!;

    if (first.startsWith('### ')) {
      tokens.push({ type: 'heading', level: 3, text: first.slice(4) });
      continue;
    }
    if (first.startsWith('## ')) {
      tokens.push({ type: 'heading', level: 2, text: first.slice(3) });
      continue;
    }
    if (lines.every((line) => line.startsWith('- '))) {
      tokens.push({ type: 'ul', items: lines.map((line) => line.slice(2)) });
      continue;
    }
    if (lines.every((line) => /^\d+\.\s/.test(line))) {
      tokens.push({ type: 'ol', items: lines.map((line) => line.replace(/^\d+\.\s/, '')) });
      continue;
    }

    tokens.push({ type: 'paragraph', text: lines.join(' ') });
  }

  return tokens;
}

/** Formatowanie w linii: **pogrubienie**, `kod`, [tekst](adres). */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-star">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={key}
          className="rounded-xs bg-slate px-1.5 py-0.5 font-mono text-[0.875em] text-signal"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const external = href!.startsWith('http');
      return (
        <a
          key={key}
          href={href}
          className="link-underline text-signal"
          {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        >
          {label}
        </a>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

export function Markdown({ content }: { content: string }) {
  const tokens = tokenize(content);

  return (
    <div className="space-y-6">
      {tokens.map((token, index) => {
        const key = `block-${index}`;

        switch (token.type) {
          case 'heading':
            return token.level === 2 ? (
              <h2
                key={key}
                data-reveal
                className="pt-8 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-tight text-star"
              >
                {token.text}
              </h2>
            ) : (
              <h3
                key={key}
                data-reveal
                className="pt-4 font-display text-[1.25rem] font-semibold tracking-tight text-star"
              >
                {token.text}
              </h3>
            );

          case 'ul':
            return (
              <ul key={key} className="space-y-3">
                {token.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`} className="flex gap-4 leading-relaxed text-dim">
                    <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                    <span>{inline(item, `${key}-${itemIndex}`)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'ol':
            return (
              <ol key={key} className="space-y-3">
                {token.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`} className="flex gap-4 leading-relaxed text-dim">
                    <span className="mt-0.5 font-mono text-[0.75rem] text-signal/70">
                      {String(itemIndex + 1).padStart(2, '0')}
                    </span>
                    <span>{inline(item, `${key}-${itemIndex}`)}</span>
                  </li>
                ))}
              </ol>
            );

          default:
            return (
              <p key={key} className="text-lead leading-relaxed text-dim">
                {inline(token.text, key)}
              </p>
            );
        }
      })}
    </div>
  );
}
