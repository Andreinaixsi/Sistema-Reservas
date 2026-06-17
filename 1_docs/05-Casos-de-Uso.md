# Casos de Uso del Sistema

##  Módulo de Autenticación y Usuarios

| **ID: CU-001** | **Registro de Usuario** |
| :--- | :--- |
| **Objetivo** | Permitir que un nuevo usuario cree una cuenta en el sistema sin pertenecer aún a una organización. |
| **Actor** | Usuario no autenticado |
| **Precondiciones** | El usuario no debe tener una cuenta existente con ese email. |
| **Flujo Principal** | 1. Acceso a la página de registro.<br>2. Ingreso de email, contraseña y nombre completo.<br>3. Validación de email no registrado.<br>4. Encriptación de contraseña y guardado de usuario.<br>5. Muestra mensaje de confirmación. |
| **Flujos Alternos** | El usuario decide iniciar sesión en lugar de registrarse (va a CU-003). |
| **Excepciones** | **Email ya registrado:** Mensaje de error indicando que el email ya está en uso. |
| **Postcondiciones** | Usuario registrado en DB sin organización asociada. |
| **Req. Asociados** | RF-001 |

<br>

| **ID: CU-003** | **Inicio de Sesión** |
| :--- | :--- |
| **Objetivo** | Permitir que un usuario registrado acceda al sistema mediante autenticación. |
| **Actor** | Usuario registrado |
| **Precondiciones** | El usuario debe tener una cuenta activa en el sistema. |
| **Flujo Principal** | 1. Acceso a la página de inicio de sesión.<br>2. Ingreso de email y contraseña.<br>3. Validación de credenciales contra la base de datos.<br>4. Generación de token JWT.<br>5. Redirección al panel principal. |
| **Flujos Alternos** | El usuario olvidó su contraseña (no implementado en MVP). |
| **Excepciones** | **Credenciales incorrectas:** El sistema muestra un mensaje de error genérico. |
| **Postcondiciones** | El usuario queda autenticado con un token JWT válido. |
| **Req. Asociados** | RF-003 |

<br>

| **ID: CU-011** | **Editar Perfil** |
| :--- | :--- |
| **Objetivo** | Permitir al usuario modificar sus datos personales (nombre, email, contraseña). |
| **Actor** | Usuario autenticado / Administrador |
| **Precondiciones** | Usuario autenticado con un token JWT válido. |
| **Flujo Principal** | **Cambiar Nombre:** Ingreso a perfil, modificación de nombre, validación de campo no vacío y guardado.<br>**Cambiar Email:** Modificación de email, validación de formato y verificación de duplicidad.<br>**Cambiar Contraseña:** Verificación de clave actual, validación de requisitos mínimos y coincidencia de confirmación. Encriptación con bcrypt y guardado. |
| **Excepciones** | Email duplicado, Contraseña actual incorrecta, Contraseñas no coinciden, Contraseña débil (<6 caracteres), Campos vacíos. |
| **Postcondiciones** | Datos actualizados en la tabla `users`. |
| **Req. Asociados** | RF-011, RN-011 |

---

##  Módulo de Organización

| **ID: CU-002** | **Registro de Organización (Creación de Administrador)** |
| :--- | :--- |
| **Objetivo** | Permitir que un usuario cree una organización y se convierta automáticamente en su administrador. |
| **Actor** | Usuario no autenticado o autenticado sin organización |
| **Precondiciones** | Email no existente (si es nuevo) y nombre de organización único. |
| **Flujo Principal** | 1. Acceso al formulario.<br>2. Ingreso de datos personales y de organización.<br>3. Creación de usuario en `users`.<br>4. Creación de organización en `organizations`.<br>5. Inserción de `organization_settings` por defecto.<br>6. Asociación como administrador en `organization_members`.<br>7. Redirección al panel. |
| **Excepciones** | **Email ya registrado:** Error si no está autenticado.<br>**Datos inválidos:** Rechazo de campos vacíos o mal formateados. |
| **Postcondiciones** | Organización creada y usuario autenticado como administrador. |
| **Req. Asociados** | RF-002, RN-007 |

<br>

