import fs from "fs";
import path from "path";
import { Builder, By, Key, until } from "selenium-webdriver";

describe("Pruebas con Selenium y Jest", () => {
  describe("Inicio de sesión", () => {
    test("Muestra mensaje de error al ingresar credenciales inválidas", async () => {
      const driver = await new Builder().forBrowser("chrome").build();

      // Abre el aula virtual
      await driver.get(
        "https://campusvirtual.ugd.edu.ar/moodle/login/index.php",
      );

      // Busca los inputs de usuario y contraseña
      const usernameInput = await driver.findElement(By.name("username"));
      const passwordInput = await driver.findElement(By.name("password"));

      // Ingresa credenciales inválidas
      await usernameInput.sendKeys("99999");
      await passwordInput.sendKeys("99999");

      // Simula la tecla "Enter" para hacer submit
      await passwordInput.sendKeys(Key.RETURN);

      // Espera a que la página de resultados se cargue
      await driver.wait(
        until.elementLocated(By.id("loginerrormessage")),
        10000,
      );

      // Toma una screenshot
      const screenshot = await driver.takeScreenshot();
      const filePath = path.join(__dirname, "..", "output", "aula_virtual.png");
      fs.writeFileSync(filePath, screenshot, "base64");

      // Obtiene un elemento con la clase "error"
      let errorMessage = await driver.findElement({
        // id: "loginerrormessage",
        className: "error",
      });

      // Verificar que el texto del mensaje de error matchea con la regex definida
      expect(await errorMessage.getText()).toMatch(/Datos erróneos/i);

      await driver.quit();
    });
  });
});
