import { APP_ID, sharedConfig } from './wdio.shared.conf.js';

/**
 * Same suite on a real-device cloud (Sauce Labs).
 * Requires SAUCE_USERNAME / SAUCE_ACCESS_KEY and the APK uploaded to Sauce Storage.
 * Not executed in this repo's CI (no paid account) — it shows that switching provider is config-only.
 */
export const config: WebdriverIO.Config = {
  ...sharedConfig,
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: (process.env.SAUCE_REGION as 'us' | 'eu' | undefined) ?? 'us',
  maxInstances: 3,
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Google.*',
      'appium:platformVersion': '1[3-5]',
      'appium:app': process.env.SAUCE_APP ?? 'storage:filename=mda.apk',
      'appium:appPackage': APP_ID,
      'appium:appWaitActivity': '*',
      'sauce:options': { build: `appium-mobile-framework ${process.env.GITHUB_RUN_NUMBER ?? 'local'}` },
    },
  ],
};
