/**
 * aum. Universal Responsive Audit
 *
 * Two-mode automated responsive checker:
 *
 * Mode 1 — SWEEP: Scans every 50px from 320–1920px for horizontal overflow.
 * Mode 2 — TARGETED: Runs detailed checks at specific device viewports.
 *
 * Usage:
 *   node scripts/responsive-audit.mjs                             # Full targeted audit, breakpoints preset
 *   node scripts/responsive-audit.mjs --sweep                     # Sweep mode: 320–1920px in 50px steps
 *   node scripts/responsive-audit.mjs --sweep --step 25           # Finer sweep
 *   node scripts/responsive-audit.mjs --preset andrea             # Targeted: Andrea's devices
 *   node scripts/responsive-audit.mjs --preset full               # Targeted: all 15 viewports
 *   node scripts/responsive-audit.mjs --pages index,coleccion     # Specific pages
 *   node scripts/responsive-audit.mjs --json                      # JSON output
 */

import { chromium } from 'playwright-core';
import { resolveDevices } from './viewports.mjs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';

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
  const args = { preset: 'breakpoints', pages: null, port: 8080, json: false, sweep: false, step: 50 };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--preset' && argv[i + 1]) args.preset = argv[++i];
    else if (argv[i] === '--pages' && argv[i + 1]) args.pages = argv[++i].split(',').map(s => s.trim());
    else if (argv[i] === '--port' && argv[i + 1]) args.port = parseInt(argv[++i], 10);
    else if (argv[i] === '--json') args.json = true;
    else if (argv[i] === '--sweep') args.sweep = true;
    else if (argv[i] === '--step' && argv[i + 1]) args.step = parseInt(argv[++i], 10);
  }
  return args;
}

async function runSweep(page, baseUrl, targetPages, step) {
  const issues = [];
  const MIN_WIDTH = 320;
  const MAX_WIDTH = 1920;
  const HEIGHT = 900;

  console.log(`\n  SWEEP MODE: ${MIN_WIDTH}–${MAX_WIDTH}px in ${step}px steps`);
  console.log(`  Total widths to test: ${Math.ceil((MAX_WIDTH - MIN_WIDTH) / step) + 1}\n`);

  for (const [pageName, pagePath] of Object.entries(targetPages)) {
    const overflowWidths = [];

    for (let width = MIN_WIDTH; width <= MAX_WIDTH; width += step) {
      await page.setViewportSize({ width, height: HEIGHT });
      await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(300);

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientW = await page.evaluate(() => document.documentElement.clientWidth);

      if (scrollW > clientW + 2) {
        overflowWidths.push({ width, overflow: scrollW - clientW });
      }
    }

    if (overflowWidths.length > 0) {
      console.log(`  [X] ${pageName}: overflow at ${overflowWidths.length} widths`);
      const ranges = [];
      let start = overflowWidths[0];
      let prev = overflowWidths[0];
      for (let i = 1; i < overflowWidths.length; i++) {
        if (overflowWidths[i].width - prev.width <= step) {
          prev = overflowWidths[i];
        } else {
          ranges.push({ from: start.width, to: prev.width, maxOverflow: Math.max(...overflowWidths.slice(0, ranges.length + 1).map(o => o.overflow)) });
          start = overflowWidths[i];
          prev = overflowWidths[i];
        }
      }
      ranges.push({ from: start.width, to: prev.width, maxOverflow: Math.max(...overflowWidths.map(o => o.overflow)) });

      for (const range of ranges) {
        const rangeStr = range.from === range.to ? `${range.from}px` : `${range.from}–${range.to}px`;
        console.log(`      ${rangeStr} (max ${range.maxOverflow}px overflow)`);
        issues.push({
          check: 'sweep-horizontal-overflow',
          severity: 'CRITICAL',
          page: pageName,
          range: rangeStr,
          fromWidth: range.from,
          toWidth: range.to,
          maxOverflow: range.maxOverflow,
        });
      }
    } else {
      console.log(`  [OK] ${pageName}: no overflow at any width`);
    }
  }

  return issues;
}

