/**
 * aum. Design Guardian — Screenshot Utility (v2)
 *
 * Captures full-page screenshots using Playwright device descriptors.
 * Supports all 143 Playwright devices + custom laptop/desktop viewports.
 *
 * Usage:
 *   node scripts/screenshot.mjs --label baseline                              # Quick preset
 *   node scripts/screenshot.mjs --label baseline --preset andrea              # Andrea's devices
 *   node scripts/screenshot.mjs --label baseline --preset breakpoints         # All breakpoint zones
 *   node scripts/screenshot.mjs --label baseline --preset full                # 15 viewports
 *   node scripts/screenshot.mjs --label baseline --device "iPhone 15 Pro"     # Specific Playwright device
 *   node scripts/screenshot.mjs --label baseline --pages index,coleccion      # Specific pages
 */

import { chromium } from 'playwright-core';
import { mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { resolveDevices, PRESET_NAMES } from './viewports.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

const ALL_PAGES = {
  index: '/',
  coleccion: '/coleccion/',
  nosotros: '/nosotros/',
  contacto: '/contacto/',
  'cuarzo-transparente': '/coleccion/cuarzo-transparente/',
  amatista: '/coleccion/amatista/',
  sodalita: '/coleccion/sodalita/',
  aventurina: '/coleccion/aventurina/',
  citrino: '/coleccion/citrino/',
  cornalina: '/coleccion/cornalina/',
  'jaspe-brechado': '/coleccion/jaspe-brechado/',
};

function parseArgs(argv) {
  const args = { pages: null, label: 'capture', port: 8080, preset: null, device: null };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--pages' && argv[i + 1]) args.pages = argv[++i].split(',').map(p => p.trim());
    else if (argv[i] === '--label' && argv[i + 1]) args.label = argv[++i];
    else if (argv[i] === '--port' && argv[i + 1]) args.port = parseInt(argv[++i], 10);
    else if (argv[i] === '--preset' && argv[i + 1]) args.preset = argv[++i];
    else if (argv[i] === '--device' && argv[i + 1]) args.device = argv[++i];
  }
  return args;
}

async function captureScreenshots() {
  const { pages, label, port, preset, device: deviceArg } = parseArgs(process.argv);
  const baseUrl = `http://localhost:${port}`;
  const outDir = join(PROJECT_ROOT, '.screenshots', label);

  const input = deviceArg || preset || 'quick';
  const deviceList = resolveDevices(input);

  const targetPages = pages
    ? Object.fromEntries(Object.entries(ALL_PAGES).filter(([key]) => pages.includes(key)))
    : ALL_PAGES;

  if (Object.keys(targetPages).length === 0) {
    console.error('No matching pages. Available:', Object.keys(ALL_PAGES).join(', '));
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });

  console.log(`\n  aum. Screenshot Capture`);
  console.log(`  Label:   ${label}`);
  console.log(`  Devices: ${deviceList.map(([n]) => n).join(', ')}`);
  console.log(`  Pages:   ${Object.keys(targetPages).join(', ')}`);
  console.log(`  Output:  ${outDir}\n`);

  let browser;
  try {
    browser = await chromium.launch({ executablePath: BRAVE_PATH, headless: true });
    let count = 0;

    for (const [deviceName, device] of deviceList) {
      const context = await browser.newContext({
        viewport: device.viewport,
        deviceScaleFactor: device.deviceScaleFactor || 1,
        isMobile: device.isMobile || false,
        hasTouch: device.hasTouch || false,
      });
      const page = await context.newPage();

      const safeDeviceName = deviceName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

      for (const [name, path] of Object.entries(targetPages)) {
        await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForFunction(() => document.fonts.ready.then(() => true), { timeout: 5000 });
        await page.waitForLoadState('networkidle');

        const filename = `${name}-${safeDeviceName}.png`;
        const filepath = join(outDir, filename);
        await page.screenshot({ path: filepath, fullPage: true });

        console.log(`  + ${filename} (${device.viewport.width}x${device.viewport.height} @${device.deviceScaleFactor}x)`);
        count++;
      }

      await context.close();
    }

    console.log(`\n  Done. ${count} screenshots saved.\n`);
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      console.error('\n  Dev server not running. Start first:\n    cd aum/web && npm start\n');
    } else {
      console.error('\n  Error:', err.message, '\n');
    }
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

captureScreenshots();
