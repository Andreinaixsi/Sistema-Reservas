# 🧪 Plan de Pruebas
## Sistema de Gestión de Reservas Multi-Organización

---

## 1. Objetivo

Validar que el sistema cumpla con los requisitos funcionales y no funcionales definidos en el SRS, garantizando que:

- Las operaciones CRUD funcionen correctamente para todas las entidades.
- Las reglas de negocio (no solapamiento, permisos, aislamiento) se apliquen correctamente.
- La experiencia de usuario sea fluida y sin errores confusos.
- El sistema maneje correctamente los errores y casos límite.

---

## 2. Tipos de Prueba

| Tipo | Descripción | ¿Quién la ejecuta? |
|------|-------------|---------------------|
| **Unitarias** | Probar funciones y métodos individuales del backend (servicios, validadores). | Desarrollador backend |
| **Funcionales** | Verificar que cada caso de uso funcione de extremo a extremo según lo especificado. | Ambos |
| **Integración** | Probar la comunicación entre frontend, backend y base de datos. | Ambos |
| **Usabilidad** | Validar que la interfaz sea intuitiva y cumpla con RNF-001 (máx. 3 clics para reservar). | Probador / Ambos |
| **Manuales** | Pruebas exploratorias para detectar errores no previstos. | Ambos |

---

## 3. Casos de Prueba

---

### CP-001 — Registro de Usuario Exitoso

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un usuario nuevo pueda registrarse correctamente (RF-001, CU-001). |
| **Precondición** | El email `test@example.com` no existe en la base de datos. |
| **Pasos** | 1. Acceder a `/register`.<br>2. Ingresar email: `test@example.com`, contraseña: `Test1234`, nombre: `Juan Pérez`.<br>3. Hacer clic en "Registrarse". |
| **Resultado esperado** | El sistema crea el usuario, muestra mensaje de confirmación y redirige a `/login`. |
| **Estado** | 🔲 Pendiente |

---

### CP-002 — Registro con Email Duplicado

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el sistema rechace un email ya registrado (RF-001, RN-011). |
| **Precondición** | El email `admin@test.com` ya existe en la base de datos. |
| **Pasos** | 1. Acceder a `/register`.<br>2. Ingresar email: `admin@test.com`, contraseña: `Test1234`, nombre: `Otro Admin`.<br>3. Hacer clic en "Registrarse". |
| **Resultado esperado** | El sistema muestra un error: "Este email ya está registrado". No se crea el usuario. |
| **Estado** | 🔲 Pendiente |

---

### CP-003 — Inicio de Sesión Exitoso

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un usuario registrado pueda iniciar sesión (RF-003, CU-003). |
| **Precondición** | El usuario `admin@test.com` existe con contraseña `test123`. |
| **Pasos** | 1. Acceder a `/login`.<br>2. Ingresar email: `admin@test.com`, contraseña: `test123`.<br>3. Hacer clic en "Iniciar Sesión". |
| **Resultado esperado** | El sistema genera un token JWT y redirige al Dashboard. |
| **Estado** | 🔲 Pendiente |

---

### CP-004 — Inicio de Sesión con Credenciales Incorrectas

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el sistema rechace credenciales inválidas (RF-003). |
| **Precondición** | Ninguna. |
| **Pasos** | 1. Acceder a `/login`.<br>2. Ingresar email: `admin@test.com`, contraseña: `incorrecta`.<br>3. Hacer clic en "Iniciar Sesión". |
| **Resultado esperado** | El sistema muestra un error: "Credenciales incorrectas". No se genera token. |
| **Estado** | 🔲 Pendiente |

---

### CP-005 — Registro de Organización con Administrador

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar la creación simultánea de organización y usuario administrador (RF-002, CU-002). |
| **Precondición** | El email `nuevo@admin.com` no existe. |
| **Pasos** | 1. Acceder a `/register-org`.<br>2. Ingresar datos de usuario: `nuevo@admin.com`, `Admin456`, `María López`.<br>3. Ingresar datos de organización: `Mi Condominio`, tipo: `condominio`.<br>4. Hacer clic en "Crear Organización". |
| **Resultado esperado** | Se crea el usuario, la organización, la configuración por defecto y la membresía como admin. Redirige al Dashboard. |
| **Estado** | 🔲 Pendiente |

