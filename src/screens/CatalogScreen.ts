import { BaseScreen } from './BaseScreen.js';
import { id, productImage } from '../utils/locators.js';
import ProductDetailScreen from './ProductDetailScreen.js';

/**
 * Bounded, deterministic scrolling of the catalog's outer container.
 * Why not UiScrollable.scrollIntoView? The product grid is a RecyclerView nested in a
 * ScrollView: UiScrollable picks the inner list (which can't scroll), keeps swiping and
 * can hang the UiAutomator2 server on the device. Here we scroll the real container,
 * at most N times, and stop as soon as the target is visible or the end is reached.
 */
async function scrollUntilDisplayed(selector: string, maxSwipes = 15): Promise<void> {
  for (let i = 0; i <= maxSwipes; i += 1) {
    if (await $(selector).isDisplayed().catch(() => false)) return;
    const container = await $(id('scrollView'));
    const canScrollMore = await driver.execute('mobile: scrollGesture', {
      elementId: container.elementId,
      direction: 'down',
      percent: 0.6,
    });
    if (!canScrollMore && !(await $(selector).isDisplayed().catch(() => false))) break;
  }
  if (!(await $(selector).isDisplayed().catch(() => false))) {
    throw new Error(`Not found after scrolling the catalog: ${selector}`);
  }
}

/** Resolves when the element is at the same position in two consecutive reads. */
async function waitUntilStill(el: WebdriverIO.Element): Promise<void> {
  await browser.waitUntil(
    async () => {
      const a = await el.getLocation();
      await browser.pause(250);
      const b = await el.getLocation();
      return a.x === b.x && a.y === b.y;
    },
    { timeout: 5_000, timeoutMsg: 'list did not settle after scrolling' },
  );
}

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
   *
   * Mobile gotcha: right after a scroll the list is still moving (fling). A tap during
   * the fling only stops the scroll and is not delivered as a click. We wait until the
   * image stops moving before tapping, and retry once if the detail screen didn't open.
   */
  async openProduct(name: string): Promise<void> {
    await this.waitForDisplayed();
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      await scrollUntilDisplayed(productImage(name));
      const image = await $(productImage(name));
      await image.waitForDisplayed();
      await waitUntilStill(image);
      await image.click();
      try {
        await ProductDetailScreen.waitForDisplayed(8_000);
        return;
      } catch (e) {
        if (attempt === 2) throw e;
      }
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    await $(id('sortIV')).click();
    await this.tap(id(SORT_ROW[option]));
    await this.waitForDisplayed();
  }
}

export default new CatalogScreen();