| **ID: CU-004** | **Gestionar Recursos (Crear, Editar, Eliminar)** |
| :--- | :--- |
| **Objetivo** | Permitir al administrador administrar los recursos disponibles en su organización. |
| **Actor** | Administrador de la organización |
| **Precondiciones** | Autenticado con rol de administrador; organización existente. |
| **Flujo Principal** | **Crear:** Ingreso de nombre, descripción y capacidad; validación y guardado.<br>**Editar:** Selección de recurso, modificación de campos y guardado.<br>**Eliminar:** Confirmación de eliminación y desactivación/borrado en cascada. |
| **Excepciones** | **Usuario sin permisos:** Error 403.<br>**Datos inválidos:** Rechazo de campos vacíos. |
| **Postcondiciones** | Recurso creado, modificado o eliminado de la organización. |
| **Req. Asociados** | RF-004, RN-004 |

<br>

| **ID: CU-005** | **Configurar Reglas de Reserva** |
| :--- | :--- |
| **Objetivo** | Permitir al administrador definir límites y horarios para las reservas de su organización. |
| **Actor** | Administrador de la organización |
| **Precondiciones** | Autenticado con rol de administrador; organización con configuración por defecto. |
| **Flujo Principal** | 1. Acceso a configuración.<br>2. Visualización de reglas actuales.<br>3. Modificación de horario (inicio/fin), duración máxima y días de anticipación.<br>4. Validación y guardado en `organization_settings`. |
| **Excepciones** | **Valores inválidos:** Inicio > Fin.<br>**Usuario sin permisos:** Error 403. |
| **Postcondiciones** | Reglas actualizadas aplicadas a nuevas reservas. |
| **Req. Asociados** | RF-005, RN-010 |

<br>

| **ID: CU-010** | **Agregar Miembro a la Organización** |
| :--- | :--- |
| **Objetivo** | Permitir al administrador incorporar nuevos miembros a su organización. |
| **Actor** | Administrador de la organización |
| **Precondiciones** | Administrador autenticado; usuario a agregar debe tener cuenta en el sistema. |
| **Flujo Principal** | 1. Acceso a sección de miembros.<br>2. Ingreso de email del usuario.<br>3. Verificación de existencia del usuario.<br>4. Verificación de no pertenencia previa.<br>5. Adición con rol "member". |
| **Excepciones** | **Usuario no encontrado:** Email no registrado.<br>**Usuario ya miembro:** Ya pertenece a la organización. |
| **Postcondiciones** | Usuario agregado con permisos de visualización y reserva. |
| **Req. Asociados** | RF-010 |

<br>

| **ID: CU-012** | **Unirse a Organización por Código de Invitación** |
| :--- | :--- |
| **Objetivo** | Permitir al usuario unirse de forma autónoma a una organización existente ingresando un código de invitación. |
| **Actor** | Usuario autenticado |
| **Precondiciones** | Usuario autenticado; código de invitación válido y activo en el sistema. |
| **Flujo Principal** | 1. Acceso a la pantalla de onboarding o panel principal sin organización.<br>2. Selección de la opción "Unirse a organización existente".<br>3. Ingreso del código de invitación.<br>4. Validación del código y de no pertenencia previa del usuario.<br>5. Asociación del usuario a la organización con rol "member". |
| **Excepciones** | **Código inválido:** El sistema muestra un mensaje indicando que el código no existe o está inactivo.<br>**Usuario ya miembro:** Se informa que el usuario ya pertenece a esa organización. |
| **Postcondiciones** | Usuario agregado a la organización como miembro y redireccionado al dashboard. |
| **Req. Asociados** | RF-012 |

---

##  Módulo de Reservas

| **ID: CU-006** | **Crear Reserva** |
| :--- | :--- |
| **Objetivo** | Permitir a un miembro de la organización reservar un recurso en un horario específico. |
| **Actor** | Miembro de la organización autenticado |
| **Precondiciones** | Autenticado; miembro de la organización dueña; recurso activo; reglas configuradas. |
| **Flujo Principal** | 1. Acceso a lista de recursos (con terminología personalizada según la organización: p.ej. "Salas", "Aulas", "Canchas").<br>2. Selección de recurso y visualización de disponibilidad y reglas aplicables.<br>3. Selección de fecha/hora en base a la zona horaria de la organización.<br>4. Validación client-side proactiva de las reglas de reserva (si se violan, se inhabilita el envío del formulario y se muestra una advertencia descriptiva de la regla).<br>5. Envío y validación en backend (horario, duración, pasado, solapamiento).<br>6. Guardado de reserva como "active". |
| **Excepciones** | **Solapamiento (409):** Horario ocupado.<br>**Regla incumplida:** Indica violación de duración, horario o anticipación configurada (en cliente o backend).<br>**Recurso inactivo / Usuario no miembro.** |
| **Postcondiciones** | Reserva creada; horario bloqueado para otros. |
| **Req. Asociados** | RF-006, RN-001, RN-002, RN-003, RN-009, RN-010 |

