# Modelo de Datos
## Sistema de Gestión de Reservas Multi-Organización


## 1. Descripción General

El modelo de datos del sistema está diseñado para soportar múltiples organizaciones
independientes (multi-tenant), donde cada organización gestiona sus propios recursos
y reservas sin interferencia con otras.

### Entidades principales (7 tablas):

| Entidad | Propósito |
|---------|-----------|
| **users** | Almacena las cuentas de usuario del sistema |
| **organizations** | Representa cada organización o espacio de trabajo |
| **organization_members** | Relaciona usuarios con organizaciones y define su rol |
| **organization_settings** | Configuración de reglas de reserva por organización |
| **resources** | Recursos físicos o espacios que se pueden reservar |
| **reservations** | Reservas realizadas por los usuarios sobre los recursos |
| **reservation_history** | Auditoría de cambios de estado en reservas (opcional) |

### Principios del diseño:
- **Aislamiento de datos:** Cada organización ve solo sus recursos y reservas.
- **Integridad referencial:** Claves foráneas con eliminación en cascada.
- **Validación en base de datos:** Restricciones CHECK, EXCLUDE y UNIQUE.
- **Zona horaria:** Todas las fechas se almacenan en UTC.

## 2. Entidades

### Entidad: users
**Propósito:** Almacenar las cuentas de usuario del sistema. Un usuario puede
existir sin pertenecer a una organización (recién registrado).

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Correo electrónico del usuario |
| password_hash | VARCHAR(255) | NOT NULL | Contraseña encriptada con bcrypt |
| full_name | VARCHAR(100) | — | Nombre completo |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de registro |

**Relaciones:**
- users (1) ─── (N) organization_members → Un usuario puede pertenecer a varias organizaciones.
- users (1) ─── (N) reservations → Un usuario puede tener muchas reservas.


### Entidad: organizations
**Propósito:** Representa cada organización o espacio de trabajo independiente
(condominio, universidad, empresa, centro deportivo).

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| name | VARCHAR(100) | NOT NULL | Nombre de la organización |
| type | VARCHAR(50) | CHECK | Tipo: condominio, universidad, empresa, centro_deportivo, otro |
| invite_code | VARCHAR(50) | UNIQUE, NOT NULL | Código único de la organización para unirse autónomamente |
| invite_code_enabled | BOOLEAN | NOT NULL, DEFAULT TRUE | Indica si se permite unirse mediante el código de invitación |
| resource_label_singular | VARCHAR(50) | NOT NULL, DEFAULT 'Recurso' | Nombre singular personalizado para los recursos (ej: 'Cancha', 'Sala') |
| resource_label_plural | VARCHAR(50) | NOT NULL, DEFAULT 'Recursos' | Nombre plural personalizado para los recursos (ej: 'Canchas', 'Salas') |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- organizations (1) ─── (N) organization_members → Una organización tiene muchos miembros.
- organizations (1) ─── (1) organization_settings → Una organización tiene una configuración.
- organizations (1) ─── (N) resources → Una organización tiene muchos recursos.


### Entidad: organization_members
**Propósito:** Tabla intermedia que relaciona usuarios con organizaciones y define
el rol de cada usuario dentro de la organización.

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| user_id | INT | PRIMARY KEY, FK → users(id) | Usuario miembro |
| organization_id | INT | PRIMARY KEY, FK → organizations(id) | Organización |
| role | VARCHAR(20) | CHECK (admin, member) | Rol del usuario en la organización |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de membresía |

**Relaciones:**
- organization_members (N) ─── (1) users → Pertenece a un usuario.
- organization_members (N) ─── (1) organizations → Pertenece a una organización.


