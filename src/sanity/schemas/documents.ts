import { defineField, defineType } from 'sanity';

export const settingsType = defineType({
  name: 'settings',
  title: 'Ustawienia witryny',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Nazwa witryny', type: 'string' }),
    defineField({ name: 'tagline', title: 'Jednozdaniowy opis', type: 'text', rows: 2 }),
    defineField({ name: 'email', title: 'E-mail kontaktowy', type: 'string' }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
      description: 'Zostaw puste, jeśli numer nie ma być publikowany.',
    }),
    defineField({
      name: 'socials',
      title: 'Profile społecznościowe',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Nazwa', type: 'string' }),
            defineField({ name: 'href', title: 'Adres', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({ name: 'defaultSeo', title: 'Domyślne SEO', type: 'seo' }),
    defineField({ name: 'defaultCta', title: 'Domyślne CTA', type: 'cta' }),
  ],
  preview: { prepare: () => ({ title: 'Ustawienia witryny' }) },
});

export const pageType = defineType({
  name: 'page',
  title: 'Strony',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa robocza',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adres (slug)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'Np. „o-mnie”. Dla strony głównej wpisz „strona-glowna”.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'eyebrow', title: 'Etykieta nad nagłówkiem', type: 'string' }),
    defineField({ name: 'heading', title: 'Nagłówek H1', type: 'string' }),
    defineField({ name: 'lead', title: 'Lead', type: 'text', rows: 4 }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [{ type: 'block' }, { type: 'richImage' }],
    }),
    defineField({
      name: 'faq',
      title: 'FAQ na tej stronie',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
    defineField({ name: 'cta', title: 'CTA na końcu strony', type: 'cta' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});

export const serviceType = defineType({
  name: 'service',
  title: 'Usługi',
  type: 'document',
  fields: [
    defineField({ name: 'index', title: 'Numer porządkowy', type: 'string', initialValue: '01' }),
    defineField({
      name: 'title',
      title: 'Nazwa usługi',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'tagline', title: 'Jedno zdanie', type: 'string' }),
    defineField({ name: 'description', title: 'Opis', type: 'text', rows: 4 }),
    defineField({
      name: 'deliverables',
      title: 'Zakres prac',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'priceFrom',
      title: 'Cena od (PLN)',
      type: 'number',
      description: 'Zostaw puste dla wyceny indywidualnej.',
    }),
    defineField({ name: 'duration', title: 'Czas realizacji', type: 'string' }),
    defineField({ name: 'order', title: 'Kolejność', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { name: 'manual', title: 'Kolejność ręczna', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'tagline' } },
});

export const projectType = defineType({
  name: 'project',
  title: 'Realizacje / Case studies',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Podstawowe', default: true },
    { name: 'case', title: 'Case study' },
    { name: 'media', title: 'Grafiki' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'client',
      title: 'Klient / marka',
      type: 'string',
      group: 'basic',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: { source: 'client' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Tytuł realizacji', type: 'string', group: 'basic' }),
    defineField({ name: 'summary', title: 'Podsumowanie (listing)', type: 'text', rows: 3, group: 'basic' }),
    defineField({ name: 'domain', title: 'Domena', type: 'string', group: 'basic' }),
    defineField({ name: 'url', title: 'Adres strony', type: 'url', group: 'basic' }),
    defineField({ name: 'role', title: 'Zakres mojej pracy', type: 'string', group: 'basic' }),
    defineField({ name: 'category', title: 'Kategoria', type: 'string', group: 'basic' }),
    defineField({
      name: 'tags',
      title: 'Etykiety (2–4)',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'basic',
      validation: (rule) => rule.max(4),
    }),
    defineField({ name: 'stack', title: 'Technologie', type: 'array', of: [{ type: 'string' }], group: 'basic' }),
    defineField({
      name: 'accent',
      title: 'Kolor akcentu (HEX)',
      type: 'string',
      group: 'basic',
      description: 'Przejmuje go tło karty i scena 3D przy najechaniu, np. #5CE1FF.',
      validation: (rule) => rule.regex(/^#([0-9a-fA-F]{6})$/, { name: 'kolor HEX' }),
    }),
    defineField({ name: 'featured', title: 'Wyróżnij na stronie głównej', type: 'boolean', group: 'basic', initialValue: false }),
    defineField({ name: 'order', title: 'Kolejność', type: 'number', group: 'basic', initialValue: 0 }),

    defineField({ name: 'context', title: 'Kontekst projektu', type: 'text', rows: 4, group: 'case' }),
    defineField({ name: 'challenge', title: 'Wyzwanie', type: 'caseSection', group: 'case' }),
    defineField({ name: 'solution', title: 'Rozwiązanie', type: 'caseSection', group: 'case' }),
    defineField({
      name: 'features',
      title: 'Kluczowe funkcjonalności',
      type: 'array',
      of: [{ type: 'feature' }],
      group: 'case',
    }),
    defineField({
      name: 'outcome',
      title: 'Rezultat',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'case',
    }),

    defineField({ name: 'cover', title: 'Okładka', type: 'richImage', group: 'media' }),
    defineField({
      name: 'gallery',
      title: 'Galeria (desktop / mobile)',
      type: 'array',
      of: [{ type: 'richImage' }],
      group: 'media',
    }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { name: 'manual', title: 'Kolejność ręczna', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'client', subtitle: 'title', media: 'cover' } },
});

export const postType = defineType({
  name: 'post',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'excerpt', title: 'Zajawka', type: 'text', rows: 3 }),
    defineField({ name: 'category', title: 'Kategoria', type: 'string' }),
    defineField({
      name: 'publishedAt',
      title: 'Data publikacji',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'updatedAt', title: 'Data aktualizacji', type: 'date' }),
    defineField({ name: 'readingTime', title: 'Czas czytania (min)', type: 'number' }),
    defineField({ name: 'cover', title: 'Grafika główna', type: 'richImage' }),
    defineField({
      name: 'body',
      title: 'Treść',
      type: 'array',
      of: [{ type: 'block' }, { type: 'richImage' }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  orderings: [
    { name: 'newest', title: 'Najnowsze', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'publishedAt', media: 'cover' } },
});

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nazwa zestawu',
      type: 'string',
      description: 'Np. „FAQ ogólne”, „FAQ Wołomin”.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Klucz',
      type: 'string',
      description: 'Identyfikator używany w kodzie: general, wolomin, warszawa.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Pytania',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'key' } },
});

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Opinie',
  type: 'document',
  description: 'Dodawaj wyłącznie prawdziwe opinie klientów wraz ze źródłem.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Treść opinii',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'role', title: 'Firma / rola', type: 'string' }),
    defineField({
      name: 'source',
      title: 'Źródło',
      type: 'string',
      description: 'Np. „Wizytówka Google”, „e-mail”, „LinkedIn”.',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'order', title: 'Kolejność', type: 'number', initialValue: 0 }),
  ],
  preview: { select: { title: 'author', subtitle: 'role' } },
});
