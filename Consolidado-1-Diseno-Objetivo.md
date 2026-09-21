# Consolidado 1 — Diseño objetivo (MVP real)

Repositorio de Procesos SABBI. Este es el norte: la versión completa a la que se llega una vez aprobados los permisos (tenant de Entra, entorno de tech). El Consolidado 2 (alcance demo) es un subconjunto de este.

## Objetivo

Centralizar el conocimiento operativo de SABBI (el "cómo se hacen las cosas") en un repositorio único, buscable y con procesos validados. La IA está en los dos extremos: construye la plataforma y, en el uso diario, le quita a cada colaborador la parte difícil de diagramar.

## Acceso

Todos entran con su cuenta de Microsoft 365 (Entra ID) vía Auth.js (OIDC). Sin contraseñas nuevas. La identidad corporativa es la identidad en la plataforma, y es la fuente de los usuarios y de los aprobadores.

## Carril 1 — Colaborador A documenta

Formulario con campos, casi todos por selección para mantener datos limpios y agrupables:

- Colaborador (autor) y fecha: automáticos, de la sesión M365.
- Nombre del proceso.
- Descripción (opcional): el "qué es". Alimenta el buscador.
- Notas (opcional): el "cómo ejecutarlo" (dependencias, dueños de insumos). No entra al buscador.
- Área: desplegable (lista controlada).
- Proyecto: desplegable en cascada filtrado por área; opcional, con bucket "General".
- Jefe responsable / aprobador: desplegable vinculado a usuarios reales de Entra.

Diagrama: A le pide el diagrama a su Claude, recibe el XML .drawio, lo importa en el editor draw.io embebido, ajusta y guarda. Se almacena como XML (TEXT) en Postgres. Antes de guardar, la plataforma valida que el XML parsee y renderice; si no, bloquea.

## Capa de aprobación

Al guardar queda en estado PENDIENTE. El jefe designado lo ve en su bandeja y decide: aprobar, o rechazar con comentario (vuelve a A para corregir). Solo los aprobados se publican como oficiales.

## Carril 2 — Colaborador B consulta

- Buscador por nombre y descripción.
- Filtros por área, proyecto y colaborador autor (todos por selección), con contadores.
- Al abrir: descripción, notas y diagrama renderizado en modo lectura (visor draw.io).

## Modelo de datos

- usuarios (sync desde Entra: id, email, nombre, cargo, area_id, flag es_aprobador)
- areas (id, nombre)
- proyectos (id, nombre, area_id)
- procesos (id, nombre, descripcion nullable, notas nullable, area_id, proyecto_id nullable, autor_id, aprobador_id, estado, contenido_xml, fecha)
- aprobaciones (proceso_id, aprobador_id, decision, comentario, fecha)

## Stack

Next.js sobre Vercel · Postgres (Neon vía Marketplace, o el entorno de tech al aprobarse) · Auth.js con Microsoft Entra ID · draw.io embebido (editor carril 1, visor carril 2). Buscador: ILIKE sobre nombre+descripcion para el MVP; pg_trgm/full-text si escala.

## Controles ISO 27001 (Anexo A) mapeados

- A.5.15 / A.5.16 / A.8.5: control de acceso, identidades (Entra), autenticación segura.
- A.5.3: segregación de funciones (el autor no puede ser su propio aprobador).
- A.8.15: registro y trazabilidad del cambio de estado.
- A.5.18: derechos de acceso, aprobación formal por rol.
- A.8.3: solo los procesos aprobados son visibles.

Nota: ISO 27001 no define símbolos de diagrama; las formas del flujograma siguen ISO 5807. Diagrama del proceso: archivo proceso-repositorio-sabbi.drawio.

## Portabilidad (salida barata hacia el entorno de tech)

Construir "portable por defecto": ORM con migraciones (Prisma/Drizzle), conexión por DATABASE_URL, runtime Node estándar, evitar piezas propietarias de Vercel (KV, Blob, Edge Config, Image Optimization, Cron) y de Neon (branching, su auth) en la lógica. Así: Neon → Postgres de tech = pg_dump/pg_restore + cambiar connstring; Vercel → entorno de tech = redeploy (Node/Docker), no reescritura.
