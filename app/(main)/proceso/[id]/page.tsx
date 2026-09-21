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

  const estadoColor: Record<string, string> = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    APROBADO: "bg-green-100 text-green-800",
    RECHAZADO: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Volver
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {proceso.nombre}
            </h1>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-medium ${estadoColor[proceso.estado]}`}
            >
              {proceso.estado}
            </span>
          </div>
        </div>

        {proceso.descripcion && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-700">Descripción</h2>
            <p className="mt-1 text-sm text-gray-600">{proceso.descripcion}</p>
          </div>
        )}

        {proceso.notas && (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-gray-700">Notas</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
              {proceso.notas}
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-4 text-sm text-gray-600 md:grid-cols-2">
          <div>
            <span className="font-medium text-gray-700">Área:</span>{" "}
            {proceso.area.nombre}
          </div>
          {proceso.proyecto && (
            <div>
              <span className="font-medium text-gray-700">Proyecto:</span>{" "}
              {proceso.proyecto.nombre}
            </div>
          )}
          <div>
            <span className="font-medium text-gray-700">Autor:</span>{" "}
            {proceso.autor.nombre}
          </div>
          <div>
            <span className="font-medium text-gray-700">Aprobador:</span>{" "}
            {proceso.aprobador.nombre}
          </div>
          <div>
            <span className="font-medium text-gray-700">Fecha:</span>{" "}
            {new Date(proceso.fecha).toLocaleDateString("es-PE")}
          </div>
        </div>

        {proceso.aprobaciones.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <h2 className="text-sm font-medium text-gray-700">
              Historial de aprobación
            </h2>
            <div className="mt-2 space-y-2">
              {proceso.aprobaciones.map((a) => (
                <div
                  key={a.id}
                  className="rounded-md bg-gray-50 p-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.decision === "APROBADO"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {a.decision}
                    </span>
                    <span className="text-gray-600">
                      por {a.aprobador.nombre}
                    </span>
                    <span className="text-gray-400">
                      {new Date(a.fecha).toLocaleDateString("es-PE")}
                    </span>
                  </div>
                  {a.comentario && (
                    <p className="mt-1 text-gray-600">{a.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Diagrama del proceso
        </h2>
        <DrawioViewer xml={proceso.contenidoXml} />
      </div>
    </div>
  );
}
