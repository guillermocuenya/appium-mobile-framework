import { expect } from '@wdio/globals';
import CatalogScreen, { type SortOption } from '../../src/screens/CatalogScreen.js';
import ProductDetailScreen from '../../src/screens/ProductDetailScreen.js';
import { binaryCompare, byName, priceOf, products } from '../../src/data/catalog.js';
import { money, restartWithCleanState } from '../../src/utils/app.js';

const parsePrice = (text: string): number => Number(text.replace(/[^0-9.]/g, ''));

describe('Catalog', () => {
  beforeEach(async () => {
    await restartWithCleanState();
  });

  it('shows products sorted by name (A→Z) by default @smoke', async () => {
    const visible = await CatalogScreen.visibleProducts();
    expect(visible.length).toBeGreaterThanOrEqual(2);
    // The first screen must be exactly the head of the expected full ordering.
    expect(visible.map((p) => p.name)).toEqual(byName(true).slice(0, visible.length).map((p) => p.name));
  });

  it('every visible product exists in the spec with the right price', async () => {
    const visible = await CatalogScreen.visibleProducts();
    for (const item of visible) {
      const expected = priceOf(item.name);
      expect(expected).toBeDefined();
      expect(item.price).toBe(money(expected!));
    }
  });

  /**
   * Ordering is checked as a property (each pair is in order) instead of a fixed list:
   * several products share a price, and their relative order is not specified.
   */
  const sorts: { option: SortOption; label: string; inOrder: (a: { name: string; price: number }, b: { name: string; price: number }) => boolean }[] = [
    { option: 'priceAsc', label: 'price low → high', inOrder: (a, b) => a.price <= b.price },
    { option: 'priceDesc', label: 'price high → low', inOrder: (a, b) => a.price >= b.price },
    { option: 'nameDesc', label: 'name Z → A', inOrder: (a, b) => binaryCompare(a.name, b.name) >= 0 },
  ];

  for (const s of sorts) {
    it(`sorts by ${s.label}`, async () => {
      await CatalogScreen.sortBy(s.option);
      const visible = (await CatalogScreen.visibleProducts()).map((p) => ({ name: p.name, price: parsePrice(p.price) }));
      expect(visible.length).toBeGreaterThanOrEqual(2);
      for (let i = 1; i < visible.length; i += 1) {
        expect(s.inOrder(visible[i - 1], visible[i])).toBe(true);
      }
      // The first item must be an extreme of the whole catalog, not just of the visible page.
      const prices = products.map((p) => p.price);
      if (s.option === 'priceAsc') expect(visible[0].price).toBe(Math.min(...prices));
      if (s.option === 'priceDesc') expect(visible[0].price).toBe(Math.max(...prices));
      if (s.option === 'nameDesc') expect(visible[0].name).toBe(byName(false)[0].name);
    });
  }

  it('opens the product detail with the same name and price (product below the fold)', async () => {
    await CatalogScreen.openProduct('Sauce Labs Bike Light');
    expect(await ProductDetailScreen.title()).toBe('Sauce Labs Bike Light');
    expect(await ProductDetailScreen.price()).toBe(money(9.99));
  });
});
