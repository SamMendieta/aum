/**
 * Measure all sections on all pages at multiple desktop viewports.
 * Reports any section where content exceeds viewport height.
 * Design Principle #6: One section, one screen (desktop only, ≥769px width).
 */
import { chromium } from 'playwright';

const VIEWPORTS = [
  { width: 834,  height: 1024, label: 'iPad Pro 11' },
  { width: 1024, height: 768,  label: 'Small desktop' },
  { width: 1280, height: 720,  label: 'Standard desktop short' },
  { width: 1366, height: 768,  label: 'Laptop' },
  { width: 1440, height: 900,  label: 'Design baseline' },
];

const PAGES = [
  { url: '/', name: 'Index', sections: '.hero, .filosofia, .coleccion, .formula, .origen, .journal' },
  { url: '/coleccion/', name: 'Coleccion', sections: '.page-header, .soap-section' },
  { url: '/nosotros/', name: 'Nosotros', sections: '.nosotros-hero, .historia, .filosofia, .produccion, .formula, .cierre' },
  { url: '/contacto/', name: 'Contacto', sections: '.page-header, .contact-body, .photo-strip' },
  { url: '/coleccion/cuarzo-transparente/', name: 'Product (Cuarzo)', sections: '.hero, .sec, .cblock', heroNavOffset: true },
  { url: '/coleccion/citrino/', name: 'Product (Citrino)', sections: '.hero, .sec, .cblock', heroNavOffset: true },
];

const BASE = 'http://localhost:8080';

async function measurePage(page, pageInfo, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${BASE}${pageInfo.url}`, { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(500);

  const results = await page.evaluate(({selectors, heroNavOffset}) => {
    const els = document.querySelectorAll(selectors);
    const navH = heroNavOffset ? 82 : 0; // --nav-h = 82px
    return [...els].map((el, i) => {
      const rect = el.getBoundingClientRect();
      const computedHeight = parseFloat(getComputedStyle(el).height);
      const vh = window.innerHeight;
      const overflow = getComputedStyle(el).overflow;
      const overflowY = getComputedStyle(el).overflowY;
      const isClipped = ['hidden', 'clip'].includes(overflow) || ['hidden', 'clip'].includes(overflowY);
      // Product hero expects viewport - nav height; all others expect full viewport
      const isProductHero = heroNavOffset && el.classList.contains('hero');
      const expectedH = isProductHero ? vh - navH : vh;
      const contentOverflows = el.scrollHeight > Math.round(rect.height) + 2;
      const overflow_px = Math.max(0, el.scrollHeight - Math.round(rect.height));
      return {
        index: i,
        tag: el.tagName.toLowerCase(),
        className: el.className.split(' ')[0],
        id: el.id || '',
        rectHeight: Math.round(rect.height),
        expectedHeight: Math.round(expectedH),
        viewportHeight: vh,
        scrollHeight: el.scrollHeight,
        overflows: contentOverflows,
        overflow_px,
        isClipped, // overflow:hidden means content IS clipped — not scrollable
        // FAIL only if: wrong height OR content overflows without being clipped
        isFail: !( Math.abs(rect.height - expectedH) < 3 ) || (contentOverflows && !isClipped),
        ratio: (rect.height / expectedH).toFixed(3),
        isExact100svh: Math.abs(rect.height - expectedH) < 3,
      };
    });
  }, {selectors: pageInfo.sections, heroNavOffset: pageInfo.heroNavOffset || false});

  return results;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let totalFails = 0;
  let totalChecks = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`VIEWPORT: ${vp.width}×${vp.height} (${vp.label})`);
    console.log('═'.repeat(70));

    for (const pageInfo of PAGES) {
      const results = await measurePage(page, pageInfo, vp);
      for (const r of results) {
        totalChecks++;
        const isFail = r.isFail;
        const status = isFail ? '✗' : '✓';
        if (isFail) totalFails++;

        const issues = [];
        if (!r.isExact100svh) issues.push(`height=${r.rectHeight}px (expect ${r.expectedHeight}px, ratio=${r.ratio})`);
        if (r.overflows && !r.isClipped) issues.push(`SCROLLABLE overflow by ${r.overflow_px}px`);
        if (r.overflows && r.isClipped) issues.push(`clipped ${r.overflow_px}px (ok — overflow:hidden)`);

        if (isFail) {
          console.log(`  ${status} ${pageInfo.name} .${r.className}${r.id ? '#'+r.id : ''} — ${issues.join(', ')}`);
        } else if (r.overflows && r.isClipped && r.overflow_px > 30) {
          console.log(`  ⚠ ${pageInfo.name} .${r.className}${r.id ? '#'+r.id : ''} — ${issues.join(', ')}`);
        }
      }

      const fails = results.filter(r => r.isFail);
      if (fails.length === 0) {
        const warnings = results.filter(r => r.overflows && r.isClipped && r.overflow_px > 30);
        if (warnings.length === 0) {
          console.log(`  ✓ ${pageInfo.name} — all ${results.length} sections PASS`);
        } else {
          console.log(`  ✓ ${pageInfo.name} — all ${results.length} sections PASS (${warnings.length} with minor clipping)`);
        }
      }
    }
  }

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`SUMMARY: ${totalChecks - totalFails}/${totalChecks} checks passed, ${totalFails} failures`);
  console.log('═'.repeat(70));

  await browser.close();
  process.exit(totalFails > 0 ? 1 : 0);
})();
