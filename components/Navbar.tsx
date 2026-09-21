"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const links = [
    { href: "/", label: "Consulta" },
    { href: "/registrar", label: "Registrar proceso" },
    { href: "/mis-procesos", label: "Mis procesos" },
    ...(session.user.esAprobador
      ? [{ href: "/aprobar", label: "Aprobaciones" }]
      : []),
  ];

  return (
    <nav className="bg-verde-noche">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/sabbi-wordmark-bone.png"
              alt="Sabbi"
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-verde-profundo text-lima"
                    : "text-hueso/80 hover:bg-verde-profundo hover:text-hueso"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-hueso/70">
            {session.user.nombre}
            {session.user.esAprobador && (
              <span className="ml-2 rounded-md bg-morado/20 px-2 py-0.5 text-xs font-semibold text-lavanda">
                Aprobador
              </span>
            )}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md px-3 py-1.5 text-sm text-hueso/60 transition-colors hover:bg-verde-profundo hover:text-hueso"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </nav>
  );
}
