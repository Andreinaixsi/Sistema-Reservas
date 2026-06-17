# Prompt para Casos de Uso

A partir de los siguientes requerimientos funcionales y perfiles de usuario, genera los casos de uso del sistema. Para cada caso de uso, incluye obligatoriamente:

- Nombre del caso de uso (formato: CU-XXX)
- Objetivo: qué quiere lograr el actor
- Actor principal: quién ejecuta la acción
- Precondiciones: qué debe existir o ser cierto antes de iniciar
- Flujo principal: pasos numerados (mínimo 3, máximo 10)
- Flujos alternos: caminos opcionales si aplica
- Excepciones: errores posibles y cómo se manejan
- Postcondiciones: estado final esperado del sistema
- Requerimientos asociados: RF-XXX

## Perfiles de Usuario

1. **Usuario No Autenticado:** Persona que aún no ha iniciado sesión. Puede registrarse, crear una organización o iniciar sesión.

2. **Usuario Autenticado (Miembro):** Persona que inició sesión y pertenece a al menos una organización con rol "member". Puede ver recursos, consultar disponibilidad, crear y cancelar sus propias reservas, y editar su perfil.

3. **Administrador:** Usuario autenticado con rol "admin" en una organización. Tiene todos los permisos del miembro más: gestionar recursos (crear, editar, eliminar), configurar reglas de reserva, agregar miembros y cancelar cualquier reserva de su organización.
