# CLAUDE.md — Repositorio de Procesos SABBI

Instrucciones para Claude Code y cualquier agente que desarrolle este proyecto. Léelo completo antes de escribir código. Este archivo también sirve como plantilla base para nuevos proyectos de SABBI: la parte de convenciones, portabilidad y flujo de trabajo es reutilizable; la parte de dominio se reemplaza.

> Nota: Claude Code detecta este archivo como `CLAUDE.md` (mayúsculas) en la raíz del repositorio. Mantenlo ahí.

## 1. Qué es el proyecto

Plataforma web que funciona como repositorio central de procesos internos de SABBI. Un colaborador documenta un proceso con un diagrama, un jefe lo aprueba, y otro colaborador lo busca y lo consulta. El detalle funcional está en `procesos.md`; el diseño técnico en `arquitectura.md`.

## 2. Alcance actual: DEMO (no producción)

Construimos el subconjunto ejecutable (Consolidado 2), no el diseño completo. Prioridad: que el recorrido end-to-end funcione y se vea creíble.

**Construir ahora:**
- Carril A: formulario de registro (nombre, descripción, notas, área, proyecto, aprobador) + editor draw.io embebido + guardar en estado PENDIENTE.
- Aprobación: vista del aprobador para aprobar / rechazar con comentario.
- Carril B: buscador (nombre + descripción) + filtros (área, proyecto, autor) + visor draw.io en modo lectura.
- Auth simple (ver sección 7) y datos sembrados.

**NO construir ahora (roadmap, no tocar):**
- Login real con Microsoft Entra ID.
- Validación fina de XML, contadores por filtro, permisos por rol robustos, notas con menciones enlazadas, cascada estricta área→proyecto.

Regla de oro: todo lo que se construye para el demo debe ser código real reutilizable en el objetivo. Lo único desechable permitido es el auth simple.

## 3. Stack

- Next.js (App Router) + TypeScript.
- Postgres en Neon (plan free).
- ORM: Prisma (con migraciones).
- Auth: Auth.js (NextAuth v5), provider simple para el demo, Entra ID enchufable después.
- Diagramas: draw.io embebido (editor) y visor (lectura).
- Hosting: Vercel (Hobby para el demo).

## 4. Estructura del repositorio

```
/app            Rutas Next.js (App Router): carril A, aprobación, carril B
/components     UI reutilizable (formulario, drawio editor/visor, buscador)
/lib            db (Prisma client), auth, validaciones, helpers
/prisma         schema.prisma + migraciones + seed.ts
/public         estáticos
CLAUDE.md       este archivo
arquitectura.md diseño técnico
procesos.md     especificación funcional
```

## 5. Comandos

- Instalar: `npm install`
- Migrar DB: `npx prisma migrate dev`
- Sembrar datos: `npx prisma db seed`
- Desarrollo: `npm run dev`
- Build: `npm run build` / `npm run start`
- Lint/format: `npm run lint`

Antes de dar por terminada una tarea, corre build y lint y confirma que pasan.

## 6. Convenciones de código

- TypeScript estricto. Nada de `any` salvo justificación.
- Componentes de servidor por defecto; cliente solo donde haga falta interactividad (editor/visor draw.io, formularios).
- Acceso a datos solo desde el servidor (server actions o route handlers), nunca exponer credenciales al cliente.
- Nombres en inglés en el código; textos de UI en español.
- Validar toda entrada de usuario en el servidor (usa zod).
- Commits pequeños y descriptivos.

## 7. Autenticación

- **Demo:** provider simple de Auth.js (magic-link por correo, o credenciales sembradas colaborador_a / aprobador / colaborador_b). El usuario logueado se mapea a una fila de la tabla `usuarios`.
- **Objetivo:** Microsoft Entra ID (OIDC). Se enchufa cambiando la config del provider de Auth.js, sin tocar la lógica de la app.
- Aísla el auth en `/lib/auth`: el resto de la app depende del usuario de sesión, no del provider.

## 8. Integración draw.io

- Editor embebido para el carril A; visor de solo lectura para el carril B.
- El proceso se guarda como XML draw.io en una columna `TEXT` (`contenido_xml`).
- Guarda siempre el XML **sin comprimir** (legible), para poder validarlo y consultarlo.
- Al guardar: valida que el XML parsee y que el visor lo abra; si falla, bloquea el guardado.

## 9. Reglas de portabilidad (obligatorias)

El objetivo es poder migrar al entorno del equipo de tech sin reescribir.

- Conexión a la DB solo por `DATABASE_URL` (variable de entorno).
- Runtime Node estándar; no dependas de features edge-only.
- NO usar piezas propietarias de Vercel (KV, Blob, Edge Config, Image Optimization, Cron) en la lógica.
- NO acoplar la app a features propietarias de Neon (branching, su auth).
- Todo el esquema vive en migraciones Prisma, para recrearlo en cualquier Postgres.

## 10. Seguridad

- Nunca commitees secretos. Usa `.env` (y `.env.example` con llaves vacías).
- No expongas `DATABASE_URL` ni tokens al cliente.
- Controles ISO 27001 mapeados en `arquitectura.md`; respétalos al implementar (segregación autor/aprobador, registro de cambios de estado, solo aprobados visibles).

## 11. Flujo de trabajo con el agente

- Trabaja en incrementos pequeños y verificables; corre build/lint tras cada uno.
- Pide verificación al humano solo cuando sea estrictamente necesario: acciones destructivas, cambios de esquema con datos, o decisiones de producto no cubiertas por los consolidados.
- Ante ambigüedad cubierta por `procesos.md` o `arquitectura.md`, sigue esos documentos en vez de preguntar.
- No amplíes el alcance más allá de la sección 2.

## 12. Definición de "hecho" para el demo

Un colaborador puede: iniciar sesión, registrar un proceso con diagrama (queda pendiente), el aprobador lo aprueba, y otro colaborador lo busca por filtros y lo visualiza. Build y lint pasan. Hay datos sembrados. Desplegado en Vercel y probado end-to-end una vez.

## 13. Reutilización para nuevos proyectos

Al reusar esta plantilla: conserva secciones 3-11 como estándar de SABBI; reemplaza 1, 2 y 12 con el dominio del nuevo proyecto; actualiza `arquitectura.md` y `procesos.md`. Mantén las reglas de portabilidad y seguridad intactas.
