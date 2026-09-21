---
name: nextjs-prisma-feature
description: Usar al construir o modificar una funcionalidad en una app Next.js (App Router) con Prisma + Postgres — una ruta, formulario, listado o mutación de datos. Cubre server actions, límites de acceso a datos, validación con zod y migraciones.
---

# Construir una feature Next.js + Prisma

## Cuándo usar
Cualquier feature que lea o escriba datos: formulario de registro, bandeja, buscador, cambio de estado.

## Patrón base
- Server Components por defecto; usa Client Components solo donde haya interactividad (formularios, editor/visor).
- El acceso a datos ocurre SOLO en el servidor (server actions o route handlers). Nunca uses el cliente de Prisma ni credenciales en el cliente.
- Un único cliente Prisma como singleton en `/lib/db`.

## Pasos
1. Define o ajusta el modelo en `prisma/schema.prisma`.
2. Crea la migración: `npx prisma migrate dev`. Nunca edites una migración ya aplicada; crea una nueva.
3. Define el esquema de validación con `zod` para la entrada.
4. Implementa la server action / route handler: valida con zod → opera con Prisma → devuelve resultado tipado.
5. Construye la UI que invoca la acción.

## Convenciones
- TypeScript estricto, sin `any` sin justificación.
- Valida toda entrada de usuario en el servidor.
- Nombres en inglés en el código; textos de UI en español.
- Corre `build` y `lint` antes de dar por terminada la tarea.

## Gotchas
- En serverless usa la `DATABASE_URL` con pooling (Neon pooled) para no agotar conexiones.
- Mantén el cliente Prisma como singleton para evitar múltiples instancias en hot reload.
