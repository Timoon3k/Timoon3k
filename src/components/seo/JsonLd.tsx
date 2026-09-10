/**
 * Wstrzykuje dane strukturalne. Treść pochodzi wyłącznie z naszego kodu,
 * a `JSON.stringify` z podmianą `<` chroni przed przedwczesnym zamknięciem
 * znacznika script.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
