import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getApprovedProcesses,
  getAreas,
  getProyectos,
  getAuthors,
} from "@/lib/queries";
import SearchFilters from "@/components/SearchFilters";
import Link from "next/link";

export default async function ConsultaPage({
  searchParams,
}: {
  searchParams: { search?: string; areaId?: string; proyectoId?: string; autorId?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [procesos, areas, proyectos, autores] = await Promise.all([
    getApprovedProcesses(searchParams),
    getAreas(),
    getProyectos(),
    getAuthors(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Consulta de procesos
      </h1>

      <SearchFilters areas={areas} proyectos={proyectos} autores={autores} />

      {procesos.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No se encontraron procesos</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {procesos.map((p) => (
            <Link
              key={p.id}
              href={`/proceso/${p.id}`}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {p.nombre}
              </h3>
              {p.descripcion && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {p.descripcion}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">
                  {p.area.nombre}
                </span>
                {p.proyecto && (
                  <span className="rounded bg-gray-100 px-2 py-0.5">
                    {p.proyecto.nombre}
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {p.autor.nombre} &middot;{" "}
                {new Date(p.fecha).toLocaleDateString("es-PE")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
