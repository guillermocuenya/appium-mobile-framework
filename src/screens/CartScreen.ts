import { APP_ID } from '../../config/wdio.shared.conf.js';
import { BaseScreen } from './BaseScreen.js';
import { id } from '../utils/locators.js';

class CartScreen extends BaseScreen {
  protected readonly anchor = `//*[@resource-id="${APP_ID}:id/productTV" or @resource-id="${APP_ID}:id/noItemTitleTV"]`;

  async isEmpty(): Promise<boolean> {
    await this.waitForDisplayed();
    return $(id('noItemTitleTV')).isDisplayed().catch(() => false);
  }

  async emptyMessage(): Promise<string> {
    return this.textOf('noItemTitleTV');
  }

  async itemNames(): Promise<string[]> {
    await this.waitForDisplayed();
    return $$(id('titleTV')).map((e) => e.getText());
  }

  async itemsLabel(): Promise<string> {
    return this.textOf('itemsTV');
  }

  async total(): Promise<string> {
    return this.textOf('totalPriceTV');
  }

  private row(name: string, child: string): string {
    return `//*[@resource-id="${APP_ID}:id/titleTV" and @text="${name}"]/ancestor::*[.//*[@resource-id="${APP_ID}:id/${child}"]][1]//*[@resource-id="${APP_ID}:id/${child}"]`;
  }

  async quantityOf(name: string): Promise<number> {
    return Number(await $(this.row(name, 'noTV')).getText());
  }

  async increase(name: string): Promise<void> {
    await this.tap(this.row(name, 'plusIV'));
  }

  async remove(name: string): Promise<void> {
    await this.tap(this.row(name, 'removeBt'));
  }

  async proceedToCheckout(): Promise<void> {
    await this.tap(id('cartBt'));
  }
}

export default new CartScreen();
