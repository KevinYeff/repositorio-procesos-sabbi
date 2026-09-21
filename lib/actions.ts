"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  createProcessSchema,
  approvalSchema,
  validateXml,
} from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createProcess(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  const raw = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    notas: formData.get("notas"),
    areaId: formData.get("areaId"),
    proyectoId: formData.get("proyectoId"),
    aprobadorId: formData.get("aprobadorId"),
    contenidoXml: formData.get("contenidoXml"),
  };

  const parsed = createProcessSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  if (data.aprobadorId === session.user.id) {
    return { error: "No puedes ser tu propio aprobador" };
  }

  if (!validateXml(data.contenidoXml)) {
    return { error: "El XML del diagrama no es válido" };
  }

  const proceso = await prisma.proceso.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion || null,
      notas: data.notas || null,
      areaId: data.areaId,
      proyectoId: data.proyectoId || null,
      autorId: session.user.id,
      aprobadorId: data.aprobadorId,
      contenidoXml: data.contenidoXml,
      estado: "PENDIENTE",
    },
  });

  revalidatePath("/aprobar");
  return { success: true, id: proceso.id };
}

export async function submitApproval(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session.user.esAprobador) {
    return { error: "No autorizado" };
  }

  const raw = {
    procesoId: formData.get("procesoId"),
    decision: formData.get("decision"),
    comentario: formData.get("comentario"),
  };

  const parsed = approvalSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  const proceso = await prisma.proceso.findUnique({
    where: { id: data.procesoId },
  });

  if (!proceso) {
    return { error: "Proceso no encontrado" };
  }

  if (proceso.aprobadorId !== session.user.id) {
    return { error: "No eres el aprobador asignado" };
  }

  if (proceso.estado !== "PENDIENTE") {
    return { error: "El proceso ya fue evaluado" };
  }

  if (data.decision === "RECHAZADO" && !data.comentario?.trim()) {
    return { error: "El comentario es obligatorio al rechazar" };
  }

  await prisma.$transaction([
    prisma.proceso.update({
      where: { id: data.procesoId },
      data: { estado: data.decision === "APROBADO" ? "APROBADO" : "RECHAZADO" },
    }),
    prisma.aprobacion.create({
      data: {
        procesoId: data.procesoId,
        aprobadorId: session.user.id,
        decision: data.decision,
        comentario: data.comentario || null,
      },
    }),
  ]);

  revalidatePath("/aprobar");
  revalidatePath("/");
  return { success: true };
}

export async function resubmitProcess(procesoId: string, xml: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "No autenticado" };
  }

  if (!validateXml(xml)) {
    return { error: "El XML del diagrama no es válido" };
  }

  const proceso = await prisma.proceso.findUnique({
    where: { id: procesoId },
  });

  if (!proceso) return { error: "Proceso no encontrado" };
  if (proceso.autorId !== session.user.id) return { error: "No autorizado" };
  if (proceso.estado !== "RECHAZADO") {
    return { error: "Solo se pueden reenviar procesos rechazados" };
  }

  await prisma.proceso.update({
    where: { id: procesoId },
    data: { estado: "PENDIENTE", contenidoXml: xml },
  });

  revalidatePath("/aprobar");
  return { success: true };
}
