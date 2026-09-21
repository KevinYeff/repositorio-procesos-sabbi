"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface SearchFiltersProps {
  areas: { id: string; nombre: string }[];
  proyectos: { id: string; nombre: string; areaId: string }[];
  autores: { id: string; nombre: string }[];
}

const selectClass =
  "mt-1 block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi";

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
    <div className="rounded-2xl border border-border-soft bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-sm font-medium text-verde-profundo"
          >
            Buscar
          </label>
          <input
            id="search"
            type="text"
            defaultValue={searchParams.get("search") || ""}
            placeholder="Buscar por nombre o descripcion..."
            onChange={(e) => updateFilter("search", e.target.value)}
            className="mt-1 block w-full rounded-xl border border-border-soft bg-hueso px-3 py-2 text-sm text-verde-profundo shadow-sm focus:border-verde-sabbi focus:outline-none focus:ring-1 focus:ring-verde-sabbi"
          />
        </div>

        <div>
          <label
            htmlFor="areaFilter"
            className="block text-sm font-medium text-verde-profundo"
          >
            Area
          </label>
          <select
            id="areaFilter"
            value={currentArea}
            onChange={(e) => updateFilter("areaId", e.target.value)}
            className={selectClass}
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
            className="block text-sm font-medium text-verde-profundo"
          >
            Proyecto
          </label>
          <select
            id="proyectoFilter"
            value={searchParams.get("proyectoId") || ""}
            onChange={(e) => updateFilter("proyectoId", e.target.value)}
            className={selectClass}
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
            className="block text-sm font-medium text-verde-profundo"
          >
            Autor
          </label>
          <select
            id="autorFilter"
            value={searchParams.get("autorId") || ""}
            onChange={(e) => updateFilter("autorId", e.target.value)}
            className={selectClass}
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