---

### CP-006 — Crear Recurso (Admin)

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un administrador pueda crear un recurso (RF-004, CU-004). |
| **Precondición** | Usuario autenticado como admin de la organización 1. |
| **Pasos** | 1. Acceder a `/admin/resources`.<br>2. Hacer clic en "Nuevo Recurso".<br>3. Ingresar nombre: `Sala VIP`, capacidad: `15`.<br>4. Hacer clic en "Crear". |
| **Resultado esperado** | El recurso aparece en la lista de recursos activos. |
| **Estado** | 🔲 Pendiente |

---

### CP-007 — Crear Recurso sin Permisos (Miembro)

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un miembro no pueda crear recursos (RN-004). |
| **Precondición** | Usuario autenticado como miembro (no admin). |
| **Pasos** | 1. Intentar acceder directamente a `/admin/resources` o enviar POST a `/api/v1/resources`. |
| **Resultado esperado** | El sistema muestra error 403 Forbidden. |
| **Estado** | 🔲 Pendiente |

---

### CP-008 — Crear Reserva Exitosa

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar la creación de una reserva sin conflictos (RF-006, CU-006). |
| **Precondición** | Usuario miembro autenticado. Recurso 1 (Salón de Eventos) activo. No hay reservas activas el 20/06/2026 de 14:00 a 16:00. |
| **Pasos** | 1. Acceder al recurso 1.<br>2. Seleccionar fecha: 20/06/2026, hora inicio: 14:00, hora fin: 16:00.<br>3. Hacer clic en "Reservar". |
| **Resultado esperado** | La reserva se crea con estado "active". Se muestra confirmación. |
| **Estado** | 🔲 Pendiente |

---

### CP-009 — Crear Reserva con Solapamiento

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el sistema rechace una reserva que se solape con otra existente (RN-001). |
| **Precondición** | Existe una reserva activa el 20/06/2026 de 14:00 a 16:00 en el recurso 1. |
| **Pasos** | 1. Acceder al recurso 1.<br>2. Seleccionar fecha: 20/06/2026, hora inicio: 15:00, hora fin: 17:00.<br>3. Hacer clic en "Reservar". |
| **Resultado esperado** | El sistema muestra error 409: "Horario no disponible". No se crea la reserva. |
| **Estado** | 🔲 Pendiente |

---

### CP-010 — Crear Reserva con Duración Excedida

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el sistema rechace una reserva que exceda la duración máxima (RN-010). |
| **Precondición** | La organización tiene `max_duration_minutes = 120`. |
| **Pasos** | 1. Acceder al recurso 1.<br>2. Seleccionar horario con 3 horas de duración (ej: 14:00 a 17:00).<br>3. Hacer clic en "Reservar". |
| **Resultado esperado** | El sistema muestra error indicando que la duración máxima es 120 minutos. |
| **Estado** | 🔲 Pendiente |

---

### CP-011 — Cancelar Reserva (Dueño)

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el creador de una reserva pueda cancelarla (RF-007, CU-007). |
| **Precondición** | Usuario `usuario@test.com` tiene una reserva activa (id=1). |
| **Pasos** | 1. Acceder a "Mis Reservas".<br>2. Localizar la reserva activa.<br>3. Hacer clic en "Cancelar".<br>4. Confirmar cancelación. |
| **Resultado esperado** | La reserva cambia a estado "cancelled". El horario queda liberado. |
| **Estado** | 🔲 Pendiente |

---

### CP-012 — Cancelar Reserva (Admin sobre reserva ajena)

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un administrador pueda cancelar la reserva de otro usuario (RN-005). |
| **Precondición** | Usuario admin autenticado. Existe una reserva activa de otro usuario en su organización. |
| **Pasos** | 1. Acceder al panel de administración o detalle del recurso.<br>2. Localizar la reserva activa.<br>3. Hacer clic en "Cancelar".<br>4. Confirmar cancelación. |
| **Resultado esperado** | La reserva cambia a estado "cancelled". |
| **Estado** | 🔲 Pendiente |

---

