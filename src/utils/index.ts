import {
  Browser,
  Builder,
  By,
  WebDriver,
  WebElement,
  until,
} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";

const DEFAULT_DISPLAY_TIMEOUT = 10000;
const AULA_VIRTUAL_URL = "https://campusvirtual.ugd.edu.ar/moodle/login/";
const STUDENT_ID_INPUT_NAME = "username";
const PASSWORD_INPUT_NAME = "password";
const FILE_DOWNLOAD_DIR = path.resolve(__dirname, "..", "..", "downloads");

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
    const courseElement = await this.findCourseByName(course);
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

  private async findCourseByName(course: string) {
    const courseElement = await this.driver.wait(
      until.elementLocated(By.linkText(course)),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    return courseElement;
  }

  public async getListedCoursesNames() {
    const courseElements = await this.driver.wait(
      until.elementsLocated(By.css("h2.title a")),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    const courseNames = await this.getElementsText(courseElements);
    return courseNames;
  }

  public async getListedActivityNames() {
    const activityElements = await this.driver.wait(
      until.elementsLocated(
        By.xpath("//a[img[@alt='Tarea'] and span[@class='instancename']]"),
      ),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    const activityNames = await this.getElementsText(activityElements);
    return activityNames;
  }

  private async getElementsText(elements: WebElement[]) {
    const elementsText: string[] = [];
    for (const element of elements) {
      const elementText = await element.getText();
      elementsText.push(elementText);
    }
    return elementsText;
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

  public async openProfile() {
    const profileButtonElement = await this.driver.wait(
      until.elementLocated(
        By.xpath("//a[contains(@href, 'user/profile.php')]"),
      ),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    await this.clickElement(profileButtonElement);
  }

  public async getCoursesListedInProfile() {
    const courseElements = await this.driver.wait(
      until.elementsLocated(By.css("dl dd a")),
    );
    const courseNames = await this.getElementsText(courseElements);
    return courseNames;
  }

  public async goToFAQPage() {
    const faqButtonElement = await this.driver.wait(
      until.elementLocated(
        By.xpath("//a[contains(text(), 'PREGUNTAS FRECUENTES')]"),
      ),
    );
    await this.clickElement(faqButtonElement);
  }

  public async toggleQuestionAccordion(question: string) {
    const questionAccordionElement = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//button[contains(text(), '${question}')]`),
      ),
    );
    await this.clickElement(questionAccordionElement);
  }

  public async isAnswerDisplayed(answer: string) {
    const answerElement = await this.driver.wait(
      until.elementLocated(By.xpath(`//p[contains(text(), '${answer}')]`)),
    );
    await this.scrollElementIntoView(answerElement);
    return await answerElement.isDisplayed();
  }

  public async isPaymentMessageDisplayed() {
    const message = "no deberá registrar deuda luego del día 10 de cada mes.";
    const messageElement = await this.driver.wait(
      until.elementLocated(By.xpath(`//em[contains(text(), '${message}')]`)),
    );
    await this.scrollElementIntoView(messageElement);
    return await messageElement.isDisplayed();
  }

  public async openCourseResource(resourceName: string) {
    const resourceElement = await this.driver.wait(
      until.elementLocated(
        By.xpath(`//a[img and span[contains(text(), '${resourceName}')]]`),
      ),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    await this.clickElement(resourceElement);
  }

  public async downloadPdf(fileName: string) {
    const fileUrl = await this.driver
      .wait(
        until.elementLocated(By.xpath(`//a[contains(text(), '${fileName}')]`)),
      )
      .getAttribute("href");
    await this.driver.get(fileUrl);
  }

  public async isFileDownloaded(fileName: string) {
    const filePath = path.join(FILE_DOWNLOAD_DIR, fileName);
    const fileExists = await this.waitForFile(filePath, 60000);
    return fileExists;
  }

  private waitForFile(path: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const fileExists = fs.existsSync(path);
        if (fileExists) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          resolve(true);
        }
      }, 1000);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        resolve(false);
      }, timeout);
    });
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
  const options = new chrome.Options();
  options.setUserPreferences({
    "download.default_directory": FILE_DOWNLOAD_DIR,
    "download.prompt_for_download": false,
    "download.directory_upgrade": true,
    "plugins.always_open_pdf_externally": true,
  });

  return await new Builder()
    .forBrowser(browser)
    .setChromeOptions(options)
    .build();
}

export async function terminateWebDriver(driver: WebDriver) {
  return await driver.quit();
}
