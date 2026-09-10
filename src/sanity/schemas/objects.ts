import { defineField, defineType } from 'sanity';

export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł SEO (title)',
      type: 'string',
      description: 'Optymalnie 50–60 znaków. Widoczny w wynikach wyszukiwania i na karcie przeglądarki.',
      validation: (rule) => rule.max(70).warning('Powyżej 70 znaków Google zwykle skraca tytuł.'),
    }),
    defineField({
      name: 'description',
      title: 'Opis SEO (meta description)',
      type: 'text',
      rows: 3,
      description: 'Optymalnie 140–160 znaków. To zdanie decyduje o klikalności w wynikach.',
      validation: (rule) => rule.max(180).warning('Powyżej 180 znaków opis zostanie ucięty.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Grafika Open Graph',
      type: 'image',
      description: 'Obraz udostępniania w mediach społecznościowych. Zalecane 1200 × 630 px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'noIndex',
      title: 'Wyklucz z indeksowania',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});

export const ctaType = defineType({
  name: 'cta',
  title: 'Wezwanie do działania',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Nagłówek', type: 'string' }),
    defineField({ name: 'lead', title: 'Tekst', type: 'text', rows: 3 }),
    defineField({ name: 'label', title: 'Etykieta przycisku', type: 'string' }),
    defineField({ name: 'href', title: 'Adres docelowy', type: 'string', initialValue: '/kontakt#formularz' }),
  ],
});

export const faqItemType = defineType({
  name: 'faqItem',
  title: 'Pytanie i odpowiedź',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Pytanie',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Odpowiedź',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: 'question' } },
});

export const richImageType = defineType({
  name: 'richImage',
  title: 'Obraz',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Tekst alternatywny',
      type: 'string',
      description: 'Opis obrazu dla czytników ekranu i wyszukiwarek. Wymagany.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'caption', title: 'Podpis', type: 'string' }),
  ],
});

export const caseSectionType = defineType({
  name: 'caseSection',
  title: 'Sekcja case study',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Nagłówek', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Akapity',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
    }),
  ],
  preview: { select: { title: 'heading' } },
});

export const featureType = defineType({
  name: 'feature',
  title: 'Funkcjonalność',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Nazwa', type: 'string' }),
    defineField({ name: 'body', title: 'Opis', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'title', subtitle: 'body' } },
});
