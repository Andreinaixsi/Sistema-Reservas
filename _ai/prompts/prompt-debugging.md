# Prompt para Debugging

Analiza este error dentro del contexto de mi proyecto. Primero explica la causa probable, luego enumera verificaciones concretas, después propone una solución paso a paso y finalmente indica qué   debería actualizarse si el cambio afecta arquitectura, datos, API o flujo funcional.
## Contexto del Proyecto
- **Stack:** React + Vite + Tailwind (frontend), Python + FastAPI + SQLAlchemy (backend), PostgreSQL en Neon (base de datos).
- **Arquitectura:** Monolito modular con separación por dominios (auth/, users/, organizations/, resources/, reservations/).
- **Autenticación:** JWT generado en backend, almacenado en localStorage en frontend.
- **Validación de solapamiento:** Se hace en el backend (reservation.service.py) con una consulta SQL, no en la base de datos.
- **Base de datos:** PostgreSQL en Neon. No se usa restricción EXCLUDE.
- **Aislamiento:** Multi-tenant lógico por organization_id. Cada usuario solo ve datos de su organización.
