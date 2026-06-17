#  Bitácora de Avances
## Sistema de Gestión de Reservas Multi-Organización

### Equipo
- José Sánchez-puga
- Andreina Martinez
---

## Registro #1 — Especificación de Planteamiento y objetivos

**Fecha:** 15 de abril de 2026

**Avance realizado:**
- Definición del planteamiento del problema
- Definición de objetivos y alcance del proyecto 
- 
**Documentos actualizados:**
- [Planteamiento del Problema](01-Planteamiento-del-Problema.md)
- [Objetivos y Alcance](02-Objetivos-y-Alcance.md)

**Código modificado:**
- No aplica (fase de planificación)

**Problemas encontrados:**
- Ninguno en esta fase

**Próximo paso:**
- Los requiisitos funcionales y no funcionales
---

## Registro #2 Especificación de requisitos funcionales y no funcionales

**Fecha:** 20 de abril de 2026

**Avance realizado:**
-Se documentó las requerimientos del sistema

**Documentos actualizados:**
- [Requerimientos funcionales](03-Requerimientos-Funcionales.md)
- [Requerimientos No Funcionales](04-Requerimientos-No-Funcionales.md)
  
**Código modificado:**
- No aplica (documentación)

**Problemas encontrados:**
-

**Próximo paso:**
- Hacer los casos de uso

---

## Registro #3 Casos de uso y Reglas de negocio

**Fecha:** 26 de Abril de 2026

**Avance realizado:**
- Documentación de 11 Casos de Uso (CU-001 a CU-011) y especificacion de las reglas de negocio
- Creación de matriz de trazabilidad (CU ↔ RF ↔ RN)
-  Adición de RF-011 (Editar Perfil) al SRS

  
**Documentos actualizados:**
- [Casos de uso](05-Casos-de-Uso.md)
- [Reglas de Negocio](07-Reglas-de-negocio.md)
- [Requerimientos funcionales](03-Requerimientos-Funcionales.md)

**Código modificado:**
-  No aplica (documentación)

**Problemas encontrados:**
- No se habia especificado que el usuario pueda modificar sus datos personales (nombre, email, contraseña).

**Próximo paso:**
- 

---

## Registro #4 — Documentación Técnica 

**Fecha:** 30 de abril de 2026

**Avance realizado:**
- Diseño de arquitectura del sistema (cliente-servidor, monolito modular)
- Selección del stack tecnológico (React, FastAPI, PostgreSQL)
- Adición de RN-011 (Email único al editar) a Reglas de Negocio

**Documentos actualizados:**
- [Arquitectura general](07-Arquitectura-general.md)
- [Reglas de Negocio](07-Reglas-de-negocio.md)

**Código modificado:**
- No aplica (documentación)

**Problemas encontrados:**
- No se habia especificado que al cambiar el email, debe validarse que no exista otro usuario con ese email en los requerimientos

**Próximo paso:**
- Diseñar el backend y el frontend
---

## Registro #5 — Diseño backend y el frontend

**Fecha:** 05 de mayo de 2026

**Avance realizado:**
- 
**Documentos actualizados:**
- [Diseño Frontend](08-Diseño-Frontend.md)
- [Diseño Backend](09-Diseño-Backend.md)

**Código modificado:**
- Documentación de Diseño Frontend (Estructura de Pantallas, Navegación, Componentes Clave)
- Documentación de Diseño Backend (Responsabilidades, Módulos, Lógica de Negocio, Manejo de Errores)

**Problemas encontrados:**
- Ninguno en esta fase

**Próximo paso:**
- 

---

## Registro #6 — Modelo de datos y creación de base de datos, Avances hasta ahora

**Fecha:** 20 de mayo de 2026

**Avances realizado:**
- Creacion de modelo de datos relacional (7 tablas: users, organizations, organization_members, organization_settings, resources, reservations)
- Creación de cuenta en Neon 
- Creación del proyecto `neondb` en Neon
- Obtención de la URL de conexión
- Instalación y configuración de pgAdmin 4
- Conexión exitosa de pgAdmin a Neon
- Ejecución del script SQL con 7 tablas creadas correctamente
- Inserción de datos de prueba (2 usuarios, 1 organización, 3 recursos, 1 reserva)
- Se documentó la consulta de validación en el flujo de creación de reserva
- Se decidió mover la validación de solapamiento de la base de datos al backend.
  
**Documentos actualizados:**
- [Modelo de datos](10-Modelo-de-Datos.md)
- [Arquitectura general](07-Arquitectura-general.md)
- [Diseño Backend](09-Diseño-Backend.md)
  
**Código modificado:**
- 

**Problemas encontrados:**
-  Error con la restricción `EXCLUDE` usando `tstzrange` en Neon (incompatible). Solución: eliminar la restricción de la BD y mover la validación de solapamiento al backend.

**Próximo paso:**
- [Imagenes neon y postgre](assets/imágenes/Neon1.jpeg)
- [Imagenes neon y postgre](assets/imágenes/Neon2.jpeg)
- [Imagenes neon y postgre](assets/imágenes/PostgreSQL1.png)
- [Imagenes neon y postgre](assets/imágenes/PostgreSQL2.png)
---

## Registro #7 — Api e interfaces

**Fecha:** 24 de Mayo de 2026

