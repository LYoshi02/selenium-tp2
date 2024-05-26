# Estructura del Proyecto
En la raíz del proyecto se podrán encontrar las siguientes carpetas:
* **downloads:** guarda los archivos que se descarguen durante la ejecución de ciertos casos de prueba.
* **output:** guarda capturas de pantallas realizadas durante la ejecución de las pruebas y un archivo HTML de reporte de los resultados de las pruebas ejecutadas.
* **src:** contiene los archivos de código fuente donde se implementan los distintos casos de pruebas y las clases y funciones de utilidad.


# Agrupación de Casos de Prueba
Para la implementación de los casos de prueba en Selenium se agruparon los diez casos de la siguiente forma:
* Sesión del usuario (Login)
  * 1 - Inicio de sesión exitoso con credenciales válidas.
  * 2 - Error en inicio de sesión con credenciales inválidas.
  * 10 - Verificación de cierre de sesión exitoso.
* Pantalla principal del aula, todos los cursos y preguntas frecuentes (Classroom)
  * 4 - Visualización de recordatorio de pago de cuota al iniciar sesión.
  * 5 - Búsqueda de materia exitosa desde 'Todos los cursos'.
  * 8 - Verificación de preguntas frecuentes.
* Aula de una materia (Course)
  * 3 - Titulo correcto al ingresar al aula de la materia.
  * 6 - Visualización correcta del icono de tarea.
  * 7 - Descarga exitosa de pdf.
* Perfil del alumno (Profile)
  * 9 - Verificación de materia en listado de 'Perfiles de curso' desde perfil del usuario.


# Tecnologías Utilizadas
Para el proyecto se utilizaron las siguientes tecnologías:
* Node.js
* TypeScript
* Selenium
* Jest


# Instalación del Proyecto
Usar la versión 20 de Node.js

Ejecutar `npm install` en consola para instalar las dependencias.


# Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto y agregarle los valores para las variables de entorno que están definidas en el archivo `.env.example`.

El objetivo de estas variables es poder ejecutar tests que requieran de datos sensibles como las credenciales para el inicio de sesión, sin tener que especificar sus valores dentro del código fuente.

Para acceder a los valores de dichas variables durante la ejecución de los tests, se debe importarlas del archivo `config.ts`.


# Ejecución del Proyecto
Ejecutar `npm run test` en consola para corrar los tests del proyecto luego de instalar las dependencias y configurar las variables de entorno.
