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
      <div>
        <span className="inline-block rounded-md bg-verde-sabbi/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-verde-sabbi">
          Consulta
        </span>
        <h1 className="mt-2 text-2xl font-bold text-verde-profundo">
          Procesos aprobados
        </h1>
      </div>

      <SearchFilters areas={areas} proyectos={proyectos} autores={autores} />

      {procesos.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-white p-8 text-center">
          <p className="text-ink-caption">No se encontraron procesos</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {procesos.map((p) => (
            <Link
              key={p.id}
              href={`/proceso/${p.id}`}
              className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-base font-bold text-verde-profundo">
                {p.nombre}
              </h3>
              {p.descripcion && (
                <p className="mt-1 line-clamp-2 text-sm text-ink-body">
                  {p.descripcion}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-verde-sabbi/10 px-2 py-0.5 font-semibold text-verde-sabbi">
                  {p.area.nombre}
                </span>
                {p.proyecto && (
                  <span className="rounded-md bg-hueso px-2 py-0.5 text-ink-caption">
                    {p.proyecto.nombre}
                  </span>
                )}
              </div>
              <div className="mt-2 text-xs text-ink-caption">
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
