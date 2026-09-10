import type { StructureResolver } from 'sanity/structure';

/**
 * Ustawienia witryny to dokument pojedynczy — pokazujemy go jako pozycję,
 * a nie jako listę, żeby nie dało się utworzyć drugiej kopii.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Treść')
    .items([
      S.listItem()
        .title('Ustawienia witryny')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('settings')),
      S.divider(),
      S.documentTypeListItem('page').title('Strony'),
      S.documentTypeListItem('service').title('Usługi'),
      S.documentTypeListItem('project').title('Realizacje'),
      S.documentTypeListItem('post').title('Blog'),
      S.divider(),
      S.documentTypeListItem('faq').title('FAQ'),
      S.documentTypeListItem('testimonial').title('Opinie'),
    ]);
