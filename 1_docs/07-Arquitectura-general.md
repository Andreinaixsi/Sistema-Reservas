##  Arquitectura Técnica

### 1 Stack Tecnológico 

| Capa | Tecnología | Justificación |
|------|------------|--------------|
| **Frontend** | React + Vite (sin TypeScript) | Más fácil de aprender y rápido de desarrollar |
| **UI** | Tailwind CSS | Rápido para diseñar sin complicaciones |
| **Estado** | React Query + useState | Manejo simple de datos sin sobrecarga |
| **Backend** | Python + FastAPI | Fácil, rápido y bien documentado |
| **Autenticación** | JWT + bcrypt | Estándar, suficiente y seguro |
| **Base de Datos** | PostgreSQL (Neon) | Robusto y adecuado para el sistema. La validación de solapamiento se realiza en el backend para mayor compatibilidad serverless. |
| **ORM** | SQLAlchemy | Control total del modelo |
| **Testing** | pytest (básico) | Pruebas esenciales |

### 2 Arquitectura General 

La aplicación está construida bajo un modelo **Cliente-Servidor**, donde el frontend y el backend están completamente desacoplados.

1.  **Frontend**:
    Aplicación web de una sola página (**SPA**) desarrollada con React. Se encarga de la interfaz de usuario, la navegación y el consumo de la API REST del backend. Se comunica exclusivamente mediante peticiones HTTP a endpoints que devuelven JSON.

2.  **Backend**:
    **API REST** construida con FastAPI (Python). Responsable de la lógica de negocio, validaciones (incluyendo la de solapamiento de reservas), autenticación y gestión de datos.

3.  **Base de Datos**:
    **PostgreSQL** (alojada en Neon), utilizada para almacenar usuarios, organizaciones, recursos y reservas.

4.  **Servicios Externos**:
    No se contemplan servicios externos en el MVP (posible integración futura con email o notificaciones).

5.  **Autenticación**:
    Basada en **JWT (JSON Web Token)**, permitiendo sesiones seguras y sin estado (stateless).

6.  **Hosting / Despliegue**:
     La base de datos está en la nube (Neon) para facilitar el desarrollo en equipo.

### 3 Estilo Arquitectónico

El sistema sigue una combinación de los siguientes estilos, lo que lo hace robusto y fácil de mantener:

- **Cliente-Servidor**: Separación física entre el frontend (React) y el backend (FastAPI). Esto permite desarrollarlos y probarlos de forma independiente.
- **API REST + SPA**: El backend expone una API REST consumida por una Single Page Application. La SPA no recarga la página, ofreciendo una experiencia de usuario fluida.
- **Monolito Modular**: El backend es un único servicio (un solo despliegue), pero su código está organizado en módulos independientes por dominio (`auth`, `users`, `resources`, `reservations`). Esto facilita la escalabilidad del código sin la complejidad de los microservicios.
- **Modelo-Controller (similar a MVC)**: Dentro de cada módulo del backend, la lógica se separa en:
    - **Modelos (SQLAlchemy):** Definen la estructura de los datos y la capa de persistencia.
    - **Controladores (FastAPI):** Gestionan las peticiones HTTP y las respuestas.
    - **Servicios:** Contienen la lógica de negocio (validaciones, reglas, etc.).
    La "Vista" (View) del MVC clásico se traslada completamente al frontend (React).

### 4 Componentes Principales

| Componente | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Cliente (Frontend)** | React, Vite, Tailwind CSS | Interfaz de usuario, gestión de estado con React Query y enrutamiento con React Router. |
| **API (Backend)** | Python, FastAPI | Lógica de negocio, validación de reglas y solapamientos, autenticación JWT, y comunicación con la BD mediante SQLAlchemy. |
| **Base de Datos** | PostgreSQL (Neon) | Persistencia de toda la información del sistema, garantizando la integridad referencial y el aislamiento de datos entre organizaciones. |

### 5 Flujo General de Datos

1.  El usuario interactúa con la **SPA (React)** en el navegador (ej: rellena el formulario de reserva).
2.  La SPA realiza una petición HTTP a un endpoint de la **API REST (FastAPI)**.
3.  El backend valida el **token JWT** en el header de autorización para identificar al usuario.
4.  Los **controladores** reciben la petición y delegan la lógica en los **servicios**.
5.  Los servicios ejecutan la lógica de negocio (validar reglas de la organización, verificar solapamiento, etc.).
6.  Los servicios utilizan **SQLAlchemy** para interactuar con la base de datos **PostgreSQL**.
7.  La base de datos devuelve los resultados o confirma la transacción.
8.  El backend formatea la respuesta y la envía al frontend en formato **JSON**.
9.  El frontend actualiza la interfaz de usuario con los nuevos datos (ej: muestra la reserva creada o un mensaje de error).

### 6 Diagrama Sugerido
[Diagrama de flujo de datos](assets/diagramas/Diagrama-sugerido.png)

### 7 Decisiones Técnicas Relevantes

- **Python y FastAPI**: Se eligió Python por su legibilidad y rapidez de desarrollo. FastAPI añade alto rendimiento y documentación automática (Swagger).
- **React**: Framework popular basado en componentes. Permite crear interfaces de usuario dinámicas y reutilizables.
- **PostgreSQL**: Base de datos relacional robusta que asegura la integridad de los datos y el aislamiento multi-tenant.
- **SQLAlchemy**: ORM maduro que permite interactuar con la base de datos usando objetos Python, evitando inyecciones SQL.
- **JWT y bcrypt**: Estándar para autenticación segura y sin estado.
- **Tailwind CSS**: Framework CSS utilitario que acelera el diseño de la interfaz.
- **Validación de solapamiento en Backend**: Decisión tomada por compatibilidad con Neon. Permite un control más granular y mensajes de error personalizados.

