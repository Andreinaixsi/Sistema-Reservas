#Requisitos Funcionales

##RF-001 -- Registro de Usuario

**Descripción**: El sistema debe permitir a un usuario registrarse sin pertenecer inicialmente a una organización. 
**Actor**: Usuario
**Entrada**: email, contraseña, nombre 
**Proceso esperado**:

1. Validar que el email no exista
2. Crear usuario en la base de datos

**Salida**: Usuario registrado 
**Prioridad**: Alta
**Observaciones**: El usuario no tendrá organización hasta unirse o crear una.

##RF-002 -- Registro de Organización (Creación de Administrador)

**Descripción**: El sistema debe permitir crear una organización junto con un usuario administrador. Actor: Usuario Entrada: nombre, email, contraseña, nombre de organización, tipo
**Proceso esperado**:
1. Crear usuario
2. Crear organización
3. Asociar usuario como administrador 

**Salida**: Organización creada con usuario administrador 
**Prioridad**: Alta 
**Observaciones**: Este flujo reemplaza el registro simple si el usuario desea administrar.

##RF-003 -- Inicio de Sesión

**Descripción**: Permite a los usuarios autenticarse en el sistema.
**Actor**: Usuario 
**Entrada**: email, contraseña Proceso esperado:

1. Validar credenciales

2. Generar token JWT

**Salida**: Acceso al sistema Prioridad: Alta


##RF-004 -- Gestión de Recursos

**Descripción**: Permite al administrador crear, editar y eliminar recursos dentro de su organización.
**Actor**: Administrador
**Entrada**: nombre, descripción, capacidad 
**Proceso esperado**:

1. Validar permisos de administrador
2. Guardar recurso asociado a la organización

**Salida**: Recurso creado/modificado/eliminado Prioridad: Alta
**Observaciones**: Solo administradores pueden gestionar recursos.

## RF-005 --Configuración de Reglas de Reserva

**Descripción**: Permite al administrador definir reglas para el uso de los recursos. 
**Actor**: Administrador
**Entrada**:

1. horarios permitidos (inicio/fin)

2. duración máxima

3. días permitidos

**Proceso esperado**:

1. Guardar configuración en la organización

2. Aplicar reglas en validaciones de reservas 

**Salida**: Reglas configuradas
**Prioridad**: Media 
**Observaciones**: Las reglas afectan todas las reservas.

## RF-006 -- Crear Reserva

**Descripción**: Permite a un usuario reservar un recurso en un horario específico. 
**Actor**: Usuario autenticado 
**Entrada**: resource_id, start_time, end_time
**Proceso esperado**:

1. Validar reglas de la organización

2. Verificar solapamientos

3. Guardar reserva

**Salida**: Reserva creada
**Prioridad**: Alta

##RF-007 -- Cancelar Reserva

**Descripción**: Permite cancelar una reserva existente. **Actor**: Usuario / Administrador 
**Entrada**: reservation_id
**Proceso esperado**:

1. Validar permisos

2. Cambiar estado de la reserva

**Salida**: Reserva cancelada
**Prioridad**: Alta

##RF-008 -- Visualizar Disponibilidad

**Descripción**: Permite consultar horarios disponibles de un recurso.
**Actor**: Usuario 
**Entrada**: resource_id 
**Proceso esperado**:

1. Consultar reservas existentes

2. Mostrar horarios ocupados 

**Salida**: Disponibilidad del recurso 
**Prioridad**: Alta

##RF-009 -- Listar Recursos

**Descripción**: Permite visualizar los recursos disponibles en una organización.
**Actor**: Usuario autenticado 
**Entrada**: organization_id 
**Proceso esperado**: El sistema consulta los recursos activos. 
**Salida**: Lista de recursos 
**Prioridad**: Alta 
**Observaciones**: Solo recursos de su organización.

##RF-010 -- Unirse a Organización

**Descripción**: Permite agregar usuarios a una organización. 
**Actor**: Administrador
**Entrada**: email del usuario
**Proceso esperado**: Se registra al usuario como miembro en la organización. 
**Salida**: Usuario agregado a la organización
**Prioridad**: Media 
**Observaciones**: Puede simplificarse en MVP sin invitaciones reales.
