# Requerimientos No Funcionales

| ID | Atributo | Descripción | Criterios de Aceptación |
| :--- | :--- | :--- | :--- |
| **RNF-001** | **Usabilidad** | El sistema debe ser fácil de usar, con una interfaz clara e intuitiva que permita a los usuarios realizar acciones sin capacitación previa. | • Navegación simple: máximo 3 clics para una reserva.<br>• Formularios con validación de errores visibles.<br>• Diseño responsivo (PC/Móvil).<br>• Mensajes de confirmación claros. |
| **RNF-002** | **Rendimiento** | El sistema debe responder de manera rápida a las solicitudes del usuario para garantizar una buena experiencia. | • Tiempo de respuesta < 2s en operaciones comunes.<br>• Creación de reservas en < 3s.<br>• Soporte de múltiples usuarios sin degradación notable. |
| **RNF-003** | **Seguridad** | El sistema debe proteger los datos de los usuarios y garantizar el acceso controlado a la información. | • Autenticación mediante **JWT**.<br>• Contraseñas con hash **bcrypt**.<br>• Aislamiento de datos por organización.<br>• Validación de permisos para acciones críticas. |
| **RNF-004** | **Disponibilidad** | El sistema debe estar disponible la mayor parte del tiempo durante el periodo de evaluación. | • Disponibilidad mínima del **95%**.<br>• Capacidad de reinicio rápido ante fallos.<br>• Entorno local o servidor accesible para demo. |
| **RNF-005** | **Mantenibilidad** | El sistema debe estar estructurado para facilitar futuras modificaciones y ampliaciones. | • Arquitectura modular (**Screaming Architecture**).<br>• Separación clara: Frontend, Backend y DB.<br>• Código organizado por funcionalidades.<br>• Uso de *Clean Code*. |
