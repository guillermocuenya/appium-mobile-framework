import { accessibilityId, byText, id } from '../utils/locators.js';

/** Header + side menu: present on every main screen. */
class HeaderBar {
  private readonly menuButton = id('menuIV');
  private readonly cartButton = id('cartRL');
  private readonly cartBadge = id('cartTV');
  private readonly sortButton = id('sortIV');

  async openMenu(): Promise<void> {
    await $(this.menuButton).click();
  }

  async openCart(): Promise<void> {
    await $(this.cartButton).click();
  }

  /** Number in the cart badge; 0 when the badge is hidden. */
  async cartCount(): Promise<number> {
    const badge = await $(this.cartBadge);
    if (!(await badge.isDisplayed().catch(() => false))) return 0;
    const text = (await badge.getText()).trim();
    return text ? Number(text) : 0;
  }

  async openSort(): Promise<void> {
    await $(this.sortButton).click();
  }

  async chooseMenuItem(item: 'Login' | 'Logout' | 'Catalog'): Promise<void> {
    await this.openMenu();
    const target = item === 'Catalog' ? byText('Catalog') : accessibilityId(`${item} Menu Item`);
    await $(target).waitForDisplayed();
    await $(target).click();
  }

  async menuHasItem(item: 'Login' | 'Logout'): Promise<boolean> {
    await this.openMenu();
    const present = await $(accessibilityId(`${item} Menu Item`)).isDisplayed().catch(() => false);
    await driver.back(); // close the drawer
    return present;
  }

  async confirmLogout(): Promise<void> {
    await $(byText('LOGOUT')).click();
  }
}

export default new HeaderBar();
