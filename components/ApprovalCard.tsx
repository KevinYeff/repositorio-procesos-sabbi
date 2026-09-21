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
  const [showDetail, setShowDetail] = useState(false);
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
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {proceso.nombre}
          </h3>
          {proceso.descripcion && (
            <p className="mt-1 text-sm text-gray-600">{proceso.descripcion}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="rounded bg-gray-100 px-2 py-0.5">
              {proceso.area.nombre}
            </span>
            {proceso.proyecto && (
              <span className="rounded bg-gray-100 px-2 py-0.5">
                {proceso.proyecto.nombre}
              </span>
            )}
            <span>Autor: {proceso.autor.nombre}</span>
            <span>
              {new Date(proceso.fecha).toLocaleDateString("es-PE")}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetail ? "Ocultar" : "Ver diagrama"}
        </button>
      </div>

      {showDetail && (
        <div className="mt-4">
          <a
            href={`/proceso/${proceso.id}`}
            target="_blank"
            className="text-sm text-blue-600 hover:underline"
          >
            Abrir detalle completo en nueva pestaña
          </a>
        </div>
      )}

      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario (obligatorio para rechazar)"
          rows={2}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => handleDecision("APROBADO")}
            disabled={loading}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            Aprobar
          </button>
          <button
            onClick={() => handleDecision("RECHAZADO")}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      </div>
    </div>
  );
}
