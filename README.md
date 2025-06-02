# ACCESOS-COMPARTIDOS-CURSOS

Gestor de accesos y contraseñas usando PostgREST y PostgreSQL.

## Configuración

### 1. Base de Datos PostgreSQL

Asegúrate de tener una tabla `accounts` en tu base de datos PostgreSQL con la siguiente estructura:

```sql
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  requires_dynamic_pin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Si usas PostgREST con role anónimo, asegúrate de dar permisos:
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE accounts TO anon;
GRANT USAGE ON SCHEMA public TO anon;
```

### 2. PostgREST

Configura PostgREST para conectar con tu base de datos PostgreSQL. Consulta la [documentación oficial de PostgREST](https://postgrest.org/en/stable/tutorials/tut0.html) para más detalles.

**Configuración mínima de PostgREST (postgrest.conf):**
```
db-uri = "postgres://user:password@host:port/database"
db-schema = "public"
db-anon-role = "anon"
```

### 3. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_POSTGREST_URL=https://tu-servidor-postgrest.com
VITE_POSTGREST_API_KEY=tu_jwt_token_opcional
```

- `VITE_POSTGREST_URL`: URL de tu servidor PostgREST (sin `/accounts` al final)
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
- ✅ IDs UUID generados automáticamente
- ✅ Timestamps automáticos

## Tecnologías

- React + TypeScript
- Vite
- Tailwind CSS  
- PostgREST
- PostgreSQL

## Troubleshooting

### Error 404 en POST
- Verifica que tu role de PostgreSQL tenga permisos INSERT en la tabla
- Asegúrate de que PostgREST esté configurado correctamente
- Revisa que la URL no incluya el nombre de la tabla al final

### Error de CORS
- Configura CORS en tu servidor PostgREST o proxy

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Santiagociroc11/ACCESOS-COMPARTIDOS-CURSOS)