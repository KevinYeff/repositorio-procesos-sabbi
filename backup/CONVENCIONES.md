# Convenciones del blueprint — Repositorio de Procesos SABBI

Llave para leer `repositorio-procesos-sabbi.drawio` (5 páginas) y generar los archivos base de forma determinista.

## Concepto del producto
Repositorio/base de conocimiento de procesos internos, accesible desde una interfaz web para colaboradores autenticados con **Microsoft 365**. Permite **consultar procesos de cualquier área** para acelerar el aprendizaje de un colaborador nuevo o de otra área. **No hay IA embebida en la aplicación.** Claude Desktop se usa solo como herramienta de desarrollo (implementar, versionar en GitHub, desplegar).

## Cómo leer el diagrama
- Cada nodo con `→ ruta/archivo` es **un archivo a generar** en esa ruta exacta.
- Las flechas representan **dependencia** (import / llamada / relación).
- El **color/prefijo** indica la capa y el rol del artefacto.

## Prefijos `[TIPO]`
| Tipo | Significado | Destino |
|------|-------------|---------|
| PAGE | Página / ruta App Router | `app/.../page.tsx` |
| UI | Componente React | `components/...` |
| API | Route Handler | `app/api/.../route.ts` |
| SVC | Servicio / lógica de negocio | `lib/services/...` |
| MODEL | Entidad de datos | `prisma/schema.prisma` |
| AUTH | Identidad / seguridad | `middleware.ts`, `lib/auth.ts` |
| LIB | Utilidad / cliente compartido | `lib/...` |
| EXT | Servicio externo | (no se genera código) |

## Tipo de paso (lo elige el autor, no una IA)
Cada paso se etiqueta con **un** tipo, para estandarizar y colorear el diagrama:
- **T · Transporte** · **C · Captura** · **K · Criterio** (rombo) · **V · Verificación** · **O · Operación**

El diagrama de flujo se **deriva de los pasos** con `mermaid.js` en el cliente, de forma determinista (mismo proceso ⇒ mismo diagrama). Sin llamadas a ningún modelo.

## Reglas duras (no negociables)
1. **Sin IA en el runtime.** El producto no llama a ningún modelo. Todo el conocimiento lo aportan personas; el sistema estandariza, guarda, versiona y hace consultable.
2. **Auth:** Microsoft Entra ID (Azure AD / M365) SSO vía NextAuth. Sin passwords propios.
3. **Datos agnósticos:** el modelo (pág. 02) es el contrato; `DATABASE_URL` apunta al proveedor Postgres que se defina. Prisma es el ORM sugerido y swappable.
4. **Deploy:** Vercel, versionado en GitHub.
5. **Trazabilidad:** cada cambio genera una `ProcessVersion` inmutable + un `AuditEvent`.
6. **UI on-brand:** la interfaz debe seguir la marca Sabbi (skill `sabbi-brand`); el blueprint define estructura, no estética.

## Formato estándar de un proceso
Objetivo · Responsables · Pasos (tipo T/C/K/V/O) · Entradas/Salidas por paso · Decisiones y ramas · Herramientas · Reglas de verificación · Riesgos/excepciones · Resumen operativo (redactado por el autor). La UI valida campos requeridos con reglas de formulario (no IA) antes de publicar.

## Orden sugerido de generación
1. Scaffold Next.js + TS + Tailwind + config Vercel.
2. `prisma/schema.prisma` (pág. 02) + `lib/db.ts` + seed de áreas.
3. Auth Entra ID/M365: `lib/auth.ts`, `middleware.ts`, ruta nextauth.
4. Servicios `lib/services/*` (CRUD + versión + búsqueda + audit).
5. API route handlers.
6. `lib/mermaid.ts` (diagrama determinista desde pasos).
7. Componentes UI + páginas (con marca Sabbi).
8. `.env.example` + README + repo GitHub + deploy a Vercel.

## Variables de entorno
- `AUTH_MICROSOFT_ENTRA_ID_ID` / `_SECRET` / `_ISSUER`
- `AUTH_SECRET` (NextAuth)
- `DATABASE_URL` (proveedor Postgres por definir)
- `NEXT_PUBLIC_APP_URL`
