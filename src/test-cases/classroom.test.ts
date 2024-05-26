import { envVariables } from "../config";
import { initializeWebDriver, terminateWebDriver } from "../utils";
import { ClassroomTestUtils } from "../utils/classroom";

describe("Classroom", () => {
  let utils: ClassroomTestUtils;

  beforeEach(async () => {
    const driver = await initializeWebDriver({
      maximizeWindow: true,
    });
    utils = new ClassroomTestUtils(driver);
  });

  afterEach(async () => {
    await terminateWebDriver(utils.getDriver());
  });

  test("4 - Visualización de recordatorio de pago de cuota al iniciar sesión", async () => {
    await utils.loginUser(envVariables.studentId, envVariables.password);
    const result = await utils.isPaymentMessageDisplayed();
    await utils.saveOutputScreenshot("result-4.png");
    expect(result).toBe(true);
  });

  test("5 - Búsqueda de materia exitosa desde 'Todos los cursos'", async () => {
    // ARRANGE
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.goToMyCoursesPage();

    // ASSERT
    const courseNamesFound = await utils.getListedCoursesNames();
    const expectedCourseName = "GESTION DE LA CALIDAD Y AUDITORIA";

    await utils.saveOutputScreenshot("result-5.png");

    expect(courseNamesFound).toContain(expectedCourseName);
  });

  test("8 - Verificación de preguntas frecuentes", async () => {
    // ARRANGE
    const question = "¿Todos tenemos USUARIO?";
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.goToFAQPage();
    await utils.toggleQuestionAccordion(question);

    // ASSERT
    const expectedAnswer =
      "No, solo aquellos alumnos que Secretaria Acádemica valide que estén en regla con la Universidad.";
    const isAnswerDisplayed = await utils.isAnswerDisplayed(expectedAnswer);

    await utils.saveOutputScreenshot("result-8.png");

    expect(isAnswerDisplayed).toBe(true);
  });
});
