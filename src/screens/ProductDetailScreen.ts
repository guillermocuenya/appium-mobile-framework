import { BaseScreen } from './BaseScreen.js';
import { id, scrollToId } from '../utils/locators.js';

class ProductDetailScreen extends BaseScreen {
  protected readonly anchor = id('cartBt');

  async title(): Promise<string> {
    return this.textOf('productTV');
  }

  async price(): Promise<string> {
    return this.textOf('priceTV');
  }

  async quantity(): Promise<number> {
    return Number(await this.textOf('noTV'));
  }

  async increaseQuantity(times = 1): Promise<void> {
    for (let i = 0; i < times; i += 1) await this.tap(id('plusIV'));
  }

  async decreaseQuantity(times = 1): Promise<void> {
    for (let i = 0; i < times; i += 1) await this.tap(id('minusIV'));
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return $(id('cartBt')).isEnabled();
  }

  async addToCart(): Promise<void> {
    await $(scrollToId('cartBt'));
    await this.tap(id('cartBt'));
  }
}

export default new ProductDetailScreen();
