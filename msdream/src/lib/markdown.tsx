import { Fragment, type ReactNode } from 'react';

/**
 * Minimalny renderer Markdown dla treści redakcyjnych (poradniki, dokumenty
 * prawne). Świadomie bez zewnętrznej biblioteki: obsługujemy dokładnie tyle
 * składni, ile realnie występuje w treści, i nie dokładamy kilkudziesięciu
 * kilobajtów JS do bundle'a strony, która i tak renderuje się na serwerze.
 *
 * Obsługiwane: ## i ### nagłówki, listy punktowane i numerowane, akapity,
 * **pogrubienie**, [linki](url).
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  // Naprzemiennie: **bold** oraz [tekst](href)
  const pattern = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));

    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={`${keyPrefix}-b${i}`}>{token.slice(2, -2)}</strong>);
    } else {
      const label = token.slice(1, token.indexOf(']'));
      const href = token.slice(token.indexOf('(') + 1, -1);
      const external = /^https?:\/\//.test(href);
      nodes.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={href}
          {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {label}
        </a>,
      );
    }
    last = match.index + token.length;
    i += 1;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <>
      {blocks.map((block, i) => {
        const key = `b${i}`;
        const trimmed = block.trim();

        if (trimmed.startsWith('### ')) {
          return <h3 key={key}>{inline(trimmed.slice(4), key)}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={key}>{inline(trimmed.slice(3), key)}</h2>;
        }

        const lines = trimmed.split('\n');

        if (lines.every((l) => /^[-*]\s+/.test(l.trim()))) {
          return (
            <ul key={key}>
              {lines.map((l, j) => (
                <li key={`${key}-${j}`}>{inline(l.trim().replace(/^[-*]\s+/, ''), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => /^\d+[.)]\s+/.test(l.trim()))) {
          return (
            <ol key={key}>
              {lines.map((l, j) => (
                <li key={`${key}-${j}`}>
                  {inline(l.trim().replace(/^\d+[.)]\s+/, ''), `${key}-${j}`)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={key}>
            {lines.map((l, j) => (
              <Fragment key={`${key}-${j}`}>
                {j > 0 ? ' ' : null}
                {inline(l, `${key}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
