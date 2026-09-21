# Consolidado 2 — Alcance del demo (lunes)

Subconjunto ejecutable del Consolidado 1 para demostrar el lunes que la idea funciona. Todo lo que se construye aquí es código real que se reutiliza; lo único desechable es el auth simple.

## Objetivo del demo

Mostrar el recorrido completo de los dos carriles + aprobación, con datos que se vean creíbles. Un colaborador registra un proceso (con su diagrama) y otro lo encuentra por buscador/filtros y lo visualiza.

## Diferencia clave vs el diseño objetivo

Solo cambia la capa de identidad. No se usa Entra ID (no hay permiso de tenant en fin de semana). Todo lo demás es igual.

- Auth objetivo (Entra ID) → Auth demo: magic-link por correo, o 3 cuentas sembradas (colaborador_a, aprobador, colaborador_b).
- Usuarios/jefes desde Entra → tabla `usuarios` sembrada manualmente. El desplegable de aprobador y la bandeja leen de ahí, igual que en el objetivo.
- Auth.js es modular: enchufar Entra después es cambiar config, sin tocar la app.

## Incluido en el demo

- Carril A: formulario (nombre, descripcion, notas, area, proyecto, aprobador), generar diagrama con Claude → importar en draw.io embebido → guardar (estado PENDIENTE).
- Aprobación: vista simple del aprobador → aprobar / rechazar con comentario.
- Carril B: buscador (nombre+descripcion) + filtros (area, proyecto, autor) → abrir proceso → visor draw.io en lectura.

## Pospuesto (se menciona como roadmap, no se construye)

- Login real con Microsoft/Entra ID.
- Validación fina de XML, contadores, permisos por rol robustos, notas con menciones enlazadas, cascada estricta area→proyecto.

## Datos sembrados (para que no se vea vacío)

- usuarios: 3-4 (autores + al menos un aprobador).
- areas: 2-3 (ej. Finanzas, Operaciones, Tecnología).
- proyectos: 2-3.
- procesos: 4-5 de ejemplo ya aprobados, con diagrama, para poblar el buscador y filtros del Carril B.

## Stack demo (todo gratis)

Next.js · Neon Free (0.5 GB, 100 CU-h/mes, scale-to-zero 5 min; suficiente) · Vercel Hobby (uso demo, no producción) · draw.io embed + viewer · Auth.js con provider simple.

## Ruta del demo al objetivo

1. Reemplazar provider de Auth.js (simple → Entra ID) cuando haya permiso de tenant.
2. Entra pasa a llenar la tabla `usuarios` (deja de sembrarse a mano).
3. Migrar la BD a Postgres de tech (pg_dump/restore) y redeploy en su entorno si se sale de Vercel.

## Antes de presentar

- Sembrar los datos de ejemplo.
- Ensayar el recorrido una vez.
- Tener proceso-repositorio-sabbi.drawio como respaldo visual por si algo falla en vivo.
