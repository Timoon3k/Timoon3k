/**
 * Stałe dane witryny. Wszystko, co bywa zmieniane częściej niż raz na kwartał,
 * mieszka w CMS (patrz: src/sanity) — tutaj zostaje wyłącznie tożsamość projektu.
 */

/**
 * Adres kanoniczny witryny.
 *
 * Kolejność rozstrzygania ma znaczenie przy wdrożeniu na Vercel:
 * dopóki domena nie jest podpięta, deployment żyje pod adresem *.vercel.app.
 * Gdyby `canonical`, Open Graph i sitemapa wskazywały wtedy docelową domenę,
 * wyszukiwarka dostałaby adresy prowadzące do zupełnie innej, istniejącej
 * witryny. Dlatego bez jawnie ustawionego `NEXT_PUBLIC_SITE_URL` używamy
 * adresu, pod którym deployment faktycznie stoi.
 *
 * Wartość jest odczytywana wyłącznie po stronie serwera (metadane, sitemapa,
 * robots, JSON-LD), więc zmienne bez prefiksu NEXT_PUBLIC_ są tu bezpieczne.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit;

  // Stabilny adres produkcyjny projektu na Vercel (bez sufiksu deploymentu).
  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (process.env.VERCEL_ENV === 'production' && vercelProduction) {
    return `https://${vercelProduction}`;
  }

  // Adres pojedynczego deploymentu — podgląd, gałąź, preview.
  const vercelDeployment = process.env.VERCEL_URL;
  if (vercelDeployment) return `https://${vercelDeployment}`;

  return 'https://majewskitomasz.pl';
}

export const siteUrl = resolveSiteUrl().replace(/\/$/, '');

/** `true` tylko dla wdrożenia produkcyjnego — podglądy nie mogą trafić do indeksu. */
export const isProductionDeployment =
  process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === 'production';

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
