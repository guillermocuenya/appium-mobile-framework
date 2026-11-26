import { expect } from '@wdio/globals';
import CatalogScreen from '../../src/screens/CatalogScreen.js';
import ProductDetailScreen from '../../src/screens/ProductDetailScreen.js';
import CartScreen from '../../src/screens/CartScreen.js';
import HeaderBar from '../../src/screens/HeaderBar.js';
import LoginScreen from '../../src/screens/LoginScreen.js';
import { completeScreen, paymentScreen, reviewScreen, shippingScreen } from '../../src/screens/CheckoutScreens.js';
import { DELIVERY_FEE } from '../../src/data/catalog.js';
import { shippingAddress, testCard, users } from '../../src/data/checkout.js';
import { money, restartWithCleanState, sum } from '../../src/utils/app.js';

async function cartWithBackpackAndGoToCheckout(): Promise<void> {
  await CatalogScreen.openProduct('Sauce Labs Backpack');
  await ProductDetailScreen.waitForDisplayed();
  await ProductDetailScreen.addToCart();
  await HeaderBar.openCart();
  await CartScreen.proceedToCheckout();
}

describe('Checkout', () => {
  beforeEach(async () => {
    await restartWithCleanState();
  });

  it('guest is asked to log in and then completes the purchase end to end @smoke', async () => {
    await cartWithBackpackAndGoToCheckout();

    // Checkout requires authentication: the app routes the guest to login first.
    await LoginScreen.waitForDisplayed();
    await LoginScreen.login(users.standard.username, users.standard.password);

    await shippingScreen.fill(shippingAddress);
    await shippingScreen.continueToPayment();

    await paymentScreen.fill(testCard);
    expect(await paymentScreen.billingSameAsShipping()).toBe(true);
    await paymentScreen.reviewOrder();

    await reviewScreen.waitForDisplayed();
    expect(await reviewScreen.deliveryName()).toBe(shippingAddress.fullName);
    // Order total = items + flat delivery fee.
    expect(await reviewScreen.total()).toBe(money(sum(29.99, DELIVERY_FEE)));

    await reviewScreen.placeOrder();
    await completeScreen.waitForDisplayed();
    expect(await completeScreen.headline()).toBe('Checkout Complete');

    // After the order the cart must be empty.
    await completeScreen.continueShopping();
    expect(await HeaderBar.cartCount()).toBe(0);
  });

  it('shipping form blocks progress and flags every required field', async () => {
    await cartWithBackpackAndGoToCheckout();
    await LoginScreen.login(users.standard.username, users.standard.password);
    await shippingScreen.waitForDisplayed();

    await shippingScreen.continueToPayment();

    expect(await paymentScreen.isDisplayed()).toBe(false);
    expect(await shippingScreen.visibleErrors()).toEqual([
      'fullNameErrorTV',
      'address1ErrorTV',
      'cityErrorTV',
      'zipErrorTV',
      'countryErrorTV',
    ]);
  });

  it('payment form requires card details before review', async () => {
    await cartWithBackpackAndGoToCheckout();
    await LoginScreen.login(users.standard.username, users.standard.password);
    await shippingScreen.fill(shippingAddress);
    await shippingScreen.continueToPayment();
    await paymentScreen.waitForDisplayed();

    await paymentScreen.reviewOrder();
    expect(await reviewScreen.isDisplayed()).toBe(false);
    expect(await paymentScreen.isDisplayed()).toBe(true);
  });
});
