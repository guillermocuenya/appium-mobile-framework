import { expect } from '@wdio/globals';
import HeaderBar from '../../src/screens/HeaderBar.js';
import LoginScreen from '../../src/screens/LoginScreen.js';
import CatalogScreen from '../../src/screens/CatalogScreen.js';
import { users } from '../../src/data/checkout.js';
import { restartWithCleanState } from '../../src/utils/app.js';

describe('Login', () => {
  beforeEach(async () => {
    await restartWithCleanState();
    await HeaderBar.chooseMenuItem('Login');
    await LoginScreen.waitForDisplayed();
  });

  it('valid user logs in and the menu offers "Log Out" @smoke', async () => {
    await LoginScreen.login(users.standard.username, users.standard.password);
    await CatalogScreen.waitForDisplayed();
    expect(await HeaderBar.menuHasItem('Logout')).toBe(true);
  });

  it('locked-out user is rejected with a clear message', async () => {
    await LoginScreen.login(users.locked.username, users.locked.password);
    expect(await LoginScreen.passwordError()).toBe('Sorry this user has been locked out.');
    expect(await LoginScreen.isDisplayed()).toBe(true);
  });

  it('username is required', async () => {
    await LoginScreen.login('', users.standard.password);
    expect(await LoginScreen.usernameError()).toBe('Username is required');
  });

  it('password is required', async () => {
    await LoginScreen.login(users.standard.username, '');
    expect(await LoginScreen.passwordError()).toBe('Enter Password');
  });

  it('logging out asks for confirmation and returns to login', async () => {
    await LoginScreen.login(users.standard.username, users.standard.password);
    await CatalogScreen.waitForDisplayed();
    await HeaderBar.chooseMenuItem('Logout');
    await HeaderBar.confirmLogout();
    await LoginScreen.waitForDisplayed();
  });
});
