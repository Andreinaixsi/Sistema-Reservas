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
- ❌ Cancelación de reservas 
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


## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta [`_docs/`](./_docs/):

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta [`1_docs/`](./1_docs/):

| # | Documento | Descripción |
|:---|-----------|-------------|
| 1 | [Planteamiento del Problema](./1_docs/01-Planteamiento-del-Problema.md) | Descripción del problema a resolver |
| 2 | [Objetivos y Alcance](./1_docs/02-Objetivos-y-Alcance.md) | Objetivos del MVP y fuera de alcance |
| 3 | [Requerimientos Funcionales](./1_docs/03-Requerimientos-Funcionales.md) | 12 RF documentados (RF-001 a RF-012) |
| 4 | [Requerimientos No Funcionales](./1_docs/04-Requerimientos-No-Funcionales.md) | 5 RNF documentados (RNF-001 a RNF-005) |
| 5 | [Casos de Uso](./1_docs/05-Casos-de-Uso.md) | 12 CU documentados (CU-001 a CU-012) |
| 6 | [Reglas de Negocio](./1_docs/06-Reglas-de-negocio.md) | 11 RN documentadas (RN-001 a RN-011) |
| 7 | [Arquitectura General](./1_docs/07-Arquitectura-general.md) | Estilos arquitectónicos, componentes, flujo de datos |
| 8 | [Diseño Frontend](./1_docs/08-Diseño-Frontend.md) | Estructura de pantallas, navegación, componentes |
| 9 | [Diseño Backend](./1_docs/09-Diseño-Backend.md) | Módulos, capas, lógica de negocio, errores |
| 10 | [Modelo de Datos](./1_docs/10-Modelo-de-Datos.md) | 7 tablas, campos, relaciones, índices |
| 11 | [API e Interfaces](./1_docs/11-Api-e-Interfaces.md) | 17 endpoints documentados |
| 12 | [Plan de Pruebas](./1_docs/12-Plan-de-Pruebas.md) | 22 casos de prueba (CP-001 a CP-022) |
| 13 | [Manual Técnico](./_docs/13-Manual-de-Técnico.md) | Guía para desarrolladores |
| 14 | [Manual de Usuario](./1_docs/14-Manual-de-Usuario.md) | Guía para usuarios finales |
| 15 | [Bitácora de Avances](./1_docs/15-Bitácora-de-Avances.md) | Registro cronológico del desarrollo |


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


## 👥 Equipo

| Nombre |
|--------|
| José Sanchez-puga |
| Andreina Martinez|



## 📝 Licencia

Este proyecto es parte de un trabajo académico. 



## 📊 Resumen Final del Proyecto

| Indicador | Valor |
|-----------|-------|
| **Documentos** | 16 en `_docs/` + README + bitácora |
| **Requisitos Funcionales** | 12 (RF-001 a RF-012) |
| **Requisitos No Funcionales** | 5 (RNF-001 a RNF-005) |
| **Reglas de Negocio** | 11 (RN-001 a RN-011) |
| **Casos de Uso** | 12 (CU-001 a CU-012) |
| **Endpoints API** | 17 (API-001 a API-017) |
| **Tablas BD** | 7 |
| **Casos de Prueba** | 22 (CP-001 a CP-022) |
| **Agentes Antigravity** | 4 (Arquitecto, Backend, Frontend, Documentador) |
| **Prompts documentados** | 5 (Casos de Uso, Debugging, Pruebas, Requerimientos, Code Review) |
| **Registros en bitácora** | 7 |




