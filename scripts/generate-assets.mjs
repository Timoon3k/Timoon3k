/**
 * Generuje autorskie plansze kierunkowe realizacji oraz grafiki Open Graph.
 *
 * Plansze są abstrakcyjnymi wizualizacjami układu strony — celowo nie udają
 * zrzutów ekranu. Po wgraniu prawdziwych screenów w Sanity zostaną podmienione.
 *
 * Uruchomienie: node scripts/generate-assets.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const projectsDir = path.join(root, 'public', 'projects');
const ogDir = path.join(root, 'public', 'og');

const projects = [
  { slug: 'msdream', name: 'MS Dream', domain: 'msdream.pl', accent: '#E0A458', kind: 'booking' },
  { slug: 'weekendowe-loty', name: 'Weekendowe Loty', domain: 'weekendoweloty.pl', accent: '#5CE1FF', kind: 'shop' },
  { slug: 'lmajewski', name: 'Ł. Majewski', domain: 'lmajewski.pl', accent: '#C8CDD8', kind: 'gallery' },
  { slug: 'damian-cebula-serwis', name: 'Damian Cebula Serwis', domain: 'damiancebula-serwis.pl', accent: '#FF7A4D', kind: 'local' },
];

const VOID = '#070a12';
const SURFACE = '#0d1220';
const LINE = '#1c2431';

const esc = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Abstrakcyjny układ treści zależny od typu realizacji. */
function layout(kind, w, h, accent) {
  const pad = Math.round(w * 0.06);
  const inner = w - pad * 2;
  const parts = [];

  // Pasek nawigacji
  parts.push(`<rect x="${pad}" y="${Math.round(h * 0.07)}" width="${Math.round(inner * 0.16)}" height="10" rx="2" fill="${accent}" opacity="0.85"/>`);
  for (let i = 0; i < 4; i += 1) {
    parts.push(
      `<rect x="${pad + Math.round(inner * 0.5) + i * Math.round(inner * 0.12)}" y="${Math.round(h * 0.075)}" width="${Math.round(inner * 0.08)}" height="7" rx="2" fill="#94a3b8" opacity="0.34"/>`,
    );
  }

  // Nagłówek
  const headTop = Math.round(h * 0.19);
  parts.push(`<rect x="${pad}" y="${headTop}" width="${Math.round(inner * 0.74)}" height="34" rx="3" fill="#e2e8f0" opacity="0.9"/>`);
  parts.push(`<rect x="${pad}" y="${headTop + 48}" width="${Math.round(inner * 0.52)}" height="34" rx="3" fill="#e2e8f0" opacity="0.55"/>`);
  parts.push(`<rect x="${pad}" y="${headTop + 112}" width="${Math.round(inner * 0.36)}" height="9" rx="2" fill="#94a3b8" opacity="0.4"/>`);
  parts.push(`<rect x="${pad}" y="${headTop + 130}" width="${Math.round(inner * 0.3)}" height="9" rx="2" fill="#94a3b8" opacity="0.28"/>`);
  parts.push(`<rect x="${pad}" y="${headTop + 168}" width="${Math.round(inner * 0.19)}" height="38" rx="2" fill="${accent}"/>`);

  const bodyTop = Math.round(h * 0.62);

  if (kind === 'gallery') {
    const cols = 4;
    const gap = 14;
    const cw = Math.round((inner - gap * (cols - 1)) / cols);
    for (let i = 0; i < cols; i += 1) {
      const ch = i % 2 === 0 ? Math.round(h * 0.26) : Math.round(h * 0.2);
      parts.push(
        `<rect x="${pad + i * (cw + gap)}" y="${bodyTop}" width="${cw}" height="${ch}" rx="3" fill="${SURFACE}" stroke="${LINE}"/>`,
      );
      parts.push(
        `<rect x="${pad + i * (cw + gap)}" y="${bodyTop}" width="${cw}" height="${ch}" rx="3" fill="${accent}" opacity="${0.05 + i * 0.03}"/>`,
      );
    }
  } else if (kind === 'booking') {
    const cw = Math.round(inner * 0.58);
    parts.push(`<rect x="${pad}" y="${bodyTop}" width="${cw}" height="${Math.round(h * 0.26)}" rx="3" fill="${SURFACE}" stroke="${LINE}"/>`);
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 6; c += 1) {
        const active = (r * 6 + c) % 5 === 0;
        parts.push(
          `<rect x="${pad + 20 + c * Math.round((cw - 40) / 6)}" y="${bodyTop + 24 + r * 34}" width="${Math.round((cw - 40) / 6) - 10}" height="22" rx="2" fill="${active ? accent : '#94a3b8'}" opacity="${active ? 0.85 : 0.16}"/>`,
        );
      }
    }
    parts.push(`<rect x="${pad + cw + 20}" y="${bodyTop}" width="${inner - cw - 20}" height="${Math.round(h * 0.26)}" rx="3" fill="${SURFACE}" stroke="${LINE}"/>`);
    parts.push(`<rect x="${pad + cw + 44}" y="${bodyTop + 28}" width="${inner - cw - 68}" height="12" rx="2" fill="#94a3b8" opacity="0.35"/>`);
    parts.push(`<rect x="${pad + cw + 44}" y="${bodyTop + 52}" width="${Math.round((inner - cw - 68) * 0.7)}" height="12" rx="2" fill="#94a3b8" opacity="0.22"/>`);
    parts.push(`<rect x="${pad + cw + 44}" y="${bodyTop + 96}" width="${Math.round((inner - cw - 68) * 0.55)}" height="30" rx="2" fill="${accent}"/>`);
  } else if (kind === 'shop') {
    const cols = 3;
    const gap = 20;
    const cw = Math.round((inner - gap * (cols - 1)) / cols);
    for (let i = 0; i < cols; i += 1) {
      const x = pad + i * (cw + gap);
      parts.push(`<rect x="${x}" y="${bodyTop}" width="${cw}" height="${Math.round(h * 0.27)}" rx="3" fill="${SURFACE}" stroke="${LINE}"/>`);
      parts.push(`<rect x="${x}" y="${bodyTop}" width="${cw}" height="${Math.round(h * 0.14)}" rx="3" fill="${accent}" opacity="${0.1 + i * 0.04}"/>`);
      parts.push(`<rect x="${x + 18}" y="${bodyTop + Math.round(h * 0.16)}" width="${Math.round(cw * 0.62)}" height="11" rx="2" fill="#e2e8f0" opacity="0.6"/>`);
      parts.push(`<rect x="${x + 18}" y="${bodyTop + Math.round(h * 0.16) + 22}" width="${Math.round(cw * 0.34)}" height="11" rx="2" fill="${accent}" opacity="0.8"/>`);
    }
  } else {
    const items = ['', '', ''];
    items.forEach((_, i) => {
      const y = bodyTop + i * Math.round(h * 0.1);
      parts.push(`<rect x="${pad}" y="${y}" width="${inner}" height="${Math.round(h * 0.075)}" rx="3" fill="${SURFACE}" stroke="${LINE}"/>`);
      parts.push(`<circle cx="${pad + 34}" cy="${y + Math.round(h * 0.0375)}" r="12" fill="${accent}" opacity="0.75"/>`);
      parts.push(`<rect x="${pad + 62}" y="${y + Math.round(h * 0.028)}" width="${Math.round(inner * 0.3)}" height="11" rx="2" fill="#e2e8f0" opacity="0.55"/>`);
      parts.push(`<rect x="${pad + inner - 130}" y="${y + Math.round(h * 0.026)}" width="110" height="26" rx="2" fill="${accent}" opacity="0.9"/>`);
    });
  }

  return parts.join('');
}

