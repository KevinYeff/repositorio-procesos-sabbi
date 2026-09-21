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
      <span className="inline-block rounded-md bg-verde-sabbi/10 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-verde-sabbi">
        Registro
      </span>
      <h1 className="mt-2 mb-6 text-2xl font-bold text-verde-profundo">
        Registrar nuevo proceso
      </h1>
      <ProcessForm
        areas={areas}
        aprobadores={aprobadores}
        currentUserId={session.user.id}
      />
    </div>
  );
}
