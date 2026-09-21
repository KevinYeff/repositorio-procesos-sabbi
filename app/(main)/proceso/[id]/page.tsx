import { auth } from "@/lib/auth";
import { getProcessById } from "@/lib/queries";
import { redirect, notFound } from "next/navigation";
import DrawioViewer from "@/components/DrawioViewer";
import Link from "next/link";

export default async function ProcesoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const proceso = await getProcessById(params.id);
  if (!proceso) notFound();

  const isAutor = proceso.autorId === session.user.id;
  const isAprobador = proceso.aprobadorId === session.user.id;
  const canView =
    proceso.estado === "APROBADO" || isAutor || isAprobador;

  if (!canView) notFound();

  const estadoStyles: Record<string, string> = {
    PENDIENTE: "bg-lima/30 text-verde-profundo",
    APROBADO: "bg-verde-sabbi/10 text-verde-sabbi",
    RECHAZADO: "bg-morado/10 text-morado",
  };

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-verde-sabbi hover:text-verde-profundo"
      >
        &larr; Volver a consulta
      </Link>

      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block rounded-md bg-verde-sabbi/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-verde-sabbi">
              {proceso.area.nombre}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-verde-noche">
              {proceso.nombre}
            </h1>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${estadoStyles[proceso.estado]}`}
            >
              {proceso.estado}
            </span>
          </div>
        </div>

        {proceso.descripcion && (
          <div className="mt-5 rounded-xl border-l-4 border-verde-sabbi bg-verde-sabbi/5 p-4">
            <h2 className="text-sm font-bold text-verde-profundo">Descripcion</h2>
            <p className="mt-1 text-sm text-ink-body">{proceso.descripcion}</p>
          </div>
        )}

        {proceso.notas && (
          <div className="mt-4 rounded-xl border-l-4 border-lavanda bg-lavanda/5 p-4">
            <h2 className="text-sm font-bold text-verde-profundo">Notas</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink-body">
              {proceso.notas}
            </p>
          </div>
        )}

        <div className="mt-5 grid gap-4 text-sm text-ink-body md:grid-cols-2">
          <div>
            <span className="font-semibold text-verde-profundo">Area:</span>{" "}
            {proceso.area.nombre}
          </div>
          {proceso.proyecto && (
            <div>
              <span className="font-semibold text-verde-profundo">Proyecto:</span>{" "}
              {proceso.proyecto.nombre}
            </div>
          )}
          <div>
            <span className="font-semibold text-verde-profundo">Autor:</span>{" "}
            {proceso.autor.nombre}
          </div>
          <div>
            <span className="font-semibold text-verde-profundo">Aprobador:</span>{" "}
            {proceso.aprobador.nombre}
          </div>
          <div>
            <span className="font-semibold text-verde-profundo">Fecha:</span>{" "}
            {new Date(proceso.fecha).toLocaleDateString("es-PE")}
          </div>
        </div>

        {proceso.aprobaciones.length > 0 && (
          <div className="mt-6 border-t border-border-soft pt-4">
            <h2 className="text-sm font-bold text-verde-profundo">
              Historial de aprobacion
            </h2>
            <div className="mt-2 space-y-2">
              {proceso.aprobaciones.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl bg-hueso p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        a.decision === "APROBADO"
                          ? "bg-verde-sabbi/10 text-verde-sabbi"
                          : "bg-morado/10 text-morado"
                      }`}
                    >
                      {a.decision}
                    </span>
                    <span className="text-ink-body">
                      por {a.aprobador.nombre}
                    </span>
                    <span className="text-ink-caption">
                      {new Date(a.fecha).toLocaleDateString("es-PE")}
                    </span>
                  </div>
                  {a.comentario && (
                    <p className="mt-1 text-ink-body">{a.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-border-soft bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-verde-profundo">
          Diagrama del proceso
        </h2>
        <DrawioViewer xml={proceso.contenidoXml} />
      </div>
    </div>
  );
}
