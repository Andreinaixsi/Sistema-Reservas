# Manual Técnico - Sistema Web de Gestión y Control de Reservas

Este documento contiene la especificación técnica, requisitos, pasos de instalación y configuración para ejecutar y mantener el **Sistema Web de Gestión y Control de Reservas** de recursos multi-organización.

---

## 1. Requisitos para Ejecutar el Proyecto

El sistema está dividido en dos partes principales: el backend desarrollado en Python con **FastAPI** y el frontend desarrollado en Javascript utilizando **React**, **Vite** y **TailwindCSS**.

### Lenguaje y Runtime
*   **Backend (API REST):**
    *   **Lenguaje:** Python 3.10 o superior.
    *   **Gestor de paquetes:** `pip` (incluido en Python).
    *   **Entorno Virtual:** `venv` o `virtualenv` recomendado.
*   **Frontend (UI):**
    *   **Lenguaje:** Javascript (ES6+) / React 18.
    *   **Runtime:** Node.js v18.x o superior (LTS recomendado).
    *   **Gestor de paquetes:** `npm` v9.x o superior (o `yarn` / `pnpm`).

### Base de Datos
*   **Motor:** PostgreSQL v14 o superior (el sistema soporta bases de datos locales o servicios en la nube como Neon DB).
*   **ORM:** SQLAlchemy 2.0+ (los modelos se generan y mapean de forma automática al iniciar la API).

### Herramientas Necesarias (Herramientas de Desarrollo)
*   **Editor de código:** Visual Studio Code o cualquier IDE de preferencia con soporte para Python y Javascript.
*   **Cliente de base de datos:** pgAdmin, DBeaver o TablePlus para administración de PostgreSQL (opcional).
*   **Pruebas de API:** Postman, Insomnia o la propia interfaz interactiva Swagger UI de FastAPI (`/docs`).
*   **Control de versiones:** Git.

### Dependencias Principales
*   **Backend (`backend/requirements.txt`):**
    *   `fastapi` (Framework web asíncrono)
    *   `uvicorn` (Servidor ASGI para producción y desarrollo)
    *   `sqlalchemy` (Mapeo objeto-relacional ORM)
    *   `psycopg2-binary` (Driver para conexión a PostgreSQL)
    *   `passlib[bcrypt]` (Hachado de contraseñas de usuarios)
    *   `python-jose[cryptography]` (Manejo de JSON Web Tokens - JWT)
    *   `pydantic-settings` (Gestión de configuración a través de variables de entorno)
    *   `pytest` (Suite para pruebas unitarias y de integración)
*   **Frontend (`frontend/package.json`):**
    *   `react` y `react-dom` (Biblioteca de interfaz de usuario)
    *   `vite` (Herramienta de empaquetado rápido)
    *   `@tanstack/react-query` (Gestión de estado asíncrono y peticiones HTTP)
    *   `axios` (Cliente HTTP para solicitudes al backend)
    *   `lucide-react` (Biblioteca de iconos)
    *   `react-router-dom` (Enrutamiento del lado del cliente)
    *   `tailwindcss` y `postcss` (Estilos y diseño responsivo)

---

## 2. Instalación Paso a Paso

Sigue estas instrucciones secuenciales para clonar, instalar y levantar el entorno de desarrollo local.

### Paso 1: Clonar y Acceder al Repositorio
Abre tu terminal favorita, clona el repositorio del proyecto y navega hacia el directorio raíz:
```bash
git clone <url-del-repositorio>
cd sistema-de-reservas
```

### Paso 2: Instalación del Backend (API REST)
1.  **Navegar al directorio del backend:**
    ```bash
    cd backend
    ```
2.  **Crear un entorno virtual de Python:**
    *   En Windows:
        ```bash
        python -m venv venv
        ```
    *   En macOS / Linux:
        ```bash
        python3 -m venv venv
        ```
3.  **Activar el entorno virtual:**
    *   En Windows (PowerShell):
        ```powershell
        .\venv\Scripts\Activate.ps1
        ```
    *   En Windows (CMD):
        ```cmd
        .\venv\Scripts\activate.bat
        ```
    *   En macOS / Linux (Terminal):
        ```bash
        source venv/bin/activate
        ```
4.  **Instalar las dependencias de Python:**
    ```bash
    pip install -r requirements.txt
    ```

### Paso 3: Instalación del Frontend (Aplicación React)
1.  **Abrir una nueva terminal y navegar al directorio del frontend:**
    ```bash
    cd frontend
    ```
2.  **Instalar las dependencias de Node.js:**
    ```bash
    npm install
    ```
3. ** Ejecutar el servidor de desarrollo **
     ```bash
    npm run dev
     ```
