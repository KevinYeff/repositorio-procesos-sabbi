import { z } from "zod";

export const createProcessSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(200),
  descripcion: z.string().max(2000).optional().default(""),
  notas: z.string().max(5000).optional().default(""),
  areaId: z.string().min(1, "El área es obligatoria"),
  proyectoId: z.string().optional().default(""),
  aprobadorId: z.string().min(1, "El aprobador es obligatorio"),
  contenidoXml: z.string().min(1, "El diagrama es obligatorio"),
});

export const approvalSchema = z.object({
  procesoId: z.string().min(1),
  decision: z.enum(["APROBADO", "RECHAZADO"]),
  comentario: z.string().max(2000).optional().default(""),
});

export function validateXml(xml: string): boolean {
  if (!xml || xml.trim().length === 0) return false;
  try {
    if (
      !xml.includes("<mxGraphModel") &&
      !xml.includes("<mxfile")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
