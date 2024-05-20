import { envVariables } from "../config";
import { TestUtils, initializeWebDriver, terminateWebDriver } from "../utils";

const AULA_VIRTUAL_URL = "https://campusvirtual.ugd.edu.ar/moodle/login/";
const STUDENT_ID_INPUT_NAME = "username";
const PASSWORD_INPUT_NAME = "password";

describe("Casos de prueba para el aula virtual", () => {
  let utils: TestUtils;

  beforeEach(async () => {
    const driver = await initializeWebDriver();
    driver.manage().window().maximize();
    utils = new TestUtils(driver);
  });

  afterEach(async () => {
    await terminateWebDriver(utils.getDriver());
  });

  test("1 - Inicio de sesión exitoso con credenciales válidas", async () => {
    // ARRANGE
    const studentId = envVariables.studentId;
    const password = envVariables.password;

    // ACT
    await utils.openPage(AULA_VIRTUAL_URL);

    await utils.typeInInput(STUDENT_ID_INPUT_NAME, studentId);
    await utils.typeInInput(PASSWORD_INPUT_NAME, password);

    await utils.clickLoginButton();

    // ASSERT
    const allMyCoursesButton = await utils.getAllMyCoursesButton();
    const isButtonDisplayed = await utils.isDisplayed(allMyCoursesButton);

    await utils.saveOutputScreenshot("result-1.png");

    expect(isButtonDisplayed).toBe(true);
  });

  test("2 - Error en inicio de sesión con credenciales inválidas", async () => {
    // ARRANGE
    const invalidStudentId = "99999";
    const invalidPassword = "abcde";

    // ACT
    await utils.openPage(AULA_VIRTUAL_URL);

    await utils.typeInInput(STUDENT_ID_INPUT_NAME, invalidStudentId);
    await utils.typeInInput(PASSWORD_INPUT_NAME, invalidPassword);

    await utils.clickLoginButton();

    // ASSERT
    const logginErrorMessage = await utils.getLoginErrorMessageText();
    const expectedMessage = /Datos erróneos/i;

    await utils.saveOutputScreenshot("result-2.png");

    expect(logginErrorMessage).toMatch(expectedMessage);
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

  test("4 - Visualización de recordatorio de pago de cuota al iniciar sesión", async () => {
    // ARRANGE
    // ACT
    // ASSERT
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

  test("10 - Verificación de cierre de sesión exitoso", async () => {
    // ARRANGE
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.logoutUser();

    // ASSERT
    await utils.saveOutputScreenshot("result-10.png");
    expect(await utils.isLoginHeadingDisplayed()).toBe(true);
  });
});