function plate({ w, h, accent, name, domain, kind, label }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${VOID}"/>
      <stop offset="1" stop-color="#04060b"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.16" r="0.7">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.24"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#8fa3bf" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <ellipse cx="${w * 0.82}" cy="${h * 0.12}" rx="${w * 0.34}" ry="${h * 0.2}" fill="none" stroke="${accent}" stroke-opacity="0.16"/>
  <ellipse cx="${w * 0.82}" cy="${h * 0.12}" rx="${w * 0.22}" ry="${h * 0.13}" fill="none" stroke="${accent}" stroke-opacity="0.1"/>
  ${layout(kind, w, h, accent)}
  <text x="${w * 0.06}" y="${h - 34}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${Math.round(w * 0.014)}" letter-spacing="2.4" fill="#8fa3bf" fill-opacity="0.75">${esc(domain.toUpperCase())}</text>
  <text x="${w - w * 0.06}" y="${h - 34}" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${Math.round(w * 0.014)}" letter-spacing="2.4" fill="${accent}" fill-opacity="0.8">${esc(label)}</text>
  <title>${esc(name)} — ${esc(domain)}</title>
</svg>`;
}

function ogImage({ title, subtitle, accent }) {
  const w = 1200;
  const h = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#04060b"/>
      <stop offset="1" stop-color="#0a0f1a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.28" r="0.62">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <ellipse cx="965" cy="200" rx="300" ry="128" fill="none" stroke="${accent}" stroke-opacity="0.3"/>
  <ellipse cx="965" cy="200" rx="215" ry="92" fill="none" stroke="${accent}" stroke-opacity="0.2" transform="rotate(-22 965 200)"/>
  <circle cx="965" cy="200" r="46" fill="${accent}" fill-opacity="0.16"/>
  <circle cx="965" cy="200" r="16" fill="${accent}"/>
  <text x="80" y="176" font-family="Georgia, 'Times New Roman', serif" font-size="21" letter-spacing="5" fill="${accent}">TOMASZ MAJEWSKI</text>
  <text x="80" y="300" font-family="Helvetica, Arial, sans-serif" font-size="66" font-weight="700" fill="#eef2f8">${esc(title)}</text>
  <text x="80" y="374" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#9aa4b8">${esc(subtitle)}</text>
  <rect x="80" y="470" width="4" height="64" fill="${accent}"/>
  <text x="104" y="500" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#9aa4b8">Wołomin · Warszawa · cała Polska</text>
  <text x="104" y="528" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="#6b7488">majewskitomasz.pl</text>
</svg>`;
}

