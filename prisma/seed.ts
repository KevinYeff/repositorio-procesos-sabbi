import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  console.log("Creando areas...");
  const wm = await prisma.area.create({ data: { nombre: "WM" } });
  const inversiones = await prisma.area.create({ data: { nombre: "Inversiones" } });
  const growth = await prisma.area.create({ data: { nombre: "Growth" } });
  const adminFinanzas = await prisma.area.create({ data: { nombre: "Admin & Finanzas" } });
  const rrhh = await prisma.area.create({ data: { nombre: "RRHH" } });
  const legal = await prisma.area.create({ data: { nombre: "Legal" } });
  const fondos = await prisma.area.create({ data: { nombre: "Fondos" } });
  const operaciones = await prisma.area.create({ data: { nombre: "Operaciones" } });
  const foro = await prisma.area.create({ data: { nombre: "Foro" } });
  const ai = await prisma.area.create({ data: { nombre: "AI" } });

  console.log("Creando proyectos...");
  const projOnboarding = await prisma.proyecto.create({
    data: { nombre: "Onboarding de clientes", areaId: wm.id },
  });
  const projDueDiligence = await prisma.proyecto.create({
    data: { nombre: "Due diligence", areaId: inversiones.id },
  });
  const projCampanas = await prisma.proyecto.create({
    data: { nombre: "Campanas de captacion", areaId: growth.id },
  });
  const projCierreContable = await prisma.proyecto.create({
    data: { nombre: "Cierre contable mensual", areaId: adminFinanzas.id },
  });
  const projAutomatizacion = await prisma.proyecto.create({
    data: { nombre: "Automatizacion de procesos", areaId: ai.id },
  });

  console.log("Creando usuarios...");
  const hash = await bcrypt.hash("demo123", 10);

  const colaboradorA = await prisma.usuario.create({
    data: {
      email: "colaborador_a@sabbi.com",
      nombre: "Ana Torres",
      cargo: "Analista de procesos",
      areaId: operaciones.id,
      esAprobador: false,
      password: hash,
    },
  });

  const aprobador = await prisma.usuario.create({
    data: {
      email: "aprobador@sabbi.com",
      nombre: "Carlos Mendez",
      cargo: "Jefe de Operaciones",
      areaId: operaciones.id,
      esAprobador: true,
      password: hash,
    },
  });

  const colaboradorB = await prisma.usuario.create({
    data: {
      email: "colaborador_b@sabbi.com",
      nombre: "Lucia Ramirez",
      cargo: "Coordinadora de Growth",
      areaId: growth.id,
      esAprobador: false,
      password: hash,
    },
  });

  const colaboradorC = await prisma.usuario.create({
    data: {
      email: "colaborador_c@sabbi.com",
      nombre: "Pedro Gutierrez",
      cargo: "Analista financiero",
      areaId: adminFinanzas.id,
      esAprobador: false,
      password: hash,
    },
  });

  console.log("Creando procesos aprobados...");

  const procesosData = [
    {
      nombre: "Onboarding de nuevo cliente WM",
      descripcion:
        "Proceso de alta e incorporacion de un nuevo cliente de Wealth Management, desde la firma del contrato hasta la apertura de cuenta.",
      notas:
        "Requiere documentacion KYC completa. Coordinar con Legal para la revision del contrato.",
      areaId: wm.id,
      proyectoId: projOnboarding.id,
      autorId: colaboradorA.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Onboarding WM", [
        "Recibir solicitud del cliente",
        "Recopilar documentacion KYC",
        "Revision de Legal",
        "Apertura de cuenta",
        "Asignar asesor",
        "Reunion de bienvenida",
      ]),
    },
    {
      nombre: "Evaluacion de oportunidad de inversion",
      descripcion:
        "Proceso de analisis y evaluacion de una nueva oportunidad de inversion para el comite.",
      notas:
        "El analisis debe incluir valoracion, riesgos y tesis de inversion. Plazo maximo: 15 dias habiles.",
      areaId: inversiones.id,
      proyectoId: projDueDiligence.id,
      autorId: colaboradorA.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Evaluacion inversion", [
        "Recibir propuesta",
        "Analisis financiero",
        "Due diligence",
        "Preparar memo de inversion",
        "Presentar a comite",
        "Decision del comite",
      ]),
    },
    {
      nombre: "Lanzamiento de campana de captacion",
      descripcion:
        "Proceso para planificar, ejecutar y medir una campana de captacion de nuevos miembros.",
      notas:
        "Coordinar con el equipo de contenido para los materiales. El presupuesto debe ser aprobado por Admin & Finanzas.",
      areaId: growth.id,
      proyectoId: projCampanas.id,
      autorId: colaboradorB.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Campana de captacion", [
        "Definir objetivo y audiencia",
        "Aprobar presupuesto",
        "Crear materiales",
        "Lanzar campana",
        "Monitorear metricas",
        "Reporte de resultados",
      ]),
    },
    {
      nombre: "Cierre contable mensual",
      descripcion:
        "Proceso de cierre de libros contables al final de cada mes, incluyendo conciliaciones y ajustes.",
      notas:
        "El cierre debe completarse antes del dia 5 del mes siguiente. Coordinar con Tesoreria.",
      areaId: adminFinanzas.id,
      proyectoId: projCierreContable.id,
      autorId: colaboradorC.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Cierre contable", [
        "Extraer balances",
        "Conciliar cuentas bancarias",
        "Registrar ajustes",
        "Generar balance de comprobacion",
        "Revisar y aprobar",
      ]),
    },
    {
      nombre: "Implementacion de modelo AI",
      descripcion:
        "Proceso para evaluar, desarrollar y desplegar un modelo de inteligencia artificial en produccion.",
      notas:
        "Requiere aprobacion del comite de datos. Validar cumplimiento con Legal antes del despliegue.",
      areaId: ai.id,
      proyectoId: projAutomatizacion.id,
      autorId: colaboradorA.id,
      aprobadorId: aprobador.id,
      xml: makeDiagram("Implementacion AI", [
        "Definir caso de uso",
        "Recopilar y preparar datos",
        "Entrenar modelo",
        "Validar resultados",
        "Aprobacion de Legal",
        "Desplegar en produccion",
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
  console.log("  - 10 areas (WM, Inversiones, Growth, Admin & Finanzas, RRHH, Legal, Fondos, Operaciones, Foro, AI)");
  console.log("  - 5 proyectos");
  console.log("  - 4 usuarios");
  console.log("  - 5 procesos aprobados con diagrama");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
