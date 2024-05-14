# Instalación y Ejecución del Proyecto

Usar la versión 20 de Node.js

Ejecutar `npm install` en consola para instalar las dependencias.

Ejecutar `npm run test` en consola para corrar los tests del proyecto luego de instalar las dependencias.


# Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto y agregarle los valores para las variables de entorno que están definidas en el archivo `.env.example`.

El objetivo de estas variables es poder ejecutar tests que requieran de datos sensibles como las credenciales para el inicio de sesión, sin tener que especificar sus valores dentro del código fuente.

Para acceder a los valores de dichas variables durante la ejecución de los tests, se debe importarlas del archivo `config.ts`.