import { APP_ID } from '../../config/wdio.shared.conf.js';
import { BaseScreen } from './BaseScreen.js';
import { id, scrollToText } from '../utils/locators.js';

export type SortOption = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';

const SORT_ROW: Record<SortOption, string> = {
  nameAsc: 'nameAscCL',
  nameDesc: 'nameDesCL',
  priceAsc: 'priceAscCL',
  priceDesc: 'priceDesCL',
};

class CatalogScreen extends BaseScreen {
  protected readonly anchor = id('productRV');

  /** Titles and prices of the products currently rendered, in visual order. */
  async visibleProducts(): Promise<{ name: string; price: string }[]> {
    await this.waitForDisplayed();
    const titles = await $$(id('titleTV')).map((e) => e.getText());
    const prices = await $$(id('priceTV')).map((e) => e.getText());
    return titles.map((name, i) => ({ name, price: prices[i] ?? '' }));
  }

  /**
   * Only the product image opens the detail screen (the title is not clickable),
   * so we locate the card by its title and tap the image in the same card.
   */
  async openProduct(name: string): Promise<void> {
    await this.waitForDisplayed();
    await $(scrollToText(name));
    const image = await $(
      `//*[@resource-id="${APP_ID}:id/titleTV" and @text="${name}"]/../*[@resource-id="${APP_ID}:id/productIV"]`,
    );
    await image.waitForDisplayed();
    await image.click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await $(id('sortIV')).click();
    await this.tap(id(SORT_ROW[option]));
    await this.waitForDisplayed();
  }
}

export default new CatalogScreen();
