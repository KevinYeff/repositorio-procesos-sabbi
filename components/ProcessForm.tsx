"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DrawioEditor from "@/components/DrawioEditor";
import { createProcess } from "@/lib/actions";

interface FormProps {
  areas: { id: string; nombre: string }[];
  aprobadores: { id: string; nombre: string; email: string }[];
  currentUserId: string;
}

const inputClass =
  "mt-1 block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi";

export default function ProcessForm({
  areas,
  aprobadores,
  currentUserId,
}: FormProps) {
  const router = useRouter();
  const [xml, setXml] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [proyectos, setProyectos] = useState<{ id: string; nombre: string }[]>(
    []
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [xmlSaved, setXmlSaved] = useState(false);

  async function loadProyectos(areaId: string) {
    setSelectedArea(areaId);
    if (!areaId) {
      setProyectos([]);
      return;
    }
    const res = await fetch(`/api/proyectos?areaId=${areaId}`);
    const data = await res.json();
    setProyectos(data);
  }

  const handleXmlSave = useCallback((savedXml: string) => {
    setXml(savedXml);
    setXmlSaved(true);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!xml) {
      setError("Debes guardar el diagrama antes de registrar el proceso");
      setSaving(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("contenidoXml", xml);

    const result = await createProcess(formData);

    if (result.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/mis-procesos");
    router.refresh();
  }

  const filteredAprobadores = aprobadores.filter(
    (a) => a.id !== currentUserId
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-verde-profundo"
            >
              Nombre del proceso *
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="areaId"
              className="block text-sm font-medium text-verde-profundo"
            >
              Area *
            </label>
            <select
              id="areaId"
              name="areaId"
              required
              value={selectedArea}
              onChange={(e) => loadProyectos(e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar area</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="proyectoId"
              className="block text-sm font-medium text-verde-profundo"
            >
              Proyecto
            </label>
            <select
              id="proyectoId"
              name="proyectoId"
              className={inputClass}
              disabled={!selectedArea}
            >
              <option value="">General</option>
              {proyectos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="aprobadorId"
              className="block text-sm font-medium text-verde-profundo"
            >
              Aprobador *
            </label>
            <select
              id="aprobadorId"
              name="aprobadorId"
              required
              className={inputClass}
            >
              <option value="">Seleccionar aprobador</option>
              {filteredAprobadores.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-verde-profundo"
          >
            Descripcion
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows={2}
            className={inputClass}
            placeholder="Que es este proceso?"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="notas"
            className="block text-sm font-medium text-verde-profundo"
          >
            Notas
          </label>
          <textarea
            id="notas"
            name="notas"
            rows={2}
            className={inputClass}
            placeholder="Dependencias, responsables, como ejecutarlo..."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
        <label className="mb-2 block text-sm font-bold text-verde-profundo">
          Diagrama del proceso *
        </label>
        <p className="mb-3 text-xs text-ink-caption">
          Crea o importa tu diagrama en el editor. Presiona el boton de guardar
          dentro del editor para capturar el XML.
        </p>
        <DrawioEditor onSave={handleXmlSave} />
        {xmlSaved && (
          <p className="mt-2 text-sm font-semibold text-verde-sabbi">
            Diagrama guardado correctamente
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-morado px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-morado/90 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Registrar proceso"}
        </button>
      </div>
    </form>
  );
}
