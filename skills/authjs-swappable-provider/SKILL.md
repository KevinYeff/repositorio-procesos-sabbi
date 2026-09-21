---
name: authjs-swappable-provider
description: Usar al configurar o cambiar la autenticación en una app Next.js con Auth.js (NextAuth v5) de forma que el provider sea intercambiable — por ejemplo un provider simple para el demo y Microsoft Entra ID después — sin tocar la lógica de la app.
---

# Autenticación intercambiable con Auth.js

## Cuándo usar
Al montar el login, o al migrar de un auth simple a Entra ID (u otro OIDC).

## Principio
La app depende del **usuario de sesión**, no del provider. Aísla todo el auth en `/lib/auth`. Cambiar de provider debe ser un cambio de configuración, no de lógica.

## Demo
- Provider simple: magic-link por correo, o credenciales sembradas (colaborador_a / aprobador / colaborador_b).
- Mapea el usuario autenticado a una fila de la tabla `usuarios` (fuente de verdad de roles y aprobadores).

## Objetivo (Entra ID / OIDC)
- Provider Microsoft Entra ID vía variables de entorno (`AUTH_MICROSOFT_ENTRA_ID_ID`, `_SECRET`, `_ISSUER`).
- Requiere registrar la app en el tenant. La app pasa a llenar la tabla `usuarios` automáticamente.

## Convenciones
- Define `AUTH_SECRET`.
- En los callbacks, adjunta `id` y `rol` del usuario a la sesión, para que la autorización dependa de la fila local, no del proveedor.

## Gotchas
- No mezcles lógica de negocio con el provider; si un componente conoce el nombre del proveedor, refactoriza.
