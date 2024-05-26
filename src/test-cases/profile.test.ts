import { envVariables } from "../config";
import { initializeWebDriver, terminateWebDriver } from "../utils";
import { ProfileTestUtils } from "../utils/profile";

describe("Profile", () => {
  let utils: ProfileTestUtils;

  beforeEach(async () => {
    const driver = await initializeWebDriver({
      maximizeWindow: true,
    });
    utils = new ProfileTestUtils(driver);
  });

  afterEach(async () => {
    await terminateWebDriver(utils.getDriver());
  });

  test("9 - Verificación de materia en listado de 'Perfiles de curso' desde perfil del usuario", async () => {
    // ARRANGE
    await utils.loginUser(envVariables.studentId, envVariables.password);

    // ACT
    await utils.openProfile();

    // ASSERT
    const coursesFound = await utils.getCoursesListedInProfile();
    const expectedCourseName = "GESTION DE LA CALIDAD Y AUDITORIA";

    await utils.saveOutputScreenshot("result-9.png");

    expect(coursesFound).toContain(expectedCourseName);
  });
});
