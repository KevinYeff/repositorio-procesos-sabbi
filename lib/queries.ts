import { prisma } from "@/lib/db";

export async function getAreas() {
  return prisma.area.findMany({ orderBy: { nombre: "asc" } });
}

export async function getProyectos(areaId?: string) {
  return prisma.proyecto.findMany({
    where: areaId ? { areaId } : undefined,
    orderBy: { nombre: "asc" },
  });
}

export async function getAprobadores() {
  return prisma.usuario.findMany({
    where: { esAprobador: true },
    select: { id: true, nombre: true, email: true },
    orderBy: { nombre: "asc" },
  });
}

export async function getApprovedProcesses(params: {
  search?: string;
  areaId?: string;
  proyectoId?: string;
  autorId?: string;
}) {
  const { search, areaId, proyectoId, autorId } = params;

  return prisma.proceso.findMany({
    where: {
      estado: "APROBADO",
      ...(search && {
        OR: [
          { nombre: { contains: search, mode: "insensitive" } },
          { descripcion: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(areaId && { areaId }),
      ...(proyectoId && { proyectoId }),
      ...(autorId && { autorId }),
    },
    include: {
      area: true,
      proyecto: true,
      autor: { select: { id: true, nombre: true } },
    },
    orderBy: { fecha: "desc" },
  });
}

export async function getProcessById(id: string) {
  return prisma.proceso.findUnique({
    where: { id },
    include: {
      area: true,
      proyecto: true,
      autor: { select: { id: true, nombre: true, email: true } },
      aprobador: { select: { id: true, nombre: true, email: true } },
      aprobaciones: {
        include: {
          aprobador: { select: { nombre: true } },
        },
        orderBy: { fecha: "desc" },
      },
    },
  });
}

export async function getPendingForApprover(aprobadorId: string) {
  return prisma.proceso.findMany({
    where: {
      aprobadorId,
      estado: "PENDIENTE",
    },
    include: {
      area: true,
      proyecto: true,
      autor: { select: { id: true, nombre: true } },
    },
    orderBy: { fecha: "desc" },
  });
}

export async function getMyProcesses(autorId: string) {
  return prisma.proceso.findMany({
    where: { autorId },
    include: {
      area: true,
      proyecto: true,
      aprobador: { select: { nombre: true } },
      aprobaciones: {
        orderBy: { fecha: "desc" },
        take: 1,
      },
    },
    orderBy: { fecha: "desc" },
  });
}

export async function getAuthors() {
  return prisma.usuario.findMany({
    where: {
      procesosCreados: { some: { estado: "APROBADO" } },
    },
    select: { id: true, nombre: true },
    orderBy: { nombre: "asc" },
  });
}
