/**
 * Zamiana HTML-a z edytora WordPressa na wąski markdown renderowany przez
 * `src/lib/markdown.tsx`.
 *
 * Powód jest bezpieczeństwowy, nie estetyczny: renderer markdownu buduje
 * elementy Reacta, więc treść z CMS-u nigdy nie trafia do DOM jako HTML.
 * Wstawienie `content.rendered` przez `dangerouslySetInnerHTML` byłoby
 * krótsze, ale otwierałoby drogę do XSS-a i wciągało klasy WordPressa,
 * które rozjechałyby typografię strony.
 *
 * Obsługiwany podzbiór odpowiada temu, co renderer potrafi wyświetlić:
 * nagłówki h2/h3, akapity, listy, pogrubienia, kod i odnośniki.
 * Reszta znaczników jest spłaszczana do tekstu — świadomie, bo lepiej
 * stracić formatowanie niż wyświetlić surowy znacznik.
 */

/**
 * Encje nazwane, które realnie wychodzą z WordPressa: składnia, typografia
 * i litery diakrytyczne. Encje liczbowe (`&#322;`) obsługuje osobna ścieżka,
 * więc tabela nie musi być pełna — musi pokrywać polski i interpunkcję,
 * bo nieodkodowana encja wyświetliłaby się użytkownikowi dosłownie.
 */
const NAMED_ENTITIES: Record<string, string> = {
  // Składnia
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '',
  // Typografia
  hellip: '…', mdash: '—', ndash: '–', minus: '−', times: '×', deg: '°',
  laquo: '«', raquo: '»', bdquo: '„', rdquo: '”', ldquo: '“',
  sbquo: '‚', rsquo: '’', lsquo: '‘', prime: '′', Prime: '″',
  euro: '€', pound: '£', copy: '©', reg: '®', trade: '™', middot: '·', bull: '•',
  // Polskie znaki diakrytyczne
  aogon: 'ą', Aogon: 'Ą', cacute: 'ć', Cacute: 'Ć', eogon: 'ę', Eogon: 'Ę',
  lstrok: 'ł', Lstrok: 'Ł', nacute: 'ń', Nacute: 'Ń',
  sacute: 'ś', Sacute: 'Ś', zacute: 'ź', Zacute: 'Ź', zdot: 'ż', Zdot: 'Ż',
  // Pozostałe litery łacińskie spotykane w nazwach własnych
  oacute: 'ó', Oacute: 'Ó', aacute: 'á', Aacute: 'Á', eacute: 'é', Eacute: 'É',
  iacute: 'í', Iacute: 'Í', uacute: 'ú', Uacute: 'Ú',
  agrave: 'à', egrave: 'è', ugrave: 'ù', ccedil: 'ç', Ccedil: 'Ç',
  auml: 'ä', Auml: 'Ä', ouml: 'ö', Ouml: 'Ö', uuml: 'ü', Uuml: 'Ü',
  szlig: 'ß', ntilde: 'ñ', Ntilde: 'Ñ', oslash: 'ø', Oslash: 'Ø',
  aring: 'å', Aring: 'Å', aelig: 'æ', AElig: 'Æ',
  scaron: 'š', Scaron: 'Š', zcaron: 'ž', Zcaron: 'Ž', ccaron: 'č', Ccaron: 'Č',
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(parseInt(code, 16)))
    // Dopasowanie najpierw dokładne, dopiero potem bez wielkości liter:
    // `&Zdot;` to Ż, a `&zdot;` to ż — spłaszczenie zamieniłoby jedno w drugie.
    .replace(
      /&([a-z]+);/gi,
      (match, name: string) => NAMED_ENTITIES[name] ?? NAMED_ENTITIES[name.toLowerCase()] ?? match,
    );
}

