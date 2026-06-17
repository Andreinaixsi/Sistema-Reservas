##  Diseño Backend

### 8.1 Responsabilidades del Backend

El backend es el núcleo funcional del sistema. Sus responsabilidades principales son:

- **Autenticar y autorizar** todas las peticiones mediante JWT.
- **Aislar datos** entre organizaciones (multi-tenancy lógico).
- **Validar reglas de negocio** (horarios permitidos, duración máxima, anticipación, etc.) antes de cualquier operación de escritura.
- **Gestionar el ciclo de vida** de usuarios, organizaciones, recursos y reservas (CRUD).
- **Garantizar la integridad de los datos** evitando solapamientos de reservas mediante consultas condicionales en la capa de servicio.
- **Responder de forma estandarizada** (éxito o error) en formato JSON.

### 8.2 Módulos o Capas

El backend sigue una estructura de **monolito modular** con separación por dominio funcional. Cada módulo se organiza en tres capas internas:

| Capa | Responsabilidad | Ejemplo de archivo |
| :--- | :--- | :--- |
| **Controladores** (`controller.py`) | Definen los endpoints de la API REST. Reciben la petición HTTP, delegan en el servicio y retornan la respuesta. | `reservations/reservation.controller.py` |
| **Servicios** (`service.py`) | Contienen **toda la lógica de negocio** y las validaciones. Se comunican con la capa de datos (SQLAlchemy). | `reservations/reservation.service.py` |
| **Modelos** (`model.py`) | Definen las clases de SQLAlchemy que mapean las tablas de la base de datos. | `reservations/reservation.model.py` |

**Módulos por dominio:**

| Módulo | Propósito |
| :--- | :--- |
| `auth/` | Registro, inicio de sesión, generación y validación de tokens JWT. |
| `users/` | Gestión del perfil de usuario (editar nombre, email, contraseña). |
| `organizations/` | Creación de organizaciones, gestión de miembros y roles. |
| `resources/` | CRUD de recursos (solo administradores). |
| `reservations/` | Creación, cancelación y consulta de reservas. Validación de solapamiento y reglas de la organización. |
| `common/` | Elementos transversales: conexión a la BD (`database.py`), middlewares de autenticación, manejadores de errores personalizados. |

### 8.3 Lógica del Negocio

Toda la lógica de negocio se concentra en la capa de **servicios**. Esto facilita las pruebas unitarias y la modificación de reglas sin tocar los endpoints.

**Ubicación y flujo de las reglas principales:**

1.  **Validación de Solapamiento (RN-001) y Mitigación de Concurrencia (Race Conditions):**
    - Se implementa en `reservation.service.py`.
    - **Control de Concurrencia:** Para evitar reservas duplicadas ante peticiones simultáneas, la consulta de validación de disponibilidad se ejecuta dentro de una transacción con **bloqueo pesimista** (empleando `SELECT ... FOR UPDATE` sobre el recurso o las reservas en el rango de tiempo) o configurando el nivel de aislamiento de la transacción en `SERIALIZABLE`.
    - Justo antes de crear una reserva, se ejecuta esta consulta SQL bloqueante que busca cualquier reserva activa cuyo rango de tiempo se cruce con el solicitado (`start_time < new_end AND end_time > new_start`).
    - Si existe conflicto de horarios, se lanza una excepción que el controlador convierte en un error `409 Conflict`. Si la transacción de base de datos es abortada por un conflicto de serialización concurrente, el backend capturará el error para reintentar la operación o rechazarla de forma segura.

2.  **Validación de Reglas de Organización (RN-010):**
    - Se implementa en `reservation.service.py`.
    - Se cargan los `organization_settings` de la organización dueña del recurso.
    - Se valida secuencialmente:
        - `start_time` no es en el pasado.
        - `end_time - start_time` no supera `max_duration_minutes`.
        - `start_time` no supera el límite de `max_days_ahead`.
        - La hora de `start_time` y `end_time` está dentro de `allowed_start_time` y `allowed_end_time`.

3.  **Permisos de Administrador (RN-004):**
    - Se verifica en los servicios de `resources` y `organizations`.
    - Se consulta la tabla `organization_members` para confirmar que el `user_id` tiene `role = 'admin'` en la organización correspondiente.

### 8.4 Manejo de Errores

El backend responde ante cualquier error con una estructura JSON estandarizada y un código de estado HTTP semántico. FastAPI + Pydantic facilitan la validación de entrada.

**Estructura de error estándar:**
```json
{
  "detail": "Mensaje descriptivo del error"
}
```

**Códigos de estado HTTP utilizados:**

| Código | Significado | ¿Cuándo se usa? |
| :--- | :--- | :--- |
| **200** | OK | Lecturas exitosas (listar recursos, ver disponibilidad). |
| **201** | Created | Creación exitosa (registro, nueva reserva, nuevo recurso). |
| **400** | Bad Request | Datos de entrada inválidos (formato de email incorrecto, `start_time > end_time`). |
| **401** | Unauthorized | Token JWT inválido, expirado o ausente. |
| **403** | Forbidden | Usuario autenticado pero sin permisos (ej: miembro intenta crear un recurso). |
| **404** | Not Found | Recurso, reserva u organización no encontrada o no pertenece a la organización del usuario. |
| **409** | Conflict | Conflicto de negocio, principalmente **solapamiento de horarios**. |
| **422** | Validation Error | FastAPI lo lanza automáticamente si falla la validación de tipos con Pydantic (ej: enviar un string en lugar de un entero). |
| **500** | Internal Server Error | Errores inesperados. Se registran en logs y se retorna un mensaje genérico. |

