import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const areaId = req.nextUrl.searchParams.get("areaId");
  if (!areaId) {
    return NextResponse.json([]);
  }
  const proyectos = await prisma.proyecto.findMany({
    where: { areaId },
    orderBy: { nombre: "asc" },
  });
  return NextResponse.json(proyectos);
}
