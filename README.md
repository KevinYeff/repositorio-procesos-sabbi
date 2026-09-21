# Repositorio de Procesos SABBI

Plataforma web para documentar, aprobar y consultar procesos internos de SABBI. Un colaborador registra un proceso con diagrama draw.io, un aprobador lo valida, y cualquier colaborador lo busca y consulta.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Postgres** (Neon en demo)
- **Prisma** (ORM + migraciones)
- **Auth.js** (NextAuth v5) con provider de credenciales (demo) — Entra ID enchufable
- **draw.io** embebido (editor y visor)
- **Tailwind CSS**

## Requisitos

- Node.js >= 18
- Postgres (o cuenta en [Neon](https://neon.tech))

## Configuración local

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Copiar `.env.example` a `.env` y completar las variables:

```bash
cp .env.example .env
```

Variables requeridas:
- `DATABASE_URL` — URL de conexión a Postgres (con `?sslmode=require` para Neon)
- `AUTH_SECRET` — Generar con `openssl rand -base64 32`
- `AUTH_URL` — `http://localhost:3000` para desarrollo local

3. Crear las tablas y sembrar datos de ejemplo:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

La app estará en http://localhost:3000.

## Cuentas de prueba

| Email | Contraseña | Rol |
|---|---|---|
| colaborador_a@sabbi.com | demo123 | Autor (Analista de procesos) |
| aprobador@sabbi.com | demo123 | Aprobador (Jefe de Operaciones) |
| colaborador_b@sabbi.com | demo123 | Autor (Coordinadora de TI) |
| colaborador_c@sabbi.com | demo123 | Autor (Analista financiero) |

## Recorrido end-to-end

1. **Registrar:** Ingresar como `colaborador_a@sabbi.com`, ir a "Registrar proceso", llenar el formulario y crear un diagrama en el editor draw.io. El proceso queda en estado PENDIENTE.
2. **Aprobar:** Ingresar como `aprobador@sabbi.com`, ir a "Aprobaciones" y aprobar o rechazar el proceso.
3. **Consultar:** Ingresar como `colaborador_b@sabbi.com`, buscar procesos aprobados por nombre, filtrar por área/proyecto/autor, y visualizar el diagrama.

## Despliegue en Vercel

1. Conectar el repositorio de GitHub en [Vercel](https://vercel.com).
2. Configurar las variables de entorno (`DATABASE_URL`, `AUTH_SECRET`).
3. El `postinstall` genera el cliente de Prisma automáticamente.
4. Ejecutar la migración inicial contra la DB de Neon:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Estructura del proyecto

```
/app            Rutas Next.js (App Router)
/components     Componentes de UI (formulario, drawio, buscador)
/lib            DB (Prisma), auth, validaciones, queries, acciones
/prisma         Schema, migraciones, seed
```