async function main() {
  await mkdir(projectsDir, { recursive: true });
  await mkdir(ogDir, { recursive: true });

  for (const project of projects) {
    const variants = [
      { suffix: 'cover', w: 1600, h: 1000, label: 'CASE STUDY' },
      { suffix: 'desktop', w: 1600, h: 1000, label: 'DESKTOP' },
      { suffix: 'mobile', w: 800, h: 1400, label: 'MOBILE' },
    ];

    for (const variant of variants) {
      const svg = plate({
        w: variant.w,
        h: variant.h,
        accent: project.accent,
        name: project.name,
        domain: project.domain,
        kind: project.kind,
        label: variant.label,
      });
      await writeFile(path.join(projectsDir, `${project.slug}-${variant.suffix}.svg`), svg, 'utf8');
    }
  }

  const ogTargets = [
    { file: 'default.png', title: 'Strony, które trudno zignorować', subtitle: 'Projektowanie i kodowanie stron internetowych', accent: '#5CE1FF' },
    { file: 'portfolio.png', title: 'Portfolio realizacji', subtitle: 'Sklepy, systemy rezerwacji i strony firmowe', accent: '#5CE1FF' },
    { file: 'wolomin.png', title: 'Strony internetowe — Wołomin', subtitle: 'Lokalny web developer, bezpośrednia współpraca', accent: '#E0A458' },
    { file: 'warszawa.png', title: 'Strony internetowe — Warszawa', subtitle: 'Zaawansowane wdrożenia dla firm i marek', accent: '#5CE1FF' },
    { file: 'blog.png', title: 'Blog o stronach WWW', subtitle: 'Wydajność, SEO, WordPress i technologie', accent: '#FF7A4D' },
  ];

  for (const target of ogTargets) {
    const svg = ogImage(target);
    await sharp(Buffer.from(svg)).png({ quality: 90, compressionLevel: 9 }).toFile(path.join(ogDir, target.file));
  }

  console.log(`Wygenerowano ${projects.length * 3} plansz realizacji i ${ogTargets.length} grafik OG.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