### CP-013 — Cancelar Reserva sin Permisos

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un miembro no pueda cancelar la reserva de otro miembro (RN-005). |
| **Precondición** | Usuario miembro A autenticado. Existe una reserva activa del usuario miembro B. |
| **Pasos** | 1. Intentar cancelar la reserva de B mediante la API o interfaz. |
| **Resultado esperado** | El sistema muestra error 403 Forbidden. |
| **Estado** | 🔲 Pendiente |

---

### CP-014 — Consultar Disponibilidad

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que se muestren correctamente los horarios ocupados y libres (RF-008, CU-008). |
| **Precondición** | Recurso 1 tiene una reserva activa el 20/06/2026 de 10:00 a 12:00. |
| **Pasos** | 1. Acceder al detalle del recurso 1.<br>2. Ver el calendario/disponibilidad para el 20/06/2026. |
| **Resultado esperado** | El horario de 10:00 a 12:00 aparece como ocupado. El resto del día aparece como disponible, respetando el horario permitido de la organización. Se muestra el timezone de la organización. |
| **Estado** | 🔲 Pendiente |

---

### CP-015 — Aislamiento de Datos entre Organizaciones

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un usuario solo vea recursos y reservas de su propia organización (RN-006). |
| **Precondición** | Usuario A pertenece a la organización 1. Existe la organización 2 con sus propios recursos. |
| **Pasos** | 1. Autenticarse como usuario A.<br>2. Listar recursos.<br>3. Intentar acceder directamente a un recurso de la organización 2 mediante la API. |
| **Resultado esperado** | Solo se listan recursos de la organización 1. El acceso al recurso de la org 2 devuelve 404 o 403. |
| **Estado** | 🔲 Pendiente |

---

### CP-016 — Unirse a Organización por Código de Invitación

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un usuario pueda unirse a una organización usando un código válido (RF-012, CU-012). |
| **Precondición** | Usuario autenticado sin organización. La organización 1 tiene el código `ABC12345`. |
| **Pasos** | 1. Acceder a `/onboarding`.<br>2. Ingresar el código: `ABC12345`.<br>3. Hacer clic en "Unirse". |
| **Resultado esperado** | El usuario queda registrado como miembro de la organización 1. Puede ver sus recursos. |
| **Estado** | 🔲 Pendiente |

---

### CP-017 — Unirse con Código Inválido

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que el sistema rechace un código de invitación inválido (RF-012). |
| **Precondición** | Usuario autenticado sin organización. |
| **Pasos** | 1. Acceder a `/onboarding`.<br>2. Ingresar un código inexistente: `ZZZZ9999`.<br>3. Hacer clic en "Unirse". |
| **Resultado esperado** | El sistema muestra error: "Código de invitación inválido". |
| **Estado** | 🔲 Pendiente |

---

### CP-018 — Editar Perfil

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un usuario pueda modificar su nombre y email (RF-011, CU-011). |
| **Precondición** | Usuario autenticado. |
| **Pasos** | 1. Acceder a "Mi Perfil".<br>2. Cambiar el nombre a "Nuevo Nombre".<br>3. Hacer clic en "Guardar". |
| **Resultado esperado** | Los datos se actualizan correctamente. Se muestra confirmación. |
| **Estado** | 🔲 Pendiente |

---

### CP-019 — Cambiar Contraseña

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar el cambio de contraseña (RF-011, CU-011). |
| **Precondición** | Usuario autenticado con contraseña actual `test123`. |
| **Pasos** | 1. Acceder a "Mi Perfil" → "Cambiar Contraseña".<br>2. Ingresar contraseña actual: `test123`, nueva: `Nueva456`, confirmar: `Nueva456`.<br>3. Hacer clic en "Actualizar". |
| **Resultado esperado** | La contraseña se actualiza. Puede iniciar sesión con la nueva contraseña. |
| **Estado** | 🔲 Pendiente |

---

### CP-020 — Usabilidad: Crear Reserva en ≤ 3 clics

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar el RNF-001: máximo 3 clics para crear una reserva desde el Dashboard. |
| **Precondición** | Usuario autenticado con al menos un recurso disponible. |
| **Pasos** | 1. Clic en "Recursos" (Sidebar).<br>2. Clic en un recurso (Card).<br>3. Seleccionar horario y clic en "Reservar". |
| **Resultado esperado** | La reserva se crea en exactamente 3 clics desde la navegación principal. |
| **Estado** | 🔲 Pendiente |