async function checkHorizontalOverflow(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const issues = [];

    // Build set of scroll containers — elements inside these are expected to exceed viewport
    const scrollContainers = new Set();
    for (const el of document.querySelectorAll('body *')) {
      const style = getComputedStyle(el);
      if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
        scrollContainers.add(el);
      }
    }

    function isInsideScrollContainer(el) {
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
        if (scrollContainers.has(parent)) return true;
        parent = parent.parentElement;
      }
      return false;
    }

    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect();
      if (rect.right > vw + 1) {
        // Skip elements inside horizontal scroll containers — their overflow is intentional
        if (isInsideScrollContainer(el)) continue;

        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + [...el.classList].join('.') : '') +
          (el.id ? '#' + el.id : '');
        issues.push({
          check: 'horizontal-overflow',
          severity: 'HIGH',
          selector: selector.slice(0, 120),
          overflow: Math.round(rect.right - vw),
        });
      }
    }
    return issues.filter((issue, _, all) =>
      !all.some(other => other !== issue && other.selector !== issue.selector && issue.selector.startsWith(other.selector))
    ).slice(0, 10);
  });
}

async function checkBodyOverflow(page) {
  return page.evaluate(() => {
    const scrollW = document.documentElement.scrollWidth;
    const clientW = document.documentElement.clientWidth;
    if (scrollW > clientW + 2) {
      return [{ check: 'body-horizontal-scroll', severity: 'CRITICAL', scrollWidth: scrollW, clientWidth: clientW, overflow: scrollW - clientW }];
    }
    return [];
  });
}

async function checkTouchTargets(page, isMobile) {
  if (!isMobile) return [];
  return page.evaluate(() => {
    const MIN = 44;
    const issues = [];
    for (const el of document.querySelectorAll('a, button, input, select, textarea, [role="button"], [tabindex]')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight * 3) continue;
      if (rect.width < MIN || rect.height < MIN) {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + [...el.classList].join('.') : '');
        issues.push({
          check: 'touch-target-too-small',
          severity: 'MEDIUM',
          selector: selector.slice(0, 120),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    }
    return issues.slice(0, 15);
  });
}

async function checkVhOverflow(page) {
  return page.evaluate(() => {
    const issues = [];
    for (const section of document.querySelectorAll('.hero, .soap-section, .nosotros-hero')) {
      const rect = section.getBoundingClientRect();
      if (section.scrollHeight > rect.height + 10) {
        const selector = section.tagName.toLowerCase() +
          (section.className && typeof section.className === 'string' ? '.' + [...section.classList].join('.') : '');
        issues.push({
          check: 'vh-content-overflow',
          severity: 'HIGH',
          selector: selector.slice(0, 120),
          containerHeight: Math.round(rect.height),
          contentHeight: Math.round(section.scrollHeight),
          overflow: Math.round(section.scrollHeight - rect.height),
          clipped: getComputedStyle(section).overflow === 'hidden',
        });
      }
    }
    return issues;
  });
}

async function checkTextClipping(page) {
  return page.evaluate(() => {
    const issues = [];
    for (const el of document.querySelectorAll('h1, h2, h3, h4, p, span, a, li, .btn-ghost, .btn-wa-cta')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight * 5) continue;
      const style = getComputedStyle(el);
      if (style.textOverflow === 'ellipsis' && style.overflow === 'hidden' && el.scrollWidth > el.clientWidth + 1) {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + [...el.classList].join('.') : '');
        issues.push({
          check: 'text-truncated',
          severity: 'MEDIUM',
          selector: selector.slice(0, 120),
          visibleWidth: Math.round(el.clientWidth),
          textWidth: Math.round(el.scrollWidth),
        });
      }
    }
    return issues.slice(0, 10);
  });
}

