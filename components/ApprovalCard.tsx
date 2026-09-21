"use client";

import { useState } from "react";
import { submitApproval } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface ApprovalCardProps {
  proceso: {
    id: string;
    nombre: string;
    descripcion: string | null;
    fecha: Date;
    area: { nombre: string };
    proyecto: { nombre: string } | null;
    autor: { nombre: string };
  };
}

export default function ApprovalCard({ proceso }: ApprovalCardProps) {
  const router = useRouter();
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDecision(decision: "APROBADO" | "RECHAZADO") {
    if (decision === "RECHAZADO" && !comentario.trim()) {
      setError("El comentario es obligatorio al rechazar");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("procesoId", proceso.id);
    formData.set("decision", decision);
    formData.set("comentario", comentario);

    const result = await submitApproval(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-verde-profundo">
            {proceso.nombre}
          </h3>
          {proceso.descripcion && (
            <p className="mt-1 text-sm text-ink-body">{proceso.descripcion}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-verde-sabbi/10 px-2 py-0.5 font-semibold text-verde-sabbi">
              {proceso.area.nombre}
            </span>
            {proceso.proyecto && (
              <span className="rounded-md bg-hueso px-2 py-0.5 text-ink-caption">
                {proceso.proyecto.nombre}
              </span>
            )}
            <span className="text-ink-caption">Autor: {proceso.autor.nombre}</span>
            <span className="text-ink-caption">
              {new Date(proceso.fecha).toLocaleDateString("es-PE")}
            </span>
          </div>
        </div>
        <a
          href={`/proceso/${proceso.id}`}
          target="_blank"
          className="text-sm font-medium text-verde-sabbi hover:text-verde-profundo"
        >
          Ver diagrama
        </a>
      </div>

      <div className="mt-4 space-y-3 border-t border-border-soft pt-4">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario (obligatorio para rechazar)"
          rows={2}
          className="block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => handleDecision("APROBADO")}
            disabled={loading}
            className="rounded-full bg-verde-profundo px-5 py-2 text-sm font-bold text-hueso transition-colors hover:bg-verde-noche disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={() => handleDecision("RECHAZADO")}
            disabled={loading}
            className="rounded-full border border-morado bg-white px-5 py-2 text-sm font-bold text-morado transition-colors hover:bg-morado/5 disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
