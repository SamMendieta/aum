// generate-favicon.mjs — one-time favicon generator for aum.
// Run: node generate-favicon.mjs
// Outputs: src/favicon.svg, src/favicon-32.png, src/apple-touch-icon.png, src/favicon.ico

import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const sharp = require('./node_modules/sharp/lib/index.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');

// ── Brand colours ──────────────────────────────────────────────
const BG     = '#6b5045';   // c-dark-bg — brand dark mocha earth
const CREAM  = '#fffbf4';   // c-dark-text
const ACCENT = '#c9a87c';   // c-accent — gold

// ── SVG template (scalable, used for favicon.svg + raster source)
// Design: dark square, "aum" in cream Pierson-style serif, gold period
function makeSVG(size) {
  const pad  = size * 0.1;          // 10% padding
  const fontSize = size * 0.32;     // text size
  const textY    = size * 0.595;    // vertical center baseline
  const dotR     = size * 0.065;    // period dot radius
  // We render "aum" then a separate accent-coloured dot for the period
  // so the dot pops with brand accent even at tiny sizes
  const textX = size * 0.44;        // centre of "aum" (slightly left of centre to balance dot)
  const dotX  = size * 0.83;
  const dotY  = size * 0.595;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.06)}" fill="${BG}"/>
  <text
    x="${textX}"
    y="${textY}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${fontSize}"
    font-weight="400"
    fill="${CREAM}"
    text-anchor="middle"
    letter-spacing="${size * 0.018}"
  >aum</text>
  <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="${ACCENT}"/>
</svg>`;
}

// ── Write SVG favicon (modern browsers: Chrome, Firefox, Edge, Safari 15.4+)
const svgContent = makeSVG(32);
writeFileSync(path.join(SRC, 'favicon.svg'), svgContent, 'utf8');
console.log('✓ favicon.svg');

// ── Raster sizes to generate
const sizes = [
  { name: 'favicon-32.png',        size: 32  },
  { name: 'favicon-16.png',        size: 16  },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'favicon-192.png',       size: 192 }, // PWA / Android Chrome
];

const pngBuffers = {};

for (const { name, size } of sizes) {
  const svg = Buffer.from(makeSVG(size));
  const png = await sharp(svg, { density: 144 })
    .resize(size, size)
    .png()
    .toBuffer();

  writeFileSync(path.join(SRC, name), png);
  pngBuffers[size] = png;
  console.log(`✓ ${name} (${size}×${size})`);
}

// ── Build favicon.ico (multi-size: 16 + 32)
// ICO format: ICONDIR header + directory entries + PNG image data
function buildIco(pngs) {
  // pngs: array of { size, buffer }
  const count = pngs.length;

  // Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: 1 = ICO
  header.writeUInt16LE(count, 4);  // number of images

  // Directory: 16 bytes per image
  const dirSize = count * 16;
  const dir = Buffer.alloc(dirSize);
  let offset = 6 + dirSize;

  pngs.forEach(({ size, buffer }, i) => {
    const base = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, base);      // width  (0 = 256)
    dir.writeUInt8(size >= 256 ? 0 : size, base + 1);  // height (0 = 256)
    dir.writeUInt8(0, base + 2);   // color count
    dir.writeUInt8(0, base + 3);   // reserved
    dir.writeUInt16LE(1, base + 4); // planes
    dir.writeUInt16LE(32, base + 6); // bit count
    dir.writeUInt32LE(buffer.length, base + 8); // size of image data
    dir.writeUInt32LE(offset, base + 12);        // offset of image data
    offset += buffer.length;
  });

  return Buffer.concat([header, dir, ...pngs.map(p => p.buffer)]);
}

const ico = buildIco([
  { size: 16, buffer: pngBuffers[16] },
  { size: 32, buffer: pngBuffers[32] },
]);
writeFileSync(path.join(SRC, 'favicon.ico'), ico);
console.log('✓ favicon.ico (16×16 + 32×32)');

console.log('\nDone. Add to base.njk <head>:');
console.log('  <link rel="icon" href="/favicon.ico" sizes="32x32">');
console.log('  <link rel="icon" href="/favicon.svg" type="image/svg+xml">');
console.log('  <link rel="apple-touch-icon" href="/apple-touch-icon.png">');
