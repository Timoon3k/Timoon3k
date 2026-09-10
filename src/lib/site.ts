/**
 * Stałe dane witryny. Wszystko, co bywa zmieniane częściej niż raz na kwartał,
 * mieszka w CMS (patrz: src/sanity) — tutaj zostaje wyłącznie tożsamość projektu.
 */

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://majewskitomasz.pl';

export const siteUrl = rawUrl.replace(/\/$/, '');

export const site = {
  url: siteUrl,
  name: 'Tomasz Majewski',
  brand: 'Majewski',
  role: 'Web developer & projektant stron internetowych',
  shortDescription:
    'Projektuję i koduję strony internetowe dla firm z Wołomina, Warszawy i całej Polski.',
  locale: 'pl_PL',
  lang: 'pl',
  city: 'Wołomin',
  region: 'mazowieckie',
  country: 'PL',
  /** Adres e-mail obsługi zapytań — nadpisywany zmienną CONTACT_EMAIL_TO na serwerze. */
  email: 'tomasz.majewski1994@gmail.com',
  /**
   * Numer telefonu nie jest publikowany, dopóki nie zostanie uzupełniony
   * w CMS (Ustawienia → Dane kontaktowe). Nie wstawiamy danych zmyślonych.
   */
  phone: null as string | null,
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tomasz-majewski-30414b23a/' },
    { label: 'GitHub', href: 'https://github.com/Timoon3k' },
    { label: 'Facebook', href: 'https://www.facebook.com/tomasz.majewski.33/' },
  ],
  /** Obszar obsługi — używane w JSON-LD ProfessionalService. */
  serviceArea: [
    'Wołomin',
    'Warszawa',
    'Ząbki',
    'Zielonka',
    'Kobyłka',
    'Marki',
    'Radzymin',
    'Tłuszcz',
    'powiat wołomiński',
    'Polska',
  ],
} as const;

export const nav = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Oferta', href: '/oferta' },
  { label: 'O mnie', href: '/o-mnie' },
  { label: 'Blog', href: '/blog' },
  { label: 'Kontakt', href: '/kontakt' },
] as const;

export const footerNav = [
  {
    title: 'Nawigacja',
    links: [
      { label: 'Strona główna', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Oferta', href: '/oferta' },
      { label: 'O mnie', href: '/o-mnie' },
      { label: 'Blog', href: '/blog' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
  },
  {
    title: 'Lokalnie',
    links: [
      { label: 'Strony internetowe Wołomin', href: '/tworzenie-stron-internetowych-wolomin' },
      { label: 'Strony internetowe Warszawa', href: '/tworzenie-stron-internetowych-warszawa' },
    ],
  },
  {
    title: 'Realizacje',
    links: [
      { label: 'MS Dream', href: '/portfolio/msdream' },
      { label: 'Weekendowe Loty', href: '/portfolio/weekendowe-loty' },
      { label: 'Ł. Majewski Fotografia', href: '/portfolio/lmajewski' },
      { label: 'Damian Cebula Serwis', href: '/portfolio/damian-cebula-serwis' },
    ],
  },
] as const;
