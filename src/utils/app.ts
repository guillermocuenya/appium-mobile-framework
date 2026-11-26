import { APP_ID } from '../../config/wdio.shared.conf.js';
import { BaseScreen } from '../screens/BaseScreen.js';
import { id } from './locators.js';

/**
 * Test isolation: every test starts from a fresh app (empty cart, logged out).
 * `mobile: clearApp` wipes app data and stops it; then we launch it again.
 * Much faster than reinstalling the APK and avoids order-dependent tests.
 */
export async function restartWithCleanState(): Promise<void> {
  try {
    await resetApp();
  } catch {
    // Self-healing: if the UiAutomator2 server on the device died (it happens on emulators
    // under load), start a fresh Appium session instead of failing every remaining test.
    console.log('[recovery] app reset failed — reloading the Appium session');
    await browser.reloadSession();
    await resetApp();
  }
}

async function resetApp(): Promise<void> {
  await driver.execute('mobile: clearApp', { appId: APP_ID });
  await driver.activateApp(APP_ID);
  await $(id('productRV')).waitForDisplayed({ timeout: 30_000, timeoutMsg: 'App did not reach the catalog after restart' });
  await BaseScreen.dismissBlockingDialogs();
}

/** Money as the app renders it: "$ 29.99". */
export const money = (amount: number): string => `$ ${amount.toFixed(2)}`;

/** Avoids floating point drift when adding prices in expectations. */
export const sum = (...values: number[]): number => Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100;
