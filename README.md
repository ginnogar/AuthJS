# Sistema de Autenticación y Autorización 🔒💻

Este proyecto es un sistema básico de autenticación y autorización, diseñado para permitir el registro, inicio de sesión y control de acceso basado en roles de usuario.

## Características 🌟

- **Registro e inicio de sesión:** Los usuarios pueden registrarse y autenticar su identidad.
- **Protección de contraseñas:** Uso de hashing seguro con `bcrypt`.
- **Autenticación basada en JWT:** Tokens JSON Web para sesiones escalables.
- **Control de acceso por roles:** Rutas protegidas para usuarios y administradores.
- **Seguridad adicional:**
  - Tokens CSRF para prevenir ataques de Cross-Site Request Forgery.
  - Limitación de intentos fallidos para prevenir ataques de fuerza bruta.
  - Cabeceras de seguridad configuradas con `helmet`.

## Instalación 🚀

1. Clona el repositorio:
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_PROYECTO>
2. Instala las dependencias:
npm install
3. Configura las variables de entorno:
Crea un archivo .env en la raíz del proyecto y añade:
PORT=3000
JWT_SECRET=mi_clave_secreta_segura
4. Inicia el servidor:
npx nodemon src/app.js

## Uso 
Rutas principales
1. Registro de usuarios
Método: POST
Endpoint: /auth/register
Body (JSON):
{
    "email": "usuario@example.com",
    "password": "123456"
}
2. Inicio de sesión
Método: POST
Endpoint: /auth/login
Body (JSON):
{
    "email": "usuario@example.com",
    "password": "123456"
}
3. Rutas protegidas
Acceso al perfil del usuario autenticado:
- Método: GET
- Endpoint: /auth/profile
Acceso solo para administradores:
- Método: GET
- Endpoint: /auth/admin
Seguridad
Protección contra XSS y CSRF: Implementada con helmet y csurf.
Intentos de inicio de sesión limitados: Máximo 5 intentos fallidos por usuario, con un bloqueo temporal de 5 minutos.
Tecnologías utilizadas
Backend:
Node.js
Express
Autenticación y seguridad:
jsonwebtoken
bcrypt
helmet
csurf
Base de datos:
SQLite con Sequelize

## Estructura del proyecto
• src/
  app.j: Punto de entrada del servidor
    middewares/: Middlewares de autenticación y roles
      authMiddleware.js
      roleMiddleware.js
      loginLimiter.js
  modeels/: Modelos de base de datos
    User.js
    database.js
  routes/: Rutas principales
    authRoutes.js

## Contribuciones 🤝
Las contribuciones son bienvenidas. Si tienes ideas para mejorar la aplicación, crea un fork del repositorio y envía un pull request.

## Autor 🧑‍💻
Desarrollado por Ginno como parte de un desafío de programación.
