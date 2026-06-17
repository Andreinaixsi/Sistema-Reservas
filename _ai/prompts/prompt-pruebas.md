# Prompt para Pruebas

Con base en los requerimientos funcionales, casos de uso y reglas de negocio, genera casos de prueba funcionales. Incluye objetivo, precondición, pasos, datos de prueba, resultado esperado y criterio de aprobación.

## Contexto del Proyecto

- **Stack:** React + Vite + Tailwind (frontend), Python + FastAPI + SQLAlchemy (backend), PostgreSQL en Neon (base de datos).
- **Arquitectura:** Monolito modular, API REST + SPA, cliente-servidor.
- **Autenticación:** JWT generado en backend, almacenado en localStorage en frontend.
- **Validación de solapamiento:** Se hace en el backend (reservation.service.py) con una consulta SQL.
- **Aislamiento:** Multi-tenant lógico por organization_id.
- **Roles:** Usuario No Autenticado, Miembro (member), Administrador (admin).
