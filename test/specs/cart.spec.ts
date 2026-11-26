import { expect } from '@wdio/globals';
import CatalogScreen from '../../src/screens/CatalogScreen.js';
import ProductDetailScreen from '../../src/screens/ProductDetailScreen.js';
import CartScreen from '../../src/screens/CartScreen.js';
import HeaderBar from '../../src/screens/HeaderBar.js';
import { money, restartWithCleanState, sum } from '../../src/utils/app.js';

async function addProduct(name: string, quantity = 1): Promise<void> {
  await CatalogScreen.openProduct(name);
  if (quantity > 1) await ProductDetailScreen.increaseQuantity(quantity - 1);
  await ProductDetailScreen.addToCart();
}

describe('Cart', () => {
  beforeEach(async () => {
    await restartWithCleanState();
  });

  it('starts empty with a clear empty state', async () => {
    expect(await HeaderBar.cartCount()).toBe(0);
    await HeaderBar.openCart();
    expect(await CartScreen.isEmpty()).toBe(true);
    expect(await CartScreen.emptyMessage()).toBe('No Items');
  });

  it('adds a product with quantity and updates badge, items and total @smoke', async () => {
    await addProduct('Sauce Labs Backpack', 2);
    expect(await HeaderBar.cartCount()).toBe(2);

    await HeaderBar.openCart();
    expect(await CartScreen.itemNames()).toEqual(['Sauce Labs Backpack']);
    expect(await CartScreen.quantityOf('Sauce Labs Backpack')).toBe(2);
    expect(await CartScreen.itemsLabel()).toBe('2 Items');
    expect(await CartScreen.total()).toBe(money(sum(29.99, 29.99)));
  });

  it('quantity 0 disables "Add To Cart" and it never goes negative', async () => {
    await CatalogScreen.openProduct('Sauce Labs Onesie');
    expect(await ProductDetailScreen.quantity()).toBe(1);

    await ProductDetailScreen.decreaseQuantity(2);
    expect(await ProductDetailScreen.quantity()).toBe(0);
    expect(await ProductDetailScreen.isAddToCartEnabled()).toBe(false);

    await ProductDetailScreen.increaseQuantity();
    expect(await ProductDetailScreen.isAddToCartEnabled()).toBe(true);
  });

  it('keeps a running total across different products', async () => {
    await addProduct('Sauce Labs Backpack');
    await driver.back();
    await addProduct('Sauce Labs Bike Light');
    expect(await HeaderBar.cartCount()).toBe(2);

    await HeaderBar.openCart();
    expect((await CartScreen.itemNames()).sort()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    expect(await CartScreen.total()).toBe(money(sum(29.99, 9.99)));
  });

  it('removing the only item returns the cart to its empty state', async () => {
    await addProduct('Sauce Labs Bike Light');
    await HeaderBar.openCart();
    await CartScreen.remove('Sauce Labs Bike Light');
    expect(await CartScreen.isEmpty()).toBe(true);
    expect(await HeaderBar.cartCount()).toBe(0);
  });
});
