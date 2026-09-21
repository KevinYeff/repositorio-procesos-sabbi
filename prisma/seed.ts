import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SAMPLE_DIAGRAM = `<mxfile host="embed.diagrams.net" modified="2024-01-01T00:00:00.000Z" agent="embed" version="22.0.0">
  <diagram id="1" name="Proceso">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827" math="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="Inicio" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1"><mxGeometry x="120" y="80" width="100" height="60" as="geometry"/></mxCell>
        <mxCell id="3" value="Paso 1" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="100" y="180" width="140" height="60" as="geometry"/></mxCell>
        <mxCell id="4" value="Paso 2" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="100" y="280" width="140" height="60" as="geometry"/></mxCell>
        <mxCell id="5" value="Fin" style="ellipse;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1"><mxGeometry x="120" y="380" width="100" height="60" as="geometry"/></mxCell>
        <mxCell id="6" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="2" target="3" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="7" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="3" target="4" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="8" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="4" target="5" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;

function makeDiagram(title: string, steps: string[]): string {
  const cells = [
    `<mxCell id="0"/>`,
    `<mxCell id="1" parent="0"/>`,
    `<mxCell id="2" value="Inicio" style="ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1"><mxGeometry x="120" y="40" width="100" height="60" as="geometry"/></mxCell>`,
  ];
  let id = 3;
  let y = 140;
  const stepIds: number[] = [];
  for (const step of steps) {
    cells.push(
      `<mxCell id="${id}" value="${step}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="80" y="${y}" width="180" height="60" as="geometry"/></mxCell>`
    );
    stepIds.push(id);
    id++;
    y += 100;
  }
  cells.push(
    `<mxCell id="${id}" value="Fin" style="ellipse;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1"><mxGeometry x="120" y="${y}" width="100" height="60" as="geometry"/></mxCell>`
  );
  const finId = id;
  id++;

  // edges
  cells.push(
    `<mxCell id="${id}" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="2" target="${stepIds[0]}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>`
  );
  id++;
  for (let i = 0; i < stepIds.length - 1; i++) {
    cells.push(
      `<mxCell id="${id}" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="${stepIds[i]}" target="${stepIds[i + 1]}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>`
    );
    id++;
  }
  cells.push(
    `<mxCell id="${id}" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="${stepIds[stepIds.length - 1]}" target="${finId}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>`
  );

  return `<mxfile host="embed.diagrams.net">
  <diagram id="1" name="${title}">
    <mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="827">
      <root>
        ${cells.join("\n        ")}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}

async function main() {
  console.log("Limpiando datos existentes...");
  await prisma.aprobacion.deleteMany();
  await prisma.proceso.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.usuario.deleteMany();
  await prisma.area.deleteMany();

  console.log("Creando áreas...");
  const finanzas = await prisma.area.create({
    data: { nombre: "Finanzas" },
  });
  const operaciones = await prisma.area.create({
    data: { nombre: "Operaciones" },
  });
  const tecnologia = await prisma.area.create({
    data: { nombre: "Tecnología" },
  });

  console.log("Creando proyectos...");
  const projERP = await prisma.proyecto.create({
    data: { nombre: "Migración ERP", areaId: finanzas.id },
  });
  const projLogistica = await prisma.proyecto.create({
    data: { nombre: "Optimización logística", areaId: operaciones.id },
  });
  const projInfra = await prisma.proyecto.create({
    data: { nombre: "Infraestructura cloud", areaId: tecnologia.id },
  });

  console.log("Creando usuarios...");
  const hash = await bcrypt.hash("demo123", 10);

  const colaboradorA = await prisma.usuario.create({
    data: {
      email: "colaborador_a@sabbi.com",
      nombre: "Ana Torres",
      cargo: "Analista de procesos",
      areaId: finanzas.id,
      esAprobador: false,
      password: hash,
    },
  });

  const aprobador = await prisma.usuario.create({
    data: {
      email: "aprobador@sabbi.com",
      nombre: "Carlos Méndez",
      cargo: "Jefe de Operaciones",
      areaId: operaciones.id,
      esAprobador: true,
      password: hash,
    },
  });

  const colaboradorB = await prisma.usuario.create({
    data: {
      email: "colaborador_b@sabbi.com",
      nombre: "Lucía Ramírez",
      cargo: "Coordinadora de TI",
      areaId: tecnologia.id,
      esAprobador: false,
      password: hash,
    },
  });

  const colaboradorC = await prisma.usuario.create({
    data: {
      email: "colaborador_c@sabbi.com",
      nombre: "Pedro Gutiérrez",
      cargo: "Analista financiero",
      areaId: finanzas.id,
      esAprobador: false,
      password: hash,
    },
  });

  console.log("Creando procesos aprobados...");

  const procesosData = [
    {
      nombre: "Cierre contable mensual",
      descripcion:
        "Proceso de cierre de libros contables al final de cada mes, incluyendo conciliaciones y ajustes.",
      notas:
        "Requiere acceso al ERP. El cierre debe completarse antes del día 5 del mes siguiente. Coordinar con Tesorería.",
      areaId: finanzas.id,
      proyectoId: projERP.id,
      autorId: colaboradorA.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Cierre contable", [
        "Extraer balances del ERP",
        "Conciliar cuentas bancarias",
        "Registrar ajustes",
        "Generar balance de comprobación",
        "Revisar y aprobar",
      ]),
    },
    {
      nombre: "Recepción de mercadería",
      descripcion:
        "Proceso de recepción, verificación y registro de mercadería en almacén.",
      notas:
        "El proveedor debe enviar la guía de remisión con 24h de anticipación. Verificar cantidades contra la orden de compra.",
      areaId: operaciones.id,
      proyectoId: projLogistica.id,
      autorId: colaboradorA.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Recepción mercadería", [
        "Recibir guía de remisión",
        "Verificar cantidades",
        "Inspección de calidad",
        "Registrar en sistema",
        "Ubicar en almacén",
      ]),
    },
    {
      nombre: "Despliegue a producción",
      descripcion:
        "Procedimiento estándar para desplegar cambios al ambiente de producción.",
      notas:
        "Solo se despliega los martes y jueves. Requiere aprobación del líder técnico y al menos una revisión de código.",
      areaId: tecnologia.id,
      proyectoId: projInfra.id,
      autorId: colaboradorB.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Deploy a producción", [
        "Crear PR y solicitar revisión",
        "Pasar pruebas automatizadas",
        "Aprobación del líder técnico",
        "Merge a main",
        "Deploy automático",
        "Verificar en producción",
      ]),
    },
    {
      nombre: "Emisión de factura electrónica",
      descripcion:
        "Proceso de generación y envío de facturas electrónicas a SUNAT.",
      notas:
        "Verificar que el RUC del cliente esté activo. Las facturas se envían en lote cada hora.",
      areaId: finanzas.id,
      proyectoId: null,
      autorId: colaboradorC.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Facturación electrónica", [
        "Validar datos del cliente",
        "Generar XML de factura",
        "Firmar digitalmente",
        "Enviar a SUNAT",
        "Registrar respuesta",
      ]),
    },
    {
      nombre: "Gestión de incidentes TI",
      descripcion:
        "Proceso de atención y resolución de incidentes de tecnología reportados por usuarios.",
      notas:
        "Los incidentes críticos escalan automáticamente al jefe de área. SLA: crítico 2h, alto 8h, medio 24h.",
      areaId: tecnologia.id,
      proyectoId: null,
      autorId: colaboradorB.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Gestión de incidentes", [
        "Recibir reporte",
        "Clasificar severidad",
        "Asignar técnico",
        "Diagnosticar y resolver",
        "Verificar con usuario",
        "Cerrar ticket",
      ]),
    },
  ];

  for (const p of procesosData) {
    const proceso = await prisma.proceso.create({
      data: {
        nombre: p.nombre,
        descripcion: p.descripcion,
        notas: p.notas,
        areaId: p.areaId,
        proyectoId: p.proyectoId,
        autorId: p.autorId,
        aprobadorId: p.aprobadorId,
        estado: "APROBADO",
        contenidoXml: p.xml,
      },
    });

    await prisma.aprobacion.create({
      data: {
        procesoId: proceso.id,
        aprobadorId: aprobador.id,
        decision: "APROBADO",
        comentario: "Proceso documentado correctamente.",
      },
    });
  }

  console.log("Seed completado:");
  console.log("  - 3 áreas");
  console.log("  - 3 proyectos");
  console.log("  - 4 usuarios");
  console.log("  - 5 procesos aprobados con diagrama");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