<br>

| **ID: CU-007** | **Cancelar Reserva** |
| :--- | :--- |
| **Objetivo** | Permitir cancelar una reserva existente, ya sea por el creador o por un administrador. |
| **Actor** | Creador de la reserva o Administrador |
| **Precondiciones** | Autenticado; reserva en estado "active"; permisos correspondientes. |
| **Flujo Principal** | 1. Acceso a "Mis reservas" o listado del recurso.<br>2. Selección de reserva.<br>3. Verificación de permisos.<br>4. Confirmación y cambio de estado a "cancelled". |
| **Excepciones** | **Usuario sin permisos:** Error 403.<br>**Reserva ya cancelada:** Información de estado. |
| **Postcondiciones** | Reserva en estado "cancelled"; horario liberado. |
| **Req. Asociados** | RF-007, RN-005 |

<br>

| **ID: CU-008** | **Consultar Disponibilidad** |
| :--- | :--- |
| **Objetivo** | Permitir a un usuario visualizar los horarios ocupados y libres de un recurso. |
| **Actor** | Miembro de la organización autenticado |
| **Precondiciones** | Miembro de la organización dueña; recurso existente y activo. |
| **Flujo Principal** | 1. Acceso a lista de recursos (usando nomenclatura personalizada).<br>2. Selección de recurso específico.<br>3. Consulta de reservas activas.<br>4. Visualización de calendario/agenda de disponibilidad mostrando de forma explícita e inequívoca la zona horaria de la organización (y una alerta en caso de que difiera del huso horario local de la PC o dispositivo del usuario).<br>5. Visualización proactiva de las reglas aplicables (duración máxima, días máximos de anticipación, horario permitido) antes de intentar crear la reserva. |
| **Excepciones** | **Recurso sin reservas:** Todo disponible.<br>**Usuario no miembro:** Error 403. |
| **Postcondiciones** | Información obtenida y reglas validadas visualmente antes de proceder con CU-006. |
| **Req. Asociados** | RF-008 |

<br>

| **ID: CU-009** | **Listar Recursos de la Organización** |
| :--- | :--- |
| **Objetivo** | Permitir a un usuario visualizar todos los recursos disponibles en su organización. |
| **Actor** | Miembro de la organización autenticado |
| **Precondiciones** | Miembro de al menos una organización; organización activa seleccionada. |
| **Flujo Principal** | 1. Acceso a la sección de recursos.<br>2. Consulta de recursos activos de la organización.<br>3. Muestra de lista con nombre, descripción y capacidad. |
| **Excepciones** | **Organización sin recursos:** El sistema muestra una interfaz de estado vacío (Empty State) premium y descriptiva con un CTA interactivo según el rol: (a) Si es Administrador: muestra un mensaje explicativo y un botón destacado para crear el primer recurso (redirige a CU-004); (b) Si es Miembro común: muestra un mensaje amigable indicando que no hay espacios registrados y sugiere contactar al administrador, junto a un botón para recargar/actualizar la vista.<br>**Usuario sin organización:** Redirección a pantalla de Onboarding para crear una organización (CU-002) o unirse a una existente mediante código de invitación (CU-012). |
| **Postcondiciones** | Visualización de recursos para posterior consulta o reserva. |
| **Req. Asociados** | RF-009, RN-006 |

##  Matriz de Trazabilidad

| Caso de Uso | Requisitos Funcionales | Reglas de Negocio |
|-------------|------------------------|-------------------|
| CU-001 | RF-001 | — |
| CU-002 | RF-002 | RN-007 |
| CU-003 | RF-003 | — |
| CU-004 | RF-004 | RN-004 |
| CU-005 | RF-005 | RN-010 |
| CU-006 | RF-006 | RN-001, RN-002, RN-003, RN-009, RN-010 |
| CU-007 | RF-007 | RN-005 |
| CU-008 | RF-008 | RN-006 |
| CU-009 | RF-009 | RN-006 |
| CU-010 | RF-010 | — |
| CU-011 | RF-011 | RN-011 |
| CU-012 | RF-012 | — |
