/**
 * aum. Universal Viewport Configuration
 *
 * Single source of truth for all responsive testing viewports.
 * Wraps Playwright's 143 built-in device descriptors + custom laptop/desktop viewports.
 *
 * Used by: screenshot.mjs, responsive-audit.mjs, playwright.config.mjs
 */

import { devices } from 'playwright-core';

// ── Custom viewports that Playwright doesn't include ──
// Playwright maxes out at 1280px width. Real laptops go up to 1920px+.
const CUSTOM_VIEWPORTS = {
  'macbook-air-11': {
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'macbook-air-13': {
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'macbook-pro-14': {
    viewport: { width: 1512, height: 945 },
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
  },
  'windows-laptop-hd': {
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'windows-laptop-fhd': {
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'windows-125-scale': {
    viewport: { width: 1536, height: 864 },
    deviceScaleFactor: 1.25,
    isMobile: false,
    hasTouch: false,
  },
  'windows-150-scale': {
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1.5,
    isMobile: false,
    hasTouch: false,
  },
  'wcag-zoom-200': {
    viewport: { width: 720, height: 450 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'ultrawide': {
    viewport: { width: 2560, height: 1080 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'galaxy-s24-plus': {
    viewport: { width: 384, height: 832 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
};

/**
 * Get a device descriptor by name. Checks custom viewports first, then Playwright devices.
 * @param {string} name
 * @returns {{ viewport: {width: number, height: number}, deviceScaleFactor: number, isMobile: boolean, hasTouch: boolean } | null}
 */
export function getDevice(name) {
  if (CUSTOM_VIEWPORTS[name]) return CUSTOM_VIEWPORTS[name];
  if (devices[name]) {
    const d = devices[name];
    return {
      viewport: d.viewport,
      deviceScaleFactor: d.deviceScaleFactor,
      isMobile: d.isMobile,
      hasTouch: d.hasTouch,
    };
  }
  return null;
}

/**
 * Named presets — groups of devices for specific testing scenarios.
 * Each entry is a device name (either custom or Playwright built-in).
 */
export const PRESETS = {
  quick: [
    'iPhone SE',
    'Desktop Chrome',
  ],
  andrea: [
    'iPhone 14',
    'macbook-air-11',
    'macbook-air-13',
  ],
  breakpoints: [
    'iPhone SE',
    'iPhone 12',
    'iPhone 14 Pro Max',
    'iPad Mini',
    'iPad (gen 7) landscape',
    'Desktop Chrome',
    'macbook-air-11',
    'macbook-air-13',
    'windows-laptop-fhd',
  ],
  platforms: [
    'iPhone SE',
    'iPhone 15 Pro',
    'iPad Pro 11',
    'Galaxy S24',
    'Galaxy Tab S9',
    'Pixel 7',
    'Desktop Chrome',
    'macbook-air-11',
    'windows-laptop-fhd',
  ],
  accessibility: [
    'iPhone SE',
    'wcag-zoom-200',
    'Desktop Chrome',
    'macbook-air-13',
  ],
  full: [
    'iPhone SE',
    'iPhone 12',
    'iPhone 14 Pro Max',
    'Galaxy S24',
    'iPad Mini',
    'iPad (gen 7)',
    'iPad (gen 7) landscape',
    'iPad Pro 11 landscape',
    'Desktop Chrome',
    'macbook-air-11',
    'macbook-air-13',
    'macbook-pro-14',
    'windows-125-scale',
    'windows-laptop-fhd',
    'wcag-zoom-200',
  ],
  responsive: [
    'Galaxy S24',
    'iPhone 14',
    'iPhone 14 Pro',
    'iPhone XR',
    'Galaxy A55',
    'iPhone 14 Pro Max',
    'iPad Mini',
    'iPad Pro 11',
    'Desktop Chrome',
    'macbook-air-11',
    'macbook-air-13',
    'windows-laptop-fhd',
    'iPhone SE',
    'wcag-zoom-200',
  ],
};

export const CUSTOM_NAMES = Object.keys(CUSTOM_VIEWPORTS);
export const PRESET_NAMES = Object.keys(PRESETS);

/**
 * Resolve a preset name or comma-separated device list to device entries.
 * @param {string} input - Preset name OR comma-separated device names
 * @returns {Array<[string, {viewport: {width: number, height: number}, deviceScaleFactor: number, isMobile: boolean, hasTouch: boolean}]>}
 */
export function resolveDevices(input) {
  const names = PRESETS[input]
    ? PRESETS[input]
    : input.split(',').map(s => s.trim());

  return names.map(name => {
    const device = getDevice(name);
    if (!device) {
      throw new Error(`Unknown device "${name}". Custom: ${CUSTOM_NAMES.join(', ')}. Use Playwright device names for built-in devices.`);
    }
    return [name, device];
  });
}
