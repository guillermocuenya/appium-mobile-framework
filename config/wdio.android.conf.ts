import path from 'node:path';
import { APP_ID, REPORTS_DIR, sharedConfig } from './wdio.shared.conf.js';

/**
 * Local Android emulator (also used in CI).
 * The APK is downloaded by `scripts/download-app.sh` into ./apps (git-ignored).
 */
const appPath = path.resolve(process.env.APP_PATH ?? 'apps/mda.apk');

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  port: 4723,
  services: [
    [
      'appium',
      {
        command: 'appium',
        args: { log: path.join(REPORTS_DIR, 'appium.log'), relaxedSecurity: true },
      },
    ],
  ],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.DEVICE_NAME ?? 'Android Emulator',
      'appium:platformVersion': process.env.PLATFORM_VERSION,
      'appium:app': appPath,
      'appium:appPackage': APP_ID,
      'appium:appWaitActivity': '*',
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
      'appium:uiautomator2ServerInstallTimeout': 120_000,
      'appium:adbExecTimeout': 120_000,
      'appium:disableWindowAnimation': true,
    },
  ],
};
