import { envVariables } from "../config";
import { initializeWebDriver, terminateWebDriver } from "../utils";
import {
  CourseTestUtils,
  cleanFileDownloadsDirectory,
  getChromeDownloadOptions,
} from "../utils/course";

describe("Course", () => {
  let utils: CourseTestUtils;
  const chromeDownloadOptions = getChromeDownloadOptions();

  beforeAll(() => {
    cleanFileDownloadsDirectory();
  });

  beforeEach(async () => {
    const driver = await initializeWebDriver({
      maximizeWindow: true,
      options: chromeDownloadOptions,
    });
    utils = new CourseTestUtils(driver);
  });

  afterEach(async () => {
    await terminateWebDriver(utils.getDriver());
  });

  test("3 - Titulo correcto al ingresar al aula de la materia", async () => {
    // ARRANGE
    const course = "GESTION DE LA CALIDAD Y AUDITORIA";
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.openCourse(course);

    // ASSERT
    const courseName = await utils.getCourseName();
    const expectedCourseName = /gestion de la calidad y auditoria/i;

    await utils.saveOutputScreenshot("result-3.png");

    expect(courseName).toMatch(expectedCourseName);
  });

  test("6 - Visualización correcta del icono de tarea", async () => {
    // ARRANGE
    const course = "GESTION DE LA CALIDAD Y AUDITORIA";
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.openCourse(course);

    // ASSERT
    const activityNamesFound = await utils.getListedActivityNames();
    const expectedActivityName = "Gestor de Incidencias y Defectos";

    await utils.saveOutputScreenshot("result-6.png");

    expect(activityNamesFound).toContain(expectedActivityName);
  });

  test("7 - Descarga exitosa de pdf", async () => {
    // ARRANGE
    const course = "GESTION DE LA CALIDAD Y AUDITORIA";
    const courseResourceName =
      "Introducción a la Calidad y Pruebas de Software";
    const downloadedFileName = "Clase 1.pdf";
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.openCourse(course);
    await utils.openCourseResource(courseResourceName);
    await utils.downloadPdf(downloadedFileName);

    // ASSERT
    const result = await utils.isFileDownloaded(downloadedFileName);
    await utils.saveOutputScreenshot("result-7.png");
    expect(result).toBe(true);
  });
});
