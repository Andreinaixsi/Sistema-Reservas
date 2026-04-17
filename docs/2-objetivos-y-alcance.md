# Objetivos y Alcance

## 1. Objetivo general  
Desarrollar una aplicación web multi-organización para la gestión y control de reservas de recursos compartidos, que permita a diferentes entidades (como condominios, universidades o empresas) administrar de forma eficiente sus espacios, evitando conflictos de horarios y centralizando la información en un sistema estructurado y escalable.


## 2. Objetivos específicos  

- Implementar un sistema de autenticación y gestión de usuarios con roles definidos dentro de cada organización.  
- Desarrollar un módulo de administración de recursos que permita crear, editar y eliminar espacios reservables.  
- Diseñar un sistema de reservas con validación automática de conflictos de horarios para garantizar la disponibilidad de recursos.  


## 3. Alcance funcional  
El sistema permitirá:

- Registro e inicio de sesión de usuarios  
- Creación y gestión de organizaciones independientes  
- Gestión de recursos dentro de cada organización  
- Creación, consulta y cancelación de reservas  
- Validación de conflictos de horarios  
- Visualización de disponibilidad de recursos  
- Historial de reservas por usuario  


## 4. Alcance técnico  
El sistema estará compuesto por los siguientes componentes:

- **Frontend:** Interfaz web para interacción del usuario (login, dashboard, reservas, recursos)  
- **Backend:** Lógica de negocio para gestión de usuarios, organizaciones, recursos y reservas  
- **Base de datos:** Modelo relacional para almacenar usuarios, organizaciones, recursos y reservas  
- **Autenticación:** Sistema de login con control de roles (usuario y administrador)  
- **APIs REST:** Comunicación entre frontend y backend para todas las operaciones del sistema  
- **Lógica de negocio:** Validación de conflictos de horarios y separación por organización (multi-tenant)  

## 5. Fuera de alcance  
Durante el desarrollo del semestre no se incluirán las siguientes funcionalidades:

- Integración con sistemas de pago en línea  
- Aplicación móvil nativa  
- Notificaciones push o SMS automáticas  
- Integración con sistemas externos de terceros  
- Despliegue en infraestructura cloud avanzada (CI/CD completo o producción escalada)  
## 6. Criterios de éxito  

El proyecto se considerará exitoso si cumple con los siguientes criterios:

- El sistema es funcional y permite gestionar reservas sin conflictos de horarios  
- La separación por organización (multi-tenant) funciona correctamente  
- La documentación del proyecto es coherente, completa y actualizada  
- Se aplican correctamente las reglas de arquitectura, código, documentación y pruebas  
- Se implementan pruebas mínimas que validen las funcionalidades críticas del sistema  
- La estructura de agentes e IA está definida y documentada en el repositorio  
