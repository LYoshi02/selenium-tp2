import { envVariables } from "../config";
import {
  AULA_VIRTUAL_URL,
  initializeWebDriver,
  terminateWebDriver,
} from "../utils";
import { LoginTestUtils } from "../utils/login";

describe("Login", () => {
  let utils: LoginTestUtils;

  beforeEach(async () => {
    const driver = await initializeWebDriver({
      maximizeWindow: true,
    });
    utils = new LoginTestUtils(driver);
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

    await utils.typeInStudentIdInput(studentId);
    await utils.typeInPasswordInput(password);

    await utils.clickLoginButton();

    // ASSERT
    const isButtonDisplayed = await utils.isAllMyCoursesButtonDisplayed();

    await utils.saveOutputScreenshot("result-1.png");

    expect(isButtonDisplayed).toBe(true);
  });

  test("2 - Error en inicio de sesión con credenciales inválidas", async () => {
    // ARRANGE
    const invalidStudentId = "99999";
    const invalidPassword = "abcde";

    // ACT
    await utils.openPage(AULA_VIRTUAL_URL);

    await utils.typeInStudentIdInput(invalidStudentId);
    await utils.typeInPasswordInput(invalidPassword);

    await utils.clickLoginButton();

    // ASSERT
    const logginErrorMessage = await utils.getLoginErrorMessageText();
    const expectedMessage = /Datos erróneos/i;

    await utils.saveOutputScreenshot("result-2.png");

    expect(logginErrorMessage).toMatch(expectedMessage);
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
