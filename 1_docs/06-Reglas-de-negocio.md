# Reglas de Negocio


### RN-001 — No Solapamiento de Reservas
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-001 |
| **Descripción** | No se permiten dos reservas activas para el mismo recurso en un mismo rango de tiempo. |
| **Condición** | Al crear una nueva reserva. |
| **Resultado esperado** | Si existe conflicto, se rechaza la reserva. |
| **Tipo** | Restricción |
| **Fuente** | Necesidad del sistema |

---

### RN-002 — Validación de Horario
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-002 |
| **Descripción** | La hora de inicio debe ser menor que la hora de fin. |
| **Condición** | Al crear o modificar una reserva. |
| **Resultado esperado** | Si el horario es inválido, se rechaza la operación. |
| **Tipo** | Validación |
| **Fuente** | Lógica del sistema |

---

### RN-003 — Reservas en el Pasado
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-003 |
| **Descripción** | No se permite crear reservas en fechas u horas pasadas. |
| **Condición** | Al registrar una nueva reserva. |
| **Resultado esperado** | Se rechaza la solicitud. |
| **Tipo** | Restricción |
| **Fuente** | Necesidad del sistema |

---

### RN-004 — Permisos de Administrador
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-004 |
| **Descripción** | Solo los administradores pueden crear, modificar o eliminar recursos. |
| **Condición** | Al gestionar recursos. |
| **Resultado esperado** | Usuarios sin permisos no pueden realizar estas acciones. |
| **Tipo** | Restricción |
| **Fuente** | Política del sistema |

---

### RN-005 — Cancelación de Reservas
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-005 |
| **Descripción** | Solo el usuario que creó la reserva o un administrador puede cancelarla. |
| **Condición** | Al intentar cancelar una reserva. |
| **Resultado esperado** | Se valida el permiso antes de cancelar. |
| **Tipo** | Restricción |
| **Fuente** | Política del sistema |

---

### RN-006 — Aislamiento por Organización
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-006 |
| **Descripción** | Los usuarios solo pueden ver y gestionar datos de las organizaciones a las que pertenecen. |
| **Condición** | En cualquier consulta o acción. |
| **Resultado esperado** | Se restringe el acceso a datos externos. |
| **Tipo** | Restricción |
| **Fuente** | Seguridad del sistema |

---

### RN-007 — Asociación Automática de Administrador
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-007 |
| **Descripción** | El usuario que crea una organización se asigna automáticamente como administrador. |
| **Condición** | Al crear una organización. |
| **Resultado esperado** | Se asigna rol admin al usuario. |
| **Tipo** | Flujo |
| **Fuente** | Decisión del proyecto |

---

### RN-008 — Estado de Reserva
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-008 |
| **Descripción** | Las reservas deben tener un estado válido (activa o cancelada). |
| **Condición** | Al crear o modificar una reserva. |
| **Resultado esperado** | Se guarda con estado válido. |
| **Tipo** | Validación |
| **Fuente** | Lógica del sistema |

---

### RN-009 — Uso de Recursos Activos
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-009 |
| **Descripción** | Solo se pueden reservar recursos que estén activos. |
| **Condición** | Al crear una reserva. |
| **Resultado esperado** | Si el recurso está inactivo, se rechaza la operación. |
| **Tipo** | Restricción |
| **Fuente** | Lógica del sistema |

---

### RN-010 — Reglas de Horario de Organización
| Atributo | Detalle |
| :--- | :--- |
| **ID** | RN-010 |
| **Descripción** | Las reservas deben respetar los horarios definidos por la organización. |
| **Condición** | Al crear una reserva. |
| **Resultado esperado** | Se valida que el horario esté dentro del rango permitido. |
| **Tipo** | Validación |
| **Fuente** | Configuración del sistema |

---

### RN-011 — Regla de Negocio: Cambio de Email
| ID | Descripción | Condición | Resultado esperado | Tipo |
| :--- | :--- | :--- | :--- | :--- |
| **RN-011** | Email único al editar | Al cambiar el email, debe validarse que no exista otro usuario con ese email. | Si el email ya está en uso, se rechaza el cambio. | *No especificado* |