### Paso 4: Inicialización de la Base de Datos
El proyecto está configurado para conectarse a una base de datos PostgreSQL.
1.  Asegúrate de tener un servidor de PostgreSQL activo (local o remoto).
2.  Crea una base de datos vacía (por ejemplo, llamada `sistema_reservas`).
3.  Las tablas se crearán automáticamente al arrancar la API REST por primera vez gracias al script de inicio `lifespan` en `main.py` (`Base.metadata.create_all(bind=engine)`).

---

## 3. Configuración

### Variables de Entorno (`.env`)

Tanto el backend como el frontend requieren configuraciones específicas para el entorno de desarrollo y producción.

#### 1. Configuración del Backend (`backend/.env`)
Debes crear un archivo llamado `.env` dentro de la carpeta `backend/` con las siguientes variables:

```env
# URL de conexión a la base de datos PostgreSQL
DATABASE_URL=postgresql://<usuario>:<contraseña>@<host>:<puerto>/<nombre_db>

# Clave secreta para la firma y cifrado de tokens JWT
SECRET_KEY=super-secret-key-for-development-change-in-production

# Algoritmo de cifrado JWT
ALGORITHM=HS256

# Tiempo de expiración del token JWT en minutos (ej: 1440 minutos = 24 horas)
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

*   **Nota sobre el fallback:** Si no se proporciona un archivo `.env`, el backend tiene un fallback por defecto configurado para conectarse a una base de datos Neon DB de desarrollo y usará la clave secreta `"super-secret-key-for-development-change-in-production"`. Se recomienda encarecidamente cambiar estos valores en entornos de producción.

#### 2. Configuración del Frontend
El frontend realiza las peticiones utilizando una ruta relativa (`/api/v1`) administrada por un proxy inverso configurado en Vite (`frontend/vite.config.js`). Esto evita problemas de CORS y configuraciones complejas de variables de entorno en desarrollo.
*   Si se despliega en producción, las llamadas HTTP seguirán resolviéndose contra `/api/v1` en la misma URL de origen, requiriendo un servidor como Nginx configurado para direccionar la ruta `/api` al backend y `/` al frontend.

---

### Puertos y Servicios Utilizados

El sistema utiliza los siguientes puertos de forma predeterminada:

| Componente | Servicio / Ejecutable | Puerto por Defecto | Descripción |
| :--- | :--- | :---: | :--- |
| **Frontend** | Vite Dev Server | `5173` | Servidor de desarrollo de React. |
| **Backend** | Uvicorn ASGI Server | `8000` | API REST de FastAPI. |
| **Base de Datos**| PostgreSQL | `5432` | Servidor relacional de base de datos. |

---

### Ejecución de Servicios en Modo de Desarrollo

Una vez configurados los parámetros previos, puedes iniciar ambos servicios ejecutando los siguientes comandos en sus respectivas terminales:

#### Ejecutar el Backend (con Entorno Virtual Activado)
Desde el directorio `backend`:
```bash
python main.py
```
*Alternativamente:*
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Una vez iniciado, podrás interactuar con la documentación auto-generada de la API en:
*   Swagger UI: `http://localhost:8000/docs`
*   Redoc UI: `http://localhost:8000/redoc`

#### Ejecutar el Frontend
Desde el directorio `frontend`:
```bash
npm run dev
```
La aplicación web estará disponible en el navegador en la dirección:
*   `http://localhost:5173`

---

## 4. Estructura de la Base de Datos (Modelos)

La persistencia de datos está estructurada de la siguiente manera:

*   **`users`**: Almacena información de los usuarios registrados (`email`, `password_hash`, `full_name`).
*   **`organizations`**: Registra las organizaciones creadas (`name`, `type`, `invite_code`, etiquetas personalizadas).
*   **`organization_members`**: Tabla relacional con roles (`admin`, `member`) que asocia usuarios con sus organizaciones.
*   **`organization_settings`**: Ajustes de reserva por organización (`max_days_ahead`, horario permitido de apertura/cierre, zona horaria).
*   **`resources`**: Recursos individuales que se pueden reservar (`name`, `description`, `capacity`, `is_active`).
*   **`reservations`**: Historial y control de reservas realizadas por los usuarios para recursos en intervalos específicos (`start_time`, `end_time`, `status`).

---

## 5. Ejecución de Pruebas Unitarias

Para asegurar que todo funcione correctamente después de la instalación, puedes correr los tests unitarios automatizados del backend:

1.  Navega a la carpeta `backend/`.
2.  Asegúrate de tener el entorno virtual activado.
3.  Ejecuta `pytest` utilizando el módulo de Python para resolver correctamente las rutas de importación:
    ```bash
    python -m pytest
    ```
