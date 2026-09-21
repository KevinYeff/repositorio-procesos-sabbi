---
name: deploy-vercel-neon
description: Usar al desplegar una app Next.js + Postgres en Vercel con base de datos Neon, manteniéndola portable para poder migrarla a otro host o Postgres después sin reescribir.
---

# Desplegar Next.js + Neon en Vercel (portable)

## Cuándo usar
Al preparar el despliegue del MVP/demo, o al planear la salida hacia otro entorno.

## Neon
- Crea el proyecto en Neon (plan free suficiente para un MVP).
- Usa la `DATABASE_URL` con pooling para entornos serverless.

## Vercel
- Conecta el repo de GitHub.
- Configura variables de entorno: `DATABASE_URL`, `AUTH_SECRET` (y las del provider).
- Corre las migraciones de Prisma en el despliegue.

## Reglas de portabilidad (obligatorias)
- Conexión solo por `DATABASE_URL`.
- Runtime Node estándar; nada edge-only.
- NO uses piezas propietarias de Vercel (KV, Blob, Edge Config, Image Optimization, Cron) en la lógica.
- NO acoples la app a features propietarias de Neon (branching, su auth).
- Todo el esquema en migraciones Prisma.

## Aviso de licencia
- El plan Hobby de Vercel es solo para uso no comercial. Para producción interna real, usa Pro o el entorno propio del equipo de tech.

## Salida hacia otro entorno
- Datos: `pg_dump` de Neon + `pg_restore` en el Postgres destino + cambiar `DATABASE_URL`.
- App: redeploy como servidor Node o contenedor Docker. No es reescritura.
