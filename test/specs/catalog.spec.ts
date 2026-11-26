import { expect } from '@wdio/globals';
import CatalogScreen from '../../src/screens/CatalogScreen.js';
import ProductDetailScreen from '../../src/screens/ProductDetailScreen.js';
import { byName, byPrice, products } from '../../src/data/catalog.js';
import { money, restartWithCleanState } from '../../src/utils/app.js';

describe('Catalog', () => {
  beforeEach(async () => {
    await restartWithCleanState();
  });

  it('shows products sorted by name (A→Z) by default @smoke', async () => {
    const visible = await CatalogScreen.visibleProducts();
    const expected = byName(true).slice(0, visible.length);
    expect(visible.length).toBeGreaterThanOrEqual(2);
    expect(visible.map((p) => p.name)).toEqual(expected.map((p) => p.name));
  });

  it('every visible price matches the product specification', async () => {
    const visible = await CatalogScreen.visibleProducts();
    for (const item of visible) {
      const spec = products.find((p) => p.name === item.name);
      expect(spec).toBeDefined();
      expect(item.price).toBe(money(spec!.price));
    }
  });

  const sorts = [
    { option: 'priceAsc', label: 'price low → high', oracle: () => byPrice(true) },
    { option: 'priceDesc', label: 'price high → low', oracle: () => byPrice(false) },
    { option: 'nameDesc', label: 'name Z → A', oracle: () => byName(false) },
  ] as const;

  for (const s of sorts) {
    it(`sorts by ${s.label}`, async () => {
      await CatalogScreen.sortBy(s.option);
      const first = (await CatalogScreen.visibleProducts())[0];
      const expectedFirst = s.oracle()[0];
      expect(first.name).toBe(expectedFirst.name);
      expect(first.price).toBe(money(expectedFirst.price));
    });
  }

  it('opens the product detail with the same name and price', async () => {
    await CatalogScreen.openProduct('Sauce Labs Bike Light');
    await ProductDetailScreen.waitForDisplayed();
    expect(await ProductDetailScreen.title()).toBe('Sauce Labs Bike Light');
    expect(await ProductDetailScreen.price()).toBe(money(9.99));
  });
});
