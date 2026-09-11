import assert from 'node:assert/strict';
import { test } from 'node:test';
import { htmlToMarkdown, readingTimeFrom } from './html-to-markdown.ts';

/**
 * Uruchomienie: `npm test`.
 *
 * Testy pilnują dwóch rzeczy naraz: że treść z WordPressa wygląda tak,
 * jak autor ją napisał, i że nie da się przez nią wstrzyknąć znaczników.
 */

const cases: [string, string, string][] = [
  // opis, HTML z WordPressa, oczekiwany markdown
  ['encja nazwana', '<p>sp&oacute;jnik</p>', 'spójnik'],
  ['encja — wielkość liter ma znaczenie', '<p>&Zdot;uk i &zdot;uk</p>', 'Żuk i żuk'],
  ['encja liczbowa', '<p>cudzys&#322;&oacute;w</p>', 'cudzysłów'],
  ['encja szesnastkowa', '<p>&#x142;&#243;dka</p>', 'łódka'],
  ['&amp; nie rozwija się dwukrotnie', '<p>&amp;oacute;</p>', '&oacute;'],
  ['twarda spacja i waluta', '<p>30&nbsp;&euro;</p>', '30 €'],
  ['cudzysłowy typograficzne', '<p>&bdquo;test&rdquo;</p>', '„test”'],

  ['h1 schodzi do h2', '<h1>Tytuł</h1>', '## Tytuł'],
  ['h2', '<h2>Nagłówek</h2>', '## Nagłówek'],
  ['h3', '<h3>Podnagłówek</h3>', '### Podnagłówek'],
  ['h4 i głębiej też do h3', '<h4>Głębiej</h4>', '### Głębiej'],
  ['lista punktowana', '<ul><li>A</li><li>B</li></ul>', '- A\n- B'],
  ['lista numerowana', '<ol><li>A</li><li>B</li></ol>', '1. A\n2. B'],
  ['pogrubienie', '<p>Zwykły <strong>gruby</strong></p>', 'Zwykły **gruby**'],
  ['kursywa idzie na pogrubienie', '<p><em>kursywa</em></p>', '**kursywa**'],
  ['kod', '<p><code>npm run dev</code></p>', '`npm run dev`'],
  ['odnośnik zewnętrzny', '<p><a href="https://a.pl">tekst</a></p>', '[tekst](https://a.pl)'],
  ['odnośnik względny', '<p><a href="/oferta">oferta</a></p>', '[oferta](/oferta)'],
  ['mailto', '<p><a href="mailto:a@b.pl">mail</a></p>', '[mail](mailto:a@b.pl)'],

  ['kontener Gutenberga rozwijany', '<div class="wp-block-group"><p>A</p><p>B</p></div>', 'A\n\nB'],
  ['figure rozwijany', '<figure><p>Podpis</p></figure>', 'Podpis'],
  ['komentarze Gutenberga znikają', '<!-- wp:paragraph --><p>A</p><!-- /wp:paragraph -->', 'A'],
  ['tekst bez znaczników', 'Goły tekst', 'Goły tekst'],
  ['pusty HTML', '   ', ''],
  ['linia pozioma pomijana', '<p>A</p><hr/><p>B</p>', 'A\n\nB'],
  ['gwiazdka autora nie udaje pogrubienia', '<p>2 * 3</p>', '2 \\* 3'],
];

for (const [label, input, expected] of cases) {
  test(label, () => assert.equal(htmlToMarkdown(input), expected));
}

/* Wstrzyknięcia — treść z CMS-u nie może stać się znacznikiem ani skryptem. */

const injections: [string, string, string][] = [
  ['javascript: traci odnośnik, zostaje tekst', '<p><a href="javascript:alert(1)">klik</a></p>', 'klik'],
  ['data: traci odnośnik, zostaje tekst', '<p><a href="data:text/html,x">klik</a></p>', 'klik'],
  ['script wycięty', '<p>A</p><script>alert(1)</script><p>B</p>', 'A\n\nB'],
  ['style wycięty', '<style>p{}</style><p>A</p>', 'A'],
  ['iframe wycięty', '<iframe src="x"></iframe><p>A</p>', 'A'],
  ['onerror nie przechodzi', '<p><img src=x onerror="alert(1)">A</p>', 'A'],
];

for (const [label, input, expected] of injections) {
  test(label, () => {
    const result = htmlToMarkdown(input);
    assert.equal(result, expected);
    assert.ok(!/<[a-z]/i.test(result), 'w wyniku nie może zostać znacznik HTML');
  });
}

test('czas czytania — minimum jedna minuta', () => {
  assert.equal(readingTimeFrom('krótko'), 1);
});

test('czas czytania — 400 słów to 2 minuty', () => {
  assert.equal(readingTimeFrom(Array(400).fill('słowo').join(' ')), 2);
});
