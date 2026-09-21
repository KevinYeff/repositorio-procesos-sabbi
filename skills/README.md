# Batería de skills — base de desarrollo SABBI

Skills para que Claude Code desarrolle este proyecto de forma óptima. Claude Code las detecta automáticamente cuando viven en `.claude/skills/<nombre>/SKILL.md` en la raíz del repo.

## Skills incluidas

- **nextjs-prisma-feature** — construir features Next.js con Prisma + Postgres (server actions, zod, migraciones).
- **authjs-swappable-provider** — auth con Auth.js intercambiable (simple en demo, Entra ID después).
- **drawio-embed-viewer** — incrustar editor y visor draw.io, persistir XML sin comprimir, validar al guardar.
- **deploy-vercel-neon** — desplegar en Vercel + Neon manteniendo portabilidad.
- **secure-approval-workflow** — registro + aprobación por rol + trazabilidad, con controles ISO 27001.

## Reutilización para nuevos proyectos

Cuatro de las cinco son genéricas (nextjs-prisma-feature, authjs-swappable-provider, deploy-vercel-neon, secure-approval-workflow): cópialas tal cual a un nuevo repo. `drawio-embed-viewer` es específica de proyectos con diagramas. Ajusta los detalles de dominio, mantén los principios de portabilidad y seguridad.
