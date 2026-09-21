import { auth } from "@/lib/auth";
import { getMyProcesses } from "@/lib/queries";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MisProcesosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const procesos = await getMyProcesses(session.user.id);

  const estadoColor: Record<string, string> = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    APROBADO: "bg-green-100 text-green-800",
    RECHAZADO: "bg-red-100 text-red-800",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Mis procesos</h1>
        <Link
          href="/registrar"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Registrar nuevo
        </Link>
      </div>

      {procesos.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No has registrado procesos aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {procesos.map((p) => (
            <Link
              key={p.id}
              href={`/proceso/${p.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.nombre}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-blue-700">
                      {p.area.nombre}
                    </span>
                    {p.proyecto && (
                      <span className="rounded bg-gray-100 px-2 py-0.5">
                        {p.proyecto.nombre}
                      </span>
                    )}
                    <span>
                      Aprobador: {p.aprobador.nombre}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${estadoColor[p.estado]}`}
                >
                  {p.estado}
                </span>
              </div>
              {p.aprobaciones[0]?.comentario && (
                <p className="mt-2 rounded-md bg-red-50 p-2 text-sm text-red-700">
                  Comentario: {p.aprobaciones[0].comentario}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