---

### CP-021 — Empty State: Miembro sin Recursos

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un miembro vea un mensaje claro cuando no hay recursos (RNF-001, CU-009). |
| **Precondición** | Usuario miembro autenticado. Su organización no tiene recursos activos. |
| **Pasos** | 1. Acceder a "Recursos". |
| **Resultado esperado** | Se muestra un mensaje: "Aún no hay recursos disponibles" con un botón de recarga o un aviso para contactar al administrador. |
| **Estado** | 🔲 Pendiente |

---

### CP-022 — Empty State: Admin sin Recursos

| Campo | Valor |
|-------|-------|
| **Objetivo** | Validar que un administrador vea un CTA para crear su primer recurso (RNF-001, CU-009). |
| **Precondición** | Usuario admin autenticado. Su organización no tiene recursos activos. |
| **Pasos** | 1. Acceder a "Recursos". |
| **Resultado esperado** | Se muestra un mensaje: "Crea tu primer recurso" con un botón "Nuevo Recurso" que lleva al formulario de creación. |
| **Estado** | 🔲 Pendiente |

---

## 📊 Matriz de Trazabilidad de Pruebas

| Caso de Prueba | Requisito Funcional | Regla de Negocio | Caso de Uso |
|----------------|---------------------|------------------|-------------|
| CP-001 | RF-001 | — | CU-001 |
| CP-002 | RF-001 | RN-011 | CU-001 |
| CP-003 | RF-003 | — | CU-003 |
| CP-004 | RF-003 | — | CU-003 |
| CP-005 | RF-002 | RN-007 | CU-002 |
| CP-006 | RF-004 | — | CU-004 |
| CP-007 | RF-004 | RN-004 | CU-004 |
| CP-008 | RF-006 | — | CU-006 |
| CP-009 | RF-006 | RN-001 | CU-006 |
| CP-010 | RF-006 | RN-010 | CU-006 |
| CP-011 | RF-007 | RN-005 | CU-007 |
| CP-012 | RF-007 | RN-005 | CU-007 |
| CP-013 | RF-007 | RN-005 | CU-007 |
| CP-014 | RF-008 | — | CU-008 |
| CP-015 | RF-009 | RN-006 | CU-009 |
| CP-016 | RF-012 | — | CU-012 |
| CP-017 | RF-012 | — | CU-012 |
| CP-018 | RF-011 | — | CU-011 |
| CP-019 | RF-011 | RN-011 | CU-011 |
| CP-020 | RNF-001 | — | CU-006 |
| CP-021 | RNF-001 | — | CU-009 |
| CP-022 | RNF-001 | — | CU-009 |

---

## 📝 Registro de Ejecución

| CP | Fecha | Resultado | Observaciones |
|----|-------|-----------|---------------|
| CP-001 | — | 🔲 Pendiente | — |
| CP-002 | — | 🔲 Pendiente | — |
| CP-003 | — | 🔲 Pendiente | — |
| CP-004 | — | 🔲 Pendiente | — |
| CP-005 | — | 🔲 Pendiente | — |
| CP-006 | — | 🔲 Pendiente | — |
| CP-007 | — | 🔲 Pendiente | — |
| CP-008 | — | 🔲 Pendiente | — |
| CP-009 | — | 🔲 Pendiente | — |
| CP-010 | — | 🔲 Pendiente | — |
| CP-011 | — | 🔲 Pendiente | — |
| CP-012 | — | 🔲 Pendiente | — |
| CP-013 | — | 🔲 Pendiente | — |
| CP-014 | — | 🔲 Pendiente | — |
| CP-015 | — | 🔲 Pendiente | — |
| CP-016 | — | 🔲 Pendiente | — |
| CP-017 | — | 🔲 Pendiente | — |
| CP-018 | — | 🔲 Pendiente | — |
| CP-019 | — | 🔲 Pendiente | — |
| CP-020 | — | 🔲 Pendiente | — |
| CP-021 | — | 🔲 Pendiente | — |
| CP-022 | — | 🔲 Pendiente | — |
