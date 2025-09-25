# FRACTTAL-TEST-BACKEND
*Backend sólido y escalable para la gestión de tareas, categorías y etiquetas*

![last-commit](https://img.shields.io/github/last-commit/kelthaz/fracttal-test-backend?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/kelthaz/fracttal-test-backend?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/kelthaz/fracttal-test-backend?style=flat&color=0080ff)

### Construido con las siguientes tecnologías:
![Node.js](https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=flat&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-3178C6.svg?style=flat&logo=typeorm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000.svg?style=flat&logo=jsonwebtokens&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F.svg?style=flat&logo=dotenv&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white)

---

##  Tabla de Contenidos
- [Visión General](#visión-general)
- [Primeros Pasos](#primeros-pasos)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Uso](#uso)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Módulos Principales](#módulos-principales)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Licencia](#licencia)

---

## Visión General
**fracttal-test-backend** es el núcleo de la aplicación, diseñado con **Node.js y Express**, proporcionando una API RESTful escalable y segura.  

Se integra con **PostgreSQL** para la persistencia de datos, maneja autenticación basada en **JWT**, y sigue una arquitectura limpia para garantizar mantenibilidad, modularidad y separación de responsabilidades.  

Características principales:
- **API RESTful** con rutas bien definidas para tareas, categorías y etiquetas.  
- **Autenticación JWT** para acceso seguro a rutas protegidas.  
- **Base de datos PostgreSQL** con integración a través de Sequelize.  
- **Arquitectura Modular y Limpia**: separación en capas (controllers, routes, middlewares, domain, infraestructure).  
- **Configuración centralizada** con Dotenv para variables de entorno.  
- **Escalabilidad y mantenibilidad** aseguradas gracias a la organización del proyecto.  

---

##  Primeros Pasos

###  Requisitos Previos
Este proyecto requiere las siguientes dependencias:
- **Node.js**: v22.19.0  
- **Lenguaje:** JavaScript / TypeScript  
- **Gestor de Paquetes:** npm  
- **Base de Datos:** PostgreSQL  

> Este proyecto fue probado con **Node.js v22.19.0** y **PostgreSQL 17**.  
Se recomienda usar estas versiones para evitar problemas de compatibilidad.

---

###  Instalación
Clona el proyecto desde el repositorio e instala las dependencias:

1. **Clonar el repositorio:**
```sh
git clone https://github.com/kelthaz/fracttal-test-backend
```

2. **Entrar al directorio del proyecto:**
```sh
cd fracttal-test-backend
```

3. **Instalar dependencias con npm:**
```sh
npm install
```

4. **Configurar variables de entorno (.env):**
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=fracttal_test
JWT_SECRET=clave_super_segura
```
Tener en cuenta que debes cambiar los nombres a como tenngas tu usuario y DB en tu maquina local.


5. **Iniciar el servidor en desarrollo:**
```sh
npm run dev
```

6. **Una vez en ejecución, el backend estará disponible en:**
```
http://localhost:3000/api
```

### Scripts de Base de Datos
- El esquema completo de la base de datos se encuentra en [scripts/schema.sql](scripts/schema.sql).
- Incluye definición de tablas (usuarios, tareas, categorías, etiquetas) y relaciones.
- tener en cuenta que cuando se inicia la aplicacion se crea la BD automaticamente con el TypeOrm
- El Script donde estan las respuestas de las 10 preguntas con el respectivo query y respuesta de salida de ejemplos a resolver para la prueba estan en la siguiente ruta [scripts/questions.sql](scripts/questions.sql).
- El Script donde estan los queries con los que pueden hacer las siguientes ejecuciones: SELECT, INSERT, UPDATE, DELETE para cada tabla estan en la siguiente ruta [scripts/data.sql](scripts/data.sql).

**Ejemplos de endpoints:**
```sh
Auth:
POST /api/auth/login → login de usuario
POST /api/auth/register → registro de usuario

Tareas:
GET /api/tareas → listar tareas
POST /api/tareas → crear nueva tarea
PUT /api/tareas/:id → actualizar tarea
DELETE /api/tareas/:id → eliminar tarea

Categorías
GET /api/categorias → listar categorías
POST /api/categorias → crear nueva categoría

Etiquetas:
GET /api/tags → listar etiquetas
POST /api/tags → crear nueva etiqueta

```

**La estructura del proyecto sigue una arquitectura limpia:**
```sh
src/
│── domain/             # Entidades y modelos de dominio
│── infrastructure/     # Conexiones a DB, repositorios, configuración
│── presentation/         # Controllers, middlewares, routes y types
│── config/             # Configuración centralizada (dotenv, db, etc.)
│── server.js           # Punto de entrada principal

```
## Flujos Principales

### Flujo de Tareas
1. **Crear Tarea**: `POST /api/tareas`  
   - Incluye título, descripción
   - Middleware valida la estructura de la petición.  
   - Se almacena en la base de datos PostgreSQL.  

2. **Listar Tareas**: `GET /api/tareas`  
   - Permite filtrar por estado, prioridad, categoría o etiquetas.  
   - Soporta paginación y ordenamiento.  

3. **Actualizar Tarea**: `PUT /api/tareas/:id`  
   - Permite cambiar estado, título, descripción o etiquetas.  

4. **Eliminar Tarea**: `DELETE /api/tareas/:id`  
   - Elimina una tarea de forma permanente.  

---

### Flujo de Categorías
1. **Crear Categoría**: `POST /api/categorias`  
   - Nombre único requerido.  

2. **Listar Categorías**: `GET /api/categorias`  
   - Devuelve todas las categorías disponibles.  

3. **Asociar Categoría a Tarea**:  
   - Una tarea puede pertenecer a una sola categoría.  

---

### Flujo de Etiquetas
1. **Crear Etiqueta**: `POST /api/etiquetas`  
   - Nombre único requerido.  

2. **Listar Etiquetas**: `GET /api/etiquetas`  
   - Devuelve todas las etiquetas creadas.  

3. **Asociar Etiquetas a Tareas**:  
   - Relación many-to-many (una tarea puede tener varias etiquetas y viceversa).  

---

### Flujo de Autenticación
1. **Registro**: `POST /api/auth/register`  
   - Recibe nombre, email y contraseña.  
   - La contraseña se encripta con **bcrypt**.  

2. **Login**: `POST /api/auth/login`  
   - Devuelve un **JWT** firmado para mantener la sesión.  

3. **Validación de Token**: Middleware verifica el JWT en rutas protegidas.  

4. **Perfil de Usuario**: `GET /api/auth/profile`  
   - Devuelve información del usuario autenticado.  


**Módulos Principales**
### Auth
- **Manejo de login y registro.**
- **Encriptación de contraseñas.**
- **Generación y validación de JWT.**
### Tareas
- **CRUD de tareas.**
- **Filtros por estado, prioridad y fecha.**
- **Asociación de categorías y etiquetas.**
### Categorias
- **Creación y administración de categorías.**
- **Integración con tareas.**
### Etiquetas
- **Creación y administración de etiquetas.**
- **Relación many-to-many con tareas.**

## Guías de Desarrollo

### Buenas Prácticas
- **Clean Architecture:** Facilita escalabilidad y testeo.  
- **Error Handling Centralizado:** Middlewares para captura de errores.  
- **Variables de Entorno:** Nunca exponer credenciales en el código.  
- **Versionamiento de la API:** Preparado para escalabilidad futura.  

### Estilo de Código
- **Uso de TypeScript** (en evolución del proyecto).  
- **Convenciones consistentes** en nombres de carpetas y archivos.  

---

## Licencia
- **Este proyecto fue desarrollado como parte de la prueba técnica para Fracttal.**  
- **Uso libre** para fines educativos y de aprendizaje.  




