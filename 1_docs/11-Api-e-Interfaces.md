##  API e Interfaces

###  Autenticación (`/api/v1/auth`)

| | | |
| :--- | :--- | :--- |
| **API-001** | **Registro de Usuario** | |
| Método | `POST` | |
| Ruta | `/api/v1/auth/register` | |
| Objetivo | Crear una cuenta de usuario sin organización (RF-001). | |
| Entrada (JSON) | `{ "email": "user@example.com", "password": "secreta", "full_name": "Juan" }` | |
| Salida (201) | `{ "id": 1, "email": "user@example.com", "full_name": "Juan", "created_at": "..." }` | |
| Errores | `400` (email inválido), `409` (email ya registrado) | |
| Autenticación | No | |

| | | |
| :--- | :--- | :--- |
| **API-002** | **Registro de Organización + Admin** | |
| Método | `POST` | |
| Ruta | `/api/v1/auth/register-org` | |
| Objetivo | Crear organización, usuario administrador y membresía (RF-002). | |
| Entrada (JSON) | `{ "user": { "email": "admin@org.com", "password": "secreta", "full_name": "Admin" }, "organization": { "name": "Mi Empresa", "type": "empresa", "resource_label_singular": "Sala", "resource_label_plural": "Salas" } }` (etiquetas personalizadas opcionales) | |
| Salida (201) | `{ "user": { "id": 1, ... }, "organization": { "id": 1, "name": "Mi Empresa", "type": "empresa", "resource_label_singular": "Sala", "resource_label_plural": "Salas", "invite_code": "ORG123" }, "role": "admin" }` | |
| Errores | `400` (validación), `409` (email duplicado) | |
| Autenticación | No | |

| | | |
| :--- | :--- | :--- |
| **API-003** | **Inicio de Sesión** | |
| Método | `POST` | |
| Ruta | `/api/v1/auth/login` | |
| Objetivo | Autenticar usuario y devolver token JWT (RF-003). | |
| Entrada (JSON) | `{ "email": "user@example.com", "password": "secreta" }` | |
| Salida (200) | `{ "access_token": "eyJhbG...", "token_type": "bearer" }` | |
| Errores | `401` (credenciales incorrectas) | |
| Autenticación | No | |

---

### Organizaciones (`/api/v1/organizations`)

| | | |
| :--- | :--- | :--- |
| **API-004** | **Listar mis organizaciones** | |
| Método | `GET` | |
| Ruta | `/api/v1/organizations` | |
| Objetivo | Obtener organizaciones a las que pertenece el usuario autenticado. | |
| Salida (200) | `[ { "id": 1, "name": "Mi Empresa", "type": "empresa", "resource_label_singular": "Sala", "resource_label_plural": "Salas", "role": "admin" } ]` | |
| Errores | `401` | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-005** | **Agregar miembro a organización** | |
| Método | `POST` | |
| Ruta | `/api/v1/organizations/{org_id}/members` | |
| Objetivo | Agregar un usuario existente a la organización (RF-010). | |
| Entrada (JSON) | `{ "email": "nuevo@miembro.com" }` | |
| Salida (201) | `{ "user_id": 2, "organization_id": 1, "role": "member" }` | |
| Errores | `403` (no admin), `404` (usuario no encontrado), `409` (ya es miembro) | |
| Autenticación | Sí (admin) | |

| | | |
| :--- | :--- | :--- |
| **API-006** | **Obtener / Editar configuración de reservas** | |
| Método | `GET` / `PUT` | |
| Ruta | `/api/v1/organizations/{org_id}/settings` | |
| Objetivo | Consultar o modificar reglas de reserva de la organización (RF-005). | |
| Entrada (PUT) | `{ "max_days_ahead": 14, "max_duration_minutes": 180, "allowed_start_time": "08:00", "allowed_end_time": "20:00" }` | |
| Salida (200) | `{ "organization_id": 1, "max_days_ahead": 14, ... }` | |
| Errores | `403` (no admin), `404` | |
| Autenticación | Sí (admin) | |

| | | |
| :--- | :--- | :--- |
| **API-015** | **Unirse a organización con código de invitación** | |
| Método | `POST` | |
| Ruta | `/api/v1/organizations/join` | |
| Objetivo | Unir de forma autónoma al usuario autenticado a una organización usando su código de invitación (RF-012). | |
| Entrada (JSON) | `{ "invite_code": "ORG123" }` | |
| Salida (201) | `{ "user_id": 1, "organization_id": 3, "role": "member" }` | |
| Errores | `400` (código inválido o desactivado), `401` (no autenticado), `409` (ya es miembro de la organización) | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-016** | **Regenerar código de invitación** | |
| Método | `POST` | |
| Ruta | `/api/v1/organizations/{org_id}/invite-code/regenerate` | |
| Objetivo | Generar un nuevo código de invitación para la organización, invalidando el anterior (RF-012). | |
| Salida (200) | `{ "organization_id": 1, "invite_code": "NEWCODE456" }` | |
| Errores | `401` (no autenticado), `403` (no admin), `404` (organización no encontrada) | |
| Autenticación | Sí (admin) | |

| | | |
| :--- | :--- | :--- |
| **API-017** | **Obtener código de invitación** | |
| Método | `GET` | |
| Ruta | `/api/v1/organizations/{org_id}/invite-code` | |
| Objetivo | Obtener el código de invitación activo de la organización (RF-012). | |
| Salida (200) | `{ "organization_id": 1, "invite_code": "ORG123", "invite_code_enabled": true }` | |
| Errores | `401` (no autenticado), `403` (no admin), `404` (organización no encontrada) | |
| Autenticación | Sí (admin) | |

---

### Recursos (`/api/v1/resources`)

