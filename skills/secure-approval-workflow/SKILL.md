---
name: secure-approval-workflow
description: Usar al construir una app interna que requiere registro de contenido, aprobación por rol y trazabilidad — con controles de seguridad mapeados a ISO 27001 Anexo A. Reutilizable en cualquier flujo de aprobación interno.
---

# Flujo de aprobación seguro (ISO 27001)

## Cuándo usar
Cualquier app donde un usuario envía algo, otro con autoridad lo aprueba, y debe quedar registro.

## Principios
- Las identidades son usuarios reales (logins), nunca texto libre. El aprobador referencia la tabla `usuarios`.
- Segregación de funciones: el autor no puede ser su propio aprobador (ISO 27001 A.5.3).
- Solo el contenido aprobado es visible (A.8.3).
- Toda transición de estado queda registrada con autor, aprobador, decisión, comentario y fecha (A.8.15).

## Máquina de estados
`PENDIENTE → APROBADO`, o `PENDIENTE → RECHAZADO (+comentario) → el autor corrige y reenvía`.

## Controles a implementar
- A.5.15 / A.5.16 / A.8.5: control de acceso, identidades, autenticación segura.
- A.5.18: derechos de acceso; aprobación formal según rol.
- A.5.3: segregación de funciones.
- A.8.15: registro y trazabilidad.
- A.8.3: restricción de acceso a la información (solo aprobados).

## Gotchas
- No confundas la fuente de identidades (Entra u otra) con la lógica de aprobación: la lógica depende de la tabla `usuarios`, así el auth se puede cambiar sin tocarla.
- ISO 27001 no define símbolos de diagrama; si diagramas el flujo, usa convención de flujograma (ISO 5807).
