#  Manual de Usuario
## Sistema de Gestión de Reservas Multi-Organización



## 1. Introducción

El **Sistema de Gestión de Reservas** es una aplicación web que permite a diferentes organizaciones (condominios, universidades, empresas, centros deportivos) gestionar la reserva de sus espacios compartidos (salones, canchas, salas de reuniones, etc.).

Con este sistema podrás:
- Registrarte y crear o unirte a una organización.
- Ver los espacios disponibles en tu organización.
- Reservar un espacio en un horario específico.
- Cancelar tus reservas si ya no las necesitas.
- (Si eres administrador) Gestionar los espacios y miembros de tu organización.

El sistema está diseñado para ser intuitivo: **crear una reserva no te tomará más de 3 clics**.
<img width="1240" height="597" alt="pantalla principal" src="https://github.com/user-attachments/assets/e90a7422-3b17-437a-8297-0da51869f10b" />

---

## 2. Acceso al Sistema

### 2.1 Registro de Usuario(member)

Si aún no tienes cuenta:

1. Abre la aplicación en tu navegador.
2. Haz clic en **"Registrarse"**.
3. Completa los campos:
   - **Email**: tu correo electrónico (debe ser válido y no estar registrado).
   - **Contraseña**: mínimo 6 caracteres.
   - **Nombre completo**: cómo quieres que te identifiquen en el sistema.
4. Haz clic en **"Registrarse"**.
5. Si todo es correcto serás redirigido al inicio de sesión.

> **Nota:** Al registrarte no estarás en ninguna organización todavía. Deberás crear una o unirte a una existente.

<img width="1240" height="597" alt="Registro usuario" src="https://github.com/user-attachments/assets/06ef2d3d-21cc-456b-9c0e-6159e20506ee" />


### 2.2 Registro con Organización (Administrador)

Si quieres crear tu propia organización y ser su administrador:

1. Haz clic en **"Crea una Organización"** en la página de Inicio de sesión.

<img width="1240" height="597" alt="Inicio de Sesion" src="https://github.com/user-attachments/assets/6f3603cd-8a7f-43d9-8bd4-a987fe4aca86" />

2. Completa tus datos personales (email, contraseña, nombre).
3. Completa los datos de la organización:
   - **Nombre**: ej. "Edificio Las Palmas".
   - **Tipo**: condominio, universidad, empresa, centro deportivo u otro.
   - Nomencaltura de como llama a las áreas
4. Haz clic en **"Registrar Organización"**.
5. ¡Listo! Eres el administrador de tu nueva organización.

<img width="1240" height="694" alt="Registro Administrador-Organizacion" src="https://github.com/user-attachments/assets/0d43ac0b-b8f5-493f-9684-bb5fdb411ced" />

### 2.3 Inicio de Sesión

Si ya tienes cuenta:

1. Haz clic en **"Iniciar Sesión"**.
2. Ingresa tu **email** y **contraseña**.
3. Haz clic en **"Entrar"**.
4. Accederás al **Dashboard** principal.
<img width="1240" height="597" alt="Ejemplo registro member" src="https://github.com/user-attachments/assets/4f3dffed-32b2-4136-b0c9-b548cc51d6da" />
<img width="1240" height="597" alt="Ejemplo inicio" src="https://github.com/user-attachments/assets/30a9cd9c-da8d-4849-9386-a046466af457" />


---

### 2.4 Unirse a una Organización (Código de Invitación)

Si tu administrador te dio un código de invitación:

1. Inicia sesión en el sistema.
2. Si no perteneces a ninguna organización, verás la pantalla de **Onboarding**.
3. Ingresa el **código de invitación** (ej. `ABC12345`).
4. Haz clic en **"Unirse a la organización"**.
5. Quedarás registrado como miembro de la organización y podrás ver sus espacios.

<img width="1240" height="669" alt="Invitacion member" src="https://github.com/user-attachments/assets/5322163e-247d-4ed9-b763-d57ec646c6bd" />

<img width="1240" height="597" alt="Pantalla principal mamber" src="https://github.com/user-attachments/assets/789796b6-9daa-4d63-9692-9a7571bf9348" />


## 3. Flujos Principales

---

### Flujo 1: Crear una Reserva (Miembro)

Este es el flujo más importante del sistema. Sigue estos pasos:

**Paso 1: Acceder a los espacios disponibles**

Desde el menú lateral (Sidebar), haz clic en **"Áreas comúnes"**. Verás una lista de los espacios disponibles en tu organización.

<img width="1240" height="597" alt="image" src="https://github.com/user-attachments/assets/49484afa-d77c-4e78-9b50-25b284579f68" />

> **Nota:** Los nombres de los espacios pueden variar según tu organización. Por ejemplo, en un condominio podrían llamarse "Salones" o "Canchas".

**Paso 2: Seleccionar un espacio**

Haz clic en **"Reservar"** en la tarjeta del espacio que quieres reservar. Verás una pantalla con:
- La **Disponibilidad Horaria ** (horarios ocupados en rojo, libres en verde).
- El **huso horario** de tu organización (importante si estás en otra zona).
- Las **reglas de reserva**: duración máxima, días de anticipación, horario permitido.
<img width="1240" height="675" alt="image" src="https://github.com/user-attachments/assets/963bcf00-5ed0-4e34-be32-af68aed09036" />

**Paso 3: Elegir horario y confirmar**

