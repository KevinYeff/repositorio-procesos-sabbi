"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface SearchFiltersProps {
  areas: { id: string; nombre: string }[];
  proyectos: { id: string; nombre: string; areaId: string }[];
  autores: { id: string; nombre: string }[];
}

export default function SearchFilters({
  areas,
  proyectos,
  autores,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key === "areaId") {
        params.delete("proyectoId");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  const currentArea = searchParams.get("areaId") || "";
  const filteredProyectos = currentArea
    ? proyectos.filter((p) => p.areaId === currentArea)
    : proyectos;

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Buscar
          </label>
          <input
            id="search"
            type="text"
            defaultValue={searchParams.get("search") || ""}
            placeholder="Buscar por nombre o descripción..."
            onChange={(e) => updateFilter("search", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="areaFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Área
          </label>
          <select
            id="areaFilter"
            value={currentArea}
            onChange={(e) => updateFilter("areaId", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="proyectoFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Proyecto
          </label>
          <select
            id="proyectoFilter"
            value={searchParams.get("proyectoId") || ""}
            onChange={(e) => updateFilter("proyectoId", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {filteredProyectos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="autorFilter"
            className="block text-sm font-medium text-gray-700"
          >
            Autor
          </label>
          <select
            id="autorFilter"
            value={searchParams.get("autorId") || ""}
            onChange={(e) => updateFilter("autorId", e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            {autores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
