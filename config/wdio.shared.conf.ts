import fs from 'node:fs';
import path from 'node:path';

export const APP_ID = 'com.saucelabs.mydemoapp.android';
export const REPORTS_DIR = path.resolve('reports');

/** Settings shared by every platform/provider config. */
export const sharedConfig: WebdriverIO.Config = {
  runner: 'local',
  specs: ['../test/specs/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 15_000,
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 2,
  // A spec file that fails because of infrastructure (emulator hiccup) gets one more chance.
  specFileRetries: process.env.CI ? 1 : 0,
  specFileRetriesDeferred: true,
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 180_000 },
  reporters: [
    'spec',
    ['junit', { outputDir: path.join(REPORTS_DIR, 'junit'), outputFileFormat: (o) => `results-${o.cid}.xml` }],
  ],
  capabilities: [],

  onPrepare() {
    fs.mkdirSync(path.join(REPORTS_DIR, 'failures'), { recursive: true });
  },

  /** Evidence on failure: screenshot + page source (the XML of the UI tree). */
  async afterTest(test, _context, { passed }) {
    if (passed) return;
    const safe = `${test.parent} ${test.title}`.replace(/[^a-z0-9]+/gi, '_').slice(0, 120);
    const dir = path.join(REPORTS_DIR, 'failures');
    await browser.saveScreenshot(path.join(dir, `${safe}.png`)).catch(() => undefined);
    const source = await browser.getPageSource().catch(() => '');
    if (source) fs.writeFileSync(path.join(dir, `${safe}.xml`), source);
    // Short, human-readable trace in the CI log: which screen and which texts were visible.
    const activity = await driver.getCurrentActivity().catch(() => '?');
    const texts = [...source.matchAll(/text="([^"]+)"/g)].map((m) => m[1]).slice(0, 25);
    console.log(`[failure context] activity=${activity} visible texts: ${texts.join(' | ')}`);
  },
};
