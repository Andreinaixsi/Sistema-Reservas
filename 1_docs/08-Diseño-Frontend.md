##  Diseño Frontend

### 7.1 Objetivo del Frontend

El frontend es la capa de interacción con el usuario. Su objetivo principal es proporcionar una **interfaz clara, rápida y accesible** que permita a los miembros de distintas organizaciones gestionar reservas de recursos sin fricciones. Debe guiar al usuario a través de los flujos principales (registro, creación de reservas, consulta de disponibilidad) minimizando la cantidad de clics y mostrando mensajes de error y confirmación comprensibles.

### 7.2 Estructura de Pantallas

La aplicación se organiza en las siguientes pantallas principales, accesibles según el estado de autenticación y el rol del usuario:

| Pantalla | Ruta | Descripción | Actor(es) |
| :--- | :--- | :--- | :--- |
| **Inicio / Landing** | `/` | Página de bienvenida con breve descripción del sistema y botones para **Iniciar Sesión** o **Registrarse**. | Usuario no autenticado |
| **Login** | `/login` | Formulario con campos de email,nombre y contraseña. | Usuario no autenticado |
| **Registro** | `/register` | Formulario para crear cuenta (RF-001). Opción de marcar "Quiero crear una organización" para pasar al flujo RF-002. | Usuario no autenticado |
| **Registro de Org.** | `/register-org` | Formulario extendido que solicita nombre de la organización, tipo y los datos del usuario administrador (RF-002). | Usuario no autenticado |
| **Onboarding** | `/onboarding` | Pantalla para usuarios registrados sin organización. Permite elegir entre crear una nueva organización (CU-002) o unirse a una existente ingresando un código (CU-012). | Usuario autenticado sin org |
| **Dashboard** | `/dashboard` | Panel principal post-login. Muestra un resumen de las próximas reservas del usuario y accesos rápidos a recursos y "Mis reservas". | Usuario autenticado |
| **Recursos** | `/resources` | Lista de recursos activos de la organización seleccionada (RF-009). Cada recurso es una card que permite acceder a su disponibilidad y reserva. | Usuario autenticado |
| **Detalle de Recurso** | `/resources/:id` | Vista de calendario/lista semanal con disponibilidad del recurso (RF-008). Botón "Nueva Reserva" que despliega el formulario de creación (RF-006). | Usuario autenticado |
| **Mis Reservas** | `/my-reservations` | Listado de reservas activas y canceladas del usuario autenticado. Permite cancelar (RF-007) haciendo clic en un botón. | Usuario autenticado |
| **Administrar Recursos** | `/admin/resources` | CRUD de recursos: tabla con acciones de editar y eliminar, y botón para crear nuevo recurso (RF-004). | Administrador |
| **Configuración** | `/admin/settings` | Formulario para modificar reglas de reserva de la organización (RF-005): horario permitido, duración máxima y mínima, anticipación. | Administrador |
| **Miembros** | `/admin/members` | Tabla de miembros de la organización con botón "Agregar miembro" (RF-010), visualización, desactivación y regeneración del código de invitación (RF-012). | Administrador |

### 7.3 Navegación

La navegación se gestiona con **React Router**. La estructura de navegación cambia según el estado de autenticación:

- **Usuario no autenticado:**
  - Barra superior simple con logo y enlaces fijos: `Iniciar Sesión` y `Registrarse`.
  - Las rutas protegidas redirigen automáticamente al `/login`.

- **Usuario autenticado:**
  - **Navbar superior**: muestra el nombre del usuario, un selector de organización activa, y un icono de perfil.
  - **Sidebar** (panel lateral): enlaces a `Dashboard`, `Recursos`, `Mis Reservas`.
  - Si el usuario es **administrador**, el Sidebar muestra un segundo bloque "Administración" con enlaces a `Gestionar Recursos`, `Miembros` y `Configuración`.
  - En dispositivos móviles, el Sidebar se colapsa en un menú tipo "hamburguesa".

### 7.4 Componentes Clave

La interfaz se construye con componentes reutilizables, principalmente:

| Componente | Descripción | Ubicación |
| :--- | :--- | :--- |
| **Navbar** | Barra de navegación superior. Contiene el logo, enlaces principales, selector de organización y menú de usuario. | `shared/components/Navbar.jsx` |
| **Sidebar** | Panel lateral de navegación. Muestra enlaces agrupados por funcionalidad. Se oculta en móviles. | `shared/components/Sidebar.jsx` |
| **ResourceCard** | Tarjeta que muestra nombre, descripción y capacidad de un recurso. Al hacer clic, navega al detalle. | `features/resources/components/ResourceCard.jsx` |
| **ReservationForm** | Formulario controlado para seleccionar fecha, hora de inicio y fin. Incluye validación de rango y reglas de la organización. | `features/reservations/components/ReservationForm.jsx` |
| **ReservationList** | Tabla o lista de reservas. Muestra estado, recurso, horario y un botón de "Cancelar" si la reserva está activa y pertenece al usuario. | `features/reservations/components/ReservationList.jsx` |
| **AvailabilityCalendar** | Visualización básica de una semana en columnas. Muestra bloques horarios ocupados en rojo y libres en verde. | `features/resources/components/AvailabilityCalendar.jsx` |
| **Modal** | Ventana flotante genérica para confirmaciones (ej: "¿Estás seguro de cancelar esta reserva?"). | `shared/components/Modal.jsx` |
| **Button** | Botón reutilizable con variantes (primario, secundario, peligro). | `shared/components/Button.jsx` |


### 7.5 Manejo de Estados y Peticiones

- **React Query**: se encarga de obtener, cachear y sincronizar los datos del backend (recursos, reservas, disponibilidad). Automáticamente refresca la información tras una mutación exitosa.
- **useState + useContext**: se usa para el estado global simple, como el **token JWT** (almacenado en localStorage, como se definió en el MVP) o la **organización activa** seleccionada por el usuario.
- **Manejo de errores**: se muestra un componente `ErrorMessage` en línea o un toast de notificación (según la gravedad) cuando el backend retorna errores `409 Conflict`, `403 Forbidden` o `422 Validation Error`.

### 7.6 Diseño Responsivo y Usabilidad

- **Tailwind CSS** aplica un diseño *mobile-first*. Las pantallas de listado y detalle se adaptan a dispositivos móviles.
- Los formularios muestran **validación en tiempo real**: los campos inválidos se marcan en rojo con un mensaje justo debajo.
- El flujo de creación de reserva desde el Dashboard no supera los **3 clics**: (1) Seleccionar recurso → (2) Elegir horario → (3) Confirmar.
