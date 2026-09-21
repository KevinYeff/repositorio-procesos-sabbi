import { auth } from "@/lib/auth";
import { getPendingForApprover } from "@/lib/queries";
import { redirect } from "next/navigation";
import ApprovalCard from "@/components/ApprovalCard";

export default async function AprobarPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.esAprobador) redirect("/");

  const procesos = await getPendingForApprover(session.user.id);

  return (
    <div>
      <span className="inline-block rounded-md bg-morado/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-morado">
        Aprobaciones
      </span>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-verde-profundo">
        Procesos pendientes
      </h1>

      {procesos.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-white p-8 text-center">
          <p className="text-ink-caption">No tienes procesos pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {procesos.map((p) => (
            <ApprovalCard key={p.id} proceso={p} />
          ))}
        </div>
      )}
    </div>
  );
}
