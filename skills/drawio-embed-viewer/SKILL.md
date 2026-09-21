---
name: drawio-embed-viewer
description: Usar al incrustar diagramas draw.io (diagrams.net) en una app web — un editor para crear/ajustar y un visor de solo lectura para mostrar — y al persistir el diagrama como XML.
---

# draw.io embebido: editor y visor

## Cuándo usar
Cuando el usuario debe crear o ver diagramas dentro de la app, guardando el resultado.

## Editor (autoría)
- Incrusta draw.io por iframe usando su protocolo de embed (`embed.diagrams.net`, comunicación por postMessage), o autohospeda la imagen Docker `jgraph/drawio`.
- Flujo: el usuario pega/importa el XML → lo ajusta → la app recibe el XML por postMessage al guardar.

## Visor (lectura)
- Usa `viewer.min.js` de draw.io para renderizar el XML en modo solo lectura. No cargues el editor completo para mostrar.

## Persistencia
- Guarda el XML en una columna `TEXT` (ej. `contenido_xml`).
- Guarda el XML **sin comprimir** (legible). draw.io por defecto puede exportar comprimido (deflate + base64); fuerza la opción sin comprimir.

## Validación al guardar
- Antes de persistir: verifica que el XML parsee y que el visor lo abra. Si falla, bloquea el guardado.

## Gotchas
- Sanitiza el render; no confíes en XML arbitrario.
- El mismo XML alimenta editor y visor: un solo formato, dos usos.
