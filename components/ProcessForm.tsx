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
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del proceso *
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="areaId"
            className="block text-sm font-medium text-gray-700"
          >
            Área *
          </label>
          <select
            id="areaId"
            name="areaId"
            required
            value={selectedArea}
            onChange={(e) => loadProyectos(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Seleccionar área</option>
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
            className="block text-sm font-medium text-gray-700"
          >
            Proyecto
          </label>
          <select
            id="proyectoId"
            name="proyectoId"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className="block text-sm font-medium text-gray-700"
          >
            Aprobador *
          </label>
          <select
            id="aprobadorId"
            name="aprobadorId"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="¿Qué es este proceso?"
        />
      </div>

      <div>
        <label
          htmlFor="notas"
          className="block text-sm font-medium text-gray-700"
        >
          Notas
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Dependencias, dueños de insumos, cómo ejecutarlo..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Diagrama del proceso *
        </label>
        <p className="mb-2 text-xs text-gray-500">
          Crea o importa tu diagrama en el editor. Presiona el botón de guardar
          dentro del editor para capturar el XML.
        </p>
        <DrawioEditor onSave={handleXmlSave} />
        {xmlSaved && (
          <p className="mt-2 text-sm text-green-600">
            Diagrama guardado correctamente
          </p>
        )}
      </div>

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Registrar proceso"}
        </button>
      </div>
    </form>
  );
}