1. Selecciona la **fecha** que deseas reservar.
2. Elige la **hora de inicio** y **hora de fin**.
3. El sistema te mostrará si el horario es válido según las reglas de tu organización.
4. Haz clic en **"Reservar"**.
5. Si el horario está disponible, verás una **confirmación** con los detalles de tu reserva.

> **En total: 3 clics** (Recursos → Espacio → Reservar). ¡Así de simple!
> 
<img width="1240" height="675" alt="image" src="https://github.com/user-attachments/assets/0968d676-893f-40ee-9247-56376ee1b952" />

<img width="1240" height="675" alt="image" src="https://github.com/user-attachments/assets/24f68efe-1bb7-4bbf-9b44-45f1c77c3df5" />

### Flujo 2: Cancelar una Reserva

Si ya no necesitas una reserva que hiciste:

1. Desde el menú lateral, haz clic en **"Mis Reservas"**.
2. Localiza la reserva que quieres cancelar (las reservas activas tienen un botón de cancelar).
3. Haz clic en **"Cancelar"**.
4. Confirma la cancelación en la ventana emergente.
5. La reserva quedará cancelada y el horario se liberará para otros usuarios.

<img width="1240" height="597" alt="image" src="https://github.com/user-attachments/assets/d867fb5b-5c98-4d59-9e8d-8aa51cbdee54" />


### Flujo 3: Ver Disponibilidad de un Espacio

Si solo quieres consultar cuándo está ocupado un espacio:

1. Haz clic en **"Recursos"** en el menú lateral.
2. Selecciona el espacio que te interesa.
3. Navega por el calendario para ver los **horarios ocupados** (marcados en rojo).
4. Los espacios en blanco/verde están **disponibles** para reservar.

---

### Flujo 4: Gestionar Espacios (Solo Administrador)

Si eres administrador, puedes crear, editar y eliminar espacios:

**Crear un nuevo espacio:**

1. Ve a **"Gestionar áreas comúnes"** en el menú lateral.


<img width="1224" height="589" alt="image" src="https://github.com/user-attachments/assets/61c6d618-bfb6-4587-a480-66d54e4f9073" />

2. Haz clic en **"Crear Área Común"**.
   
<img width="1224" height="589" alt="image" src="https://github.com/user-attachments/assets/ee0ec250-57cf-44f7-b4e0-6a80d17e33ed" />

3. Completa los campos: nombre, descripción y capacidad.
4. Haz clic en **"Guardar"**.
<img width="1224" height="589" alt="image" src="https://github.com/user-attachments/assets/e34df901-640d-4028-9a5c-966a28ebb6c9" />


**Editar o eliminar un espacio:**

1. En la lista de recursos, localiza el espacio que quieres modificar.
2. Haz clic en el ícono de **editar** (lápiz) o **eliminar** (papelera).
3. Realiza los cambios o confirma la eliminación.

<img width="1224" height="589" alt="image" src="https://github.com/user-attachments/assets/b8fffe9f-91db-4d68-a5c1-e7ae4bd246f3" />


### Flujo 5: Configurar Reglas de Reserva (Solo Administrador)

Puedes personalizar los límites de reserva para tu organización:

1. Ve a **"Reglas de Reserva"** en el menú lateral.
2. Modifica los valores:
   - **Horario permitido**: de apertura y de cierre
   - **Días de anticipación**: maxima y minima
3. Haz clic en **"Guardar Cambios"**.
4. Las nuevas reglas se aplicarán a todas las reservas futuras.

<img width="1224" height="620" alt="image" src="https://github.com/user-attachments/assets/5643be46-5a07-4c80-87a5-738204acfec3" />


### Flujo 6: Agregar Miembros (Solo Administrador)

Para que otros usuarios se unan a tu organización:

**Opción A: Código de invitación**
1. Ve a **"Miembros"** en el menú lateral.
2. Copia el **código de invitación** de tu organización.
3. Compártelo con los usuarios que quieras invitar.
4. Ellos podrán unirse ingresando el código en la pantalla de **Onboarding**.

**Opción B: Agregar directamente**
1. Ve a **"Miembros"** en el menú lateral.
2. Haz clic en **"Agregar Miembro"**.
3. Ingresa el **email** del usuario que quieres agregar.
4. Haz clic en **"Agregar"**.
5. El usuario aparecerá en la lista de miembros.

<img width="1224" height="595" alt="image" src="https://github.com/user-attachments/assets/8af3dfd9-7949-40fc-a80d-3ab3d19233da" />


##  Soporte

Si tienes problemas con el sistema:
- **Miembros:** Contacta al administrador de tu organización.
- **Administradores:** Revisa la documentación técnica o contacta al equipo de desarrollo.

---

## Navegación Rápida

| ¿Qué quieres hacer? | ¿A dónde vas? |
|----------------------|---------------|
| Registrarme | Clic en **Registrarse** |
| Iniciar sesión | Clic en **Iniciar Sesión** |
| Reservar un espacio | Menú → **Recursos** → Seleccionar espacio → **Reservar** |
| Cancelar una reserva | Menú → **Mis Reservas** → **Cancelar** |
| Ver horarios ocupados | Menú → **Recursos** → Seleccionar espacio |
| Crear/editar espacios | Menú → **Administrar Recursos** (solo admin) |
| Cambiar reglas de reserva | Menú → **Configuración** (solo admin) |
| Agregar miembros | Menú → **Miembros** (solo admin) |