/** Znaki, które w markdownie znaczą coś innego niż w treści. */
const escapeMarkdown = (text: string) => text.replace(/([*`[\]])/g, '\\$1');

/** Sam tekst: bez znaczników, z rozwiniętymi encjami, bez uciekania. */
const plain = (html: string) => decodeEntities(html.replace(/<[^>]*>/g, ''));

/**
 * Zamienia formatowanie w linii, a wszystko pozostałe spłaszcza do tekstu.
 *
 * Gotowe fragmenty markdownu chowamy pod znacznikami pozycyjnymi, zanim
 * uciekniemy znaki specjalne w zwykłym tekście. Bez tego trzeba by uciekać
 * i odkręcać w tej samej przestrzeni znaków — a wtedy gwiazdka wpisana przez
 * autora i gwiazdka pogrubienia byłyby nie do odróżnienia.
 */
function inlineToMarkdown(html: string): string {
  const slots: string[] = [];
  // Znacznik z obszaru prywatnego Unicode — nie wystąpi w treści z CMS-u.
  const hold = (markdown: string) => `\uE000${slots.push(markdown) - 1}\uE000`;

  const withSlots = html
    .replace(/<br\s*\/?>/gi, ' ')
    // Kursywa idzie na pogrubienie — renderer nie zna innego wyróżnienia.
    .replace(/<(strong|b|em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner: string) => {
      const text = escapeMarkdown(plain(inner)).trim();
      return text ? hold(`**${text}**`) : '';
    })
    .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, (_, inner: string) => {
      const text = plain(inner).trim();
      return text ? hold(`\`${text}\``) : '';
    })
    .replace(/<a\b[^>]*?href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href: string, inner: string) => {
      const label = escapeMarkdown(plain(inner)).trim();
      const url = decodeEntities(href).trim();
      // Tylko bezpieczne schematy — `javascript:` i `data:` zostają samym tekstem.
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(url);
      return safe && label ? hold(`[${label}](${url})`) : label;
    });

  const escaped = escapeMarkdown(plain(withSlots));
  const restored = escaped.replace(/\uE000(\d+)\uE000/g, (_, index: string) => slots[Number(index)] ?? '');

  return collapse(restored);
}

const collapse = (text: string) => text.replace(/[ \t\u00a0]+/g, ' ').trim();

function listToMarkdown(html: string, ordered: boolean): string {
  const items = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => inlineToMarkdown(match[1] ?? ''))
    .filter(Boolean);

  if (!items.length) return '';
  return items.map((item, index) => (ordered ? `${index + 1}. ${item}` : `- ${item}`)).join('\n');
}

export function htmlToMarkdown(html: string): string {
  if (!html.trim()) return '';

  // Znaczniki, które nie niosą treści dla czytelnika.
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|noscript)\b[\s\S]*?<\/\1>/gi, '');

  const blocks: string[] = [];
  const pattern =
    /<(h[1-6]|p|ul|ol|blockquote|pre|figure|div)\b[^>]*>([\s\S]*?)<\/\1>|<(hr)\s*\/?>/gi;

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let matchedAnything = false;

  while ((match = pattern.exec(cleaned)) !== null) {
    matchedAnything = true;
    lastIndex = pattern.lastIndex;

    const tag = (match[1] ?? match[3] ?? '').toLowerCase();
    const inner = match[2] ?? '';

    if (tag === 'hr') continue;

    if (/^h[1-6]$/.test(tag)) {
      const text = inlineToMarkdown(inner);
      if (!text) continue;
      // h1 z treści wpisu schodzi do h2 — nagłówek pierwszego stopnia
      // należy do tytułu strony, nie do artykułu.
      const level = tag === 'h1' || tag === 'h2' ? '##' : '###';
      blocks.push(`${level} ${text}`);
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const list = listToMarkdown(inner, tag === 'ol');
      if (list) blocks.push(list);
      continue;
    }

    if (tag === 'pre') {
      const code = collapse(plain(inner));
      if (code) blocks.push(`\`${code}\``);
      continue;
    }

    if (tag === 'figure' || tag === 'div') {
      // Kontenery Gutenberga — wchodzimy głębiej zamiast zgniatać zawartość.
      const nested = htmlToMarkdown(inner);
      if (nested) blocks.push(nested);
      continue;
    }

    const text = inlineToMarkdown(inner);
    if (text) blocks.push(text);
  }

  // Treść bez żadnego znacznika blokowego (albo ogon po ostatnim z nich).
  const tail = matchedAnything ? cleaned.slice(lastIndex) : cleaned;
  const tailText = inlineToMarkdown(tail);
  if (tailText) blocks.push(tailText);

  return blocks.join('\n\n');
}

/** Czas czytania w minutach — WordPress go nie zna, więc liczymy z treści. */
export function readingTimeFrom(markdown: string): number {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