async function checkSafeAreaInsets(page) {
  return page.evaluate(() => {
    const issues = [];
    for (const el of document.querySelectorAll('*')) {
      const style = getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'sticky') {
        const selector = el.tagName.toLowerCase() +
          (el.className && typeof el.className === 'string' ? '.' + [...el.classList].join('.') : '');
        const rect = el.getBoundingClientRect();
        if (rect.bottom >= window.innerHeight - 5 || rect.top <= 5) {
          issues.push({
            check: 'safe-area-review',
            severity: 'LOW',
            selector: selector.slice(0, 120),
            position: style.position,
            nearEdge: rect.bottom >= window.innerHeight - 5 ? 'bottom' : 'top',
          });
        }
      }
    }
    return issues.slice(0, 10);
  });
}

async function runTargeted(page, baseUrl, targetPages, preset) {
  const deviceList = resolveDevices(preset);
  const allIssues = [];

  console.log(`\n  TARGETED MODE: ${preset} preset (${deviceList.length} devices)\n`);

  for (const [pageName, pagePath] of Object.entries(targetPages)) {
    for (const [deviceName, device] of deviceList) {
      await page.setViewportSize(device.viewport);
      await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(600);

      const checks = await Promise.all([
        checkBodyOverflow(page),
        checkHorizontalOverflow(page),
        checkTouchTargets(page, device.isMobile),
        checkVhOverflow(page),
        checkTextClipping(page),
        checkSafeAreaInsets(page),
      ]);

      const issues = checks.flat().map(issue => ({
        ...issue,
        page: pageName,
        device: deviceName,
        viewportSize: `${device.viewport.width}x${device.viewport.height}`,
      }));

      if (issues.length > 0) {
        allIssues.push(...issues);
        for (const issue of issues) {
          const icon = issue.severity === 'CRITICAL' ? 'X' : issue.severity === 'HIGH' ? '!' : issue.severity === 'MEDIUM' ? '~' : '.';
          console.log(`  [${icon}] ${issue.severity} | ${pageName} @ ${deviceName} (${device.viewport.width}px) | ${issue.check}: ${issue.selector || issue.overflow + 'px'}`);
        }
      } else {
        console.log(`  [OK] ${pageName} @ ${deviceName} (${device.viewport.width}px)`);
      }
    }
  }

  return allIssues;
}

async function main() {
  const { preset, pages, port, json, sweep, step } = parseArgs(process.argv);
  const baseUrl = `http://localhost:${port}`;

  const targetPages = pages
    ? Object.fromEntries(Object.entries(ALL_PAGES).filter(([k]) => pages.includes(k)))
    : ALL_PAGES;

  if (Object.keys(targetPages).length === 0) {
    console.error('No matching pages. Available:', Object.keys(ALL_PAGES).join(', '));
    process.exit(1);
  }

  console.log(`\n  aum. Universal Responsive Audit`);
  console.log(`  Mode:   ${sweep ? 'SWEEP (' + step + 'px steps)' : 'TARGETED (' + preset + ')'}`);
  console.log(`  Pages:  ${Object.keys(targetPages).join(', ')}\n`);

  let browser;
  try {
    browser = await chromium.launch({ executablePath: BRAVE_PATH, headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const allIssues = sweep
      ? await runSweep(page, baseUrl, targetPages, step)
      : await runTargeted(page, baseUrl, targetPages, preset);

    const bySeverity = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    for (const i of allIssues) bySeverity[i.severity] = (bySeverity[i.severity] || 0) + 1;

    console.log(`\n  ────────────────────────────────`);
    console.log(`  Total issues: ${allIssues.length}`);
    for (const [sev, count] of Object.entries(bySeverity)) {
      if (count > 0) console.log(`    ${sev}: ${count}`);
    }
    console.log(`  ────────────────────────────────\n`);

    if (json) {
      const outDir = join(PROJECT_ROOT, '.screenshots');
      mkdirSync(outDir, { recursive: true });
      const outPath = join(outDir, 'audit-results.json');
      writeFileSync(outPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        mode: sweep ? 'sweep' : 'targeted',
        preset: sweep ? `sweep-${step}px` : preset,
        issues: allIssues,
      }, null, 2));
      console.log(`  JSON: ${outPath}\n`);
    }

    if (bySeverity.CRITICAL > 0 || bySeverity.HIGH > 0) process.exit(1);
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

main();