**Avance realizado:**
- Creacion de documentacion de apis e interfaces
**Documentos actualizados:**
- [Api e interfaces](11-Api-e-Interfaces.md)

**Código modificado:**
-

**Problemas encontrados:**
-
**Próximo paso:**
-
## Registro #7 — Cambios realizados hazta ahora

**Fecha:**  3 de Junio de 2026

**Avance realizado:**
-  Se diseñó y documentó el sistema de Códigos de Invitación (RF-012 y CU-012) que permite a los usuarios comunes unirse de forma autónoma a una organización.
- Se definieron 3 nuevos endpoints en la API (API-015, API-016 y API-017) y la interfaz visual `/onboarding`.
- Se introdujeron etiquetas personalizadas (resource_label_singular y resource_label_plural) para reemplazar nombres abstractos ("Organización", "Recursos") por términos del contexto de uso (ej. "Cancha", "Sala").
- Se especificó que el frontend debe visualizar explícitamente el timezone de la organización y alertar si difiere de la zona horaria del cliente local para evitar solapamientos accidentales.
- Se definió la renderización de las limitaciones de reserva antes de que el usuario envíe su formulario de reserva, añadiendo validación del lado del cliente.
- Se actualizó RNF-001 (Usabilidad) y CU-009 para requerir layouts de pantallas vacías interactivas con CTAs dinámicos en base al rol (Admin vs Miembro) para prevenir confusión en usuarios no técnicos.

**Documentos actualizados:**
- [Requerimientos funcionales](03-Requerimientos-Funcionales.md) Se agregó RF-012: Unirse por Código 
- [Requerimientos No Funcionales](04-Requerimientos-No-Funcionales.md) RNF-001 (Usabilidad). Empty States interactivos 
- [Modelo de datos](10-Modelo-de-Datos.md) Entidad: organizations actualizada 
- [Casos de uso](05-Casos-de-Uso.md) CU-012 (Unirse por Código), CU-006, CU-008, CU-009 actualizados 
- [Api e interfaces](11-Api-e-Interfaces.md) API-002, API-004, API-015, API-016, API-017 
- [Diseño Frontend](08-Diseño-Frontend.md) Estructura de Pantallas actualizada 

**Código modificado:**
-

**Problemas encontrados:**
- El usuario no tenía forma autónoma de unirse, quedando bloqueado a la espera de que el administrador lo agregue.
- Falta de personalización de etiquetas. Si un usuario está en el contexto de un condominio, espera leer términos como "Residencias" y "Salón de fiestas".
- Si el frontend no muestra explícitamente en qué huso horario se está haciendo la reserva, un usuario que viaje o tenga su dispositivo mal configurado podría reservar en el horario equivocado, generando solapamientos accidentales.
- Las organizaciones pueden configurar días de anticipación y duración máxima (RF-005). Si estas reglas no se muestran de forma clara en la interfaz antes de que el usuario intente reservar (CU-006), el usuario se enfrentará a mensajes de error de validación sin entender por qué su horario fue rechazado.

**Próximo paso:**
- actualizar la tabla en neon 

## Registro #7 — Actualizacion base de datos, 

**Fecha:** 6 de Junio de 2026

**Avance realizado:**
- Creación de la estructura de carpetas del proyecto (backend, frontend, database)
- Configuración del entorno virtual de Python (venv)
- Instalación de dependencias (FastAPI, SQLAlchemy, uvicorn, python-jose, bcrypt, python-dotenv)
- Agregadas columnas resource_label_singular, resource_label_plural e invite_code a la tabla organizations
- Personalización de etiquetas para la organización de prueba ("Salón", "Salones")

**Código modificado:**
- Base de datos Neon — Tabla organizations actualizada

**Problemas encontrados:**
-Falla en la cmd de la pc , no se podian instalar las dependencias , ni utilizar el git

## Registro #7 — Avances hasta ahora

**Fecha:** 16 de Junio de 2026

**Avance realizado:**
-Se ejecutaron los protocolos de pruebas sobre la aplicación web, detectándose una anomalía crítica en el módulo de autenticación (login) que redirigía por defecto a la interfaz de administración. Dicho inconveniente fue solventado con éxito, garantizando la restricción de accesos correspondientes a cada rol.
- A pesar de los inconvenientes con el entorno local, se logró gestionar y subir el  proyecto al repositorio remoto en GitHub utilizando una estación de trabajo alterna.

  

**Problemas encontrados:**
- El sistema actual carece de los módulos destinados a la Edición de Perfil de usuario y al mecanismo de Recuperación de Contraseñas, quedando registrados como requerimientos pendientes.
- Se presentaron fallas operativas con la herramienta Git en la computadora principal, lo que impidió realizar el control de versiones de forma regular y obligó a utilizar un equipo portátil secundario.
- Al realizar el despliegue desde la estación alterna, un error en la ejecución del commit inicial limpio sobrescribió el historial en GitHub, ocasionando el borrado accidental de la documentación técnica previamente almacenada.


 - [portatil secundario](assets/imágenes/Laptop-git.png)

## Registro #7 — Manuales de usuario y técnico

**Fecha:** 17 de Junio de 2026

**Avance realizado:**
-Se realizaron los manuales con la explicación detallada de como instalar debidamente el Sistema en local y como debe Ingresar el usuario al sistema, mostrando todos los flujos correspondientes.

[evidencia sistema ejecución](_deliverables/evidencia/ejecución)
