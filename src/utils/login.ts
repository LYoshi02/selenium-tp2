import { By, WebDriver, until } from "selenium-webdriver";

import {
  DEFAULT_DISPLAY_TIMEOUT,
  PASSWORD_INPUT_NAME,
  STUDENT_ID_INPUT_NAME,
  TestUtils,
} from ".";

export class LoginTestUtils extends TestUtils {
  constructor(driver: WebDriver) {
    super(driver);
  }

  public async typeInStudentIdInput(email: string) {
    await this.typeInInput(STUDENT_ID_INPUT_NAME, email);
  }

  public async typeInPasswordInput(password: string) {
    await this.typeInInput(PASSWORD_INPUT_NAME, password);
  }

  public async clickLoginButton() {
    const loginButtonElement = await this.driver.findElement(
      By.css('input[type="submit"][value="Ingresar"]'),
    );
    await this.clickElement(loginButtonElement);
  }

  public async isAllMyCoursesButtonDisplayed() {
    const allMyCoursesButton = await this.getAllMyCoursesButton();
    return await allMyCoursesButton.isDisplayed();
  }

  public async getLoginErrorMessageText() {
    return await this.driver
      .wait(until.elementLocated(By.css("span.error")), DEFAULT_DISPLAY_TIMEOUT)
      .getText();
  }

  public async logoutUser() {
    const logoutButtonElement = await this.driver.wait(
      until.elementLocated(By.xpath("//a[contains(@href, 'logout')]")),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    await this.clickElement(logoutButtonElement);

    const confirmDisconnectionButton = await this.driver.findElement(
      By.css('input[type="submit"][value="Continuar"]'),
    );
    await this.clickElement(confirmDisconnectionButton);
  }

  public async isLoginHeadingDisplayed() {
    const loginHeadingElement = await this.driver.wait(
      until.elementLocated(
        By.xpath(
          "//header[contains(text(), 'Iniciar sesión en el CAMPUS VIRTUAL')]",
        ),
      ),
      DEFAULT_DISPLAY_TIMEOUT,
    );

    return await loginHeadingElement.isDisplayed();
  }
}
