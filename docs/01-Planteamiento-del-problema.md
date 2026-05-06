# Planteamiento del Proyecto
# 1. Título del proyecto

Sistema web de gestión y control de reservas de recursos multi-organización

# 2. Descripción del problema

En múltiples entornos como condominios, universidades, empresas y centros recreativos, la gestión de recursos compartidos (salas, canchas, salones, equipos, entre otros) se realiza de forma manual o mediante herramientas no centralizadas.

Este enfoque genera diversos problemas operativos, especialmente cuando varias personas necesitan acceder a los mismos recursos dentro de una misma organización, tales como:

Conflictos de horarios debido a reservas duplicadas
Falta de visibilidad en tiempo real de la disponibilidad
Pérdida de control sobre el uso de los recursos
Procesos informales de solicitud (mensajes, papel o Excel)
Dificultad para administrar múltiples espacios dentro de una misma entidad

Además, en organizaciones con múltiples grupos o usuarios activos, no existe una separación adecuada de la información, lo que puede provocar confusión y desorganización en la gestión de reservas.

Por otro lado, cuando diferentes organizaciones utilizan sistemas independientes o no estandarizados, se pierde la posibilidad de contar con una solución unificada, escalable y eficiente para la administración de recursos compartidos.

# 3. Justificación

El desarrollo de este sistema es relevante desde tres perspectivas:

Académica:
Permite aplicar conceptos fundamentales de ingeniería de software como bases de datos relacionales, autenticación de usuarios, validación de datos, arquitectura web y control de concurrencia.

Técnica:
El proyecto incorpora el diseño de un sistema multi-organización , validación de conflictos de horarios, manejo de roles de usuario y desarrollo de una aplicación web completa con backend y frontend.

Práctica:
Resuelve un problema real presente en múltiples entornos, permitiendo una gestión eficiente, centralizada y automatizada de recursos compartidos, reduciendo errores humanos y mejorando la organización.

# 4. Público objetivo

El sistema está dirigido a organizaciones que requieran gestionar recursos compartidos de manera estructurada.

Tipo de usuario:
Administradores de organizaciones (condominios, empresas, universidades)
Usuarios finales (residentes, estudiantes, empleados)
Necesidades:
Reservar recursos de forma rápida y confiable
Evitar conflictos de horarios
Visualizar disponibilidad en tiempo real
Administrar recursos dentro de su propia organización
Limitaciones:
Bajo conocimiento técnico de algunos usuarios
Necesidad de una interfaz simple e intuitiva
Dependencia de conexión a internet para uso del sistema
Contexto de uso:
Condominios (salones de fiesta, piscinas, parrilleras)
Universidades (aulas, laboratorios)
Empresas (salas de reuniones)
Centros deportivos (canchas, equipos)
# 5. Idea general de la solución

Se propone desarrollar una aplicación web multi-organización que permita la gestión de reservas de recursos compartidos de forma centralizada.

Cada organización contará con su propio espacio independiente dentro del sistema, donde podrá registrar usuarios, definir recursos y gestionar reservas sin interferencia de otras organizaciones.

El sistema validará automáticamente los horarios para evitar conflictos y garantizar la correcta asignación de recursos. Además, permitirá visualizar la disponibilidad en tiempo real y consultar el historial de reservas, mejorando la organización y el control del uso de los recursos.

# 6. Alcance inicial del proyecto

En la primera versión del sistema se incluirá:

Registro e inicio de sesión de usuarios
Gestión de organizaciones (estructura base del sistema)
Gestión de recursos dentro de cada organización
Creación y cancelación de reservas
Validación de conflictos de horarios
Visualización de disponibilidad de recursos

No se incluirán inicialmente funcionalidades avanzadas como pagos en línea, notificaciones automáticas o integración con sistemas externos.

# 7. Restricciones

El desarrollo del proyecto está limitado por:

Tiempo académico disponible durante el semestre
Recursos tecnológicos limitados
Uso de tecnologías web estándar (backend, frontend y base de datos relacional)
Implementación en entorno de desarrollo local o despliegue básico
Nivel de experiencia del equipo de desarrollo
8. Riesgos iniciales
Errores en la validación de horarios que permitan reservas conflictivas
Complejidad en el diseño de la base de datos multi-organización
Falta de tiempo para implementar todas las funcionalidades planificadas
Problemas de integración entre frontend y backend
Dificultad en la gestión correcta de permisos y roles de usuario
