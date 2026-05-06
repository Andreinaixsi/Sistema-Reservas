# Requisitos Funcionales
Este documento detalla las funcionalidades del sistema de gestión de reservas, estructuradas para su implementación técnica.

## Autenticación y Gestión de Usuarios

| ID | Requisito | Descripción | Actor | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **RF-001** | **Registro de Usuario** | Registro base sin organización inicial (email, pass, nombre). | Usuario | Alta |
| **RF-002** | **Registro de Org.** | Creación simultánea de organización y usuario administrador. | Usuario | Alta |
| **RF-003** | **Inicio de Sesión** | Autenticación y generación de token JWT. | Usuario | Alta |
| **RF-010** | **Unirse a Org.** | El administrador agrega usuarios externos a su organización. | Admin | Media |

---

##  Administración de la Organización

| ID | Requisito | Entrada | Proceso Esperado | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **RF-004** | **Gestión de Recursos** | nombre, desc, capacidad | CRUD de recursos vinculados a la organización. | Alta |
| **RF-005** | **Reglas de Reserva** | horarios, duración, días | Configuración de límites globales para las reservas. | Media |

---

##  Reservas y Consultas

| ID | Requisito | Entrada | Proceso / Salida | Prioridad |
| :--- | :--- | :--- | :--- | :--- |
| **RF-006** | **Crear Reserva** | resource_id, start, end | Valida reglas, solapamientos y guarda la reserva. | Alta |
| **RF-007** | **Cancelar Reserva** | reservation_id | Valida permisos y cambia el estado a "Cancelado". | Alta |
| **RF-008** | **Disponibilidad** | resource_id | Muestra horarios ocupados y libres del recurso. | Alta |
| **RF-009** | **Listar Recursos** | organization_id | Lista recursos activos visibles para el usuario. | Alta |

---

##  Detalles de Lógica de Negocio

### RF-002 -- Flujo de Creación de Organización
1. Se registra al usuario en la tabla `Users`.
2. Se registra la organización en la tabla `Organizations`.
3. Se establece la relación en la tabla intermedia con el rol `ADMIN`.

### RF-006 -- Validación de Reserva
Antes de confirmar una reserva, el sistema debe cumplir:
* **Pertenencia:** El usuario debe ser miembro de la organización dueña del recurso.
* **Disponibilidad:** No debe existir ninguna otra reserva en estado "Activa" que coincida en el rango de tiempo.
* **Normativa:** La duración del bloque solicitado no debe superar la `duración máxima` definida en **RF-005**.

---
_Nota: El sistema utiliza JWT para asegurar que los usuarios solo accedan a recursos de su propia organización._





