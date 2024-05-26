import { By, WebDriver, until } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import path from "path";
import fs from "fs";

import { DEFAULT_DISPLAY_TIMEOUT, TestUtils } from ".";

const FILE_DOWNLOAD_DIRECTORY = path.resolve(
  __dirname,
  "..",
  "..",
  "downloads",
);

export const getChromeDownloadOptions = () => {
  const options = new chrome.Options();
  return options.setUserPreferences({
    // Establece el directorio predeterminado para las descargas
    "download.default_directory": FILE_DOWNLOAD_DIRECTORY,
    // Desactiva el aviso de descarga para que los archivos se descarguen automáticamente
    "download.prompt_for_download": false,
    // Permite la actualización del directorio de descarga predeterminado
    "download.directory_upgrade": true,
    // Configura Chrome para abrir archivos PDF con una aplicación externa en lugar de la vista previa en el navegador
    "plugins.always_open_pdf_externally": true,
  });
};

export const cleanFileDownloadsDirectory = () => {
  const files = fs.readdirSync(FILE_DOWNLOAD_DIRECTORY);
  if (files.length > 0) {
    files.forEach((file) => {
      if (file !== ".gitkeep") {
        const filePath = path.join(FILE_DOWNLOAD_DIRECTORY, file);
        fs.unlinkSync(filePath);
      }
    });
  }
};

export class CourseTestUtils extends TestUtils {
  constructor(driver: WebDriver) {
    super(driver);
  }

  public async openCourse(course: string) {
    const courseElement = await this.findCourseByName(course);
    await this.scrollElementIntoView(courseElement);
    await this.clickElement(courseElement);
  }

  private async findCourseByName(course: string) {
    const courseElement = await this.driver.wait(
      until.elementLocated(By.linkText(course)),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    return courseElement;
  }

  public async getCourseName() {
    const courseElement = await this.driver.wait(
      until.elementLocated(By.css("p.aula")),
      DEFAULT_DISPLAY_TIMEOUT,
    );
    const couseName = await courseElement.getText();
    await this.scrollElementIntoView(courseElement);
    return couseName;
  }

  public async getListedActivityNames() {
    const activityElements = await this.driver.wait(
      until.elementsLocated(
        By.xpath("//a[img[@alt='Tarea'] and span[@class='instancename']]"),
      ),
      DEFAULT_DISPLAY_TIMEOUT,
    );

    if (activityElements.length > 0) {
      await this.scrollElementIntoView(activityElements[0]);
    }

    const activityNames = await this.getElementsText(activityElements);
    return activityNames;
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
    const filePath = path.join(FILE_DOWNLOAD_DIRECTORY, fileName);
    const fileDownloadTimeout = 60000;
    const fileExists = await this.waitForFileDownload(
      filePath,
      fileDownloadTimeout,
    );
    return fileExists;
  }

  private waitForFileDownload(path: string, timeout: number): Promise<boolean> {
    let invervalFileCheck = 1000;
    if (timeout < invervalFileCheck) {
      invervalFileCheck = timeout;
    }

    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        const fileExists = fs.existsSync(path);
        if (fileExists) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          resolve(true);
        }
      }, invervalFileCheck);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        resolve(false);
      }, timeout);
    });
  }
}
