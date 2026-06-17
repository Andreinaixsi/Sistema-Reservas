# Sistema Web de Gestión y Control de Reservas

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Neon](https://img.shields.io/badge/Cloud-Neon-00E599?logo=neon)](https://neon.tech/)
[![Tailwind](https://img.shields.io/badge/CSS-Tailwind-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Descripción

Aplicación web que permite a diferentes organizaciones (condominios, universidades, empresas, centros deportivos) gestionar de forma centralizada la reserva de sus recursos compartidos (salones, canchas, salas de reuniones, etc.), eliminando conflictos de horarios y el uso de herramientas informales.

### Características principales

- 🔐 Autenticación segura con JWT
- 🏢 Creación y gestión de organizaciones (multi-tenant)
- 📦 Gestión de recursos (CRUD) con etiquetas personalizadas
- 📅 Reservas con validación automática de conflictos de horarios
- ❌ Cancelación de reservas con control de permisos
- 📊 Visualización de disponibilidad con timezone de la organización
- 🔗 Sistema de invitación por código para unirse a organizaciones
- 👤 Edición de perfil de usuario
- 🎨 Interfaz responsiva y usable (máximo 3 clics para reservar)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Estado** | React Query + useState |
| **Backend** | Python + FastAPI |
| **ORM** | SQLAlchemy |
| **Base de Datos** | PostgreSQL (Neon) |
| **Autenticación** | JWT + bcrypt |

---

## 📁 Estructura del Proyecto

```
reservas-app/
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticación (JWT)
│   │   ├── users/          # Perfil de usuario
│   │   ├── organizations/  # CRUD de organizaciones y miembros
│   │   ├── resources/      # CRUD de recursos
│   │   ├── reservations/   # Lógica de reservas
│   │   ├── common/         # Conexión BD, errores, middleware
│   │   └── app.py          # Punto de entrada
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── features/       # Funcionalidades (auth, resources, reservations...)
│   │   ├── shared/         # Componentes reutilizables (Navbar, Button, Modal...)
│   │   └── app/            # Rutas y estado global
│   └── package.json
├── database/
│   └── schema.sql          # Script de creación de la base de datos
├── docs/                   # Documentación completa del proyecto (16 documentos)
├── assets/
│   └── diagramas/          # Diagramas de arquitectura, ER, casos de uso
├── agents.md               # Definición de agentes Antigravity
├── skills/                 # Reglas para agentes
├── bitacora.md             # Bitácora de avances
├── .env.example            # Ejemplo de variables de entorno
└── README.md               # Este archivo
```

---

## 🚀 Instalación y Configuración

### Requisitos previos

- **Python 3.10+**
- **Node.js 18+**
- **npm** o **yarn**
- Cuenta en [Neon](https://neon.tech) (gratuita)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/reservas-app.git
cd reservas-app
```

---

### 2. Configurar la Base de Datos

#### Opción A: Usar Neon (recomendado)

1. Crea una cuenta gratuita en [neon.tech](https://neon.tech)
2. Crea un proyecto y copia la **URL de conexión**
3. Ejecuta el script SQL en pgAdmin o DBeaver:
   ```bash
   psql "TU_URL_DE_NEON" -f database/schema.sql
   ```

#### Opción B: Usar PostgreSQL local

1. Instala PostgreSQL
2. Crea una base de datos llamada `reservasdb`
3. Ejecuta el script:
   ```bash
   psql -U postgres -d reservasdb -f database/schema.sql
   ```

---

### 3. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tu URL de Neon:
# DATABASE_URL=postgresql://usuario:contraseña@host/neondb?sslmode=require
# JWT_SECRET_KEY=tu_clave_secreta

# Ejecutar el servidor
uvicorn src.app:app --reload
```

El backend estará disponible en: `http://localhost:8000`

📖 Documentación automática de la API: `http://localhost:8000/docs`

---

### 4. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

---

## 📊 Datos de Prueba

El script SQL incluye datos de prueba:

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin Principal | admin@test.com | test123 | Administrador |
| Usuario Normal | usuario@test.com | test123 | Miembro |

**Organización:** Edificio Las Palmas (Código de invitación: `ABC12345`)

**Recursos:** Salón de Eventos, Piscina, Gimnasio

---

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta [`docs/`](./docs/):

| Documento | Descripción |
|-----------|-------------|
| [📄 Índice](./docs/00-index.md) | Índice completo de la documentación |
| [📋 Reglas de Documentación](./docs/00-reglas-documentacion.md) | Reglas para mantener la documentación |
| [📝 Planteamiento del Problema](./docs/01-planteamiento-problema.md) | Descripción del problema a resolver |
| [🎯 Objetivos y Alcance](./docs/02-objetivos-alcance.md) | Objetivos del MVP |
| [✅ Requisitos Funcionales](./docs/03-requisitos-funcionales.md) | 12 RF documentados |
| [📐 Requisitos No Funcionales](./docs/04-requisitos-no-funcionales.md) | 5 RNF documentados |
| [📏 Reglas de Negocio](./docs/05-reglas-negocio.md) | 11 RN documentadas |
| [🏗️ Arquitectura del Sistema](./docs/06-arquitectura-sistema.md) | Arquitectura general y estilos |
| [🗄️ Modelo de Base de Datos](./docs/07-modelo-base-datos.md) | 7 tablas documentadas |
| [🔧 Stack Tecnológico](./docs/08-stack-tecnologico.md) | Tecnologías utilizadas |
| [📅 Plan de Desarrollo](./docs/09-plan-desarrollo.md) | 8 fases del MVP |
| [👤 Casos de Uso](./docs/10-casos-de-uso.md) | 12 CU documentados |
| [🔌 API e Interfaces](./docs/11-api-interfaces.md) | 17 endpoints documentados |
| [🎨 Diseño Frontend](./docs/12-diseno-frontend.md) | Estructura de pantallas |
| [⚙️ Diseño Backend](./docs/13-diseno-backend.md) | Módulos y capas |
| [🧪 Plan de Pruebas](./docs/14-plan-pruebas.md) | 22 casos de prueba |
| [📖 Manual de Usuario](./docs/15-manual-usuario.md) | Guía para usuarios finales |
| [🤖 Agentes Antigravity](./docs/16-agentes-antigravity.md) | Definición de agentes de IA |

---

## 🧪 Ejecutar Pruebas

```bash
cd backend

# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Ejecutar pruebas
pytest tests/
```

---

## 🐛 Reportar Problemas

Si encuentras un error o tienes una sugerencia:

1. Revisa la [bitácora de avances](./bitacora.md) para ver si ya está documentado.
2. Revisa el [plan de pruebas](./docs/14-plan-pruebas.md) para ver si tiene un caso asociado.
3. Crea un issue en el repositorio.

---

## 👥 Equipo

| Rol | Nombre |
|-----|--------|
| Base de Datos | [Tu nombre] |
| Backend | [Nombre del compañero] |

---

## 📝 Licencia

Este proyecto es parte de un trabajo académico. Todos los derechos reservados © 2026.

---

## 🙏 Agradecimientos

- **Antigravity** - Plataforma de desarrollo asistido por IA
- **DeepSeek** - Asistente de documentación y análisis
- **Neon** - Base de datos PostgreSQL en la nube

---

**Desarrollado con ❤️ como proyecto final de semestre**
```

---

## 📓 Entrada en la bitácora

```markdown
## Registro #17 — Creación del README.md

**Fecha:** 17 de junio de 2026

**Avance realizado:**
- Creación del README.md completo para el repositorio.
- Inclusión de badges del stack tecnológico.
- Documentación de pasos de instalación y configuración.
- Tabla de datos de prueba para evaluadores.
- Índice de los 16 documentos en docs/.
- Sección de agradecimientos y equipo.

**Documentos actualizados:**
- `README.md` — Nuevo ✅

**Código modificado:**
- No aplica (documentación)

**Problemas encontrados:**
- Ninguno

**Próximo paso:**
- Hacer commit final y push al repositorio.
- Preparar demo para la defensa del proyecto.
```

---

## 📊 Resumen Final del Proyecto

| Indicador | Valor |
|-----------|-------|
| **Documentos** | 16 en `docs/` + README + bitácora |
| **Requisitos Funcionales** | 12 (RF-001 a RF-012) |
| **Requisitos No Funcionales** | 5 (RNF-001 a RNF-005) |
| **Reglas de Negocio** | 11 (RN-001 a RN-011) |
| **Casos de Uso** | 12 (CU-001 a CU-012) |
| **Endpoints API** | 17 (API-001 a API-017) |
| **Tablas BD** | 7 |
| **Casos de Prueba** | 22 (CP-001 a CP-022) |
| **Agentes Antigravity** | 4 (Arquitecto, Backend, Frontend, Documentador) |
| **Prompts documentados** | 5 (Casos de Uso, Debugging, Pruebas, Requerimientos, Code Review) |
| **Registros en bitácora** | 17 |

---

¿Necesitas ajustar algo del README o quieres que genere el commit final para subir todo a GitHub?
