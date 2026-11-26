import { expect } from '@wdio/globals';
import CatalogScreen from '../../src/screens/CatalogScreen.js';
import { restartWithCleanState } from '../../src/utils/app.js';
import { APP_ID } from '../../config/wdio.shared.conf.js';

/**
 * Known defects — quarantined.
 *
 * These tests describe the CORRECT behaviour and fail today because of real defects in
 * My Demo App 2.3.0. They are skipped (reported as "pending") so the pipeline stays a
 * trustworthy signal, and they document how to reproduce each bug. To verify a fix:
 * remove `.skip` and run `npm run test:android -- --spec test/specs/known-defects.spec.ts`.
 *
 * Root cause (ProductCatalogFragment.java): the tap handler reads
 *   meta = [0, null, 2, 3, 4, 5]   ← "null is an intentionally introduced bug for demos"
 *   meta[position].intValue()
 * so position 1 throws NullPointerException and positions >= 6 throw
 * ArrayIndexOutOfBoundsException.
 */
describe('Known defects (quarantined)', () => {
  beforeEach(async () => {
    await restartWithCleanState();
  });

  it.skip('BUG-001: opening the 2nd product in the grid must not crash the app', async () => {
    const [, second] = await CatalogScreen.visibleProducts();
    await CatalogScreen.openProduct(second.name);
    expect(await driver.queryAppState(APP_ID)).toBe(4); // 4 = running in foreground
  });

  it.skip('BUG-002: opening a product below the 6th position must not crash the app', async () => {
    await CatalogScreen.openProduct('Sauce Labs Bike Light');
    expect(await driver.queryAppState(APP_ID)).toBe(4);
  });
});