| | | |
| :--- | :--- | :--- |
| **API-007** | **Listar recursos de mi organización** | |
| Método | `GET` | |
| Ruta | `/api/v1/resources?organization_id=1` | |
| Objetivo | Listar recursos activos de una organización (RF-009). | |
| Salida (200) | `[ { "id": 1, "name": "Salón", "capacity": 50, "is_active": true } ]` | |
| Errores | `403` (no pertenece a la org) | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-008** | **Crear recurso** | |
| Método | `POST` | |
| Ruta | `/api/v1/resources` | |
| Objetivo | Crear un nuevo recurso en la organización (RF-004). | |
| Entrada (JSON) | `{ "organization_id": 1, "name": "Sala de Juntas", "capacity": 10 }` | |
| Salida (201) | `{ "id": 2, "name": "Sala de Juntas", ... }` | |
| Errores | `400`, `403` (no admin) | |
| Autenticación | Sí (admin) | |

| | | |
| :--- | :--- | :--- |
| **API-009** | **Editar / Eliminar recurso** | |
| Método | `PUT` / `DELETE` | |
| Ruta | `/api/v1/resources/{resource_id}` | |
| Objetivo | Modificar o desactivar un recurso (RF-004). | |
| Entrada (PUT) | `{ "name": "Sala VIP", "capacity": 15, "is_active": false }` | |
| Salida (200) | `{ "id": 1, "name": "Sala VIP", ... }` | |
| Errores | `403`, `404` | |
| Autenticación | Sí (admin) | |


###  Reservas (`/api/v1/reservations`)

| | | |
| :--- | :--- | :--- |
| **API-010** | **Crear reserva** | |
| Método | `POST` | |
| Ruta | `/api/v1/reservations` | |
| Objetivo | Reservar un recurso en un horario (RF-006). | |
| Entrada (JSON) | `{ "resource_id": 1, "start_time": "2026-05-20T10:00:00Z", "end_time": "2026-05-20T12:00:00Z" }` | |
| Salida (201) | `{ "id": 1, "resource_id": 1, "user_id": 1, "status": "active", "start_time": "...", "end_time": "..." }` | |
| Errores | `400` (fechas inválidas), `403` (no miembro), `409` (solapamiento o regla incumplida) | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-011** | **Listar mis reservas** | |
| Método | `GET` | |
| Ruta | `/api/v1/reservations/mine` | |
| Objetivo | Obtener reservas del usuario autenticado. | |
| Salida (200) | `[ { "id": 1, "resource": { "name": "Salón" }, "start_time": "...", "status": "active" } ]` | |
| Errores | `401` | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-012** | **Cancelar reserva** | |
| Método | `PATCH` | |
| Ruta | `/api/v1/reservations/{id}/cancel` | |
| Objetivo | Cancelar una reserva activa (RF-007). | |
| Entrada | `{ "reason": "Ya no la necesito" }` (opcional) | |
| Salida (200) | `{ "id": 1, "status": "cancelled" }` | |
| Errores | `403` (no dueño/admin), `404`, `409` (ya cancelada) | |
| Autenticación | Sí | |

| | | |
| :--- | :--- | :--- |
| **API-013** | **Disponibilidad de un recurso** | |
| Método | `GET` | |
| Ruta | `/api/v1/resources/{resource_id}/availability?date=2026-05-20` | |
| Objetivo | Obtener slots ocupados/libres de un día o semana (RF-008). | |
| Salida (200) | `{ "resource_id": 1, "date": "2026-05-20", "occupied": [ {"start": "10:00", "end": "12:00"} ], "settings": { "allowed_start_time": "06:00", "allowed_end_time": "22:00", "max_duration_minutes": 120 } }` | |
| Errores | `403` (no miembro), `404` | |
| Autenticación | Sí | |


###  Perfil de Usuario (`/api/v1/profile`)

| | | |
| :--- | :--- | :--- |
| **API-014** | **Obtener / Editar perfil** | |
| Método | `GET` / `PUT` | |
| Ruta | `/api/v1/profile` | |
| Objetivo | Ver o modificar nombre, email y contraseña (RF-011). | |
| Entrada (PUT) | `{ "full_name": "Nuevo Nombre", "email": "nuevo@email.com", "current_password": "secreta", "new_password": "nueva123" }` (campos opcionales) | |
| Salida (200) | `{ "id": 1, "email": "...", "full_name": "..." }` | |
| Errores | `400` (validación), `409` (email duplicado), `401` (contraseña actual incorrecta) | |
| Autenticación | Sí | |


##  Resumen de endpoints

| Método | Ruta | RF | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | RF-001 | No |
| `POST` | `/auth/register-org` | RF-002 | No |
| `POST` | `/auth/login` | RF-003 | No |
| `GET` | `/organizations` | — | Sí |
| `POST` | `/organizations/{id}/members` | RF-010 | Admin |
| `GET/PUT` | `/organizations/{id}/settings` | RF-005 | Admin |
| `POST` | `/organizations/join` | RF-012 | Sí |
| `POST` | `/organizations/{id}/invite-code/regenerate` | RF-012 | Admin |
| `GET` | `/organizations/{id}/invite-code` | RF-012 | Admin |
| `GET` | `/resources` | RF-009 | Sí |
| `POST` | `/resources` | RF-004 | Admin |
| `PUT/DELETE` | `/resources/{id}` | RF-004 | Admin |
| `POST` | `/reservations` | RF-006 | Sí |
| `GET` | `/reservations/mine` | — | Sí |
| `PATCH` | `/reservations/{id}/cancel` | RF-007 | Sí |
| `GET` | `/resources/{id}/availability` | RF-008 | Sí |
| `GET/PUT` | `/profile` | RF-011 | Sí |
