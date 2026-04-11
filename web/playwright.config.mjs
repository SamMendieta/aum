// playwright.config.mjs
import { defineConfig } from '@playwright/test';
import { resolveDevices } from './scripts/viewports.mjs';

const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

// Build a Playwright project for each device in the 'responsive' preset.
const deviceList = resolveDevices('responsive');

const projects = deviceList.map(([name, device]) => ({
  name: name.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase(),
  use: {
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor || 1,
    isMobile: device.isMobile || false,
    hasTouch: device.hasTouch || false,
    launchOptions: {
      executablePath: BRAVE_PATH,
    },
  },
}));

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.test.mjs',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: '.screenshots/test-results.json' }]],
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'off',
  },
  projects,
  webServer: {
    command: 'npm start',
    port: 8080,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
