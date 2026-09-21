import { auth } from "@/lib/auth";
import { getAreas, getAprobadores } from "@/lib/queries";
import ProcessForm from "@/components/ProcessForm";
import { redirect } from "next/navigation";

export default async function RegistrarPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [areas, aprobadores] = await Promise.all([
    getAreas(),
    getAprobadores(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Registrar nuevo proceso
      </h1>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <ProcessForm
          areas={areas}
          aprobadores={aprobadores}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
