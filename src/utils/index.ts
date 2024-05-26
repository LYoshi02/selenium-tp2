import {
  Browser,
  Builder,
  By,
  WebDriver,
  WebElement,
  until,
} from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";

export const DEFAULT_DISPLAY_TIMEOUT = 20000; // In milliseconds
export const AULA_VIRTUAL_URL =
  "https://campusvirtual.ugd.edu.ar/moodle/login/";
export const STUDENT_ID_INPUT_NAME = "username";
export const PASSWORD_INPUT_NAME = "password";

export abstract class TestUtils {
  protected driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public getDriver() {
    return this.driver;
  }

  public async openPage(url: string) {
    await this.driver.get(url);
  }

  public async loginUser(studentId: string, password: string) {
    await this.openPage(AULA_VIRTUAL_URL);
    await this.typeInInput(STUDENT_ID_INPUT_NAME, studentId);
    await this.typeInInput(PASSWORD_INPUT_NAME, password);

    const loginButtonElement = await this.driver.findElement(
      By.css('input[type="submit"][value="Ingresar"]'),
    );
    await this.clickElement(loginButtonElement);
  }

  protected async typeInInput(inputName: string, text: string) {
    const inputElement = await this.driver.findElement(By.name(inputName));
    await inputElement.sendKeys(text);
  }

  protected async clickElement(element: WebElement) {
    await element.click();
  }

  protected async getAllMyCoursesButton() {
    return await this.driver.wait(
      until.elementLocated(By.css('a[title="Mis Cursos"]')),
      DEFAULT_DISPLAY_TIMEOUT,
    );
  }

  protected async scrollElementIntoView(element: WebElement) {
    await this.driver.executeScript(
      `
            const element = arguments[0];
            if (element.scrollIntoViewIfNeeded) {
                element.scrollIntoViewIfNeeded(true);
                window.scrollBy(0, -100);
            }
          `,
      element,
    );
  }

  protected async getElementsText(elements: WebElement[]) {
    const elementsText: string[] = [];
    for (const element of elements) {
      const elementText = await element.getText();
      elementsText.push(elementText);
    }
    return elementsText;
  }

  public async saveOutputScreenshot(screenshotName: string) {
    const screenshot = await this.driver.takeScreenshot();
    const screenshotPath = path.join(__dirname, "..", "..", "output");
    this.saveImage(screenshot, screenshotName, screenshotPath);
  }

  private saveImage(base64Image: string, imageName: string, imagePath: string) {
    const filePath = path.join(imagePath, imageName);

    // Create the custom folder if it doesn't exist
    if (!fs.existsSync(imagePath)) {
      fs.mkdirSync(imagePath, { recursive: true });
    }

    fs.writeFileSync(filePath, base64Image, "base64");
  }
}

type WebDriverConfig = {
  browser?: string;
  maximizeWindow?: boolean;
  options?: ChromeOptions;
};

export async function initializeWebDriver({
  browser = Browser.CHROME,
  maximizeWindow = false,
  options = null,
}: WebDriverConfig = {}) {
  const builder = new Builder().forBrowser(browser);
  if (browser === Browser.CHROME && options) {
    builder.setChromeOptions(options);
  }

  const driver = await builder.build();
  if (maximizeWindow) {
    await driver.manage().window().maximize();
  }

  return driver;
}

export async function terminateWebDriver(driver: WebDriver) {
  return await driver.quit();
}
