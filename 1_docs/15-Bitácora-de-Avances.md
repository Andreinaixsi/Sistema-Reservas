# 📓 Bitácora de Avances
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

## Registro #4 — Documentación Técnica Completa

**Fecha:** 30 de abril de 2026

**Avance realizado:**
- Documentación de Arquitectura General
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
- Creacion de modelo de datos relacional 
- Creación de cuenta en Neon (neon.tech)
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
- 
---

## Registro #7 — diagramas de ER y MER, y de flujo de datos 

**Fecha:** 24 de Mayo de 2026

**Avance realizado:**
-Creacion  Diagramas 

**Documentos actualizados:**
- [Modelo de datos](10-Modelo-de-Datos.md)

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
- [Modelo de datos](10-Modelo-de-Datos.md)

**Código modificado:**
-

**Problemas encontrados:**
-
**Próximo paso:**
-



- **Base de Datos:** Neon (PostgreSQL en la nube)
- **Fechas límite:** Entrega final: [dd/mm/aaaa]
