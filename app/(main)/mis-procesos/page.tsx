import { auth } from "@/lib/auth";
import { getMyProcesses } from "@/lib/queries";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MisProcesosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const procesos = await getMyProcesses(session.user.id);

  const estadoColor: Record<string, string> = {
    PENDIENTE: "bg-lima/30 text-verde-profundo",
    APROBADO: "bg-verde-sabbi/10 text-verde-sabbi",
    RECHAZADO: "bg-morado/10 text-morado",
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="inline-block rounded-md bg-verde-sabbi/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-verde-sabbi">
            Mis procesos
          </span>
          <h1 className="mt-2 text-2xl font-bold text-verde-profundo">
            Procesos registrados
          </h1>
        </div>
        <Link
          href="/registrar"
          className="rounded-full bg-morado px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-morado/90"
        >
          Registrar nuevo
        </Link>
      </div>

      {procesos.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-white p-8 text-center shadow-sm">
          <p className="text-ink-caption">No has registrado procesos aun</p>
        </div>
      ) : (
        <div className="space-y-3">
          {procesos.map((p) => (
            <Link
              key={p.id}
              href={`/proceso/${p.id}`}
              className="block rounded-2xl border border-border-soft bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-verde-profundo">{p.nombre}</h3>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-md bg-verde-sabbi/10 px-2 py-0.5 font-semibold text-verde-sabbi">
                      {p.area.nombre}
                    </span>
                    {p.proyecto && (
                      <span className="rounded-md bg-hueso px-2 py-0.5 text-ink-caption">
                        {p.proyecto.nombre}
                      </span>
                    )}
                    <span className="text-ink-caption">
                      Aprobador: {p.aprobador.nombre}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-semibold ${estadoColor[p.estado]}`}
                >
                  {p.estado}
                </span>
              </div>
              {p.aprobaciones[0]?.comentario && (
                <div className="mt-3 rounded-xl border-l-4 border-morado bg-morado/5 p-3">
                  <p className="text-sm text-ink-body">
                    {p.aprobaciones[0].comentario}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
