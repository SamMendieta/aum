// tests/responsive.test.mjs
import { test, expect } from '@playwright/test';

const ALL_PAGES = [
  { name: 'index', path: '/' },
  { name: 'coleccion', path: '/coleccion/' },
  { name: 'nosotros', path: '/nosotros/' },
  { name: 'contacto', path: '/contacto/' },
  { name: 'amatista', path: '/soaps/amatista/' },
  { name: 'citrino', path: '/soaps/citrino/' },
  { name: 'jaspe-brechado', path: '/soaps/jaspe-brechado/' },
];

for (const { name, path } of ALL_PAGES) {
  test.describe(`${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(600);
    });

    test('no horizontal scroll', async ({ page }) => {
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(2);
    });

    test('no content clipped in vh sections', async ({ page }) => {
      const overflows = await page.evaluate(() => {
        const results = [];
        for (const el of document.querySelectorAll('.hero, .soap-section, .nosotros-hero')) {
          const rect = el.getBoundingClientRect();
          if (el.scrollHeight > rect.height + 10) {
            results.push({
              cls: el.className.slice(0, 40),
              container: Math.round(rect.height),
              content: Math.round(el.scrollHeight),
            });
          }
        }
        return results;
      });
      expect(overflows).toHaveLength(0);
    });

    test('touch targets >= 44px on mobile', async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Desktop viewport');
      const tooSmall = await page.evaluate(() => {
        const results = [];
        for (const el of document.querySelectorAll('a, button, [role="button"]')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.bottom < 0 || r.top > window.innerHeight * 3) continue;
          if (r.width < 44 || r.height < 44) {
            results.push({ cls: [...el.classList].join(' ').slice(0, 50), w: Math.round(r.width), h: Math.round(r.height) });
          }
        }
        return results;
      });
      expect(tooSmall).toHaveLength(0);
    });

    test('main sections within viewport width', async ({ page }) => {
      const outOfBounds = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const results = [];
        for (const el of document.querySelectorAll('section, .wrap, main, header, footer, nav')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 5 && r.width > 0) {
            results.push({ cls: el.className.slice(0, 50), right: Math.round(r.right), vw });
          }
        }
        return results;
      });
      expect(outOfBounds).toHaveLength(0);
    });

    test('nav visible and functional', async ({ page }) => {
      const nav = page.locator('.nav');
      await expect(nav).toBeVisible();
      const isMobile = await page.evaluate(() => window.innerWidth < 768);
      if (isMobile) {
        const toggle = page.locator('.nav__toggle');
        await expect(toggle).toBeVisible();
      }
    });
  });
}
