import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Generuje domyślny obraz Open Graph (1200×630) w formacie SVG.
 *
 * Dlaczego SVG, a nie PNG: nie chcemy dokładać zależności do rasteryzacji
 * ani trzymać w repozytorium binarki, którą trudno zrecenzować. SVG jest
 * obsługiwany przez podgląd linków, a docelowy obraz OG i tak powinien
 * być fotografią MSdream — patrz SETUP.md.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#16271c"/>
  <!-- Łuk stajennego okna — ten sam motyw co w sygnecie -->
  <path d="M980 630V300C980 190 890 100 780 100" stroke="#c0a065" stroke-width="1.5" fill="none" opacity="0.55"/>
  <path d="M1060 630V300C1060 145 935 20 780 20" stroke="#c0a065" stroke-width="1.5" fill="none" opacity="0.3"/>
  <text x="90" y="250" font-family="Georgia, 'Times New Roman', serif" font-size="104" fill="#f7f3ea">Najpierw zaufanie.</text>
  <text x="90" y="360" font-family="Georgia, 'Times New Roman', serif" font-size="104" font-style="italic" fill="#d6bd8c">Potem galop.</text>
  <line x1="90" y1="430" x2="330" y2="430" stroke="#a5854a" stroke-width="2"/>
  <text x="90" y="486" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#d3c3a6">Szkoła jazdy konnej — Łomianki pod Warszawą</text>
  <text x="90" y="556" font-family="Helvetica, Arial, sans-serif" font-size="21" letter-spacing="4" fill="#a5854a">MSDREAM.PL</text>
</svg>`;

mkdirSync(resolve(root, 'public/og'), { recursive: true });
writeFileSync(resolve(root, 'public/og/msdream.svg'), svg, 'utf8');
console.log('Zapisano public/og/msdream.svg');
