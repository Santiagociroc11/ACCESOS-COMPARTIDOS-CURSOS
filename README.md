# ACCESOS-COMPARTIDOS-CURSOS

Gestor de accesos y contraseñas usando PostgREST y PostgreSQL.

## Configuración

### 1. Base de Datos PostgreSQL

Asegúrate de tener una tabla `accounts` en tu base de datos PostgreSQL con la siguiente estructura:

```sql
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  username VARCHAR(255),
  password VARCHAR(500),
  requires_dynamic_pin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. PostgREST

Configura PostgREST para conectar con tu base de datos PostgreSQL. Consulta la [documentación oficial de PostgREST](https://postgrest.org/en/stable/tutorials/tut0.html) para más detalles.

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_POSTGREST_URL=http://localhost:3000
VITE_POSTGREST_API_KEY=tu_jwt_token_opcional
```

- `VITE_POSTGREST_URL`: URL de tu servidor PostgREST
- `VITE_POSTGREST_API_KEY`: (Opcional) JWT token para autenticación si tu PostgREST requiere autenticación

### 4. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Características

- ✅ Gestión de cuentas y contraseñas
- ✅ Autenticación con contraseña maestra
- ✅ Soporte para PIN dinámico
- ✅ Interface moderna con Tailwind CSS
- ✅ Conexión directa a PostgreSQL vía PostgREST
- ✅ Operaciones CRUD completas

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS  
- PostgREST
- PostgreSQL

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Santiagociroc11/ACCESOS-COMPARTIDOS-CURSOS)