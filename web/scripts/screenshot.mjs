/**
 * aum. Design Guardian — Screenshot Utility
 *
 * Captures full-page screenshots of aum. site pages at desktop and mobile viewports.
 * Uses Brave browser via playwright-core (no bundled Chromium needed).
 *
 * Usage:
 *   node scripts/screenshot.mjs                          # All pages, saves to .screenshots/
 *   node scripts/screenshot.mjs --pages index,coleccion  # Specific pages only
 *   node scripts/screenshot.mjs --label baseline         # Custom subfolder: .screenshots/baseline/
 *   node scripts/screenshot.mjs --label after             # Custom subfolder: .screenshots/after/
 *   node scripts/screenshot.mjs --port 8081              # Custom dev server port
 *
 * Expects Eleventy dev server running on localhost (default port 8080).
 */

import { chromium } from 'playwright-core';
import { mkdirSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

// --- Config ---

const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

const VIEWPORTS = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 375, height: 812 },
};

const ALL_PAGES = {
  index: '/',
  coleccion: '/coleccion/',
  nosotros: '/nosotros/',
  contacto: '/contacto/',
  'cuarzo-transparente': '/soaps/cuarzo-transparente/',
  amatista: '/soaps/amatista/',
  sodalita: '/soaps/sodalita/',
  aventurina: '/soaps/aventurina/',
  citrino: '/soaps/citrino/',
  cornalina: '/soaps/cornalina/',
  'jaspe-brechado': '/soaps/jaspe-brechado/',
};

// --- Parse CLI args ---

function parseArgs(argv) {
  const args = { pages: null, label: 'capture', port: 8080 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--pages' && argv[i + 1]) {
      args.pages = argv[++i].split(',').map(p => p.trim());
    } else if (argv[i] === '--label' && argv[i + 1]) {
      args.label = argv[++i];
    } else if (argv[i] === '--port' && argv[i + 1]) {
      args.port = parseInt(argv[++i], 10);
    }
  }
  return args;
}

// --- Main ---

async function captureScreenshots() {
  const { pages, label, port } = parseArgs(process.argv);
  const baseUrl = `http://localhost:${port}`;
  const outDir = join(PROJECT_ROOT, '.screenshots', label);

  // Determine which pages to capture
  const targetPages = pages
    ? Object.fromEntries(
        Object.entries(ALL_PAGES).filter(([key]) => pages.includes(key))
      )
    : ALL_PAGES;

  if (Object.keys(targetPages).length === 0) {
    console.error('No matching pages found. Available:', Object.keys(ALL_PAGES).join(', '));
    process.exit(1);
  }

  // Ensure output directory
  mkdirSync(outDir, { recursive: true });

  console.log(`\n  aum. Screenshot Capture`);
  console.log(`  Label:  ${label}`);
  console.log(`  Pages:  ${Object.keys(targetPages).join(', ')}`);
  console.log(`  Output: ${outDir}\n`);

  let browser;
  try {
    browser = await chromium.launch({
      executablePath: BRAVE_PATH,
      headless: true,
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    for (const [name, path] of Object.entries(targetPages)) {
      const url = `${baseUrl}${path}`;

      for (const [viewport, size] of Object.entries(VIEWPORTS)) {
        await page.setViewportSize(size);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

        // Wait for reveal animations to complete
        await page.waitForTimeout(1200);

        const filename = `${name}-${viewport}.png`;
        const filepath = join(outDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });

        console.log(`  ✓ ${filename}`);
      }
    }

    console.log(`\n  Done. ${Object.keys(targetPages).length * 2} screenshots saved to ${outDir}\n`);
  } catch (err) {
    if (err.message.includes('ECONNREFUSED') || err.message.includes('ERR_CONNECTION_REFUSED')) {
      console.error('\n  Error: Dev server not running. Start it first:\n    cd aum/web && npm start\n');
    } else {
      console.error('\n  Error:', err.message, '\n');
    }
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

captureScreenshots();
