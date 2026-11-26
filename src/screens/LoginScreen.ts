import { BaseScreen } from './BaseScreen.js';
import { id } from '../utils/locators.js';

class LoginScreen extends BaseScreen {
  protected readonly anchor = id('loginBtn');

  async login(username: string, password: string): Promise<void> {
    await this.waitForDisplayed();
    await this.type(id('nameET'), username);
    await this.type(id('passwordET'), password);
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    await this.tap(id('loginBtn'));
  }

  async usernameError(): Promise<string> {
    return this.textOf('nameErrorTV');
  }

  async passwordError(): Promise<string> {
    return this.textOf('passwordErrorTV');
  }
}

export default new LoginScreen();
