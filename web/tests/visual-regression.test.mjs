// tests/visual-regression.test.mjs
import { test, expect } from '@playwright/test';

/**
 * Visual regression tests using Playwright's built-in toHaveScreenshot().
 * Golden images stored in tests/visual-regression.test.mjs-snapshots/
 *
 * Run: npx playwright test visual-regression
 * Update goldens: npx playwright test visual-regression --update-snapshots
 */

const VISUAL_PAGES = [
  { name: 'index', path: '/' },
  { name: 'coleccion', path: '/coleccion/' },
  { name: 'nosotros', path: '/nosotros/' },
  { name: 'contacto', path: '/contacto/' },
  { name: 'amatista', path: '/soaps/amatista/' },
];

for (const { name, path } of VISUAL_PAGES) {
  test.describe(`${name} visual`, () => {
    test(`above fold matches golden`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(1500);

      await expect(page).toHaveScreenshot(`${name}-above-fold.png`, {
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
      });
    });
  });
}