### Entidad: organization_settings
**Propósito:** Almacena las reglas de configuración de reservas para cada
organización. Se crea automáticamente con valores por defecto al crear una
organización.

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| organization_id | INT | PRIMARY KEY, FK → organizations(id) | Organización asociada |
| max_days_ahead | INT | NOT NULL, DEFAULT 7 | Máximo de días de anticipación para reservar |
| max_duration_minutes | INT | NOT NULL, DEFAULT 120 | Duración máxima de una reserva (minutos) |
| allowed_start_time | TIME | DEFAULT '06:00' | Hora de inicio permitida |
| allowed_end_time | TIME | DEFAULT '22:00' | Hora de fin permitida |
| timezone | VARCHAR(50) | DEFAULT 'UTC' | Zona horaria de la organización |

**Relaciones:**
- organization_settings (1) ─── (1) organizations → Pertenece a una organización.

---

### Entidad: resources
**Propósito:** Representa los recursos físicos o espacios que los miembros de una
organización pueden reservar (salones, piscinas, gimnasios, canchas, etc.).

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| organization_id | INT | NOT NULL, FK → organizations(id) | Organización dueña |
| name | VARCHAR(100) | NOT NULL | Nombre del recurso |
| description | TEXT | — | Descripción del recurso |
| capacity | INT | — | Capacidad máxima de personas |
| is_active | BOOLEAN | DEFAULT TRUE | Indica si el recurso está disponible |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación |

**Relaciones:**
- resources (N) ─── (1) organizations → Pertenece a una organización.
- resources (1) ─── (N) reservations → Tiene muchas reservas.


### Entidad: reservations
**Propósito:** Almacena las reservas realizadas por los usuarios sobre los
recursos. Es la entidad central del sistema.

**Campos principales:**

| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | SERIAL | PRIMARY KEY | Identificador único |
| resource_id | INT | NOT NULL, FK → resources(id) | Recurso reservado |
| user_id | INT | NOT NULL, FK → users(id) | Usuario que reservó |
| start_time | TIMESTAMP | NOT NULL | Fecha y hora de inicio (UTC) |
| end_time | TIMESTAMP | NOT NULL | Fecha y hora de fin (UTC) |
| status | VARCHAR(20) | DEFAULT 'active', CHECK | Estado: active, cancelled, pending_approval |
| cancellation_reason | TEXT | — | Motivo de cancelación |
| created_at | TIMESTAMP | DEFAULT NOW() | Fecha de creación de la reserva |

**Relaciones:**
- reservations (N) ─── (1) resources → Pertenece a un recurso.
- reservations (N) ─── (1) users → Pertenece a un usuario.

> **Nota sobre integridad de solapamientos e hilos concurrentes:**  
> Por compatibilidad con Neon (PostgreSQL serverless), no se utiliza la restricción `EXCLUDE` a nivel de base de datos.  
> La validación de solapamiento se implementa en la capa de servicios del backend mediante una consulta condicional antes de insertar la reserva.  
> **Mitigación de Concurrencia:** Dado que la validación reside en la capa de aplicación, para evitar condiciones de carrera (double-booking/solapamientos), se aplica un bloqueo pesimista en la consulta (`SELECT ... FOR UPDATE` sobre el recurso afectado) o se ejecutan las transacciones de reserva bajo el nivel de aislamiento `SERIALIZABLE` en PostgreSQL, garantizando exclusión mutua de manera robusta.

## 3. Reglas de Integridad

### 3.1 Campos Obligatorios (NOT NULL)

| Entidad | Campos obligatorios |
|---------|---------------------|
| users | email, password_hash |
| organizations | name |
| organization_members | user_id, organization_id, role |
| organization_settings | organization_id |
| resources | organization_id, name |
| reservations | resource_id, user_id, start_time, end_time |


### 3.2 Campos Únicos (UNIQUE)

| Entidad | Campo único |
|---------|-------------|
| users | email |
| organizations | (sin restricción UNIQUE adicional) |
| organization_members | (user_id, organization_id) — clave primaria compuesta |
| organization_settings | organization_id — clave primaria |
| resources | (sin restricción UNIQUE adicional) |
| reservations | (sin restricción UNIQUE adicional) |


### Diagramas
- [ER conceptual](assets/diagramas/Diagrama-ER-conceptual.jpg)
- [ER](assets/diagramas/Diagrama-ER.jpg) 
