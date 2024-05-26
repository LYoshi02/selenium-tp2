import { By, WebDriver, until } from "selenium-webdriver";

import { DEFAULT_DISPLAY_TIMEOUT, TestUtils } from ".";

export class ProfileTestUtils extends TestUtils {
  constructor(driver: WebDriver) {
    super(driver);
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

    if (courseElements.length > 0) {
      await this.scrollElementIntoView(courseElements[0]);
    }

    const courseNames = await this.getElementsText(courseElements);
    return courseNames;
  }
}
