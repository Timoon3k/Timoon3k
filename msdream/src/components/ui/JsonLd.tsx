/**
 * Wstrzykuje dane strukturalne.
 *
 * `null` jest dozwolone i oznacza „nie ma czego publikować" — dzięki temu
 * strony mogą bezwarunkowo wołać ten komponent, a builder decyduje,
 * czy dane są kompletne (patrz `lib/seo.ts`).
 */
export function JsonLd({ data }: { data: object | null }) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      // Dane pochodzą wyłącznie z naszego kodu, nigdy z wejścia użytkownika.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
