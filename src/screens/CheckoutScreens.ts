import { BaseScreen } from './BaseScreen.js';
import { id, scrollToId } from '../utils/locators.js';
import type { PaymentCard, ShippingAddress } from '../data/checkout.js';

async function hideKeyboard(): Promise<void> {
  if (await driver.isKeyboardShown()) await driver.hideKeyboard();
}

/** Step 1 — shipping address. */
class ShippingScreen extends BaseScreen {
  protected readonly anchor = id('fullNameET');

  async fill(a: ShippingAddress): Promise<void> {
    await this.waitForDisplayed();
    await this.type(id('fullNameET'), a.fullName);
    await this.type(id('address1ET'), a.address1);
    if (a.address2) await this.type(id('address2ET'), a.address2);
    await this.type(id('cityET'), a.city);
    if (a.state) {
      await $(scrollToId('stateET'));
      await this.type(id('stateET'), a.state);
    }
    await $(scrollToId('zipET'));
    await this.type(id('zipET'), a.zip);
    await $(scrollToId('countryET'));
    await this.type(id('countryET'), a.country);
    await hideKeyboard();
  }

  async continueToPayment(): Promise<void> {
    await $(scrollToId('paymentBtn'));
    await this.tap(id('paymentBtn'));
  }

  /** Resource-ids of the validation messages currently displayed. */
  async visibleErrors(): Promise<string[]> {
    const fields = ['fullNameErrorTV', 'address1ErrorTV', 'cityErrorTV', 'zipErrorTV', 'countryErrorTV'];
    const shown: string[] = [];
    for (const f of fields) {
      try {
        await $(scrollToId(f.replace('ErrorTV', 'ET'))).isExisting();
      } catch {
        /* field may already be visible */
      }
      if (await $(id(f)).isDisplayed().catch(() => false)) shown.push(f);
    }
    return shown;
  }
}

/** Step 2 — payment method. */
class PaymentScreen extends BaseScreen {
  protected readonly anchor = id('cardNumberET');

  async fill(card: PaymentCard): Promise<void> {
    await this.waitForDisplayed();
    await this.type(id('nameET'), card.fullName);
    await this.type(id('cardNumberET'), card.number);
    await this.type(id('expirationDateET'), card.expiration);
    await this.type(id('securityCodeET'), card.securityCode);
    await hideKeyboard();
  }

  async billingSameAsShipping(): Promise<boolean> {
    await $(scrollToId('billingAddressCB'));
    return (await $(id('billingAddressCB')).getAttribute('checked')) === 'true';
  }

  async reviewOrder(): Promise<void> {
    await $(scrollToId('paymentBtn'));
    await this.tap(id('paymentBtn'));
  }
}

/** Step 3 — review and place the order. */
class ReviewScreen extends BaseScreen {
  protected readonly anchor = id('placeOrderRV');

  async deliveryName(): Promise<string> {
    return this.textOf('fullNameTV');
  }

  async total(): Promise<string> {
    await $(scrollToId('totalAmountTV'));
    return this.textOf('totalAmountTV');
  }

  async placeOrder(): Promise<void> {
    await $(scrollToId('paymentBtn'));
    await this.tap(id('paymentBtn'));
  }
}

/** Step 4 — confirmation. */
class CompleteScreen extends BaseScreen {
  protected readonly anchor = id('completeTV');

  async headline(): Promise<string> {
    return this.textOf('completeTV');
  }

  async continueShopping(): Promise<void> {
    await this.tap(id('shoopingBt')); // sic: resource-id has a typo in the app
  }
}

export const shippingScreen = new ShippingScreen();
export const paymentScreen = new PaymentScreen();
export const reviewScreen = new ReviewScreen();
export const completeScreen = new CompleteScreen();
