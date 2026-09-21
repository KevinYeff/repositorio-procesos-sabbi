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
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Procesos pendientes de aprobación
      </h1>

      {procesos.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">No tienes procesos pendientes</p>
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
