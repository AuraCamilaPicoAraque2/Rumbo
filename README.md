# Rumbo

Plataforma web de orientación para estudiantes que están explorando opciones de educación superior. Reúne información de carreras e instituciones, recursos de financiación, un test vocacional RIASEC, contenidos de orientación y un blog.

El proyecto está organizado en dos aplicaciones:

- **Frontend:** React 18 y Vite.
- **Backend:** API REST con Node.js, Express y Prisma.
- **Base de datos:** PostgreSQL 16, disponible localmente mediante Docker Compose.

## Requisitos

- Node.js y npm.
- Docker Desktop con Docker Compose.
- Git, si vas a clonar el repositorio.

## Puesta en marcha local

Los siguientes pasos están escritos para PowerShell en Windows. Ejecuta los comandos desde la carpeta raíz del proyecto, salvo cuando se indique lo contrario.

### 1. Iniciar PostgreSQL

```powershell
docker compose up -d
```

Esto inicia PostgreSQL en `localhost:5433`. La configuración local del contenedor está en [`docker-compose.yml`](./docker-compose.yml).

### 2. Configurar el backend

En una terminal:

```powershell
cd backend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
```

El archivo [`backend/.env.example`](./backend/.env.example) contiene la configuración local de ejemplo para la conexión a PostgreSQL, el puerto de la API, la clave JWT y el origen permitido del frontend. Ajusta `DATABASE_URL` si cambiaste los valores del contenedor y reemplaza `JWT_SECRET` por un valor aleatorio propio.

`npm run seed` agrega los datos iniciales de prueba, incluyendo el administrador local y contenido para las secciones de la aplicación.

### 3. Iniciar la API

Desde la carpeta `backend`:

```powershell
npm run dev
```

La API queda disponible en `http://localhost:4000`. Comprueba que responde en:

- Estado de salud: <http://localhost:4000/api/health>
- Documentación interactiva: <http://localhost:4000/api/docs>
- Especificación OpenAPI en JSON: <http://localhost:4000/api/docs.json>

### 4. Iniciar el frontend

Abre una segunda terminal y ejecuta:

```powershell
cd frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm install
npm run dev
```

Vite muestra la dirección local al iniciar; normalmente es <http://localhost:5173>. El frontend usa `VITE_API_URL` para localizar la API. Su valor de desarrollo predeterminado es `http://localhost:4000/api`.

## Comandos útiles

Ejecuta cada comando desde la carpeta correspondiente.

### Backend

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia la API en modo desarrollo con reinicio al detectar cambios. |
| `npm start` | Inicia la API sin modo de observación. |
| `npx prisma migrate dev` | Aplica las migraciones de desarrollo pendientes. |
| `npm run seed` | Carga o completa los datos iniciales. |
| `npm run studio` | Abre Prisma Studio para consultar los datos. |
| `node scripts/set-admin-password.js "MiNuevaClave123"` | Cambia la contraseña de las cuentas con rol de administrador. |

### Frontend

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor local de Vite. |
| `npm run build` | Genera la compilación de producción en `dist/`. |
| `npm run preview` | Sirve localmente la compilación generada. |

## Datos de acceso y base de datos local

El seed crea este usuario administrador de **prueba local**:

- Correo: `admin@campus.test`
- Contraseña inicial: `Admin123!`

Cambia la contraseña para cualquier entorno compartido. Desde `backend`, ejecuta:

```powershell
node scripts/set-admin-password.js "TuNuevaClave123"
```

La base de datos local configurada en Docker Compose usa:

| Parámetro | Valor |
| --- | --- |
| Host | `localhost` |
| Puerto | `5433` |
| Base de datos | `campus_virtual` |
| Usuario | `campus` |
| Contraseña | `campus123` |

Por ejemplo, estos valores permiten conectarse con DBeaver. Son credenciales de desarrollo; no las reutilices en producción.

Para detener el contenedor sin eliminar los datos:

```powershell
docker compose down
```

## Estructura del proyecto

```text
backend/
  prisma/       Esquema, migraciones y datos iniciales de la base de datos
  scripts/      Utilidades administrativas
  src/
    config/     Configuración y cliente de Prisma
    controllers/ Lógica de los endpoints
    docs/       Especificación OpenAPI
    middlewares/Autenticación y manejo de errores
    routes/     Rutas de la API
frontend/
  public/       Recursos estáticos
  src/
    admin/      Vistas y herramientas de administración
    components/ Componentes reutilizables
    context/    Estado global de la aplicación
    locales/    Textos en español e inglés
    pages/      Páginas de la aplicación
    services/   Integración con la API
```

## Solución de problemas

- **No conecta a PostgreSQL:** confirma que Docker Desktop esté iniciado y que `docker compose up -d` haya terminado correctamente. Revisa que el puerto `5433` esté disponible y que `DATABASE_URL` en `backend/.env` coincida con la configuración de Docker Compose.
- **No conecta el frontend con la API:** comprueba que la API esté funcionando y que `VITE_API_URL` apunte a `http://localhost:4000/api`. El backend permite solicitudes desde el origen indicado por `CLIENT_URL` en `backend/.env`.
- **Faltan tablas o datos:** ejecuta `npx prisma migrate dev` y luego `npm run seed` desde `backend`.
- **Problemas con dependencias de Prisma:** desde `backend`, vuelve a ejecutar `npx prisma generate` después de instalar las dependencias o de modificar el esquema.
