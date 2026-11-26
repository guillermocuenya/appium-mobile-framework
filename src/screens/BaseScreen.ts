import { byText, id } from '../utils/locators.js';

export abstract class BaseScreen {
  /** Element that proves the screen is loaded. */
  protected abstract readonly anchor: string;

  async waitForDisplayed(timeout = 20_000): Promise<this> {
    await $(this.anchor).waitForDisplayed({ timeout, timeoutMsg: `${this.constructor.name} was not displayed` });
    return this;
  }

  async isDisplayed(): Promise<boolean> {
    return $(this.anchor).isDisplayed();
  }

  protected el(selector: string) {
    return $(selector);
  }

  protected async type(selector: string, value: string): Promise<void> {
    const field = await $(selector);
    await field.waitForDisplayed();
    await field.clearValue();
    await field.setValue(value);
  }

  protected async tap(selector: string): Promise<void> {
    const target = await $(selector);
    await target.waitForDisplayed();
    await target.click();
  }

  /** Text of an element by resource-id. */
  protected async textOf(resourceId: string): Promise<string> {
    const target = await $(id(resourceId));
    await target.waitForDisplayed();
    return target.getText();
  }

  /** Dismisses the app's "Version no longer supported" dialog if the backend shows it. */
  static async dismissBlockingDialogs(): Promise<void> {
    const ok = await $(byText('Ok'));
    if (await ok.isDisplayed().catch(() => false)) await ok.click();
  }
}
