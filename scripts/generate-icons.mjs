/**
 * Generuje zestaw ikon witryny na podstawie znaku orbitalnego.
 * Uruchomienie: node scripts/generate-icons.mjs
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();

const mark = (size, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  ${bg ? '<rect width="32" height="32" rx="6" fill="#04060b"/>' : ''}
  <g fill="none" stroke="#5ce1ff" stroke-width="1.1">
    <circle cx="16" cy="16" r="4.2" fill="#5ce1ff" stroke="none"/>
    <ellipse cx="16" cy="16" rx="13.4" ry="6.4" opacity="0.75"/>
    <ellipse cx="16" cy="16" rx="13.4" ry="6.4" opacity="0.5" transform="rotate(60 16 16)"/>
    <ellipse cx="16" cy="16" rx="13.4" ry="6.4" opacity="0.5" transform="rotate(120 16 16)"/>
  </g>
</svg>`;

/** Kontener ICO z pojedynczym obrazem PNG (format dopuszcza taki payload). */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // typ: ikona
  header.writeUInt16LE(1, 4); // liczba obrazów

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2); // paleta
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // płaszczyzny
  entry.writeUInt16LE(32, 6); // bity na piksel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

async function main() {
  await writeFile(path.join(root, 'src', 'app', 'icon.svg'), mark(32, true), 'utf8');

  const apple = await sharp(Buffer.from(mark(180, true))).resize(180, 180).png().toBuffer();
  await writeFile(path.join(root, 'src', 'app', 'apple-icon.png'), apple);

  const png32 = await sharp(Buffer.from(mark(32, true))).resize(32, 32).png().toBuffer();
  await writeFile(path.join(root, 'public', 'favicon.ico'), icoFromPng(png32, 32));

  console.log('Wygenerowano icon.svg, apple-icon.png oraz favicon.ico.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
