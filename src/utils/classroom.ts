import { By, WebDriver, until } from "selenium-webdriver";

import { DEFAULT_DISPLAY_TIMEOUT, TestUtils } from ".";

export class ClassroomTestUtils extends TestUtils {
  constructor(driver: WebDriver) {
    super(driver);
  }

  public async isPaymentMessageDisplayed() {
    const message = "no deberá registrar deuda luego del día 10 de cada mes.";
    const messageElement = await this.driver.wait(
      until.elementLocated(By.xpath(`//em[contains(text(), '${message}')]`)),
    );
    await this.scrollElementIntoView(messageElement);
    return await messageElement.isDisplayed();
  }

  public async goToMyCoursesPage() {
    const allMyCoursesButton = await this.getAllMyCoursesButton();
    await this.clickElement(allMyCoursesButton);
  }

  public async getListedCoursesNames() {
    const courseElements = await this.driver.wait(
      until.elementsLocated(By.css("h2.title a")),
      DEFAULT_DISPLAY_TIMEOUT,
    );

    if (courseElements.length > 0) {
      await this.scrollElementIntoView(courseElements[0]);
    }

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
    await this.driver.sleep(1000);
    return await answerElement.isDisplayed();
  }
}
