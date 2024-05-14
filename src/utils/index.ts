import {
  Browser,
  Builder,
  By,
  WebDriver,
  WebElement,
  until,
} from "selenium-webdriver";
import path from "path";
import fs from "fs";

const DEFAULT_DISPLAY_TIMEOUT = 10000;
const AULA_VIRTUAL_URL = "https://campusvirtual.ugd.edu.ar/moodle/login/";
const STUDENT_ID_INPUT_NAME = "username";
const PASSWORD_INPUT_NAME = "password";

export class TestUtils {
  private driver: WebDriver;

  constructor(driver: WebDriver) {
    this.driver = driver;
  }

  public getDriver() {
    return this.driver;
  }

  public async openPage(url: string) {
    await this.driver.get(url);
  }

  public async typeInInput(inputName: string, text: string) {
    const inputElement = await this.driver.findElement(By.name(inputName));
    await inputElement.sendKeys(text);
  }

  public async clickLoginButton() {
    const loginButtonElement = await this.driver.findElement(
      By.css('input[type="submit"][value="Ingresar"]'),
    );
    await this.clickElement(loginButtonElement);
  }

  private async clickElement(element: WebElement) {
    await element.click();
  }

  public async getAllMyCoursesButton() {
    return await this.driver.wait(
      until.elementLocated(By.css('a[title="Mis Cursos"]')),
      DEFAULT_DISPLAY_TIMEOUT,
    );
  }

  public async getLoginErrorMessageText() {
    return await this.driver
      .wait(until.elementLocated(By.css("span.error")), DEFAULT_DISPLAY_TIMEOUT)
      .getText();
  }

  public async isDisplayed(element: WebElement) {
    return await element.isDisplayed();
  }

  public async loginUser(studentId: string, password: string) {
    await this.openPage(AULA_VIRTUAL_URL);

    await this.typeInInput(STUDENT_ID_INPUT_NAME, studentId);
    await this.typeInInput(PASSWORD_INPUT_NAME, password);

    await this.clickLoginButton();
  }

  public async goToMyCoursesPage() {
    const allMyCoursesButton = await this.getAllMyCoursesButton();
    await this.clickElement(allMyCoursesButton);
  }

  public async openCourse(course: string) {
    const courseElement = await this.driver.wait(
      until.elementLocated(By.linkText(course)),
      DEFAULT_DISPLAY_TIMEOUT,
    );

    await this.scrollElementIntoView(courseElement);
    await this.clickElement(courseElement);
  }

  private async scrollElementIntoView(element: WebElement) {
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

  public async getCourseName() {
    return await this.driver
      .wait(until.elementLocated(By.css("p.aula")), DEFAULT_DISPLAY_TIMEOUT)
      .getText();
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

export async function initializeWebDriver(browser: string = Browser.CHROME) {
  return await new Builder().forBrowser(browser).build();
}

export async function terminateWebDriver(driver: WebDriver) {
  return await driver.quit();
}
